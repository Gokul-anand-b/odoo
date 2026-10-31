# WedPilot AI — Backend Architecture

## Stack

- **Framework:** Django 4.2
- **API:** Django REST Framework
- **Database:** PostgreSQL (SQLite for development)
- **Documentation:** drf-spectacular (OpenAPI 3.0)

## Directory Structure

```
backend/
├── config/                 → Django project configuration
│   ├── settings.py         → Main settings
│   ├── urls.py             → Root URL configuration
│   ├── wsgi.py             → WSGI entry point
│   └── asgi.py             → ASGI entry point
│
├── api/                    → REST API application
│   ├── urls.py             → API URL routing
│   ├── views.py            → General API views
│   └── <module>/           → Feature-specific APIs (future)
│
├── common/                 → Shared utilities
│   ├── models.py           → Base model classes
│   └── utils.py            → Response helpers, pagination
│
├── manage.py               → Django CLI
└── requirements.txt        → Python dependencies
```

## API Conventions

### URL Patterns
- All APIs under `/api/v1/`
- Resource-based URLs: `/api/v1/weddings/`, `/api/v1/vendors/`
- Nested resources: `/api/v1/weddings/{id}/guests/`

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Base Models
All models should inherit from `common.models.TimeStampedModel` or `common.models.SoftDeleteModel`.

### Adding a Feature Module

1. Create directory: `api/<module>/`
2. Add `__init__.py`, `models.py`, `serializers.py`, `views.py`, `urls.py`
3. Register in `config/settings.py` INSTALLED_APPS
4. Include URLs in `api/urls.py`
5. Run migrations: `python manage.py makemigrations && python manage.py migrate`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Django secret key | Dev key (change in prod) |
| `DJANGO_DEBUG` | Debug mode | `True` |
| `DB_ENGINE` | Database engine | `sqlite3` |
| `DB_NAME` | Database name | `db.sqlite3` |
| `DB_USER` | Database user | Empty |
| `DB_PASSWORD` | Database password | Empty |
| `DB_HOST` | Database host | Empty |
| `DB_PORT` | Database port | Empty |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `localhost:3000` |
