from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User


def login(identifier: str, password: str):
    # Allow login with email or phone
    user = User.query.filter(
        (User.email == identifier) | (User.phone == identifier)
    ).first()

    if not user or not user.check_password(password):
        return None, 'Invalid credentials'

    token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role}
    )
    return {'token': token, 'user': user.to_dict()}, None


def register(name: str, email: str, phone: str, password: str):
    if User.query.filter_by(email=email).first():
        return None, 'Email already registered'

    if phone and User.query.filter_by(phone=phone).first():
        return None, 'Phone number already registered'

    user = User(name=name, email=email, phone=phone or None, role='user')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return user.to_dict(), None
