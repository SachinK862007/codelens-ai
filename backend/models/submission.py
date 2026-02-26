# backend/models/submission.py
"""
Submission tracking data models
Handles exercise submissions and progress tracking
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"
    REVIEW_NEEDED = "review_needed"

class TestCaseResult(BaseModel):
    test_case_id: int
    passed: bool
    input: str
    expected_output: str
    actual_output: str
    error_message: Optional[str] = None

class CodeSubmissionBase(BaseModel):
    exercise_id: int
    user_id: int
    code_content: str
    language: str

class CodeSubmissionCreate(CodeSubmissionBase):
    pass

class CodeSubmission(CodeSubmissionBase):
    id: int
    status: SubmissionStatus
    test_results: List[TestCaseResult]
    points_earned: int
    submitted_at: datetime
    graded_at: Optional[datetime] = None
    grader_id: Optional[int] = None
    feedback: Optional[str] = None
    execution_time: Optional[float] = None
    memory_usage: Optional[int] = None  # in KB
    
    class Config:
        orm_mode = True

class SubmissionReview(BaseModel):
    submission_id: int
    reviewer_id: int
    feedback: str
    points_adjusted: int
    status: SubmissionStatus

class BatchSubmissionRequest(BaseModel):
    exercise_id: int
    submissions: List[CodeSubmissionCreate]

class SubmissionStats(BaseModel):
    total_submissions: int
    passed_count: int
    failed_count: int
    average_score: float
    completion_rate: float
    avg_execution_time: float

class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    total_points: int
    completed_exercises: int
    rank: int

class ProgressSnapshot(BaseModel):
    user_id: int
    timestamp: datetime
    level: int
    completed_exercises: int
    total_points: int
    streak_days: int
    last_activity: datetime

class Achievement(BaseModel):
    id: int
    name: str
    description: str
    points: int
    unlocked_at: datetime
    user_id: int
    
    class Config:
        orm_mode = True

class UserProgress(BaseModel):
    user_id: int
    current_level: int
    completed_exercises: int
    total_points: int
    streak_days: int
    last_activity: datetime
    achievements: List[Achievement]
    next_milestone: Optional[str] = None
    progress_percentage: float
