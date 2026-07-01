
from database.db import db
from datetime import datetime


class Expense(db.Model):
    __tablename__ = "expense"
    expense_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column( db.Integer, db.ForeignKey("users.user_id"))
    category = db.Column(db.String(100))
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_method=db.Column(db.String(25))
   
        
        