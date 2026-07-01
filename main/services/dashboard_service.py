from database.db import db
from sqlalchemy import func
from models.income import Income
from models.expense import Expense
from models.savings import Savings
from models.budget import Budget
from datetime import datetime

def get_dashboard_data(user_id):

    month = datetime.now().month
    year = datetime.now().year

    
    total_income = db.session.query(
        func.sum(Income.amount)
    ).filter(
        Income.user_id == user_id,
        func.extract("month", Income.date) == month,
        func.extract("year", Income.date) == year
    ).scalar() or 0

    total_expense = db.session.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == user_id,
        func.extract("month", Expense.date) == month,
        func.extract("year", Expense.date) == year
    ).scalar() or 0

    total_savings = db.session.query(
        func.sum(Savings.saved_amount)
    ).filter(
        Savings.user_id == user_id
    ).scalar() or 0

    total_goals = Savings.query.filter(
        Savings.user_id == user_id,
        Savings.status != "Completed"
    ).count()
  

    month = datetime.now().month
    year = datetime.now().year

    budget = Budget.query.filter_by(
        user_id=user_id,
        month=month,
        year=year
    ).first()

    if budget:
        monthly_budget = budget.monthly_budget
    else:
        monthly_budget = 0

    remaining_budget = monthly_budget - total_expense

    if remaining_budget < 0:
        remaining_budget = 0

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "total_savings": total_savings,
        "total_goals": total_goals,
        "monthly_budget": monthly_budget,
        "remaining_budget": remaining_budget
    }