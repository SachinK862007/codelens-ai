# backend/api/debug.py
"""
Debug feature API endpoints
Handles error analysis and correction with visual flowcharts
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio

from backend.services.execution_tracer import ExecutionTracer
from backend.services.ai_engine import AIEngine
from backend.config.settings import settings

router = APIRouter(prefix="/debug", tags=["Debug"])

class DebugRequest(BaseModel):
    code: str
    error_message: Optional[str] = None
    language: str = "python"

class DebugResponse(BaseModel):
    success: bool
    error_analysis: Dict[str, Any]
    corrected_code: str
    flowchart: str
    explanation: str
    suggestions: list

# Initialize services
tracer = ExecutionTracer()
ai_engine = AIEngine(settings.claude_api_key)

@router.post("/analyze", response_model=DebugResponse)
async def analyze_error(request: DebugRequest):
    """Analyze code error and provide solution with flowchart"""
    try:
        # Execute code to get actual error if not provided
        if not request.error_message:
            execution_result = tracer.execute_with_trace(request.code)
            if execution_result["success"]:
                raise HTTPException(status_code=400, detail="No error found in code")
            
            error_info = execution_result["error"]
            error_message = f"{error_info['type']}: {error_info['message']}"
        else:
            error_message = request.error_message
        
        # Get AI analysis
        debug_prompt = ai_engine.get_debug_prompt()
        ai_response = await ai_engine.generate_response(
            debug_prompt,
            f"Code:\n{request.code}\n\nError: {error_message}"
        )
        
        if not ai_response["success"]:
            raise HTTPException(status_code=500, detail="AI analysis failed")
        
        ai_data = ai_response["response"]
        
        # Validate AI response structure
        if isinstance(ai_data, dict):
            response_data = DebugResponse(
                success=True,
                error_analysis={
                    "type": "AI Analysis",
                    "message": error_message,
                    "ai_explanation": ai_data.get("error_explanation", "")
                },
                corrected_code=ai_data.get("corrected_code", request.code),
                flowchart=ai_data.get("mermaid_flowchart", ""),
                explanation=ai_data.get("changes_explanation", ""),
                suggestions=[
                    "Test the corrected code",
                    "Compare original and fixed versions",
                    "Understand why the error occurred"
                ]
            )
        else:
            # Handle text response
            response_data = DebugResponse(
                success=True,
                error_analysis={
                    "type": "AI Analysis",
                    "message": error_message,
                    "ai_explanation": str(ai_data)
                },
                corrected_code=request.code,
                flowchart="graph TD\n    A[Error] --> B[Check AI Response]",
                explanation="AI provided text response instead of structured data",
                suggestions=["Review AI response for debugging insights"]
            )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/identify-patterns")
async def identify_common_errors(code: str):
    """Identify common programming error patterns"""
    try:
        prompt = f"""Identify common programming mistakes in this code:
{code}

Return ONLY valid JSON:
{{
  "patterns_identified": [
    {{
      "type": "off_by_one",
      "description": "Loop boundary error",
      "line_numbers": [5, 10],
      "suggestion": "Check loop conditions"
    }}
  ],
  "best_practices": [
    "Use descriptive variable names",
    "Add comments for complex logic"
  ]
}}"""
        
        ai_response = await ai_engine.generate_response(
            "You are identifying programming error patterns.", 
            prompt
        )
        
        return ai_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
