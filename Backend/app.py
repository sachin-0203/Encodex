from flask import Flask, request, jsonify, send_from_directory
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import base64
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
import secrets
import json


from flask_jwt_extended import JWTManager
from flask_jwt_extended import  (
    create_access_token, 
    create_refresh_token,  
    jwt_required, 
    get_jwt_identity,
    set_refresh_cookies,
    decode_token,
    unset_jwt_cookies,
    )
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import datetime

from google.oauth2 import id_token
from google.auth.transport import requests

from db import db
from models import User

load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app, supports_credentials=True,origins=["http://localhost:5173"])

app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///encodex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_TOKEN_LOCATION'] = ["headers", "cookies"]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=10)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=15)
app.config['JWT_COOKIE_SAMESITE'] = "Lax"
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
app.config["JWT_REFRESH_COOKIE_PATH"] = "/refresh"
app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token_cookie"
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_REFRESH_TOKEN_IN_COOKIE'] = True

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


# Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/uploads')
ENCRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/encrypted')
DECRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/decrypted')
KEYS_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/keys')  
META_FOLDER = os.path.join(PROJECT_ROOT, 'Backend/metadata')  

# Create directories if they don’t exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)
os.makedirs(KEYS_FOLDER, exist_ok=True)
os.makedirs(META_FOLDER, exist_ok=True)


app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png', 'gif'}
VALID_FOLDERS = {
    'uploads': UPLOAD_FOLDER,
    'encrypted': ENCRYPTED_FOLDER,
    'decrypted': DECRYPTED_FOLDER
}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def is_valid_image(file_path):
    try:
        img = Image.open(file_path)
        img.verify()
        return True
    except Exception:
        return False

# Temporary route:  to see the registered user data
@app.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_list.append({
            "id": user.id, 
            "username": user.username,
            "email": user.email,
        })
    return jsonify(user_list)

# route: get current user data
@app.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)


    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200



# route: Sign-Up
@app.route('/signup', methods=['POST'])
def signup():
    
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')


    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    existing_user = User.query.filter( (User.username == username ) | (User.email == email )).first()

    if(existing_user):
        return jsonify({
            "status": "register_error",
            "message": "User Already Registered!"
        }), 409
 
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        username=username, 
        email=email, 
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'status' : 'success',
        'message': 'User registered successfully',
        'username': new_user.username,
    }), 201

# route: LogIn
@app.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')


    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password,password):
        return jsonify({
            'status': 'error',
            'message': 'Invalid email or password'
        }), 401 

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))


    response = jsonify({
        'status': 'success',
        'message': 'Login successfull',
        'access_token': access_token,
        'username': user.username,
        "email": user.email,
    })

    set_refresh_cookies(response, refresh_token)
    
    return response

# route: LogOut
@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({
        'status': 'success',
        'message': "Logout Successful"
    })
    unset_jwt_cookies(response)

    return response

# route: Refresh
@app.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = int(get_jwt_identity())

    new_access_token= create_access_token(identity=str(current_user))

    return jsonify({
        "message": "success",
        "access_token": new_access_token
    })

# route: Google-Login
@app.route('/googleLogin', methods=['POST'])
def googleLogin():
    token = request.json.get('token')
    if not token:
       return jsonify({'message': 'Token is missing'}), 400
    
    try:
        idinfo = id_token.verify_oauth2_token(token , requests.Request(),"907532710684-9ehbdn45tkhmgtrcbkusljdshdq8rd8d.apps.googleusercontent.com")
        email = idinfo['email']
        name = idinfo.get('name')
        picture = idinfo.get('picture')       

        user = User.query.filter_by(email=email).first()
        if not user: 
            user = User(
                email=email,
                username=name, 
                password="GOOGLE_USER")
            db.session.add(user)
            db.session.commit()
        
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        response = jsonify({
            "status": "success",
            "access_token": access_token,
            "username": name,
            "dp": picture
        })

        set_refresh_cookies(response, refresh_token)
        return response
    
    except ValueError:
        return jsonify({"msg": "Invalid Google Token"}), 400


