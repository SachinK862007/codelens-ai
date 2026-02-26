# backend/api/ideas.py
"""
Ideas feature API endpoints
Handles project planning and ideation assistance
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio

from backend.services.ai_engine import AIEngine
from backend.config.settings import settings

router = APIRouter(prefix="/ideas", tags=["Ideas"])

class IdeaRequest(BaseModel):
    idea_description: str
    skill_level: str = "beginner"
    preferred_language: str = "python"
    time_constraint: Optional[str] = None
    existing_skills: List[str] = []

class ProjectPlanResponse(BaseModel):
    success: bool
    plan: Dict[str, Any]
    resources: List[Dict[str, str]]
    estimated_time: str
    difficulty: str

class ResourceRecommendation(BaseModel):
    topic: str
    resources: List[Dict[str, str]]
    confidence: float

class ArchitectureSuggestion(BaseModel):
    components: List[str]
    data_flow: str
    technologies: List[str]
    scalability_considerations: List[str]

# Initialize AI engine
ai_engine = AIEngine(settings.claude_api_key)

@router.post("/generate-plan", response_model=ProjectPlanResponse)
async def generate_project_plan(request: IdeaRequest):
    """Generate a complete project plan from an idea"""
    try:
        # Construct AI prompt
        prompt = f"""You are an experienced software architect and mentor helping students plan coding projects.
For the following idea, provide a comprehensive development plan:

Idea: {request.idea_description}
Skill Level: {request.skill_level}
Preferred Language: {request.preferred_language}
Time Constraint: {request.time_constraint or 'Flexible'}
Existing Skills: {', '.join(request.existing_skills) if request.existing_skills else 'None specified'}

Provide a detailed plan with:
1. Project Title
2. 7-10 step implementation roadmap
3. Algorithm pseudocode with main logic flows
4. Recommended programming language and justification
5. File structure with purposes and approximate line counts
6. 3-5 free learning resources with direct URLs
7. 3-5 common pitfalls and prevention strategies
8. Mermaid flowchart of overall system architecture
9. Estimated completion time
10. Difficulty assessment (beginner/intermediate/advanced)

Return ONLY valid JSON with keys:
title, steps, algorithm, language, language_justification, files, resources, pitfalls, mermaid, estimated_time, difficulty"""

        ai_response = await ai_engine.generate_response(
            "You are an expert software architect and educator.", 
            prompt
        )
        
        if not ai_response["success"]:
            raise HTTPException(status_code=500, detail="Failed to generate project plan")
        
        # Parse and validate response
        plan_data = ai_response["response"]
        
        if isinstance(plan_data, dict):
            response_data = ProjectPlanResponse(
                success=True,
                plan=plan_data,
                resources=plan_data.get("resources", []),
                estimated_time=plan_data.get("estimated_time", "2-4 weeks"),
                difficulty=plan_data.get("difficulty", "intermediate")
            )
        else:
            # Handle text response
            response_data = ProjectPlanResponse(
                success=True,
                plan={"raw_response": str(plan_data)},
                resources=[],
                estimated_time="2-4 weeks",
                difficulty="intermediate"
            )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommend-resources")
async def recommend_resources(topics: List[str]):
    """Recommend learning resources for specific topics"""
    try:
        topics_str = ", ".join(topics)
        prompt = f"""Recommend free, high-quality learning resources for these programming topics:
{topics_str}

For each topic, provide:
1. Topic name
2. 2-3 recommended resources with:
   - Title
   - URL
   - Brief description
   - Why it's good for beginners

Return ONLY valid JSON:
{{
  "recommendations": [
    {{
      "topic": "topic name",
      "resources": [
        {{
          "title": "Resource title",
          "url": "https://example.com",
          "description": "Brief description",
          "why_good": "Why it's recommended"
        }}
      ]
    }}
  ]
}}"""

        ai_response = await ai_engine.generate_response(
            "You are a programming education resource specialist.", 
            prompt
        )
        
        return ai_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-architecture")
async def suggest_architecture(request: IdeaRequest):
    """Suggest system architecture for a project idea"""
    try:
        prompt = f"""Suggest a system architecture for this project idea:
{request.idea_description}

Consider:
- Skill level: {request.skill_level}
- Language: {request.preferred_language}
- Scalability needs
- Data flow patterns
- Component interactions

Return ONLY valid JSON:
{{
  "components": ["component1", "component2"],
  "data_flow": "Description of how data moves through the system",
  "technologies": ["tech1", "tech2"],
  "scalability_considerations": ["consideration1", "consideration2"]
}}"""

        ai_response = await ai_engine.generate_response(
            "You are a system architect specialist.", 
            prompt
        )
        
        return ai_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/popular-ideas")
async def get_popular_ideas():
    """Get popular project ideas with brief descriptions"""
    try:
        # This would typically come from a database
        popular_ideas = [
            {
                "id": 1,
                "title": "Todo List Application",
                "description": "A web app to manage daily tasks with categories and priorities",
                "difficulty": "beginner",
                "estimated_time": "1-2 weeks",
                "tags": ["web", "productivity", "crud"]
            },
            {
                "id": 2,
                "title": "Weather Dashboard",
                "description": "Display current weather and forecasts using API integration",
                "difficulty": "intermediate",
                "estimated_time": "2-3 weeks",
                "tags": ["api", "data-visualization", "web"]
            },
            {
                "id": 3,
                "title": "Personal Finance Tracker",
                "description": "Track income, expenses, and generate financial reports",
                "difficulty": "intermediate",
                "estimated_time": "3-4 weeks",
                "tags": ["finance", "data-analysis", "charts"]
            },
            {
                "id": 4,
                "title": "Quiz Application",
                "description": "Create and take quizzes with multiple question types",
                "difficulty": "beginner",
                "estimated_time": "2-3 weeks",
                "tags": ["education", "games", "web"]
            }
        ]
        
        return {"ideas": popular_ideas}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
