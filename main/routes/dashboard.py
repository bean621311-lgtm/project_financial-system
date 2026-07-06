from flask import Blueprint,session
from flask import Flask, render_template,request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from database.db import db
from models.user import Users
from flask import jsonify
from services.dashboard_service import get_dashboard_data
from services.income_service import add_income
from services.expenses_service import add_expense
from services.savings_service import add_saving
from models.savings import Savings
from services.budget_service import ( create_budget, add_category_budget, get_current_budget )
from sqlalchemy import func, extract

from datetime import datetime
from models.income import Income
from models.expense import Expense
from models.budget import Budget
from services.loan_service import (create_loan,
    get_loans,
    get_loan,
    delete_loan,
    pay_emi)
from services.statement_service import get_statement

dashboard_blueprint = Blueprint( "dashboard",__name__)

@dashboard_blueprint.route("/user_dashboard")
def user_dashboard():
    if "user_id" not in session:
        return redirect(url_for("home.login"))

    return render_template(
        "user_dashboard.html",
        name=session.get("user_name"),
        email=session.get("user_email")
    )
@dashboard_blueprint.route("/business_dashboard")
def business_dashboard():
    if "user_id" not in session:
        return redirect(url_for("home.login"))

    return render_template(
        "dashboard_business.html",
        name=session.get("user_name"),
        email=session.get("user_email")
        )

# API FOR DASHBOARD DATA
@dashboard_blueprint.route("/dashboard_data")
def dashboard_data():

    if "user_id" not in session:
        return jsonify({})
    print(datetime.now())
    data = get_dashboard_data(
        session["user_id"]
    )

    return jsonify(data)
    
@dashboard_blueprint.route("/add_income",methods=["POST"])
def create_income():

    if "user_id" not in session:
        return jsonify({
            "message": "Login required"
        }),402

    add_income(
        session["user_id"],
        request.form["source"],
        request.form["amount"],
        request.form["remarks"]
    )

    return jsonify({
        "message": "Income Added"
    })

@dashboard_blueprint.route("/add_expense", methods=["POST"])
def create_expense():
    if "user_id" not in session:
        return jsonify({
            "message": "Login required"
        }),402
    add_expense(
        session["user_id"],
        request.form["category"],
        request.form["amount"],
        request.form["payment_method"]
    )

    return jsonify({
        "message": "Expense Added"
    })

@dashboard_blueprint.route(
    "/add_saving",
    methods=["POST"]
)
def create_saving():

    if "user_id" not in session:
        return jsonify({
            "message": "Login required"
        }), 401

    add_saving(
        session["user_id"],
        request.form["goal_name"],
        request.form["target_date"],
        request.form["target_amount"],
        request.form["description"]
    )

    return jsonify({
        "message": "Goal Created"
    })


@dashboard_blueprint.route(
    "/add_saving_amount",
    methods=["POST"]
)
def add_saving_amount_route():

    if "user_id" not in session:
        return jsonify({
            "message": "Login required"
        }), 401

    saving = Savings.query.get(
        request.form["saving_name"]
    )

    if not saving:
        return jsonify({
            "message": "Goal not found"
        }), 404

    saving.saved_amount = (
        saving.saved_amount or 0
    ) + float(request.form["amount"])

    if saving.saved_amount >= saving.target_amount:
        saving.status = "Completed"
    else:
        saving.status = "In Progress"

    db.session.commit()

    return jsonify({
        "message": "Savings Added"
    })
@dashboard_blueprint.route("/get_savings")
def get_savings():

    savings = Savings.query.filter_by(
        user_id=session["user_id"]
    ).all()

    data = []

    for s in savings:
        data.append({
            "savings_id": s.savings_id,
            "goal_name": s.goal_name,
            "saved_amount": s.saved_amount or 0,
            "target_amount": s.target_amount,
            "status": s.status
        })

    return jsonify(data)

@dashboard_blueprint.route("/create_budget", methods=["POST"])
def create_budget_route():

    if "user_id" not in session:
        return jsonify({"message": "Login required"}), 401

    success = create_budget(
        session["user_id"],
       
        request.form["monthly_budget"]
    )

    if success:
        return jsonify({
            "message": "Monthly Budget Created"
        })

    return jsonify({
        "message": "Budget already exists for this month"
    })

