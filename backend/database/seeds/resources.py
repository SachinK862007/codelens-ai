# backend/database/seeds/resources.py
"""
Seed data for educational resources
"""

learning_resources = [
    {
        "id": 1,
        "title": "Python Basics Tutorial",
        "url": "https://docs.python.org/3/tutorial/",
        "description": "Official Python tutorial for beginners",
        "category": "python",
        "difficulty": "beginner",
        "duration": "5 hours"
    },
    {
        "id": 2,
        "title": "JavaScript Guide",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "description": "Comprehensive JavaScript guide",
        "category": "javascript",
        "difficulty": "beginner",
        "duration": "8 hours"
    }
]

def get_learning_resources():
    """Get learning resources seed data"""
    return learning_resources