# route: Upload
@app.route("/upload", methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        
        user_id = get_jwt_identity()
        user_upload_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
        os.makedirs(user_upload_folder, exist_ok=True)

        filename = secure_filename(file.filename)
        file_path = os.path.join(user_upload_folder, filename)
        file.save(file_path)

        with open(file_path,'rb') as f:
            file_data = f.read()
            encoded_file = base64.b64encode(file_data).decode('utf-8')

        return jsonify({
            'status': 'success',
            'filename': filename,
            'file_base64': encoded_file,
        }), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400


def save_encryption_metadata(user_id, encrypted_filename, original_filename, recipient_name):
    metadata = {
        "user_id": user_id,
        "original_filename": original_filename,
        "encrypted_filename": encrypted_filename,
        "recipient_name": recipient_name,
        "rcpt_pubkey_name": f"{recipient_name}_aeskey.txt",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')

    }
    
    user_meta_folder = os.path.join(META_FOLDER, str(user_id))
    os.makedirs(user_meta_folder, exist_ok=True)

    metadata_filename = f"{encrypted_filename}.meta.json"
    metadata_path = os.path.join(user_meta_folder, metadata_filename)

    try:
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
    except Exception as e:
        print(f"[ERROR] Failed to write metadata: {e}")
        raise

# Generate RSA keys for each recipient
def generate_rsa_keys(recipient, user_id):
    user_key_folder = os.path.join(KEYS_FOLDER, str(user_id))
    os.makedirs(user_key_folder, exist_ok=True)
    
    private_key_path = os.path.join(user_key_folder, f"{recipient}_pvt.pem")
    public_key_path = os.path.join(user_key_folder, f"{recipient}_pub.pem")
    
    if not os.path.exists(private_key_path) or not os.path.exists(public_key_path):
        key = RSA.generate(2048)
        with open(private_key_path, 'wb') as priv_file:
            priv_file.write(key.export_key())
        with open(public_key_path, 'wb') as pub_file:
            pub_file.write(key.publickey().export_key())

# AES Encryption Function
def aes_encrypt(image_path, recipient, user_id, filename):

    generate_rsa_keys(recipient, user_id)  # Ensure user's keys exist
    
    original_imagename = os.path.basename(image_path)
    filename_without_ext, ext = os.path.splitext(original_imagename)

    aes_key = get_random_bytes(32)  # 256-bit AES key
    cipher = AES.new(aes_key, AES.MODE_GCM)
    
    with open(image_path, 'rb') as image_file:
        original_image = image_file.read()
 
    encrypted_image, tag = cipher.encrypt_and_digest(original_image)
    encrypted_data = cipher.nonce + tag + encrypted_image   

    # Load recipient's public key to encrypt AES key
    public_key_path = os.path.join(KEYS_FOLDER, str(user_id), f"{recipient}_pub.pem")
    with open(public_key_path, 'rb') as pub_file:
        recipient_public_key = RSA.import_key(pub_file.read())
    rsa_cipher = PKCS1_OAEP.new(recipient_public_key)
    encrypted_aes_key = rsa_cipher.encrypt(aes_key)
    
    encrypted_aes_key_b64 = base64.b64encode(encrypted_aes_key).decode()
    encrypted_image_b64 = base64.b64encode(encrypted_data).decode()

    encrypted_filename = f"{filename_without_ext}_{secrets.token_hex(4)}.enc"
    user_enc_folder = os.path.join(ENCRYPTED_FOLDER, str(user_id))
    os.makedirs(user_enc_folder, exist_ok=True)
    encrypted_image_path = os.path.join(user_enc_folder, encrypted_filename)
    with open(encrypted_image_path, 'w') as encrypted_file:
        encrypted_file.write(encrypted_image_b64)

    encrypted_aes_key_path = os.path.join(KEYS_FOLDER, str(user_id), f"{recipient}_aeskey.txt")
    with open(encrypted_aes_key_path, 'w') as f:
        f.write(encrypted_aes_key_b64)
    
    return encrypted_image_b64, encrypted_aes_key_b64, encrypted_filename

# route: Encrypt
@app.route('/encrypt', methods=['POST'])
@jwt_required()
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
        
        user_id = get_jwt_identity()
        encrypted_image, encrypted_aes_key, encrypted_filename = aes_encrypt(file_path, recipient, user_id, filename)

        
        # Save metadata JSON after encryption
        try:
            save_encryption_metadata(user_id, encrypted_filename, filename, recipient)

        except Exception as e:
            print(f"[WARNING] Metadata not saved: {e}") 

        os.remove(file_path)

        return jsonify({
            'status': 'success',
            'message': 'File Encrypted Successfully!',
            'encrypted_content': encrypted_image,
            'encrypted_aes_key': encrypted_aes_key,
            'image_name' : encrypted_filename,
        })
    else:
        return jsonify({'status': 'error', 'message': 'This file type is not allowed'}), 400
    
@app.route('/encrypted/metadata', methods=['GET'])
@jwt_required()
def get_encryption_metadata():
    user_id = get_jwt_identity()
    user_meta_folder = os.path.join(META_FOLDER, str(user_id))
    
    if not os.path.exists(user_meta_folder):
        return jsonify({'metadata': []})  # No files for this user yet

    metadata_files = [f for f in os.listdir(user_meta_folder) if f.endswith('.meta.json')]
    
    all_metadata = []
    for meta_file in metadata_files:
        meta_path = os.path.join(user_meta_folder, meta_file)
        try:
            with open(meta_path, 'r') as f:
                metadata = json.load(f)
            all_metadata.append(metadata)
        except Exception as e:
            # Log error or skip invalid metadata files
            continue
    
    return jsonify(all_metadata)

@app.route('/keys', methods=['GET'])
@jwt_required()
def get_user_encrypted_aes_keys():
    user_id = get_jwt_identity()

    user_keys_folder = os.path.join(KEYS_FOLDER, str(user_id))

    if not os.path.exists(user_keys_folder):
        return jsonify([])

    aes_key_files = [f for f in os.listdir(user_keys_folder) if f.endswith('_aeskey.txt')]
    return jsonify(aes_key_files)

@app.route('/key-content/<key_name>', methods=['GET'])
@jwt_required()
def get_key_content(key_name):
    user_id = get_jwt_identity()
    user_key_folder = os.path.join(KEYS_FOLDER, str(user_id))
    key_path = os.path.join(user_key_folder, key_name)

    if not os.path.exists(key_path):
        return jsonify({'error': 'Key not found'}), 404

    with open(key_path, 'r') as f:
        content = f.read()

    return jsonify({'content': content})


# AES + RSA Decryption Function
def aes_rsa_decrypt(encrypted_image_b64, encrypted_aes_key_b64, recipient, user_id):
    encrypted_image = base64.b64decode(encrypted_image_b64)
    encrypted_aes_key = base64.b64decode(encrypted_aes_key_b64)
    
    # Load user's private key
    private_key_path = os.path.join(KEYS_FOLDER, str(user_id), f"{recipient}_pvt.pem")
    with open(private_key_path, 'rb') as priv_file:
        recipient_private_key = RSA.import_key(priv_file.read())
    rsa_cipher = PKCS1_OAEP.new(recipient_private_key)
    aes_key = rsa_cipher.decrypt(encrypted_aes_key)
    
    nonce, tag, encrypted_data = encrypted_image[:16], encrypted_image[16:32], encrypted_image[32:]
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=nonce)
    decrypted_image = cipher.decrypt_and_verify(encrypted_data, tag)
    
    return base64.b64encode(decrypted_image).decode()

