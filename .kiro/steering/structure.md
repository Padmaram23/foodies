# Project Structure

## Root Organization

```
/
├── backend/          # Flask application
└── frontend/         # Angular application
```

## Backend Structure (Flask MVC)

```
backend/
├── app/
│   ├── __init__.py       # Flask app factory & SQLAlchemy init
│   ├── models/           # SQLAlchemy models (M)
│   ├── controllers/      # Business logic (C)
│   ├── views/            # API routes/endpoints (V)
│   ├── services/         # External service wrappers (Stripe, email, SMS, etc.)
│   └── config.py         # Configuration (DB connection)
├── migrations/           # Alembic database migrations
├── tests/                # Backend tests
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (DB credentials, secrets)
├── .env.example          # Template for .env file
├── .gitignore            # Exclude .env from version control
└── run.py               # Application entry point
```

## Frontend Structure (Angular)

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/   # UI components
│   │   ├── services/     # API communication
│   │   ├── models/       # TypeScript interfaces
│   │   └── app.module.ts
│   ├── assets/           # Static files
│   └── environments/     # Environment configs
├── angular.json
└── package.json
```

## MVC Pattern Guidelines

### Models (Backend)

- Define SQLAlchemy ORM models (inherit from `db.Model`)
- Map to MySQL database tables
- Contain data validation logic
- Define relationships between tables
- Handle database operations via SQLAlchemy session
- **Primary keys must use UUID** (`db.String(36)` with `default=lambda: str(uuid.uuid4())`)
- **All models must inherit `AuditMixin`** from `app.models.mixins` — this adds `created_at`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by` automatically
- **All deletes must be soft deletes** — call `record.soft_delete(deleted_by_id)` then commit. Never use `db.session.delete()`. Always exclude deleted records with `.filter(Model.deleted_at.is_(None))`

```python
# Soft delete example
dish.soft_delete(deleted_by_id=current_user_id)
db.session.commit()

# Query active records only
Dish.query.filter(Dish.deleted_at.is_(None)).all()
```

### Controllers (Backend)

- Process business logic
- Coordinate between models and views
- Handle data transformation

### Views (Backend)

- Define API endpoints
- Handle HTTP requests/responses
- Return JSON data (no HTML templates)

### Frontend Components

- Consume backend API via services
- Handle UI rendering and user interactions
- Maintain separation from business logic
- App-wide constants (app name, API URL) live in `src/environments/environment.ts` and `environment.prod.ts`
