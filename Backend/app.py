from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import base64
import time
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from cryptography.fernet import Fernet

app = Flask(__name__)
CORS(app)
app.secret_key = 'supersecretkey'

# Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'public/uploads')
ENCRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'public/encrypted')
DECRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'public/decrypted')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, 'keyfile')

# Create directories if they don’t exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)
os.makedirs(KEY_PATH, exist_ok=True)

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

# AES Encryption Function
def aes_encrypt(image_path):
    original_imagename = os.path.basename(image_path)
    filename_without_ext, ext = os.path.splitext(original_imagename)

    key = get_random_bytes(32)  # 256-bit AES key
    cipher = AES.new(key, AES.MODE_GCM)
    
    with open(image_path, 'rb') as image_file:
        original_image = image_file.read()

    encrypted_image, tag = cipher.encrypt_and_digest(original_image)
    encrypted_data = cipher.nonce + tag + encrypted_image  # Store nonce and tag with data

    encrypted_filename = f"{filename_without_ext}_{int(time.time())}.enc"
    encrypted_image_path = os.path.join(ENCRYPTED_FOLDER, encrypted_filename)
    
    with open(encrypted_image_path, 'wb') as encrypted_file:
        encrypted_file.write(encrypted_data)
    
    encryption_key = base64.b64encode(key).decode()
    encrypted_image_b64 = base64.b64encode(encrypted_data).decode()
    
    return encrypted_image_b64, encryption_key

@app.route('/encrypt', methods=['POST'])
def encrypt():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        if not is_valid_image(file_path):
            os.remove(file_path)
            return jsonify({'status': 'error', 'message': 'Invalid image file'}), 400
        
        encrypted_image, encryption_key = aes_encrypt(file_path)
        
        return jsonify({
            'status': 'success',
            'message': 'File Encrypted Successfully!',
            'encrypted_content': encrypted_image,
            'encryption_key': encryption_key
        })
    else:
        return jsonify({'status': 'error', 'message': 'This file type is not allowed'}), 400

# AES Decryption Function
def aes_decrypt(encrypted_image_b64, encryption_key_b64):
    encrypted_image = base64.b64decode(encrypted_image_b64)
    key = base64.b64decode(encryption_key_b64)
    nonce, tag, encrypted_data = encrypted_image[:16], encrypted_image[16:32], encrypted_image[32:]
    
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    decrypted_image = cipher.decrypt_and_verify(encrypted_data, tag)
    
    return base64.b64encode(decrypted_image).decode()

@app.route('/decrypt', methods=['POST'])
def decrypt():
    try:
        data = request.json
        encrypted_image_b64 = data.get('encrypted_image')
        encryption_key_b64 = data.get('encryption_key')

        if not encrypted_image_b64 or not encryption_key_b64:
            return jsonify({'error': 'Missing encryption data'}), 400

        decrypted_image_b64 = aes_decrypt(encrypted_image_b64, encryption_key_b64)
        
        return jsonify({'status': 'success', 'decrypted_image': decrypted_image_b64})

    except Exception as e:
        return jsonify({'error': f'Error while decrypting the image: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
