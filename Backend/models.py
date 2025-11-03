from Backend.db import db
from datetime import datetime, timezone

def utc_now_iso():
  return datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')


class User(db.Model):
  __tablename__ = 'user'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  email = db.Column(db.String(120), unique=True, nullable=False)
  password = db.Column(db.String(128), nullable=False)
  profile_pic = db.Column(db.LargeBinary, nullable=True)
  mimetype = db.Column(db.String(100), nullable=True)
  is_verified = db.Column(db.Boolean, default=False, server_default="0", nullable=False)

  subscriptions = db.relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
  files = db.relationship("File", back_populates="user", cascade="all, delete-orphan")

class Plan(db.Model):
  __tablename__ = 'plans'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), nullable=False, unique=True)
  price = db.Column(db.Float, nullable=False)
  duration_days = db.Column(db.Integer, nullable=False)
  features = db.Column(db.JSON, nullable=False)  

  subscriptions = db.relationship("Subscription", back_populates="plan", cascade="all, delete-orphan")


class Subscription(db.Model):
  __tablename__ = 'subscriptions'

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
  start_date = db.Column(db.Date, nullable=False)
  end_date = db.Column(db.Date, nullable=False)
  is_active = db.Column(db.Boolean, default=True)

  user = db.relationship("User", back_populates="subscriptions")
  plan = db.relationship("Plan", back_populates="subscriptions")


class File(db.Model):
  __tablename__ = 'files'

  id = db.Column(db.Integer, primary_key = True)
  filename = db.Column(db.String(255), nullable=False, server_default="temp")
  mimetype = db.Column(db.String(100), nullable=True)
  data = db.Column(db.LargeBinary, nullable=True)
  encrypted_b64 = db.Column(db.Text, nullable=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

  created_at = db.Column(db.DateTime, default = datetime.utcnow)

  file_type = db.Column(db.String(20), nullable = False)
  
  recipient = db.Column(db.String(100), nullable=True)
  key_filename = db.Column(db.String(100), nullable=True)

  user = db.relationship('User', back_populates='files')

class Key(db.Model):
  __tablename__ = 'keys'

  id = db.Column(db.Integer, primary_key = True)
  user_id = db.Column(db.Integer, nullable=False)
  recipient = db.Column(db.String(100), nullable=False)

  aes_key = db.Column(db.Text, nullable=True)
  rsa_public_key = db.Column(db.Text, nullable=True)
  rsa_private_key = db.Column(db.Text, nullable=True)

  created_at = db.Column(db.DateTime, default = datetime.utcnow)


class MetaData(db.Model):
  __tablename__ = 'metaData'

  id = db.Column(db.Integer, primary_key = True)
  user_id = db.Column(db.Integer, nullable = False)
  original_filename = db.Column(db.String(100), nullable=True)
  encrypted_filename = db.Column(db.String(100), nullable=True)
  recipient_name = db.Column(db.String(100), nullable=True)
  rcpt_pubkey_name = db.Column(db.String(100), nullable=True)
  created_at = db.Column(db.String, default= utc_now_iso)

