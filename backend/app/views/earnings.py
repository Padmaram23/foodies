from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.earnings_controller import get_earnings

bp = Blueprint('earnings', __name__, url_prefix='/api/earnings')


@bp.route('', methods=['GET'])
@jwt_required()
def earnings():
    seller_id = get_jwt_identity()
    return jsonify(get_earnings(seller_id)), 200
