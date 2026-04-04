# Foodies — Backend

REST API service for the Foodies platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.12 |
| Framework | Flask 3.0 |
| ORM | Flask-SQLAlchemy |
| Migrations | Flask-Migrate (Alembic) |
| Database | MySQL |
| Driver | PyMySQL |
| Auth | Flask-JWT-Extended (JWT Bearer tokens) |
| Password hashing | bcrypt |
| CORS | Flask-CORS |
| Config | python-dotenv |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # App factory, JWT callbacks, blueprint registration, admin seed
│   ├── config.py            # Config loaded from .env
│   ├── models/
│   │   ├── mixins.py        # AuditMixin (created_at, updated_at, updated_by, deleted_at, deleted_by)
│   │   ├── user.py          # User model (roles: user, seller, admin)
│   │   ├── dish.py          # Dish model with expiry logic
│   │   └── dish_settings.py # Per-seller expiry configuration
│   ├── controllers/
│   │   ├── auth_controller.py
│   │   ├── user_controller.py
│   │   └── dish_controller.py
│   └── views/
│       ├── api.py           # Health check
│       ├── auth.py          # /api/auth/login, /api/auth/register
│       ├── user.py          # /api/user/profile, /api/user/become-seller
│       └── dish.py          # /api/dishes/*
├── migrations/              # Alembic migration versions
├── requirements.txt
├── .env.example
└── run.py                   # Entry point
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=foodies
DB_USER=your_db_user
DB_PASSWORD=your_db_password

FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your_secret_key

# Default admin seeded on first startup
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234
```

## Setup

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Database Migrations

```bash
# First time only — initialise migrations folder
flask db init

# Generate a migration after model changes
flask db migrate -m "describe your change"

# Apply pending migrations
flask db upgrade

# Roll back one migration
flask db downgrade
```

> On first `flask run`, the app auto-seeds a default admin account using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` if no admin exists.

## Running

```bash
flask run              # development server on http://localhost:5000
```

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login (email or phone) |
| GET | `/api/user/profile` | JWT | Get current user profile |
| PUT | `/api/user/profile` | JWT | Update profile |
| POST | `/api/user/become-seller` | JWT | Register as seller |
| GET | `/api/dishes` | JWT | List seller's own dishes |
| POST | `/api/dishes` | JWT | Add a dish |
| DELETE | `/api/dishes/<id>` | JWT | Soft-delete a dish |
| GET | `/api/dishes/available` | JWT | List all non-expired dishes (excludes own) |
| GET | `/api/dishes/settings` | JWT | Get expiry settings |
| PUT | `/api/dishes/settings` | JWT | Update expiry settings |

## Key Conventions

- All primary keys are UUID (`db.String(36)`)
- All models inherit `AuditMixin` — provides `created_at`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`
- All deletes are **soft deletes** — use `record.soft_delete(user_id)` then commit; never `db.session.delete()`
- Expired JWT returns HTTP `419` (distinct from `401`) so the frontend can redirect to login
