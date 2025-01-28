@app.route("/upload_image", methods= ['POST'])
def upload_image():
  if 'image' not in request.files:
    return jsonify({'error': 'No file part'}), 400
  file = request.files['image']
  if file.filename == '':
    return jsonify({'error': 'No file selected'}), 400
  if file and allowed_file(file.filename):
    filepath = os.path.join(app.config['UPLOAD FOLDER'], file.filename)
    file.save(filepath)
    return jsonify({ 'message' :'File Uploaded Successfully'})
  else :
    return jsonify({'error': 'File type not allowed'}), 400
