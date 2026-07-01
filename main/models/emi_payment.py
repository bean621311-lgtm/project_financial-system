from database.db import db
from datetime import datetime

class EMIPayment(db.Model):
    __tablename__ = "emi_payment"

    payment_id = db.Column(
        db.Integer,
        primary_key=True
    )

    loan_id = db.Column(
        db.Integer,
        db.ForeignKey("loan.loan_id")
    )

    emi_number = db.Column(db.Integer)

    amount_paid = db.Column(db.Float)

    principal_paid = db.Column(db.Float)

    interest_paid = db.Column(db.Float)

    remaining_balance = db.Column(db.Float)

    payment_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    remarks = db.Column(db.String(200))