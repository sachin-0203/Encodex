import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
  SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "default-secret")
  JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret")
  SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'encodex.db')
  SQLALCHEMY_TRACK_MODIFICATIONS = False
