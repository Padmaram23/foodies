from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.dish_controller import get_dishes, get_available_dishes, create_dish, delete_dish, get_settings, update_settings

bp = Blueprint('dish', __name__, url_prefix='/api/dishes')


@bp.route('', methods=['GET'])
@jwt_required()
def list_dishes():
    seller_id = get_jwt_identity()
    return jsonify(get_dishes(seller_id)), 200


@bp.route('', methods=['POST'])
@jwt_required()
def add_dish():
    seller_id = get_jwt_identity()
    data = request.get_json()
    result, errors = create_dish(seller_id, data or {})
    if errors:
        return jsonify({'message': 'Validation failed', 'errors': errors}), 422
    return jsonify(result), 201


# Static sub-routes MUST come before /<dish_id> to avoid being matched as a dynamic segment
@bp.route('/available', methods=['GET'])
@jwt_required()
def available_dishes():
    user_id = get_jwt_identity()
    return jsonify(get_available_dishes(exclude_seller_id=user_id)), 200


@bp.route('/settings', methods=['GET'])
@jwt_required()
def dish_settings():
    seller_id = get_jwt_identity()
    return jsonify(get_settings(seller_id)), 200


@bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_dish_settings():
    seller_id = get_jwt_identity()
    data = request.get_json()
    expiry = data.get('expiry_minutes') if data else None
    if not expiry:
        return jsonify({'message': 'expiry_minutes is required'}), 400
    result, error = update_settings(seller_id, int(expiry))
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 200


@bp.route('/<dish_id>', methods=['DELETE'])
@jwt_required()
def remove_dish(dish_id):
    seller_id = get_jwt_identity()
    success, error = delete_dish(dish_id, seller_id)
    if not success:
        return jsonify({'message': error}), 404
    return jsonify({'message': 'Deleted'}), 200
