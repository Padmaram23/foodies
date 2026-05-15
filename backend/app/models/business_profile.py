import uuid
from app import db
from app.models.mixins import AuditMixin


class BusinessProfile(AuditMixin, db.Model):
    __tablename__ = 'business_profiles'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    business_name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    seller_type = db.Column(db.Enum('homemade', 'restaurant'), nullable=False)

    seller = db.relationship('User', backref='business_profile', foreign_keys=[seller_id])

    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'business_name': self.business_name,
            'address': self.address,
            'seller_type': self.seller_type,
        }
