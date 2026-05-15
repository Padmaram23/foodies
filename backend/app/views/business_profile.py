from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.business_profile_controller import get_business_profile, save_business_profile

bp = Blueprint('business_profile', __name__, url_prefix='/api/business-profile')


@bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    seller_id = get_jwt_identity()
    profile = get_business_profile(seller_id)
    if not profile:
        return jsonify({}), 200
    return jsonify(profile), 200


@bp.route('', methods=['POST'])
@jwt_required()
def save_profile():
    seller_id = get_jwt_identity()
    data = request.get_json()
    result, error = save_business_profile(
        seller_id,
        data.get('business_name', ''),
        data.get('address', ''),
        data.get('seller_type', '')
    )
    if error:
        return jsonify({'message': error}), 400
    return jsonify(result), 200