@app.route('/decrypt', methods=['POST'])
@jwt_required()
def decrypt():
    try:
        data = request.json
        encrypted_image_b64 = data.get('encrypted_image')
        encrypted_aes_key_b64 = data.get('encryption_key')
        recipient = data.get('recipient')
        decfilename = data.get('filename')
         
        if not encrypted_image_b64 or not encrypted_aes_key_b64 or not recipient:
            return jsonify({'error': 'Missing decryption data'}), 400
        
        user_id = get_jwt_identity()
        decrypted_image_b64 = aes_rsa_decrypt(encrypted_image_b64, encrypted_aes_key_b64, recipient, user_id)

        # Decode Base64 before writing to a file
        
        decrypted_filename = decfilename
 
        user_dec_folder = os.path.join(DECRYPTED_FOLDER, str(user_id))
        os.makedirs(user_dec_folder, exist_ok=True)

        decrypted_path = os.path.join(user_dec_folder, decrypted_filename)

        with open(decrypted_path, "wb") as f:
            f.write(base64.b64decode(decrypted_image_b64))
        
        return jsonify({
            'status': 'success', 
            'decrypted_image': decrypted_image_b64,
            'filename' : decfilename,
        })
    
    except Exception as e:
        return jsonify({'error': f'Error while decrypting the image: {str(e)}'}), 500


