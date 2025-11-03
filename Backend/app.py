from flask import Flask, request, jsonify, send_from_directory, send_file
import os
import io
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import base64
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
import secrets
import json
from flask import render_template
from flask_mail import Mail
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

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

from Backend.db import db
from Backend.models import User
from Backend.models import Plan
from Backend.models import File , Key , MetaData
from flask_migrate import Migrate
from Backend.utils.email_utils import send_email
from Backend.payment import register_payment_routes

load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app, supports_credentials=True,origins=["http://localhost:5173", "https://encodexx.netlify.app"])

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

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("EMAIL_USER")  
app.config['MAIL_PASSWORD'] = os.getenv("EMAIL_PASS") 
app.config['MAIL_DEFAULT_SENDER'] = ("Encodex", "encodex.team@gmail.com")
app.config['MAIL_SECRET_KEY'] = os.getenv("MAIL_SECRET_KEY")
serializer = URLSafeTimedSerializer(app.config["MAIL_SECRET_KEY"])
FRONTEND_URL = "http://localhost:5173"

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app,db)
mail = Mail(app)
register_payment_routes(app)


# Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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

def generate_verification_token(email):
    return serializer.dumps(email, salt='email-confirm')


# Temporary route:  to see the registered user data
# @app.route("/users", methods=["GET"])
# @jwt_required()
# def get_users():
#     users = User.query.all()
#     user_list = []
#     for user in users:
#         user_list.append({
#             "id": user.id, 
#             "username": user.username,
#             "email": user.email,
#             "profile": user.mimetype,
#             "isVerified" : user.is_verified,
#         })
#     return jsonify(user_list)

# @app.route("/delete_user", methods=["POST"])
# def delete_user_test():
#     data = request.json
#     user_id = data.get("user_id")

#     if not user_id:
#         return jsonify({"error": "User ID required"}), 400

#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({"message": f"User {user_id} deleted successfully"}), 200



# --------------------------------CURRENT USER---------------------------

@app.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)


    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if not user.profile_pic or user.profile_pic == b'':
        image_url = None
    else:
        encoded_pic = base64.b64encode(user.profile_pic).decode('utf-8')
        image_url = f"data:{user.mimetype};base64,{encoded_pic}"

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile": image_url,
        "isVerified" : user.is_verified,
    }), 200


# --------------------------------REFRESH--------------------------------
@app.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = int(get_jwt_identity())

    new_access_token= create_access_token(identity=str(current_user))

    return jsonify({
        "message": "success",
        "access_token": new_access_token
    })


# --------------------------------COUNT IMAGES---------------------------

@app.route('/count-images', methods=['GET'])
@jwt_required()
def get_image_counts():
    user_id = get_jwt_identity()


    upload_count = File.query.filter_by(user_id = user_id , file_type = "original").count()
    encrypted_count = File.query.filter_by(user_id = user_id , file_type = "encrypted").count()
    decrypted_count = File.query.filter_by(user_id = user_id , file_type = "decrypted").count()
    keys_count = Key.query.filter(Key.user_id == user_id, Key.aes_key.isnot(None)).count()

    return jsonify({
        'uploads': upload_count,
        'encrypted': encrypted_count,
        'decrypted': decrypted_count,
        'keys' : keys_count,
    })



# --------------------------------VERIFICATION---------------------------

@app.route('/verify', methods = ['POST'])
def verify_user():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return jsonify({
            "success": False,
            "message" : 'Missing token'
        }),400
    
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=3600)

    except SignatureExpired:
        return jsonify({
            "success": False,
            "message": "Token Expired"
        }), 400
    
    except BadSignature:
        return jsonify({
            "success": False,
            "message": "Invalid token"
        }), 400


    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "user not found"
        }), 404
    
    user.is_verified = True
    db.session.commit()

    return jsonify({
        "success": True,
        "message": 'Email verified successfully'
    })

@app.route('/resend_verification', methods=['POST'])
@jwt_required()
def resend_verification():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.is_verified:
        return jsonify({
            "success": False,
            "message": 'Already Verified'
        })
    
    token = generate_verification_token(user.email)

    verify_link = f"http://localhost:5173/verify?token={token}"

    html_body = f"<p>Click <a href='{verify_link}' >here</a> to verify your email </p>"

    send_email(user.email, "Verify your Encodex Account", html_body, is_html=True)
    
    return jsonify({
        "success": True,
        "message": "Verification email sent"
    })



# --------------------------------AUTHENTICATION---------------------------

