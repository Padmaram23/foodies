from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.order_controller import create_order, confirm_payment, get_my_orders, get_seller_orders

bp = Blueprint('order', __name__, url_prefix='/api/orders')


@bp.route('', methods=['GET'])
@jwt_required()
def my_orders():
    buyer_id = get_jwt_identity()
    return jsonify(get_my_orders(buyer_id)), 200


@bp.route('/received', methods=['GET'])
@jwt_required()
def received_orders():
    seller_id = get_jwt_identity()
    return jsonify(get_seller_orders(seller_id)), 200


@bp.route('', methods=['POST'])
@jwt_required()
def place_order():
    buyer_id = get_jwt_identity()
    data = request.get_json()
    result, error = create_order(buyer_id, data.get('items', []))
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 201


@bp.route('/<order_id>/confirm', methods=['POST'])
@jwt_required()
def confirm(order_id):
    buyer_id = get_jwt_identity()
    data = request.get_json()
    result, error = confirm_payment(
        order_id, buyer_id,
        data.get('session_id')
    )
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 200