@dashboard_blueprint.route("/add_category_budget", methods=["POST"])
def add_category_budget_route():

    if "user_id" not in session:
        return jsonify({"message":"Login required"}),401

    success = add_category_budget(

        session["user_id"],

        request.form["category"],

        request.form["allocated_amount"]

    )

    if success:

        return jsonify({
            "message":"Category Budget Saved"
        })

    return jsonify({
        "message":"Create Monthly Budget First"
    })

@dashboard_blueprint.route("/get_budget")
def get_budget_route():

    if "user_id" not in session:
        return jsonify({})

    month = datetime.now().month
    year = datetime.now().year

    budget = get_current_budget(session["user_id"])

    # Calculate income automatically
    monthly_income = db.session.query(
        func.sum(Income.amount)
    ).filter(
        Income.user_id == session["user_id"],
        extract("month", Income.date) == month,
        extract("year", Income.date) == year
    ).scalar() or 0

    # Calculate expenses automatically
    monthly_expense = db.session.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == session["user_id"],
        extract("month", Expense.date) == month,
        extract("year", Expense.date) == year
    ).scalar() or 0

    # No budget created yet
    if not budget:

        return jsonify({

            "monthly_income": monthly_income,
            "monthly_budget": 0,
            "spent_amount": monthly_expense,
            "remaining_amount": 0,
            "status": "No Budget"

        })

    # Calculate remaining automatically
    remaining = budget.monthly_budget - monthly_expense

    # Calculate status automatically
    if remaining >= 0:
        status = "On Track"
    else:
        status = "Over Budget"

    return jsonify({

        "monthly_income": monthly_income,
        "monthly_budget": budget.monthly_budget,
        "spent_amount": monthly_expense,
        "remaining_amount": remaining,
        "status": status

    })
@dashboard_blueprint.route(
    "/create_loan",
    methods=["POST"]
)
def create_loan_route():

    if "user_id" not in session:
        return jsonify({
            "message": "Login required"
        }), 401

    try:

        loan = create_loan(

            session["user_id"],

            request.form["loan_name"],

            request.form["loan_provider"],

            float(request.form["principal_amount"]),

            float(request.form["interest_rate"]),

            int(request.form["duration_months"]),

            request.form["start_date"],

            int(request.form["due_day"]),

            request.form.get("remarks", "")

        )

        return jsonify({

            "success": True,

            "message": "Loan Created Successfully",

            "loan_id": loan.loan_id,

            "emi": loan.emi_amount,

            "total_interest": loan.total_interest,

            "total_payable": loan.total_payable

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500
@dashboard_blueprint.route("/get_loans")
def get_loans_route():

    if "user_id" not in session:
        return jsonify([])

    loans = get_loans(
        session["user_id"]
    )

    data = []

    for loan in loans:

        data.append({

            "loan_id": loan.loan_id,

            "loan_name": loan.loan_name,

            "emi_amount": loan.emi_amount

        })

    return jsonify(data)

@dashboard_blueprint.route("/pay_emi", methods=["POST"])
def pay_emi_route():

    if "user_id" not in session:
        return jsonify({
            "message": "Login required"
        }), 401

    success = pay_emi(
        request.form["loan_id"],
        request.form["payment_amount"]
    )

    if success:
        return jsonify({
            "message": "EMI Paid Successfully"
        })

    return jsonify({
        "message": "Payment Failed"
    }), 400

@dashboard_blueprint.route("/get_statement")
def get_statement_route():

        if "user_id" not in session:
            return jsonify({
                "transactions": [],
                "total_income": 0,
                "total_expense": 0,
                "total_saving": 0,
                "net_cashflow": 0
            }), 401

        month = request.args.get("month")
        year = request.args.get("year")
        transaction_type = request.args.get("type")

        data = get_statement(
            session["user_id"],
            month,
            year,
            transaction_type
        )

        return jsonify(data)

@dashboard_blueprint.route("/get_profile")
def get_profile():

    print("Session:", session)
    print("User ID:", session.get("user_id"))

    if "user_id" not in session:
        return jsonify({"message": "Not logged in"}), 401

    user = Users.query.filter_by(
        user_id=session["user_id"]
    ).first()

    print("User:", user)

    if user is None:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "user_id": user.user_id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
        "gender": user.gender,
        "dob": user.dob,
        "address": user.address,
        "occupation": user.occupation,
        "joined": user.created_at
    })