@app.route('/signup', methods=['POST'])
def signup():
    
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')


    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    existing_user = User.query.filter( (User.email == email )).first()

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


    token = generate_verification_token(email)
    verify_link = f"{FRONTEND_URL}/verify?token={token}"

    subject = "Welcome to Encodex 🎉"
    html_body = f"""
        <p>Hello,</p>
        <p>Please click the link below to verify your email:</p>
        <p><a href="{verify_link}">Verify Email</a></p>
        <p>If the button doesn’t work, copy this link:</p>
        <p>{verify_link}</p>
        """

    send_email(email, subject, html_body, is_html=True)


    return jsonify({
        'status' : 'success',
        'message': 'User registered successfully',
        'username': new_user.username,
    }), 201


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


@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({
        'status': 'success',
        'message': "Logout Successful"
    })
    unset_jwt_cookies(response)

    return response




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



# --------------------------------UPLOAD ROUTE---------------------------

@app.route("/upload", methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    
    file = request.files['file']
    file_type = request.form.get("file_type")

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        
        user_id = get_jwt_identity()
        filename = secure_filename(file.filename)

        file_data = file.read()

        db_file = File(
            filename = filename,
            mimetype = file.mimetype,
            data = file_data,
            encrypted_b64 = None,
            user_id = user_id,
            file_type = file_type
        )
        db.session.add(db_file)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': f"File '{filename}' uploaded successfully",
            'file_id': db_file.id,
            'file_type' : db_file.file_type,
        }), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400



# --------------------------------METADATA-------------------------------

def save_encryption_metadata(user_id, encrypted_filename, original_filename, recipient_name):
    metadata = MetaData(
        user_id = user_id,
        original_filename = original_filename,
        encrypted_filename =encrypted_filename,
        recipient_name = recipient_name,
        rcpt_pubkey_name = f"{recipient_name}_aeskey.txt"
    )

    db.session.add(metadata)
    db.session.commit()

@app.route('/metadata', methods=['GET'])
@jwt_required()
def get_encryption_metadata():
    user_id = get_jwt_identity()

    records = MetaData.query.filter_by(user_id = user_id).order_by(MetaData.created_at.desc()).all()
    
    metadata_list = []

    if not records: 
        return jsonify({'metadata': []}), 404
    
    for r in records:
        metadata_list.append({
            'id' : r.id,
            'original_filename' : r.original_filename,
            'encrypted_filename' : r.encrypted_filename,
            'recipient_name' : r.recipient_name,
            'rcpt_pubkey_name' : r.rcpt_pubkey_name,
            'created_at' : r.created_at
        })
    
    return jsonify(metadata_list), 200



# --------------------------------ENCRYPTION---------------------------

def generate_rsa_keys(recipient, user_id):
    existing_keys = Key.query.filter_by(user_id = user_id , recipient = recipient).first()
    if existing_keys:
        return existing_keys
    
    key = RSA.generate(2048)
    private_key = key.export_key().decode()
    public_key =  key.publickey().export_key().decode()

    new_key = Key(
        user_id = user_id,
        recipient = recipient,
        rsa_private_key = private_key,
        rsa_public_key = public_key
    )
    db.session.add(new_key)
    db.session.commit()
    return new_key

def aes_encrypt(original_file, recipient, user_id):

    filename = secure_filename(original_file.filename)
    mimetype = original_file.mimetype


    filename_without_ext, ext = os.path.splitext(filename)

    original_data = original_file.read()

    aes_key = get_random_bytes(32)
    cipher = AES.new(aes_key, AES.MODE_GCM)

    encrypted_image, tag = cipher.encrypt_and_digest(original_data)
    encrypted_data = cipher.nonce + tag + encrypted_image 


    key_record = generate_rsa_keys(recipient, user_id)

    rsa_pub_key = RSA.import_key(key_record.rsa_public_key) 

    rsa_cipher = PKCS1_OAEP.new(rsa_pub_key)
    encrypted_aes_key = rsa_cipher.encrypt(aes_key)
    
    encrypted_aes_key_b64 = base64.b64encode(encrypted_aes_key).decode()
    encrypted_image_b64 = base64.b64encode(encrypted_data).decode()

    key_record.aes_key = encrypted_aes_key_b64
    db.session.add(key_record) 

    encrypted_filename = f"{filename_without_ext}_{secrets.token_hex(4)}.enc"
    keyname = f"{recipient}_aeskey.txt"

    encrypted_record = File(
        filename = encrypted_filename,
        mimetype = 'application/octet-stream',
        data = None,
        encrypted_b64 = encrypted_image_b64,
        user_id = user_id,
        file_type = 'encrypted',
        recipient = recipient,
        key_filename= keyname
    )

    db.session.add(encrypted_record)
    db.session.commit()

    return encrypted_filename,encrypted_image_b64, encrypted_aes_key_b64,key_record.rsa_private_key, key_record.rsa_public_key,keyname

