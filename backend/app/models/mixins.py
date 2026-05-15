from datetime import datetime, timezone
from app import db


class AuditMixin:
    """
    Adds audit fields to all models.
    - created_at, updated_at, updated_by: standard audit trail
    - deleted_at, deleted_by: soft delete — never hard-delete rows, use soft_delete() instead
    """

    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=True, onupdate=lambda: datetime.now(timezone.utc))
    updated_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    deleted_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None

    def soft_delete(self, deleted_by_id: str = None):
        """Mark record as deleted without removing it from the database."""
        self.deleted_at = datetime.now(timezone.utc)
        self.deleted_by = deleted_by_id
