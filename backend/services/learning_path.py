# backend/services/learning_path.py
"""
Learning path management service
Handles curriculum structure and progression tracking
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from enum import Enum
import json

class DifficultyLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class LearningPath:
    """Represents a structured learning path"""
    
    def __init__(self, name: str, description: str, language: str):
        self.name = name
        self.description = description
        self.language = language
        self.levels = []
        self.created_at = datetime.now()
        self.is_active = True
    
    def add_level(self, level_data: Dict[str, Any]):
        """Add a level to the learning path"""
        level_data["level_number"] = len(self.levels) + 1
        self.levels.append(level_data)
    
    def get_level(self, level_number: int) -> Optional[Dict[str, Any]]:
        """Get a specific level by number"""
        if 1 <= level_number <= len(self.levels):
            return self.levels[level_number - 1]
        return None
    
    def get_next_level(self, current_level: int) -> Optional[Dict[str, Any]]:
        """Get the next level"""
        return self.get_level(current_level + 1)
    
    def get_prerequisites(self, level_number: int) -> List[str]:
        """Get prerequisites for a level"""
        level = self.get_level(level_number)
        return level.get("prerequisites", []) if level else []

class CurriculumManager:
    """Manages learning paths and curriculum progression"""
    
    def __init__(self):
        self.learning_paths = {}
        self._initialize_default_paths()
    
    def _initialize_default_paths(self):
        """Initialize default learning paths"""
        # Python Path
        python_path = LearningPath("Python Fundamentals", 
                                 "Master Python programming from basics to advanced", 
                                 "python")
        
        python_path.add_level({
            "title": "Variables and Data Types",
            "description": "Learn about variables, numbers, strings, and basic data types",
            "concepts": ["variables", "data_types", "strings", "numbers"],
            "estimated_time": 2,  # hours
            "prerequisites": [],
            "exercises": [
                {"type": "coding", "title": "Hello World", "points": 5},
                {"type": "quiz", "title": "Data Types Quiz", "points": 10}
            ]
        })
        
        python_path.add_level({
            "title": "Control Structures",
            "description": "Master if/else statements, loops, and conditional logic",
            "concepts": ["if_statements", "loops", "conditionals"],
            "estimated_time": 3,
            "prerequisites": ["variables"],
            "exercises": [
                {"type": "coding", "title": "Number Guesser", "points": 15},
                {"type": "coding", "title": "FizzBuzz", "points": 10}
            ]
        })
        
        python_path.add_level({
            "title": "Functions",
            "description": "Create reusable code with functions and parameters",
            "concepts": ["functions", "parameters", "return_values"],
            "estimated_time": 4,
            "prerequisites": ["control_structures"],
            "exercises": [
                {"type": "coding", "title": "Calculator Functions", "points": 20},
                {"type": "coding", "title": "Temperature Converter", "points": 15}
            ]
        })
        
        self.learning_paths["python"] = python_path
        
        # C Path
        c_path = LearningPath("C Programming", 
                             "Learn C programming fundamentals", 
                             "c")
        
        c_path.add_level({
            "title": "Introduction to C",
            "description": "Learn basic syntax, compilation, and hello world",
            "concepts": ["syntax", "compilation", "main_function"],
            "estimated_time": 2,
            "prerequisites": [],
            "exercises": [
                {"type": "coding", "title": "Hello World in C", "points": 5}
            ]
        })
        
        self.learning_paths["c"] = c_path
        
        # C++ Path
        cpp_path = LearningPath("C++ Programming", 
                               "Learn object-oriented programming with C++", 
                               "cpp")
        
        cpp_path.add_level({
            "title": "C++ Basics",
            "description": "Learn C++ syntax, namespaces, and basic I/O",
            "concepts": ["namespaces", "iostream", "syntax"],
            "estimated_time": 3,
            "prerequisites": [],
            "exercises": [
                {"type": "coding", "title": "Hello World in C++", "points": 5}
            ]
        })
        
        self.learning_paths["cpp"] = cpp_path
    
    def get_learning_path(self, language: str) -> Optional[LearningPath]:
        """Get learning path for a specific language"""
        return self.learning_paths.get(language.lower())
    
    def get_available_paths(self) -> List[str]:
        """Get list of available learning paths"""
        return list(self.learning_paths.keys())
    
    def get_user_progress(self, user_id: int, language: str) -> Dict[str, Any]:
        """Get user's progress in a specific learning path"""
        # In a real implementation, this would query a database
        # For demo, return mock data
        return {
            "user_id": user_id,
            "language": language,
            "current_level": 2,
            "completed_levels": [1],
            "total_levels": 15,
            "points_earned": 50,
            "streak_days": 3,
            "last_activity": datetime.now().isoformat()
        }
    
    def update_user_progress(self, user_id: int, language: str, 
                           level_completed: int, points_earned: int) -> bool:
        """Update user's progress"""
        # In a real implementation, this would update a database
        # For demo, always succeed
        return True
    
    def recommend_next_steps(self, user_id: int, language: str) -> List[Dict[str, Any]]:
        """Recommend next learning steps for user"""
        path = self.get_learning_path(language)
        if not path:
            return []
        
        user_progress = self.get_user_progress(user_id, language)
        current_level = user_progress["current_level"]
        
        recommendations = []
        
        # Recommend next level
        next_level = path.get_next_level(current_level)
        if next_level:
            recommendations.append({
                "type": "next_level",
                "title": f"Next: {next_level['title']}",
                "description": next_level["description"],
                "estimated_time": next_level["estimated_time"],
                "action": "start_level"
            })
        
        # Recommend review of previous levels
        if current_level > 1:
            recommendations.append({
                "type": "review",
                "title": "Review Previous Concepts",
                "description": "Reinforce your understanding of earlier material",
                "estimated_time": 1,
                "action": "review_level"
            })
        
        # Recommend practice exercises
        recommendations.append({
            "type": "practice",
            "title": "Practice Problems",
            "description": "Apply your knowledge with coding challenges",
            "estimated_time": 2,
            "action": "practice_problems"
        })
        
        return recommendations
    
    def generate_milestone_badge(self, user_id: int, language: str, 
                               milestone: str) -> Optional[Dict[str, Any]]:
        """Generate milestone badge for user achievement"""
        badges = {
            "first_steps": {
                "name": "First Steps",
                "description": "Completed your first lesson",
                "icon": "👣",
                "points": 10
            },
            "debug_master": {
                "name": "Debug Master",
                "description": "Successfully debugged 5 programs",
                "icon": "🐛",
                "points": 25
            },
            "consistency_king": {
                "name": "Consistency King",
                "description": "Maintained a 7-day learning streak",
                "icon": "👑",
                "points": 50
            }
        }
        
        return badges.get(milestone)

# Global instance
curriculum_manager = CurriculumManager()
