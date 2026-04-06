from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.review_controller import (
    submit_review, get_dish_reviews, get_business_reviews, get_reviewable_items
)

bp = Blueprint('review', __name__, url_prefix='/api/reviews')


@bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    buyer_id = get_jwt_identity()
    data = request.get_json() or {}
    result, error = submit_review(
        buyer_id,
        data.get('order_id'),
        data.get('dish_id'),
        int(data.get('rating', 0)),
        data.get('comment', '')
    )
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 201


@bp.route('/reviewable', methods=['GET'])
@jwt_required()
def reviewable():
    buyer_id = get_jwt_identity()
    return jsonify(get_reviewable_items(buyer_id)), 200


@bp.route('/dish/<dish_id>', methods=['GET'])
def dish_reviews(dish_id):
    return jsonify(get_dish_reviews(dish_id)), 200


@bp.route('/business/<business_profile_id>', methods=['GET'])
def business_reviews(business_profile_id):
    return jsonify(get_business_reviews(business_profile_id)), 200
