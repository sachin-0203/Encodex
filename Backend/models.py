from Backend.db import db


class User(db.Model):
  __tablename__ = 'user'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  email = db.Column(db.String(120), unique=True, nullable=False)
  password = db.Column(db.String(128), nullable=False)
  profile_pic = db.Column(db.String(500))
  role = db.Column(db.String(80))

  subscriptions = db.relationship("Subscription", back_populates="user", cascade="all, delete-orphan")

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