@app.route('/encrypt', methods=['POST'])
@jwt_required()
def encrypt():
    if 'image' not in request.files or 'recipient' not in request.form:
        return jsonify({'error': 'Missing file or recipient'}), 400
    
    file = request.files['image']
    recipient = request.form['recipient']
    user_id = get_jwt_identity()
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):

        encrypted_filename, encrypted_image,encrypted_aes_key,rsa_pvt_key,rsa_pub_key,keyname = aes_encrypt(file, recipient, user_id)

        save_encryption_metadata(user_id, encrypted_filename, file.filename, recipient)

        return jsonify({
            'status': 'success',
            'message': 'File Encrypted Successfully!',
            'encrypted_content': encrypted_image,
            'encrypted_aes_key': encrypted_aes_key,
            'image_name' : encrypted_filename,
            'key_name': keyname,
        })
    else:
        return jsonify({'status': 'error', 'message': 'This file  type is not allowed'}), 400
       


# --------------------------------DECRYPTION---------------------------

def aes_rsa_decrypt(encrypted_image_b64, encrypted_aes_key_b64, recipient, user_id):
    encrypted_image = base64.b64decode(encrypted_image_b64)
    encrypted_aes_key = base64.b64decode(encrypted_aes_key_b64)
    
    # Load user's private key
    keys = Key.query.filter_by(user_id = user_id , recipient = recipient).first()

    rsa_pvt_key = RSA.import_key(keys.rsa_private_key)

    rsa_cipher = PKCS1_OAEP.new(rsa_pvt_key)
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
        decrypted_image_bytes = base64.b64decode(decrypted_image_b64)
        
        decrypted_filename = decfilename

        existing_file =  File.query.filter_by(
            user_id = user_id ,
            filename = decrypted_filename,
            file_type = 'decrypted',
            recipient = recipient
        ).first()

        if existing_file:
            print("Decrypted image already exists, skipping save.")
            return jsonify({
                'status': 'success', 
                "message": "Decrypted image already exists.",
                'decrypted_image': decrypted_image_b64,
            }),201

        decrypted_record = File(
            filename = decrypted_filename,
            mimetype = 'image/png',
            data = decrypted_image_bytes,
            encrypted_b64 = None,
            user_id = user_id,
            file_type = 'decrypted',
            recipient = recipient,
        )
        db.session.add(decrypted_record)
        db.session.commit()

        return jsonify({
            'status': 'success', 
            "message": "Image Decrypted Successfully",
            'decrypted_image': decrypted_image_b64,
            'filename' : decfilename,
        }),200
    
    except Exception as e:
        return jsonify({'error': f'Error while decrypting the image: {str(e)}'}), 500
    
   

# --------------------------------DISPLAY ROUTES---------------------------

@app.route("/displayfile", methods= ["GET"])
@jwt_required()
def display_file():

    try:
        user_id = get_jwt_identity()
        file_type = request.args.get("file_type")

        files = (
            File.query
            .filter_by(user_id = user_id, file_type = file_type)
            .order_by(File.created_at.desc())
            .all()
        )

        if not files:
            return jsonify({'message' : 'No Images found'}), 404
        
        file_list = []

        for f in files:

            if f.file_type == "encrypted" and f.encrypted_b64:
                encoded_data = f.encrypted_b64
            else :
                encoded_data = base64.b64encode(f.data).decode() if f.data else None

            file_list.append({
                'id' : f.id,
                'filename' : f.filename,
                'mimetype' : f.mimetype,
                'file_type': f.file_type,
                'created_at': f.created_at,
                'data' : encoded_data
            })
        
        return jsonify({
            'message' : 'success',
            'files' : file_list
        }), 200
    
    except Exception as e:
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

@app.route('/display-keys', methods=['GET'])
@jwt_required()
def get_user_encrypted_aes_keys():
    user_id = get_jwt_identity()

    key_records = (
        Key.query
        .filter_by(user_id = user_id)
        .order_by(Key.created_at.desc())
        .all()
        )
    
    if not key_records:
        return jsonify({
            'message' : 'No public key found',
            'keys' : []
        }), 404
    
    pubkey_list = []

    for record in key_records:
        pubkey_list.append({
            'keyname' : f"{record.recipient}_aeskey.txt",
            'recipient': record.recipient,
            'aes_key': record.aes_key

        })

    return jsonify({
        'message' : 'success',
        'keys' : pubkey_list
    }), 200



