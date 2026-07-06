from database.db import db
from models.income import Income
from models.expense import Expense
from models.savings import Savings
from models.emi_payment import EMIPayment
from models.loan import Loan

from sqlalchemy import extract


def get_statement(user_id, month, year, transaction_type):

    transactions = []

    total_income = 0
    total_expense = 0
    total_saving = 0

    # ---------------- Income ----------------

    income_query = Income.query.filter_by(
        user_id=user_id
    )

    if month:
        income_query = income_query.filter(
            extract("month", Income.date) == int(month)
        )

    if year:
        income_query = income_query.filter(
            extract("year", Income.date) == int(year)
        )

    incomes = income_query.all()

    for income in incomes:

        transactions.append({

            "date": income.date.strftime("%d-%m-%Y"),

            "type": "Income",

            "description": income.source,

            "amount": income.amount

        })

        total_income += income.amount

    # ---------------- Expense ----------------

    expense_query = Expense.query.filter_by(
        user_id=user_id
    )

    if month:
        expense_query = expense_query.filter(
            extract("month", Expense.date) == int(month)
        )

    if year:
        expense_query = expense_query.filter(
            extract("year", Expense.date) == int(year)
        )

    expenses = expense_query.all()

    for expense in expenses:

        transactions.append({

            "date": expense.date.strftime("%d-%m-%Y"),

            "type": "Expense",

            "description": expense.category,

            "amount": expense.amount

        })

        total_expense += expense.amount

    # ---------------- Savings ----------------

    saving_query = Savings.query.filter_by(
        user_id=user_id
    )

    if month:
        saving_query = saving_query.filter(
            extract("month", Savings.date) == int(month)
        )

    if year:
        saving_query = saving_query.filter(
            extract("year", Savings.date) == int(year)
        )

    savings = saving_query.all()

    for saving in savings:

        transactions.append({

            "date": saving.date.strftime("%d-%m-%Y"),

            "type": "Saving",

            "description": saving.goal_name,

            "amount": saving.saved_amount

})

        total_saving += saving.saved_amount

    # ---------------- EMI ----------------

    emi_query = db.session.query(
        EMIPayment
    ).join(
        Loan,
        EMIPayment.loan_id == Loan.loan_id
    ).filter(
        Loan.user_id == user_id
    )

    if month:
        emi_query = emi_query.filter(
            extract("month", EMIPayment.payment_date) == int(month)
        )

    if year:
        emi_query = emi_query.filter(
            extract("year", EMIPayment.payment_date) == int(year)
        )

    emis = emi_query.all()

    for emi in emis:

        transactions.append({

            "date": emi.payment_date.strftime("%d-%m-%Y"),

            "type": "EMI",

            "description": "Loan EMI",

            "amount": emi.amount_paid

        })

        total_expense += emi.amount_paid

    # ---------------- Filter ----------------

    if transaction_type:

        transactions = [

            t for t in transactions

            if t["type"] == transaction_type

        ]

    # ---------------- Sort ----------------

    transactions.sort(

        key=lambda x: x["date"],

        reverse=True

    )

    # ---------------- Return ----------------

    return {

        "transactions": transactions,

        "total_income": total_income,

        "total_expense": total_expense,

        "total_saving": total_saving,

        "net_cashflow":
            total_income
            - total_expense
            - total_saving

    }