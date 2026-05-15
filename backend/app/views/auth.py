from flask import Blueprint, request, jsonify
from app.controllers.auth_controller import login, register

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    if not data or not data.get('identifier') or not data.get('password'):
        return jsonify({'message': 'Email/phone and password are required'}), 400

    result, error = login(data['identifier'], data['password'])
    if error:
        return jsonify({'message': error}), 401

    return jsonify(result), 200


@bp.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Name, email and password are required'}), 400

    result, error = register(
        data['name'],
        data['email'],
        data.get('phone', ''),
        data['password']
    )
    if error:
        return jsonify({'message': error}), 409

    return jsonify(result), 201
