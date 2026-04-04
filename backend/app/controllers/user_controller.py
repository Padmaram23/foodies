from app import db
from app.models.user import User


def get_user(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return None, 'User not found'
    return user.to_dict(), None


def update_user(user_id: str, data: dict):
    user = User.query.get(user_id)
    if not user:
        return None, 'User not found'

    if 'name' in data and data['name']:
        user.name = data['name']

    if 'phone' in data and data['phone'] != user.phone:
        existing = User.query.filter_by(phone=data['phone']).first()
        if existing:
            return None, 'Phone number already in use'
        user.phone = data['phone']

    if 'email' in data and data['email'] != user.email:
        existing = User.query.filter_by(email=data['email']).first()
        if existing:
            return None, 'Email already in use'
        user.email = data['email']

    db.session.commit()
    return user.to_dict(), None


def become_seller(user_id: str, seller_type: str):
    if seller_type not in ('homemade', 'restaurant'):
        return None, 'seller_type must be homemade or restaurant'
    user = User.query.get(user_id)
    if not user:
        return None, 'User not found'
    if user.is_seller:
        return None, 'Already a seller'
    if user.role == 'admin':
        return None, 'Admins cannot become sellers'
    user.role = 'seller'
    user.is_seller = True
    user.seller_type = seller_type
    db.session.commit()
    return user.to_dict(), None
