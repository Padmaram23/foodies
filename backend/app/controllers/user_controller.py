from app import db
from app.models.user import User

_NOT_FOUND = 'User not found'


def get_user(user_id: str):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return None, _NOT_FOUND
    return user.to_dict(), None


def update_user(user_id: str, data: dict):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return None, _NOT_FOUND

    if 'name' in data and data['name']:
        user.name = data['name']

    if 'phone' in data and data['phone'] != user.phone:
        if User.query.filter_by(phone=data['phone']).first():
            return None, 'Phone number already in use'
        user.phone = data['phone']

    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return None, 'Email already in use'
        user.email = data['email']

    db.session.commit()
    return user.to_dict(), None


def become_seller(user_id: str, seller_type: str, business_name: str, address: str):
    """Register user as seller and create business profile in one transaction."""
    if seller_type not in ('homemade', 'restaurant'):
        return None, 'seller_type must be homemade or restaurant'
    if not business_name:
        return None, 'Business name is required'
    if not address:
        return None, 'Address is required'

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return None, _NOT_FOUND
    if user.is_seller:
        return None, 'Already a seller'
    if user.role == 'admin':
        return None, 'Admins cannot become sellers'

    from app.models.business_profile import BusinessProfile

    user.role = 'seller'
    user.is_seller = True

    profile = BusinessProfile(
        seller_id=user_id,
        seller_type=seller_type,
        business_name=business_name,
        address=address
    )
    db.session.add(profile)
    db.session.commit()

    return user.to_dict(), None
