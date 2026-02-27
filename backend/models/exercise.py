# backend/models/exercise.py
"""
Exercise and level data models
Handles structured learning path and exercise management
"""

from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class ProgrammingLanguage(str, Enum):
    PYTHON = "python"
    C = "c"
    CPP = "cpp"
    JAVASCRIPT = "javascript"

class TestCase(BaseModel):
    input: str
    expected_output: str
    description: str

class ExerciseBase(BaseModel):
    title: str
    description: str
    difficulty: DifficultyLevel
    language: ProgrammingLanguage
    estimated_time: int  # minutes
    concepts_covered: List[str]
    prerequisites: List[str]

class ExerciseCreate(ExerciseBase):
    solution_template: str
    test_cases: List[TestCase]
    hints: List[str]

class Exercise(ExerciseBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    level_number: int
    points: int
    created_at: datetime
    is_active: bool = True

class ExerciseSubmission(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    exercise_id: int
    user_id: int
    code_submitted: str
    status: str  # pending, passed, failed
    test_results: List[dict]
    points_earned: int
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_notes: Optional[str] = None

class LearningPath(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: str
    language: ProgrammingLanguage
    total_levels: int
    created_at: datetime
    is_active: bool = True
