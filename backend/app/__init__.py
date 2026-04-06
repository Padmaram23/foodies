from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Custom response for expired tokens
    from flask import jsonify

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'message': 'Token has expired', 'code': 'TOKEN_EXPIRED'}), 419

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'message': 'Invalid token', 'code': 'TOKEN_INVALID'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'message': 'Authorization token is missing', 'code': 'TOKEN_MISSING'}), 401

    from app.views import api
    from app.views import auth
    from app.views import user
    from app.views import dish
    from app.views import order
    from app.views import earnings
    from app.views import business_profile
    from app.views import review
    app.register_blueprint(api.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(dish.bp)
    app.register_blueprint(order.bp)
    app.register_blueprint(earnings.bp)
    app.register_blueprint(business_profile.bp)
    app.register_blueprint(review.bp)

    # Start background scheduler
    _start_scheduler(app)

    # Seed default admin on startup
    with app.app_context():
        _seed_admin(app)

    return app


def _start_scheduler(app):
    from apscheduler.schedulers.background import BackgroundScheduler
    from app.jobs.order_jobs import expire_stale_orders

    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=expire_stale_orders,
        args=[app],
        trigger='interval',
        seconds=10,
        id='expire_stale_orders',
        replace_existing=True
    )
    scheduler.start()
    print('[SCHEDULER] Started — expire_stale_orders every 10 seconds')


def _seed_admin(app):
    from app.models.user import User
    try:
        db.create_all()
        admin = User.query.filter_by(role='admin').first()
        if not admin:
            admin = User(email=app.config['ADMIN_EMAIL'], role='admin', name='Admin')
            admin.set_password(app.config['ADMIN_PASSWORD'])
            db.session.add(admin)
            db.session.commit()
            print(f"[INFO] Default admin created: {app.config['ADMIN_EMAIL']}")
    except Exception as e:
        print(f"[WARN] Could not seed admin: {e}")
