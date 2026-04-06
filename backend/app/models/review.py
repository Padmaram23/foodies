import uuid
from app import db
from app.models.mixins import AuditMixin


class Review(AuditMixin, db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'), nullable=False)
    buyer_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    dish_id = db.Column(db.String(36), db.ForeignKey('dishes.id'), nullable=False)
    business_profile_id = db.Column(db.String(36), db.ForeignKey('business_profiles.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)   # 1–5
    comment = db.Column(db.Text, nullable=True)

    buyer = db.relationship('User', foreign_keys='Review.buyer_id',
                            primaryjoin='Review.buyer_id == User.id')
    dish = db.relationship('Dish', foreign_keys='Review.dish_id',
                           primaryjoin='Review.dish_id == Dish.id')
    business_profile = db.relationship('BusinessProfile', foreign_keys='Review.business_profile_id',
                                       primaryjoin='Review.business_profile_id == BusinessProfile.id')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'buyer_id': self.buyer_id,
            'buyer_name': self.buyer.name if self.buyer else None,
            'dish_id': self.dish_id,
            'dish_name': self.dish.name if self.dish else None,
            'business_profile_id': self.business_profile_id,
            'business_name': self.business_profile.business_name if self.business_profile else None,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