# --------------------------------DELETION---------------------------

@app.route('/api/delete-key', methods = ['POST'])
@jwt_required()
def deletion_key():
    data = request.get_json()
    user_id = data.get('user_id')
    recipinet = data.get('recipient')
    
    if not user_id or not recipinet:
        return jsonify({'success': False , "error": 'Missing key or user_Id'}), 400

    key_to_delete = Key.query.filter_by(user_id = user_id , recipient = recipinet).first()

    if not key_to_delete:
        return jsonify({'success': False, 'error': 'Key not found'}), 404

    db.session.delete(key_to_delete)
    db.session.commit()

    return jsonify({'success': True}), 200


@app.route('/delete-metadata', methods = ['POST'])
@jwt_required()
def delete_metadata():
    data = request.get_json()
    filename = data.get('metadataName')

    if not filename:
        return jsonify({'success': False, 'error': 'Missing metadata filename'}), 400

    data_to_delete = MetaData.query.filter_by(encrypted_filename = filename).first()

    if not data_to_delete:
        return jsonify({'success': False , 'error': 'Metadata not found'}), 404

    db.session.delete(data_to_delete)
    db.session.commit()

    return jsonify({'success': True}), 200


@app.route('/api/delete-image', methods=['DELETE'])
@jwt_required()
def delete_images():

    data = request.get_json()
    fileType = data.get('fileType')
    filename = data.get('filename')
    user_id = get_jwt_identity()

    image_to_delete = File.query.filter_by(
        user_id = user_id, 
        file_type = fileType, 
        filename = filename
    ).first() 

    if not image_to_delete:
        print("Image not found in DB")
        return jsonify({'error': "Image not found"}), 404

    db.session.delete(image_to_delete)
    db.session.commit()
    return jsonify({'success': True}), 200


# -------------------------------UPDATE USER INFO-------------------------

@app.route('/update_email', methods = ['POST'])
@jwt_required()
def update_email():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_email = data.get('email')

    if User.query.filter_by(email = new_email).first():
        return jsonify({
            "success": False,
            "message": "Enter new email"
        }), 400
    
    user = User.query.get(user_id)
    user.email = new_email
    user.is_verified = False
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Email updated"
    })


@app.route('/upload_profile_pic', methods=['POST'])
@jwt_required()
def upload_profile_pic():

    if 'profile_pic' not in request.files:
        return jsonify({'message': 'No file uploaded'}), 400
    
    profile_pic = request.files['profile_pic']

    if profile_pic.filename == '':
        return jsonify({'message': 'Empty filename'}), 400


    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    profile_pic_data = profile_pic.read()
    profile_pic_type = profile_pic.mimetype

    user.profile_pic = profile_pic_data
    user.mimetype = profile_pic_type
    db.session.commit()

    encoded_pic = base64.b64encode(profile_pic_data).decode('utf-8')

    return jsonify({
        'status': True,
        'message': 'Profile pic Updated',
        'image_url': f"data:{profile_pic_type};base64,{encoded_pic}"
    }), 200
    

@app.route('/update_user_info', methods=['POST'])
@jwt_required()
def update_user_info():

    data = request.get_json()
    print('[DATA]:', data)    
    email = data.get('email')
    new_username = data.get('name')
    userid = data.get('id')
    role = data.get('role')

    currUserId = int(get_jwt_identity())
    if currUserId != userid :
        return jsonify({'message': 'User not found'})
    
    existing_user = User.query.filter((User.id == userid) | (User.email == email)).first()

    if existing_user:
        existing_user.username = new_username
        existing_user.role = role
        db.session.commit()
        return jsonify({
            'status' : 'success',
            'username' : new_username,
            'role': role
        }), 200
    return jsonify({
        'message': 'user not update'
    }), 404



# --------------------------------PLAN--------------------------------

@app.route('/api/plan/<string:plan_name>', methods = ['GET'])
def get_plan_by_name(plan_name):
    plan  = Plan.query.filter_by(name = plan_name).first()
    if plan:
        plan_data ={
            'status': 'success',
            'id': plan.id,
            'name': plan.name,
            'price': plan.price,
            'duration': plan.duration_days,
            'features': {
                'downloads_per_month': plan.features.get('downloads_per_month'),
                'storage': plan.features.get('storage'),
                'priority_support': plan.features.get('priority_support'),
            }            
        }
        return jsonify(plan_data)
    
    else: 
        return jsonify({'error': 'Plan not found'}), 404

    

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5000)

