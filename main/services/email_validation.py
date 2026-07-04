from email_validator import validate_email, EmailNotValidError

def validate_user_email(email):
    try:
        valid = validate_email(email, check_deliverability=True)
        return True, valid.email
    except EmailNotValidError as e:
        return False, str(e)
