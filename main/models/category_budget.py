from database.db import db


class CategoryBudget(db.Model):
    __tablename__ = "category_budget"

    category_budget_id = db.Column(
        db.Integer,
        primary_key=True
    )

    budget_id = db.Column(
        db.Integer,
        db.ForeignKey("budget.budget_id")
    )

    category = db.Column(db.String(100))

    allocated_amount = db.Column(db.Float)

    spent_amount = db.Column(
        db.Float,
        default=0
    )

    remaining_amount = db.Column(db.Float)

    status = db.Column(
        db.String(30),
        default="On Track"
    )