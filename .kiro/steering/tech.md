# Technology Stack

## Backend

- **Language**: Python 3.12
- **Framework**: Flask
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Architecture**: MVC pattern
  - Models: Data layer and business logic (SQLAlchemy models)
  - Views: API endpoints (JSON responses)
  - Controllers: Request handling and routing

## Frontend

- **Framework**: Angular
- **Architecture**: Component-based SPA

## Common Commands

### Backend

```bash
# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Database migrations
flask db init          # Initialize migrations (first time only)
flask db migrate -m "migration message"  # Create migration
flask db upgrade       # Apply migrations

# Run development server
flask run

# Run tests
pytest
```

### Frontend

```bash
# Install dependencies
npm install

# Run development server
ng serve

# Build for production
ng build

# Run tests
ng test
```

## Key Dependencies

- Flask-SQLAlchemy: ORM integration
- Flask-Migrate: Database migrations (Alembic wrapper)
- PyMySQL or mysqlclient: MySQL database driver
- python-dotenv: Load environment variables from .env file

## Environment Configuration

Database credentials and sensitive configuration must be stored in `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
```

Load in `config.py`:

```python
from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
```

## Development Guidelines

- Backend serves as REST API only (no template rendering)
- Frontend consumes backend API endpoints
- Store all sensitive data (DB credentials, secret keys) in .env file
- Never commit .env to version control (add to .gitignore)
- Follow MVC separation of concerns strictly
- Use SQLAlchemy models for all database operations
- Always create migrations for schema changes
- Load environment variables using python-dotenv
- **All model primary keys must be UUID** — use `db.String(36)` with `default=lambda: str(uuid.uuid4())`; never use auto-increment integers
- **All models must use `AuditMixin`** from `app.models.mixins` — provides `created_at`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`; never add these fields manually
- **All deletes must be soft deletes** — never call `db.session.delete()`. Use `record.soft_delete(deleted_by_id=user_id)` then `db.session.commit()`. Always filter active records with `.filter(Model.deleted_at.is_(None))`
