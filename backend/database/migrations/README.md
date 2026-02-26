# Database Migrations

This directory contains Alembic migration scripts for managing database schema changes.

## Migration Files Structure

- `env.py` - Migration environment configuration
- `script.py.mako` - Template for generating new migrations
- `versions/` - Directory containing individual migration scripts

## Creating New Migrations

1. Make changes to your SQLAlchemy models
2. Run: `alembic revision --autogenerate -m "Description of changes"`
3. Review the generated migration script
4. Run: `alembic upgrade head` to apply migrations

## Rolling Back Changes

- `alembic downgrade -1` - Roll back last migration
- `alembic downgrade base` - Roll back all migrations
