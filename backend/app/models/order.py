import uuid
from app import db
from app.models.mixins import AuditMixin


class Order(AuditMixin, db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    buyer_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    status = db.Column(
        db.Enum('pending', 'paid', 'failed', 'cancelled'),
        nullable=False, default='pending'
    )
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    stripe_payment_intent_id = db.Column(db.String(100), nullable=True)
    stripe_client_secret = db.Column(db.String(255), nullable=True)

    buyer = db.relationship('User', foreign_keys='Order.buyer_id',
                            primaryjoin='Order.buyer_id == User.id')
    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'buyer_id': self.buyer_id,
            'status': self.status,
            'total_amount': float(self.total_amount),
            'stripe_payment_intent_id': self.stripe_payment_intent_id,
            'client_secret': self.stripe_client_secret,
            'items': [i.to_dict() for i in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'), nullable=False)
    dish_id = db.Column(db.String(36), db.ForeignKey('dishes.id'), nullable=False)
    dish_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'dish_id': self.dish_id,
            'dish_name': self.dish_name,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'subtotal': float(self.unit_price) * self.quantity,
        }
