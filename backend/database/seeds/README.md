# Database Seeds

This directory contains seed data for populating the database with initial values.

## Seed Files

- `users.py` - Sample user accounts for testing
- `exercises.py` - Initial coding exercises and challenges
- `resources.py` - Educational resources and tutorials
- `levels.py` - Practice levels and progression data

## Running Seeds

To populate the database with seed data:

1. Run: `python backend/database/seeds/run_seeds.py`
2. Or use the CLI command: `python -m backend.cli seed`

## Adding New Seeds

1. Create a new Python file in this directory
2. Define seed data as Python dictionaries/lists
3. Add import and execution to `run_seeds.py`
