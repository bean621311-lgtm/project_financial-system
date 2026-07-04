from flask import Flask, render_template,request,redirect,session
from flask_sqlalchemy import SQLAlchemy
from database.db import db
from models.user import Users
from config import Config
from routes.home import home_blueprint
from routes.dashboard import dashboard_blueprint
from datetime import datetime

app = Flask(__name__)

app.config.from_object(Config)
app.secret_key = "your_secret_key_123"


# Database config (edit password!)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root123@localhost:5432/financial_management_system'
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
        from models.user import Users
        from models.income import Income
        from models.expense import Expense
        from models.savings import Savings
        from models.statement import Statement
       
        db.create_all()

app.register_blueprint(home_blueprint)
app.register_blueprint(dashboard_blueprint)

if __name__ == "__main__":
    app.run(debug=True)
