from database.db import db
from models.savings import Savings


def add_saving(
        user_id,
        goal_name,
        target_date,
        target_amount,
        description):

    saving = Savings(
        user_id=user_id,
        goal_name=goal_name,
        target_date=target_date,
        target_amount=target_amount,
        saved_amount=0,
        description=description,
        status="In Progress"
    )

    db.session.add(saving)
    db.session.commit()