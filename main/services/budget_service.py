from sqlalchemy import func, extract
from database.db import db
from models.budget import Budget
from models.budget import Budget
from models.category_budget import CategoryBudget
from datetime import datetime


def create_budget(user_id, monthly_budget):

    month = datetime.now().month
    year = datetime.now().year

    budget = Budget.query.filter_by(
        user_id=user_id,
        month=month,
        year=year
    ).first()

    if budget:
        return False

    budget = Budget(
        user_id=user_id,
        month=month,
        year=year,
        
        monthly_budget=monthly_budget,
        spent_amount=0,
        remaining_amount=monthly_budget,
        status="On Track"
    )

    db.session.add(budget)
    db.session.commit()

    return True

def add_category_budget(user_id, category, amount):

    month = datetime.now().month
    year = datetime.now().year

    budget = Budget.query.filter_by(
        user_id=user_id,
        month=month,
        year=year
    ).first()

    if not budget:
        return False

    category_budget = CategoryBudget(

        budget_id=budget.budget_id,

        category=category,

        allocated_amount=amount,

        spent_amount=0,

        remaining_amount=amount,

        status="On Track"

    )

    db.session.add(category_budget)
    db.session.commit()

    return True

def get_current_budget(user_id):

    month = datetime.now().month
    year = datetime.now().year

    return Budget.query.filter_by(
        user_id=user_id,
        month=month,
        year=year
    ).first()
    
def update_budget(user_id, category, expense):

    month = datetime.now().month
    year = datetime.now().year

    budget = Budget.query.filter_by(
        user_id=user_id,
        month=month,
        year=year
    ).first()

    if not budget:
        return

    budget.spent_amount += expense

    budget.remaining_amount = (
        budget.monthly_budget -
        budget.spent_amount
    )

    if budget.remaining_amount >= 0:
        budget.status = "On Track"
    else:
        budget.status = "Over Budget"

    category_budget = CategoryBudget.query.filter_by(
        budget_id=budget.budget_id,
        category=category
    ).first()

    if category_budget:

        category_budget.spent_amount += expense

        category_budget.remaining_amount = (
            category_budget.allocated_amount -
            category_budget.spent_amount
        )

        if category_budget.remaining_amount >= 0:
            category_budget.status = "On Track"
        else:
            category_budget.status = "Over Budget"

    db.session.commit()