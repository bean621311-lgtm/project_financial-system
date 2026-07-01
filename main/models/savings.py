from database.db import db
from datetime import datetime

class Savings(db.Model):
    __tablename__ = "savings"

    savings_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id")
    )
    
    goal_name = db.Column(db.String(100))
    target_date = db.Column(db.Date)
    target_amount = db.Column(db.Float)
    saved_amount = db.Column(db.Float, default=0)
    description = db.Column(db.String(255))
    status = db.Column(
        db.String(20),
        default="In Progress"
    )

    date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )