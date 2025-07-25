# 📷🔐 Encodex - Secure Image Encryption & Decryption
Encodex is a full-stack image encryption and decryption platform designed to safeguard sensitive image data using advanced cryptographic techniques. With user authentication, secure key handling, and an intuitive interface, Encodex helps users share images confidently and securely.

# 🚀 Features
🔐 AES & Fernet Encryption — Secure your images with strong symmetric encryption algorithms.

🔑 Dynamic Key Generation — Each image is encrypted with a unique key, enhancing security.

🧾 Key Management — Keys are securely stored in user-specific folders on the server.

👤 User Authentication — Secure login/signup using JWT (access + refresh tokens).

🖼️ Image Upload & Preview — Encrypt and preview uploaded images instantly.

🔄 Decryption with Key — Restore original images using the exact encryption key.

🌐 Frontend + Backend — React.js for frontend, Flask (Python) for backend.


# Tech Stack
| Frontend     | Backend            | Security                  | Storage                         |
| ------------ | ------------------ | ------------------------- | ------------------------------- |
| React.js     | Flask              | Fernet (cryptography)     | Filesystem (user-based folders) |
| Tailwind CSS | Python             | AES + RSA (PyCryptodome)  | JWT for Auth                    |
| React Router | Flask-JWT-Extended | HttpOnly Cookies          | Local File Access               |

## 📌 How to Run Locally
  ### 1. Clone the Repository
  git clone https://github.com/your-username/encodex.git
  cd encodex
      
 ### 2. Backend Setup
  cd backend
  python -m venv venv
  source venv/bin/activate  # for Linux/macOS
  venv\Scripts\activate     # for Windows

  pip install -r requirements.txt
  python app.py
  
### 3. Frontend Setup
  cd frontend
  npm install
  npm run dev
  App runs on:

#### Frontend → http://localhost:5173
#### Backend → http://localhost:5000
