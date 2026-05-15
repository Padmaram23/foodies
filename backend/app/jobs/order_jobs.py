"""
Scheduled jobs for order management.
"""
from datetime import datetime, timezone, timedelta


def expire_stale_orders(app):
    """
    Runs every 15 minutes.
    Fails any order that has been in 'pending' state for more than 5 minutes
    and releases the reserved sold_count back to the dishes.
    """
    with app.app_context():
        from app import db
        from app.models.order import Order
        from app.models.dish import Dish

        cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)

        stale = (Order.query
                 .filter_by(status='pending')
                 .filter(Order.created_at <= cutoff)
                 .all())

        if not stale:
            return

        for order in stale:
            order.status = 'failed'
            for item in order.items:
                dish = Dish.query.filter_by(id=item.dish_id).first()
                if dish:
                    dish.sold_count = max((dish.sold_count or 0) - item.quantity, 0)

        db.session.commit()
        print(f'[CRON] Expired {len(stale)} stale order(s)')
