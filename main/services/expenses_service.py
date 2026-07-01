from database.db import db
from models.expense import Expense
from services.budget_service import update_budget

def add_expense(user_id, category, amount,payment_method):
    
    expense = Expense(
        user_id=user_id,
        category=category,
        amount=amount,
        payment_method=payment_method
    )

    db.session.add(expense)
    db.session.commit()

    update_budget(
    user_id,
    category,
    float(amount)
)