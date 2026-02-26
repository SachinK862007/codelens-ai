# backend/database/seeds/users.py
"""
Seed data for user accounts
"""

demo_users = [
    {
        "id": 1,
        "username": "demo_student",
        "email": "demo@student.com",
        "full_name": "Demo Student",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00",
        "last_login": None
    },
    {
        "id": 2,
        "username": "demo_teacher",
        "email": "demo@teacher.com",
        "full_name": "Demo Teacher",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00",
        "last_login": None
    }
]

def get_demo_users():
    """Get demo user seed data"""
    return demo_users
