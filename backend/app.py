from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database config (edit password!)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@123@localhost:5432/financial_management_system'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route("/")
def home():
    return "Backend is working!"

if __name__ == "__main__":
    app.run(debug=True)