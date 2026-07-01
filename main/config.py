class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:root123@localhost:5432/financial_management_system"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


    import os

class Config:

    SECRET_KEY = "your-secret-key"

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "yourgmail@gmail.com"
    MAIL_PASSWORD = "YOUR_GMAIL_APP_PASSWORD"
    MAIL_DEFAULT_SENDER = "yourgmail@gmail.com"
