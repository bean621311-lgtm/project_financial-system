from flask import Blueprint,session
from flask import Flask, render_template,request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from database.db import db
from models.user import Users

import bcrypt
home_blueprint = Blueprint("home",__name__)


@home_blueprint.route("/")
def home():
    return render_template("index.html")


@home_blueprint.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        role = request.form.get("role")

        if not name or not email or not password:
            return "Missing fields"

        print("DATA RECEIVED:", name, email)

        existing_user = Users.query.filter_by(email=email).first()
        if existing_user:
            return "User already exists!"

        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

        try:
            new_user = Users(
                name=name,
                email=email,
                password=hashed_password,
                role=role
            )

            db.session.add(new_user)
            db.session.commit()

            print("USER SAVED SUCCESSFULLY")

            return redirect(url_for("home.login"))

        except Exception as e:
            db.session.rollback()
            return f"Database Error: {str(e)}"

    return render_template("register.html")


@home_blueprint.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        role = request.form.get("role")
        user = Users.query.filter_by(email=email).first()

        if user and bcrypt.checkpw(
            password.encode("utf-8"),
            user.password.encode("utf-8")
        ):
            if role != user.role:
                return "Wrong role selected."

            session["user_id"] = user.user_id
            
            session["user_email"] = user.email
            session["user_role"] = user.role
            session["user_name"] = getattr(user, "name", user.email)
            

            if user.role == "Business":
                return redirect(url_for("dashboard.business_dashboard"))
            else:
                return redirect(url_for("dashboard.user_dashboard"))
        return "Invalid Email or Password"

    return render_template("login.html")


       

@home_blueprint.route("/forgot")
def forgot():
    return "Forgot Password Page"


   
   
@home_blueprint.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home.login"))