# GET -> abs path of user selected folder
def get_user_folder_path(base_folder_name, user_id):
    base_dir = os.path.dirname(__file__)
    return os.path.join(base_dir, base_folder_name, str(user_id))

@app.route('/images/<folder_name>/<user_id>')
def get_images(folder_name, user_id):   

    if folder_name not in VALID_FOLDERS:
        return jsonify({"error": "Invalid base folder name"}), 400
    
    user_specific_folder_path = get_user_folder_path(folder_name, user_id)
    if not os.path.isdir(user_specific_folder_path):
        return jsonify([])
    
    try:
        image_files = [f for f in os.listdir(user_specific_folder_path) if os.path.isfile(os.path.join(user_specific_folder_path, f))]
        image_files = [f for f in image_files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif' , '.enc'))]

        # Construct full URLs for the frontend.
        # The URL now includes the user_id for serving individual images
        image_urls = [f'http://localhost:5000/image/{folder_name}/{user_id}/{img_name}' for img_name in image_files]
        return jsonify(image_urls)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/image/<folder_name>/<user_id>/<filename>')
def serve_image(folder_name, user_id, filename):
    # Basic security check for valid base folder names
    if folder_name not in VALID_FOLDERS:
        return jsonify({"error": "Invalid base folder"}), 400

    try:
        # Use send_from_directory to safely serve files from the user's specific subfolder
        return send_from_directory(get_user_folder_path(folder_name, user_id), filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/image-counts', methods=['GET'])
@jwt_required()
def get_image_counts():
    user_id = get_jwt_identity()

    def count_files_in_folder(folder_path):
        if os.path.exists(folder_path):
            return len([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])
        return 0

    upload_count = count_files_in_folder(os.path.join(UPLOAD_FOLDER, str(user_id)))
    encrypted_count = count_files_in_folder(os.path.join(ENCRYPTED_FOLDER, str(user_id)))
    decrypted_count = count_files_in_folder(os.path.join(DECRYPTED_FOLDER, str(user_id)))

    return jsonify({
        'uploads': upload_count,
        'encrypted': encrypted_count,
        'decrypted': decrypted_count
    })


# -----------------------------------------------DELETION SECTION

# Del -> Key
@app.route('/api/delete-key', methods = ['POST'])
@jwt_required()
def deletion_key():
    data = request.get_json()
    key = data.get('key')
    user_id = get_jwt_identity()
    reci = key.split('_',1)[0] 
    
    if not key or not user_id:
        return jsonify({'success': False , "error": 'Missing key or user_Id'}), 400
    
    key_folder = os.path.join(KEYS_FOLDER, str(user_id))
    
    aes_key_path = os.path.join(key_folder, key)
    pub_key_path = os.path.join(key_folder, f"{reci}_pub.pem")
    pvt_key_path = os.path.join(key_folder, f"{reci}_pvt.pem")

    try:
        if os.path.exists(aes_key_path):
            os.remove(aes_key_path)
            os.remove(pub_key_path)
            os.remove(pvt_key_path)
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Del -> Metadata
@app.route('/delete-metadata', methods = ['POST'])
@jwt_required()
def delete_metadata():
    data = request.get_json()
    filename = data.get('metadataName')
    user_id = get_jwt_identity()

    user_meta_folder = os.path.join(META_FOLDER, str(user_id))
    metadata_filename = f"{filename}.meta.json"
    file_path = os.path.join(META_FOLDER, str(user_id), metadata_filename)
       

    metadata_files = [f for f in os.listdir(user_meta_folder) if f.endswith('.meta.json')]
    if metadata_filename in metadata_files:
        os.remove(file_path)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False , 'error': 'Metadata not found'}), 404

# Del ->  Images : upload, encrypted, decrypted
@app.route('/delete/<folder_name>/<image_name>', methods=['DELETE'])
@jwt_required()
def delete_images(folder_name, image_name):
    user_id = get_jwt_identity()
    user_specific_folder_path = get_user_folder_path(folder_name, str(user_id))

    if not os.path.isdir(user_specific_folder_path):
        return jsonify({"error": "Folder is not present"}), 404

    user_specific_image_path = os.path.join(user_specific_folder_path, image_name)

    try:
        image_files = [f for f in os.listdir(user_specific_folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.enc'))]
        
        if image_name in image_files:
            os.remove(user_specific_image_path)
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': "Image not found"}), 404
    except FileNotFoundError:
        return jsonify({"error": "File does not exist"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5000)

