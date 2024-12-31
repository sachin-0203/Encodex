from flask import Flask, request , render_template, jsonify
import os
from flask_cors import CORS
app= Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = { 'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
  return '.' in filename and filename.rsplit('.',1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/upload_image', methods= ['POST'])
def uploade_image():
  if 'image' not in request.files:
    return jsonify({'error': 'No file part'}), 400
  file = request.file['image']
  if file.filename == '':
    return jsonify({'error': 'No file selected'}), 400
  if file and allowed_file(file.filename):
    filepath = os.path.join(app.config['UPLOAD FOLDER'], file.filename)
    file.save(filepath)
    return
  else :
    return jsonify({'error': 'File type not allowed'}), 400

if __name__ == "__main__":
  if not os.path.exists('uploads'):
    os.makedirs('uploads')
  app.run(debug=True)
