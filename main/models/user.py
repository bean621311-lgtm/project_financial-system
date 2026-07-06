from database.db import db
from datetime import datetime
class Users(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="User", nullable=False)
    phone = db.Column(db.String(20))
    gender = db.Column(db.String(20))
    dob = db.Column(db.Date)
    address = db.Column(db.String(255))
    occupation = db.Column(db.String(100))
    profile_picture = db.Column(db.String(255), default="default.png")
    created_at = db.Column(db.DateTime, default= datetime.utcnow)