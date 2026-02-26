# backend/api/practice.py
"""
Practice Task feature API endpoints
Handles structured learning path and exercise management
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio

from backend.models.exercise import (
    Exercise, ExerciseCreate, ExerciseSubmission, 
    ProgrammingLanguage, DifficultyLevel
)
from backend.services.ai_engine import AIEngine
from backend.config.settings import settings

router = APIRouter(prefix="/practice", tags=["Practice"])

class PracticeRequest(BaseModel):
    language: ProgrammingLanguage = ProgrammingLanguage.PYTHON
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    current_level: int = 1

class ExerciseRequest(BaseModel):
    exercise_id: int
    code_submission: str

class PracticeResponse(BaseModel):
    exercises: List[Dict[str, Any]]
    current_level: int
    total_levels: int
    progress_percentage: float

class ExerciseResponse(BaseModel):
    success: bool
    feedback: str
    points_earned: int
    next_exercise: Optional[int] = None
    level_completed: bool = False

# Initialize services
ai_engine = AIEngine(settings.claude_api_key)

# Mock exercise database (in production, use real database)
MOCK_EXERCISES = {
    1: {
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
        "points": 10
    },
    2: {
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
        "points": 15
    }
}

@router.post("/get-exercises", response_model=PracticeResponse)
async def get_practice_exercises(request: PracticeRequest):
    """Get practice exercises for current level"""
    try:
        # Filter exercises by language and difficulty
        filtered_exercises = []
        for exercise in MOCK_EXERCISES.values():
            if (exercise["language"] == request.language.value and 
                exercise["difficulty"] == request.difficulty.value):
                filtered_exercises.append(exercise)
        
        # Sort by level and limit to current level exercises
        filtered_exercises.sort(key=lambda x: x["id"])
        current_exercises = [ex for ex in filtered_exercises if ex["id"] <= request.current_level + 2]
        
        response_data = PracticeResponse(
            exercises=current_exercises,
            current_level=request.current_level,
            total_levels=len(MOCK_EXERCISES),
            progress_percentage=min(100, (request.current_level / len(MOCK_EXERCISES)) * 100)
        )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit-exercise", response_model=ExerciseResponse)
async def submit_exercise(request: ExerciseRequest):
    """Submit exercise solution for evaluation"""
    try:
        # Get exercise details
        exercise = MOCK_EXERCISES.get(request.exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        # Evaluate code (simplified for demo)
        evaluation_result = await evaluate_code_solution(
            request.code_submission, 
            exercise["test_cases"]
        )
        
        # Generate feedback using AI
        feedback_prompt = f"""Evaluate this code solution for exercise '{exercise['title']}':

Submitted Code:
{request.code_submission}

Expected Output: {exercise['test_cases'][0]['expected_output'] if exercise['test_cases'] else 'Not specified'}

Evaluation Result: {evaluation_result['result']}

Provide encouraging feedback focusing on:
1. What they did well
2. Specific improvements needed
3. Learning points

Keep it positive and educational."""

        ai_response = await ai_engine.generate_response(
            "You are a supportive coding instructor.", 
            feedback_prompt
        )
        
        feedback_text = ai_response["response"] if ai_response["success"] else "Great effort! Keep practicing."
        
        response_data = ExerciseResponse(
            success=evaluation_result["passed"],
            feedback=feedback_text,
            points_earned=exercise["points"] if evaluation_result["passed"] else 0,
            next_exercise=request.exercise_id + 1 if evaluation_result["passed"] else None,
            level_completed=evaluation_result["passed"] and request.exercise_id == len(MOCK_EXERCISES)
        )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def evaluate_code_solution(code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Evaluate code solution against test cases"""
    try:
        # Simple evaluation (in production, use safe execution environment)
        # This is a mock evaluation for demonstration
        
        # Check if code contains expected elements
        passed = True
        result = "Code appears syntactically correct"
        
        # Basic checks
        if "print" not in code.lower() and any("print" in tc["expected_output"].lower() for tc in test_cases):
            passed = False
            result = "Missing print statement"
        
        # More sophisticated evaluation would go here
        
        return {
            "passed": passed,
            "result": result,
            "details": "Mock evaluation - in production this would run actual tests"
        }
        
    except Exception as e:
        return {
            "passed": False,
            "result": f"Evaluation error: {str(e)}",
            "details": "Failed to evaluate solution"
        }

@router.get("/progress/{user_id}")
async def get_user_progress(user_id: int):
    """Get user's learning progress"""
    try:
        # Mock progress data
        progress_data = {
            "user_id": user_id,
            "completed_exercises": 3,
            "total_exercises": 15,
            "current_streak": 5,
            "total_points": 125,
            "last_completed": "2024-01-15",
            "achievements": ["First Steps", "Debug Master", "Consistency King"]
        }
        
        return progress_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
