from database.db import db
from datetime import datetime


class Statement(db.Model):
    __tablename__ = "statement"

    statement_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    transaction_type = db.Column(db.String(50))
    description = db.Column(db.String(255))
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow)