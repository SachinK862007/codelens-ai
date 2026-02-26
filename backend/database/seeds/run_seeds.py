# backend/database/seeds/run_seeds.py
"""
Script to run database seeds
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

def run_all_seeds():
    """Run all seed scripts"""
    print("Running database seeds...")
    
    # Import seed data
    from backend.database.seeds.users import get_demo_users
    from backend.database.seeds.exercises import get_python_exercises
    
    # Get seed data
    users = get_demo_users()
    exercises = get_python_exercises()
    
    print(f"Seeded {len(users)} users")
    print(f"Seeded {len(exercises)} exercises")
    print("Seeding completed successfully!")

if __name__ == "__main__":
    run_all_seeds()
