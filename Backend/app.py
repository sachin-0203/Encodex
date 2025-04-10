from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import base64
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
import secrets
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

from db import db
from models import User

load_dotenv()

app = Flask(__name__)
CORS(app)

app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///encodex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


# Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/uploads')
ENCRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/encrypted')
DECRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/decrypted')
KEYS_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/keys')  # Store RSA keys

# Create directories if they don’t exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)
os.makedirs(KEYS_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def is_valid_image(file_path):
    try:
        img = Image.open(file_path)
        img.verify()
        return True
    except Exception:
        return False

    # Temporary route to see the registered user data
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
    return jsonify(user_list)


@app.route('/register', methods=['POST'])
def register():
    
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')


    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    existing_user = User.query.filter( (User.username == username ) | (User.email == email )).first()
    if(existing_user):
        return jsonify({
            'status': 'error',
            'message': 'User Already exist'
            }), 409
 
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'status' : 'success',
        'message': 'User registered successfully'
    }), 201


@app.route('/login', methods=['POST'])
def login():

    data = request.form
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password,password):
        return jsonify({
            'status': 'error',
            'message': 'Invalid email or password'
        }), 401 

    access_token = create_access_token(identity=user.id)

    return jsonify({
        'status': 'success',
        'message': 'Login successfull',
        'access_token': access_token,
        'username': user.username,
    }), 200





# Generate RSA keys for each recipient
def generate_rsa_keys(recipient):
    recipient_folder = os.path.join(KEYS_FOLDER, recipient)
    os.makedirs(recipient_folder, exist_ok=True)
    
    private_key_path = os.path.join(recipient_folder, "private.pem")
    public_key_path = os.path.join(recipient_folder, "public.pem")
    
    if not os.path.exists(private_key_path) or not os.path.exists(public_key_path):
        key = RSA.generate(2048)
        with open(private_key_path, 'wb') as priv_file:
            priv_file.write(key.export_key())
        with open(public_key_path, 'wb') as pub_file:
            pub_file.write(key.publickey().export_key())

# AES Encryption Function
def aes_encrypt(image_path, recipient):
    generate_rsa_keys(recipient)  # Ensure recipient's keys exist
    
    original_imagename = os.path.basename(image_path)
    filename_without_ext, ext = os.path.splitext(original_imagename)

    aes_key = get_random_bytes(32)  # 256-bit AES key
    cipher = AES.new(aes_key, AES.MODE_GCM)
    
    with open(image_path, 'rb') as image_file:
        original_image = image_file.read()

    encrypted_image, tag = cipher.encrypt_and_digest(original_image)
    encrypted_data = cipher.nonce + tag + encrypted_image

    encrypted_filename = f"{filename_without_ext}_{secrets.token_hex(4)}.enc"
    encrypted_image_path = os.path.join(ENCRYPTED_FOLDER, encrypted_filename)
    
    with open(encrypted_image_path, 'wb') as encrypted_file:
        encrypted_file.write(encrypted_data)
    
    # Load recipient's public key to encrypt AES key
    public_key_path = os.path.join(KEYS_FOLDER, recipient, "public.pem")
    with open(public_key_path, 'rb') as pub_file:
        recipient_public_key = RSA.import_key(pub_file.read())
    rsa_cipher = PKCS1_OAEP.new(recipient_public_key)
    encrypted_aes_key = rsa_cipher.encrypt(aes_key)
    
    encrypted_aes_key_b64 = base64.b64encode(encrypted_aes_key).decode()
    encrypted_image_b64 = base64.b64encode(encrypted_data).decode()
    
    return encrypted_image_b64, encrypted_aes_key_b64

@app.route('/encrypt', methods=['POST'])
def encrypt():
    if 'image' not in request.files or 'recipient' not in request.form:
        return jsonify({'error': 'Missing file or recipient'}), 400
    
    file = request.files['image']
    recipient = request.form['recipient']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        if not is_valid_image(file_path):
            os.remove(file_path)
            return jsonify({'status': 'error', 'message': 'Invalid image file'}), 400
        
        encrypted_image, encrypted_aes_key = aes_encrypt(file_path, recipient)
        image_name = f"{filename[:2].lower()}_enc_{secrets.token_hex(4)}.enc"
        return jsonify({
            'status': 'success',
            'message': 'File Encrypted Successfully!',
            'encrypted_content': encrypted_image,
            'encrypted_aes_key': encrypted_aes_key,
            'image_name' : image_name,
        })
    else:
        return jsonify({'status': 'error', 'message': 'This file type is not allowed'}), 400

# AES + RSA Decryption Function
def aes_rsa_decrypt(encrypted_image_b64, encrypted_aes_key_b64, recipient):
    encrypted_image = base64.b64decode(encrypted_image_b64)
    encrypted_aes_key = base64.b64decode(encrypted_aes_key_b64)
    
    # Load recipient's private key
    private_key_path = os.path.join(KEYS_FOLDER, recipient, "private.pem")
    with open(private_key_path, 'rb') as priv_file:
        recipient_private_key = RSA.import_key(priv_file.read())
    rsa_cipher = PKCS1_OAEP.new(recipient_private_key)
    aes_key = rsa_cipher.decrypt(encrypted_aes_key)
    
    nonce, tag, encrypted_data = encrypted_image[:16], encrypted_image[16:32], encrypted_image[32:]
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    decrypted_image = cipher.decrypt_and_verify(encrypted_data, tag)
    
    return base64.b64encode(decrypted_image).decode()

@app.route('/decrypt', methods=['POST'])
def decrypt():
    try:
        data = request.json
        encrypted_image_b64 = data.get('encrypted_image')
        encrypted_aes_key_b64 = data.get('encryption_key')
        recipient = data.get('recipient')
        
        if not encrypted_image_b64 or not encrypted_aes_key_b64 or not recipient:
            return jsonify({'error': 'Missing decryption data'}), 400
        
        decrypted_image_b64 = aes_rsa_decrypt(encrypted_image_b64, encrypted_aes_key_b64, recipient)

        # Decode Base64 before writing to a file
        decrypted_filename = f"decrypted_{recipient}.png"
        decrypted_path = os.path.join(DECRYPTED_FOLDER, decrypted_filename)

        with open(decrypted_path, "wb") as f:
            f.write(base64.b64decode(decrypted_image_b64))
        
        return jsonify({'status': 'success', 'decrypted_image': decrypted_image_b64})
    
    except Exception as e:
        return jsonify({'error': f'Error while decrypting the image: {str(e)}'}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5000)

