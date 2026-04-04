from datetime import datetime, timezone
from app import db
from app.models.dish import Dish
from app.models.dish_settings import DishSettings, DEFAULT_EXPIRY_MINUTES


def get_dishes(seller_id: str):
    dishes = (Dish.query
              .filter_by(seller_id=seller_id)
              .filter(Dish.deleted_at.is_(None))
              .order_by(Dish.created_at.desc())
              .all())
    return [d.to_dict() for d in dishes]


def get_available_dishes(exclude_seller_id: str):
    """Return all non-expired, non-deleted dishes not belonging to the requesting user."""
    now = datetime.now(timezone.utc)
    dishes = (Dish.query
              .filter(Dish.deleted_at.is_(None))
              .filter(Dish.seller_id != exclude_seller_id)
              .filter(
                  (Dish.expires_at.is_(None)) | (Dish.expires_at > now)
              )
              .order_by(Dish.created_at.desc())
              .all())
    return [d.to_dict() for d in dishes]


def create_dish(seller_id: str, data: dict):
    errors = {}
    if not data.get('name'):
        errors['name'] = 'Name is required'
    if not data.get('quantity') or int(data.get('quantity', 0)) < 1:
        errors['quantity'] = 'Quantity must be at least 1'
    if not data.get('quantity_size') or float(data.get('quantity_size', 0)) <= 0:
        errors['quantity_size'] = 'Size must be greater than 0'
    if data.get('quantity_unit') not in ('grams', 'kg'):
        errors['quantity_unit'] = 'Unit must be grams or kg'
    if not data.get('price') or float(data.get('price', 0)) < 0:
        errors['price'] = 'Price is required'
    if errors:
        return None, errors

    discount = data.get('discount_percent')
    if discount is not None:
        try:
            discount = int(discount)
            if not (1 <= discount <= 99):
                errors['discount_percent'] = 'Discount must be between 1 and 99'
                return None, errors
        except (ValueError, TypeError):
            errors['discount_percent'] = 'Invalid discount value'
            return None, errors

    dish = Dish(
        seller_id=seller_id,
        name=data['name'],
        quantity=int(data['quantity']),
        quantity_size=float(data['quantity_size']),
        quantity_unit=data['quantity_unit'],
        whats_special=data.get('whats_special', ''),
        price=float(data['price']),
        discount_percent=discount,
        expires_at=Dish.compute_expiry(seller_id)
    )
    db.session.add(dish)
    db.session.commit()
    return dish.to_dict(), None


def delete_dish(dish_id: str, seller_id: str):
    dish = (Dish.query
            .filter_by(id=dish_id, seller_id=seller_id)
            .filter(Dish.deleted_at.is_(None))
            .first())
    if not dish:
        return False, 'Dish not found'
    dish.soft_delete(deleted_by_id=seller_id)
    db.session.commit()
    return True, None


def get_settings(seller_id: str):
    settings = DishSettings.query.filter_by(seller_id=seller_id).first()
    if not settings:
        return {'seller_id': seller_id, 'expiry_minutes': DEFAULT_EXPIRY_MINUTES}
    return settings.to_dict()


def update_settings(seller_id: str, expiry_minutes: int):
    if expiry_minutes < 1:
        return None, 'expiry_minutes must be at least 1'
    settings = DishSettings.query.filter_by(seller_id=seller_id).first()
    if not settings:
        settings = DishSettings(seller_id=seller_id, expiry_minutes=expiry_minutes)
        db.session.add(settings)
    else:
        settings.expiry_minutes = expiry_minutes
    db.session.commit()
    return settings.to_dict(), None
