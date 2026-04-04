import uuid
from app import db
from app.models.mixins import AuditMixin

DEFAULT_EXPIRY_MINUTES = 360  # 6 hours


class DishSettings(AuditMixin, db.Model):
    __tablename__ = 'dish_settings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    expiry_minutes = db.Column(db.Integer, nullable=False, default=DEFAULT_EXPIRY_MINUTES)

    seller = db.relationship('User', backref='dish_settings', foreign_keys=[seller_id])

    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'expiry_minutes': self.expiry_minutes,
        }
