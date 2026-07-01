from database.db import db
from models.statement import Statement


def add_statement(
        user_id,
        statement_type,
        amount
):

    statement = Statement(
        user_id=user_id,
        statement_type=statement_type,
        amount=amount
    )

    db.session.add(statement)
    db.session.commit()