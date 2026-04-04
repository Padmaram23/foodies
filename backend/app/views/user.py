from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.user_controller import get_user, update_user, become_seller

bp = Blueprint('user', __name__, url_prefix='/api/user')


@bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    result, error = get_user(user_id)
    if error:
        return jsonify({'message': error}), 404
    return jsonify(result), 200


@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    result, error = update_user(user_id, data)
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 200


@bp.route('/become-seller', methods=['POST'])
@jwt_required()
def become_seller_route():
    user_id = get_jwt_identity()
    data = request.get_json()
    seller_type = data.get('seller_type') if data else None
    if not seller_type:
        return jsonify({'message': 'seller_type is required (homemade or restaurant)'}), 400
    result, error = become_seller(user_id, seller_type)
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 200
