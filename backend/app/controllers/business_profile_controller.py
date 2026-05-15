from app import db
from app.models.business_profile import BusinessProfile


def get_business_profile(seller_id: str):
    profile = BusinessProfile.query.filter_by(seller_id=seller_id).first()
    return profile.to_dict() if profile else None


def save_business_profile(seller_id: str, business_name: str, address: str, seller_type: str):
    if not business_name or not address or not seller_type:
        return None, 'Business name, address and seller type are required'

    profile = BusinessProfile.query.filter_by(seller_id=seller_id).first()
    if profile:
        profile.business_name = business_name
        profile.address = address
        profile.seller_type = seller_type
    else:
        profile = BusinessProfile(
            seller_id=seller_id,
            business_name=business_name,
            address=address,
            seller_type=seller_type
        )
        db.session.add(profile)

    db.session.commit()
    return profile.to_dict(), None
