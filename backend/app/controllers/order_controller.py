import os
from app import db
from app.models.order import Order, OrderItem
from app.models.dish import Dish
from app.services.stripe_service import create_checkout_session, get_checkout_session

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:4200')


def get_my_orders(buyer_id: str):
    orders = (Order.query
              .filter_by(buyer_id=buyer_id)
              .order_by(Order.created_at.desc())
              .all())
    return [o.to_dict() for o in orders]


def get_seller_orders(seller_id: str):
    """Orders containing dishes belonging to this seller — only show seller's own items."""
    orders = (Order.query
              .join(OrderItem, OrderItem.order_id == Order.id)
              .join(Dish, Dish.id == OrderItem.dish_id)
              .filter(Dish.seller_id == seller_id)
              .filter(Order.status.in_(['pending', 'paid']))
              .order_by(Order.created_at.desc())
              .distinct()
              .all())

    result = []
    for order in orders:
        # Only include items that belong to this seller
        seller_items = [
            item.to_dict() for item in order.items
            if Dish.query.filter_by(id=item.dish_id, seller_id=seller_id).first()
        ]
        if seller_items:
            order_dict = order.to_dict()
            order_dict['items'] = seller_items
            # Recalculate total for only this seller's items
            order_dict['seller_total'] = round(
                sum(i['subtotal'] for i in seller_items), 2
            )
            result.append(order_dict)

    return result


def create_order(buyer_id: str, items: list):
    if not items:
        return None, 'Cart is empty'

    order_items = []
    line_items = []
    total = 0.0

    for item in items:
        dish = Dish.query.filter_by(id=item['dish_id']).filter(Dish.deleted_at.is_(None)).first()
        if not dish:
            return None, 'Dish not found'
        if dish.is_expired:
            return None, f"'{dish.name}' has expired"

        qty = int(item.get('quantity', 1))
        # sold_count = int(item.get('sold_count', 1))
        available = (dish.quantity or 0) - (dish.sold_count or 0)
        if qty > available:
            return None, f"Only {available} serving(s) of '{dish.name}' available"

        base_price = float(dish.price)
        discount = dish.discount_percent or 0
        price = round(base_price * (1 - discount / 100), 2) if discount else base_price
        total += price * qty

        order_items.append(OrderItem(
            dish_id=dish.id,
            dish_name=dish.name,
            quantity=qty,
            unit_price=price
        ))
        line_items.append({
            'name': dish.name,
            'amount': int(price * 100),  # paise
            'quantity': qty
        })

    # Save order first to get an ID for the Stripe metadata
    order = Order(buyer_id=buyer_id, total_amount=total, status='pending')
    order.items = order_items
    db.session.add(order)
    db.session.flush()  # get order.id without committing

    try:
        session = create_checkout_session(
            line_items=line_items,
            order_id=order.id,
            success_url=f'{FRONTEND_URL}/order-success?session_id={{CHECKOUT_SESSION_ID}}&order_id={order.id}',
            cancel_url=f'{FRONTEND_URL}/cart'
        )
    except Exception as e:
        db.session.rollback()
        return None, f'Payment gateway error: {str(e)}'

    order.stripe_payment_intent_id = session['id']  # store session ID

    # Increment sold_count on pending (reserve stock)
    for oi in order_items:
        dish = Dish.query.filter_by(id=oi.dish_id).first()
        if dish:
            dish.sold_count = (dish.sold_count or 0) + oi.quantity

    db.session.commit()

    return {'order_id': order.id, 'checkout_url': session['url']}, None


def confirm_payment(order_id: str, buyer_id: str, session_id: str):
    order = Order.query.filter_by(id=order_id, buyer_id=buyer_id).first()
    if not order:
        return None, 'Order not found'

    try:
        session = get_checkout_session(session_id)
    except Exception as e:
        return None, f'Could not verify payment: {str(e)}'

    if session.get('payment_status') == 'paid':
        order.status = 'paid'
        db.session.commit()
        return order.to_dict(), None

    # Payment failed — release reserved stock back to dishes
    order.status = 'failed'
    for item in order.items:
        dish = Dish.query.filter_by(id=item.dish_id).first()
        if dish:
            dish.sold_count = max((dish.sold_count or 0) - item.quantity, 0)
    db.session.commit()
    return None, 'Payment not completed'
