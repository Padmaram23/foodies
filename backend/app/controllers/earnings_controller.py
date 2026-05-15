from datetime import datetime, timezone
from sqlalchemy import func, extract
from app import db
from app.models.order import Order, OrderItem
from app.models.dish import Dish


def get_earnings(seller_id: str):
    """Returns this month's earnings and a month-by-month history."""

    # Join paid orders → items → dishes belonging to this seller
    base = (db.session.query(
                OrderItem.unit_price,
                OrderItem.quantity,
                Order.created_at
            )
            .join(Order, Order.id == OrderItem.order_id)
            .join(Dish, Dish.id == OrderItem.dish_id)
            .filter(Order.status == 'paid')
            .filter(Dish.seller_id == seller_id)
            .all())

    now = datetime.now(timezone.utc)
    this_month = now.month
    this_year = now.year

    monthly: dict = {}
    current_month_total = 0.0

    for unit_price, quantity, created_at in base:
        if created_at is None:
            continue
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        amount = float(unit_price) * quantity
        key = created_at.strftime('%Y-%m')          # e.g. "2026-04"
        label = created_at.strftime('%B %Y')        # e.g. "April 2026"

        if key not in monthly:
            monthly[key] = {'key': key, 'label': label, 'total': 0.0}
        monthly[key]['total'] = round(monthly[key]['total'] + amount, 2)

        if created_at.month == this_month and created_at.year == this_year:
            current_month_total += amount

    history = sorted(monthly.values(), key=lambda x: x['key'], reverse=True)

    return {
        'this_month': round(current_month_total, 2),
        'this_month_label': now.strftime('%B %Y'),
        'history': history
    }
