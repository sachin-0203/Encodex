from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from cryptography.fernet import Fernet
from werkzeug.utils import secure_filename
from PIL import Image
import base64
import time

app= Flask(__name__)
CORS(app)
app.secret_key = 'supersecretkey'

# Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'public/uploads')
ENCRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'public/encrypted')
DECRYPTED_FOLDER = os.path.join(PROJECT_ROOT, 'public/decrypted')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, 'keyfile')

# create directories if not exits
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)
os.makedirs(KEY_PATH, exist_ok=True)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = { 'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.',1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def is_valid_image(file_path):
  try:
    img = Image.open(file_path)
    img.verify()
    return True
  except Exception:
    return False

# Encryption Process Function
def encryption_process(image_path):

  original_imagename = os.path.basename(image_path)
  filename_without_ext , ext = os.path.splitext(original_imagename)

  # 1. Generate the unique key and save at key_path
  key = Fernet.generate_key()
  key_filename = os.path.join(KEY_PATH, f'{filename_without_ext}_{int(time.time())}.key')
  with open(key_filename, 'wb') as key_file:
    key_file.write(key)

  # 2. create a fernet object with the generated key
  fernet = Fernet(key)

  # 2. read the original image file
  with open(image_path, 'rb') as image_file:
    original_image = image_file.read()
  
  # 3. encrypt the image
  encrypted_image = fernet.encrypt(original_image)

  # 4. create a unique filename to the encrypted image

  encrypted_image_path = os.path.join(ENCRYPTED_FOLDER, f"{filename_without_ext}_{int(time.time())}.enc")

  # 5. save the encrypted image in the encrypt folder
  with open(encrypted_image_path, 'wb') as encrypted_file:
    encrypted_file.write(encrypted_image)
  
  return base64.b64encode(encrypted_image).decode(), base64.b64encode(key).decode()


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
      if not is_valid_image(file_path):
        os.remove(file_path)
        return jsonify({'status' : 'error', 'message': 'Invalid image file'}), 400
      
      encrypted_image, encryption_key = encryption_process(file_path)
      return jsonify({
        'status': 'success',
        'message': 'File Encrypted Successfully!',
        'encrypted_content': encrypted_image,
        'encryption_key': encryption_key
        })
    except Exception as e:
      os.remove(file_path)
      return jsonify({'status': 'error', 'message': f"Error during validation: str{e}"}),500

  else:
    return jsonify({ 'status':'error', 'message': 'This file type not allowed'})

@app.route('/decrypt', methods= ['POST','GET'])
def decrypt():
    try:
      data = request.json

      # decoding the base64
      encrypted_image_path =  base64.b64decode(data['encrypted_image']) 
      decrypt_key =  base64.b64decode(data['key']) 

      fernet = Fernet(decrypt_key)
      decrypt_image = fernet.decrypt(encrypted_image_path)

      
      # for saving the decrypted file in the decrypted Folder
      original_filename = data.get('filename' , 'decryptedImage.jpg')
      decrypted_image_path = os.path.join(DECRYPTED_FOLDER, os.path.basename(original_filename).replace('.enc','') + '_decrypt.jpg' )
      with open(decrypted_image_path , 'wb') as decrypted_file:
        decrypted_file.write(decrypt_image)
 
      decrypt_base64 = base64.b64encode(decrypt_image).decode()
      return jsonify({'decrypted_image': decrypt_base64})
    

    except Exception as e:
      return jsonify({'error': 'Error users while decrypting the image'})
    



if __name__ == "__main__":
  if not os.path.exists('uploads'):
    os.makedirs('uploads')

  app.run(debug=True, host="127.0.0.1", port=5000)
