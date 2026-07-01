from database.db import db
from models.income import Income


def add_income(user_id, source, amount,remarks):

    income = Income(
        user_id=user_id,
        source=source,
        amount=amount,
        remarks=remarks
    )

    db.session.add(income)
    db.session.commit()