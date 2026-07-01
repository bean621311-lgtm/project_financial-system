from database.db import db
from datetime import datetime

class Loan(db.Model):
    __tablename__ = "loan"

    loan_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id")
    )

    loan_name = db.Column(db.String(100))

    loan_provider = db.Column(db.String(100))

    principal_amount = db.Column(db.Float)

    interest_rate = db.Column(db.Float)

    duration_months = db.Column(db.Integer)

    emi_amount = db.Column(db.Float)

    total_interest = db.Column(db.Float)

    total_payable = db.Column(db.Float)

    outstanding_balance = db.Column(db.Float)

    remaining_emi = db.Column(db.Integer)

    start_date = db.Column(db.Date)

    next_due_date = db.Column(db.Date)

    due_day = db.Column(db.Integer)

    status = db.Column(
        db.String(30),
        default="Active"
    )

    remarks = db.Column(db.String(200))

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )