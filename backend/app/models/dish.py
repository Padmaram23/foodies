import uuid
from datetime import datetime, timezone, timedelta
from app import db
from app.models.mixins import AuditMixin
from app.models.dish_settings import DishSettings, DEFAULT_EXPIRY_MINUTES
from app.models.business_profile import BusinessProfile


class Dish(AuditMixin, db.Model):
    __tablename__ = 'dishes'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    quantity_size = db.Column(db.Float, nullable=False)
    quantity_unit = db.Column(db.Enum('grams', 'kg'), nullable=False, default='grams')
    whats_special = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    discount_percent = db.Column(db.Integer, nullable=True)
    sold_count = db.Column(db.Integer, nullable=False, default=0)
    expires_at = db.Column(db.DateTime, nullable=True)

    seller = db.relationship('User', foreign_keys='Dish.seller_id', primaryjoin='Dish.seller_id == User.id', lazy='joined')

    @staticmethod
    def compute_expiry(seller_id: str) -> datetime:
        settings = DishSettings.query.filter_by(seller_id=seller_id).first()
        minutes = settings.expiry_minutes if settings else DEFAULT_EXPIRY_MINUTES
        return datetime.now(timezone.utc) + timedelta(minutes=minutes)

    @property
    def is_expired(self) -> bool:
        if not self.expires_at:
            return False
        exp = self.expires_at
        if exp.tzinfo is None:
            exp = exp.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) > exp

    def to_dict(self):
        price = float(self.price) if self.price is not None else 0
        discount = self.discount_percent or 0
        discounted_price = round(price * (1 - discount / 100), 2) if discount else None
        bp = BusinessProfile.query.filter_by(seller_id=self.seller_id).first()
        display_name = bp.business_name if bp else (self.seller.name if self.seller else None)
        seller_type = bp.seller_type if bp else None

        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'seller_name': display_name,
            'seller_type': seller_type,
            'name': self.name,
            'quantity': self.quantity,
            'quantity_size': self.quantity_size,
            'quantity_unit': self.quantity_unit,
            'whats_special': self.whats_special,
            'price': price,
            'discount_percent': discount if discount else None,
            'discounted_price': discounted_price,
            'sold_count': self.sold_count or 0,
            'available_quantity': max((self.quantity or 0) - (self.sold_count or 0), 0),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'is_expired': self.is_expired,
        }
