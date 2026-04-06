from app import db
from app.models.review import Review
from app.models.order import Order, OrderItem
from app.models.dish import Dish
from app.models.business_profile import BusinessProfile


def submit_review(buyer_id: str, order_id: str, dish_id: str, rating: int, comment: str):
    if not (1 <= rating <= 5):
        return None, 'Rating must be between 1 and 5'

    # Verify order belongs to buyer and is paid
    order = Order.query.filter_by(id=order_id, buyer_id=buyer_id, status='paid').first()
    if not order:
        return None, 'Order not found or not paid'

    # Verify dish was in this order
    item = OrderItem.query.filter_by(order_id=order_id, dish_id=dish_id).first()
    if not item:
        return None, 'Dish not found in this order'

    # Get business profile for the dish's seller
    dish = Dish.query.filter_by(id=dish_id).first()
    if not dish:
        return None, 'Dish not found'

    bp = BusinessProfile.query.filter_by(seller_id=dish.seller_id).first()
    if not bp:
        return None, 'Seller has no business profile'

    # Prevent duplicate review for same order+dish
    existing = Review.query.filter_by(order_id=order_id, dish_id=dish_id, buyer_id=buyer_id).first()
    if existing:
        return None, 'You have already reviewed this dish'

    review = Review(
        order_id=order_id,
        buyer_id=buyer_id,
        dish_id=dish_id,
        business_profile_id=bp.id,
        rating=rating,
        comment=comment or None
    )
    db.session.add(review)
    db.session.commit()
    return review.to_dict(), None


def get_dish_reviews(dish_id: str):
    reviews = (Review.query
               .filter_by(dish_id=dish_id)
               .filter(Review.deleted_at.is_(None))
               .order_by(Review.created_at.desc())
               .all())
    return [r.to_dict() for r in reviews]


def get_business_reviews(business_profile_id: str):
    reviews = (Review.query
               .filter_by(business_profile_id=business_profile_id)
               .filter(Review.deleted_at.is_(None))
               .order_by(Review.created_at.desc())
               .all())
    avg = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else None
    return {'reviews': [r.to_dict() for r in reviews], 'average_rating': avg, 'count': len(reviews)}


def get_reviewable_items(buyer_id: str):
    """Return paid order items the buyer hasn't reviewed yet."""
    paid_items = (db.session.query(OrderItem, Order)
                  .join(Order, Order.id == OrderItem.order_id)
                  .filter(Order.buyer_id == buyer_id, Order.status == 'paid')
                  .all())

    reviewed = {(r.order_id, r.dish_id) for r in
                Review.query.filter_by(buyer_id=buyer_id).all()}

    result = []
    for item, order in paid_items:
        if (order.id, item.dish_id) not in reviewed:
            dish = Dish.query.filter_by(id=item.dish_id).first()
            bp = BusinessProfile.query.filter_by(seller_id=dish.seller_id).first() if dish else None
            result.append({
                'order_id': order.id,
                'dish_id': item.dish_id,
                'dish_name': item.dish_name,
                'business_name': bp.business_name if bp else None,
                'ordered_at': order.created_at.isoformat() if order.created_at else None,
            })
    return result
