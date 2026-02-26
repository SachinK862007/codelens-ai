# backend/database/seeds/exercises.py
"""
Seed data for coding exercises
"""

python_exercises = [
    {
        "id": 1,
        "title": "Hello World Basics",
        "description": "Create a program that prints 'Hello, World!'",
        "difficulty": "beginner",
        "language": "python",
        "solution_template": "# Write your code here\nprint()",
        "test_cases": [
            {"input": "", "expected_output": "Hello, World!\n", "description": "Basic output"}
        ],
        "hints": ["Use the print() function", "Don't forget the exclamation mark"],
        "points": 10,
        "level_number": 1
    },
    {
        "id": 2,
        "title": "Variable Assignment",
        "description": "Create variables and perform basic arithmetic",
        "difficulty": "beginner",
        "language": "python",
        "solution_template": "# Create variables\nx = \ny = \nresult = ",
        "test_cases": [
            {"input": "", "expected_output": "Result: 15\n", "description": "x=10, y=5, result=x+y"}
        ],
        "hints": ["Assign numbers to variables", "Use + operator for addition"],
        "points": 15,
        "level_number": 1
    }
]

def get_python_exercises():
    """Get Python exercise seed data"""
    return python_exercises
