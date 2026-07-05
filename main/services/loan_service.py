from database.db import db
from models.loan import Loan
from models.emi_payment import EMIPayment
from datetime import datetime


def create_loan(
    user_id,
    loan_name,
    loan_provider,
    principal_amount,
    interest_rate,
    duration_months,
    start_date,
    due_day,
    remarks
):

    principal = float(principal_amount)
    rate = float(interest_rate)
    months = int(duration_months)

    years = months / 12

    total_interest = (
        principal * rate * years
    ) / 100

    total_payable = (
        principal +
        total_interest
    )

    emi = total_payable / months

    next_due_date = datetime.strptime(
        start_date,
        "%Y-%m-%d"
    )

    loan = Loan(

        user_id=user_id,

        loan_name=loan_name,

        loan_provider=loan_provider,

        principal_amount=principal,

        interest_rate=rate,

        duration_months=months,

        emi_amount=round(emi, 2),

        total_interest=round(total_interest, 2),

        total_payable=round(total_payable, 2),

        outstanding_balance=round(total_payable, 2),

        remaining_emi=months,

        start_date=next_due_date,

        next_due_date=next_due_date,

        due_day=due_day,

        remarks=remarks,

        status="Active"

    )

    db.session.add(loan)
    db.session.commit()

    return loan


def get_loans(user_id):

    return Loan.query.filter_by(

        user_id=user_id,

        status="Active"

    ).all()


def get_loan(loan_id):
    

    return Loan.query.get(loan_id)


def delete_loan(loan_id):

    loan = Loan.query.get(loan_id)

    if not loan:
        return False

    payment = EMIPayment.query.filter_by(
        loan_id=loan_id
    ).first()

    if payment:
        return False

    db.session.delete(loan)
    db.session.commit()

    return True


def pay_emi(loan_id, payment_amount):

    loan = Loan.query.get(loan_id)

    if not loan:
        return False

    payment_amount = float(payment_amount)

    payment = EMIPayment(
        loan_id=loan.loan_id,
        payment_date=datetime.now(),
        amount_paid=payment_amount
    )

    db.session.add(payment)

    loan.outstanding_balance -= payment_amount
    loan.remaining_emi -= 1

    if loan.remaining_emi <= 0 or loan.outstanding_balance <= 0:
        loan.status = "Completed"
        loan.outstanding_balance = 0
        loan.remaining_emi = 0

    db.session.commit()

    return True