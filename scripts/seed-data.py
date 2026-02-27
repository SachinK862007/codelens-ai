#!/usr/bin/env python3
"""
Seed data script for CodeLens AI
Populates the database with initial data for exercises and users
"""

import os
import sys
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend to path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.config.security import security_manager
from backend.database.connection import get_db_url, engine
from models.exercise import DifficultyLevel
from sqlalchemy import text
from datetime import datetime
# NOTE: our Pydantic models are not suitable for inserting directly into the
# database, so we perform raw SQL inserts instead.

def seed_users():
    """Create sample users via raw SQL.

    This script is primarily intended as a convenience when the database is
    otherwise empty.  It does not perform any kind of deduplication or
    check for existing rows.
    """
    users_data = [
        {
            "username": "student1",
            "email": "student1@example.com",
            "full_name": "Alice Johnson",
            "is_active": True
        },
        {
            "username": "student2",
            "email": "student2@example.com",
            "full_name": "Bob Smith",
            "is_active": True
        },
        {
            "username": "admin",
            "email": "admin@codelens-ai.org",
            "full_name": "Admin User",
            "is_active": True,
            "is_superuser": True
        }
    ]

    now = datetime.utcnow()
    insert_stmt = text(
        """
        INSERT INTO users (username, email, full_name, hashed_password, is_active, created_at)
        VALUES (:username, :email, :full_name, :hashed_password, :is_active, :created_at)
        """
    )

    with engine.begin() as conn:
        for user in users_data:
            hashed = security_manager.get_password_hash("password123")
            conn.execute(insert_stmt, {
                "username": user["username"],
                "email": user["email"],
                "full_name": user.get("full_name"),
                "hashed_password": hashed,
                "is_active": user.get("is_active", True),
                "created_at": now,
            })

    print(f"✅ Seeded {len(users_data)} users")

def seed_exercises(session=None):
    """Create sample exercises"""
    # the old version attempted to insert Pydantic objects via a session; since
    # we currently don't have ORM models, we'll simply print a message.
    exercises_data = [
        {
            "title": "Hello World",
            "description": "Write a program that prints 'Hello, World!' to the console.",
            "difficulty": DifficultyLevel.BEGINNER,
            "language": "python",
            "starter_code": "print('Hello, World!')",
            "solution": "print('Hello, World!')",
            "test_cases": '["Hello, World!"]',
            "hints": "Use the print() function to output text to the console."
        },
        {
            "title": "Variable Assignment",
            "description": "Create a variable called 'name' and assign your name to it. Then print the variable.",
            "difficulty": DifficultyLevel.BEGINNER,
            "language": "python",
            "starter_code": "# Write your code here\nname = \nprint(name)",
            "solution": "name = 'Alice'\nprint(name)",
            "test_cases": '["Alice"]',
            "hints": "Remember to use quotes around text values in Python."
        },
        {
            "title": "Simple Calculator",
            "description": "Create a calculator that adds two numbers together.",
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "language": "python",
            "starter_code": "# Write a function that takes two parameters and returns their sum\ndef add(a, b):\n    pass",
            "solution": "def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)",
            "test_cases": '[8]',
            "hints": "Don't forget to return the result from your function."
        }
    ]
    
    for exercise_data in exercises_data:
        # no-op: would normally add ORM object here
        pass
    print(f"✅ (placeholder) Prepared {len(exercises_data)} exercises")

def seed_submissions(session):
    """Create sample submissions"""
    # This would normally link to actual users and exercises.
    # Implementation omitted in this version of the script.
    print("✅ Sample submissions logic skipped (no ORM available)")

def main():
    """Main seeding function"""
    print("🌱 Starting data seeding process...")
    
    # Create database engine
    engine = create_engine(get_db_url())
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Seed data
        seed_users(session)
        seed_exercises(session)
        seed_submissions(session)
        
        print("🎉 Data seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    main()
