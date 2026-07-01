from database.db import db
from datetime import datetime


class Budget(db.Model):
    __tablename__ = "budget"

    budget_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id")
    )

    month = db.Column(db.Integer)

    year = db.Column(db.Integer)

   

    monthly_budget = db.Column(db.Float)

    spent_amount = db.Column(
        db.Float,
        default=0
    )

    remaining_amount = db.Column(db.Float)

    status = db.Column(
        db.String(30),
        default="On Track"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )