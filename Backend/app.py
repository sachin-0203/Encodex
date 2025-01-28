from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from cryptography.fernet import Fernet
from werkzeug.utils import secure_filename

app= Flask(__name__)
CORS(app)
app.secret_key = 'supersecretkey'

# Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'public/uploads')
ENCRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'public/encrypted')
DECRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'public/decrypted')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, 'key.key')

# create directories if not exits
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)

#this generates the key and save the key in the key_file
def generate_key():
  key = Fernet.generate_key()
  with open(KEY_PATH, 'wb') as key_file:
    key_file.write(key)

def load_key():
  generate_key()
  with open(KEY_PATH, 'rb') as key_file:
    return key_file.read()

CORS(app, resources={r"/upload_image": {"origins": "http://localhost:5174"}})

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = { 'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.',1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route("/upload_image", methods= ['POST'])
def upload_image():
  if 'image' not in request.files:
    return jsonify({'error': 'No file part'}), 400
  file = request.files['image']
  if file.filename == '':
    return jsonify({'error': 'No file selected'}), 400
  if file and allowed_file(file.filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    return jsonify({ 'message' :'File Uploaded Successfully'}), 200
  else :
    return jsonify({'error': 'File type not allowed'}), 400

# Encryption Process Function
def encryption_process(image_path):

  # 1. load the key
  key = load_key()
  fernet = Fernet(key)

  # 2. read the image file
  with open(image_path, 'rb') as image_file:
    original_image = image_file.read()
  
  # 3. encrypt the image
  encrypted_image = fernet.encrypt(original_image)

  # 4. modify its name
  encrypted_image_path = os.path.join(ENCRYPTED_FOLDER, os.path.basename('image_path') + '.enc')

  # 5. write the encrypted file in the encrypt folder
  with open(encrypted_image_path, 'wb') as encrypted_file:
    encrypted_file.write(encrypted_image)
  
  return encrypted_image.decode(), key.decode()

# Decryption Process Function
def decryption_process(encrypted_image_path):

  # 1. load the key
  key = load_key()
  fernet = Fernet(key)

  # 2. read the encrypted image
  with open(encrypted_image_path, 'rb') as encrypted_file:
    encrypted_image = encrypted_file.read()

  # 3. Decrypte the image
  decrypt_image = fernet.decrypt(encrypted_image)

  # 4. modify the encrypted file into original file
  orginial_file_path = os.path.join(DECRYPTED_FOLDER, os.path.basename('encrypted_image_path').replace('.enc', '_decrypted.jpg'))

  # 5. write the decrypted file
  with open(encrypted_image_path, 'wb') as decrypted_file:
    decrypted_file.write(decrypt_image)
  
  return orginial_file_path

@app.route('/encrypt', methods= ['POST', 'GET'])
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

    try:
      encrypted_image, encryption_key = encryption_process(file_path)
      return jsonify({
        'status': 'success',
        'message': 'File Encrypted Successfully!',
        'encrypted_content': encrypted_image,
        'encryption_key': encryption_key
        })
    except Exception as e:
      return jsonify({'error': 'error during encryption'}),400

  else:
    return jsonify({'error': 'This file type is not allowed'}), 400

@app.route('/decrypt', methods= ['POST'])
def decrypt():
  if 'image' not in request.files:
    return jsonify({'error': 'No file part'}), 400
  
  file = request.files['image']
  if file.filename == '':
    return jsonify({'error': 'File not selected'}),400
  
  if file and file.filename.endswith('.enc'):
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
      decrypt_file = decryption_process(file_path)
      return jsonify({'message': 'file decrypted successfully!'}), 200
    except Exception as e:
      return jsonify({'error': 'this file does not have .enc extension' }), 400
    
  else:
    return jsonify({'error': 'error while decrypting the file'}), 400



if __name__ == "__main__":
  if not os.path.exists('uploads'):
    os.makedirs('uploads')

  app.run(debug=True, host="127.0.0.1", port=5000)
