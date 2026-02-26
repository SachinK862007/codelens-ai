# backend/api/try_me.py
"""
Try Me feature API endpoints
Handles code execution visualization and explanation
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio

from backend.services.execution_tracer import ExecutionTracer
from backend.services.ai_engine import AIEngine
from backend.config.settings import settings

router = APIRouter(prefix="/try-me", tags=["Try Me"])

class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    include_explanation: bool = True
    include_flowchart: bool = True

class ExecutionResponse(BaseModel):
    success: bool
    output: str
    trace: list
    explanation: Optional[Dict[str, Any]] = None
    flowchart: Optional[str] = None
    execution_time: float
    error: Optional[Dict[str, Any]] = None

# Initialize services
tracer = ExecutionTracer()
ai_engine = AIEngine(settings.claude_api_key)

@router.post("/execute", response_model=ExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """Execute code with tracing and optional AI explanation"""
    try:
        # Execute code with tracing
        execution_result = tracer.execute_with_trace(request.code)
        
        response_data = ExecutionResponse(
            success=execution_result["success"],
            output=execution_result.get("output", ""),
            trace=execution_result["trace"],
            execution_time=execution_result["execution_time"],
            error=execution_result.get("error")
        )
        
        # Add AI explanation if requested
        if request.include_explanation and execution_result["success"]:
            try:
                explanation_prompt = ai_engine.get_code_explanation_prompt(request.language)
                ai_response = await ai_engine.generate_response(
                    explanation_prompt, 
                    request.code
                )
                
                if ai_response["success"]:
                    response_data.explanation = ai_response["response"]
            except Exception as e:
                print(f"AI explanation error: {e}")
        
        # Add flowchart if requested
        if request.include_flowchart:
            try:
                flow_info = tracer.analyze_control_flow(request.code)
                # Generate simple flowchart representation
                flowchart = _generate_simple_flowchart(flow_info)
                response_data.flowchart = flowchart
            except Exception as e:
                print(f"Flowchart generation error: {e}")
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-output")
async def predict_output(code: str):
    """Predict what code will output without running it"""
    try:
        prompt = f"""Without executing this code, predict what it will output:
{code}

Return ONLY valid JSON:
{{
  "predicted_output": "What you expect to see printed",
  "variables_created": ["var1", "var2"],
  "potential_errors": ["possible error if any"]
}}"""
        
        ai_response = await ai_engine.generate_response(
            "You are predicting code output without running it.", 
            prompt
        )
        
        return ai_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _generate_simple_flowchart(flow_info: Dict[str, Any]) -> str:
    """Generate simple Mermaid flowchart from flow information"""
    if "error" in flow_info:
        return "graph TD\n    A[Error analyzing code] --> B[Fix syntax errors]"
    
    lines = ["graph TD"]
    
    # Add start node
    lines.append("    A[Start] --> B[Initialize Variables]")
    
    # Add functions
    for i, func in enumerate(flow_info.get("functions", [])):
        node_id = f"F{i}"
        lines.append(f"    B --> {node_id}[Function: {func['name']}]")
    
    # Add conditionals
    for i, cond in enumerate(flow_info.get("conditionals", [])):
        node_id = f"C{i}"
        lines.append(f"    B --> {node_id}[Conditional Line {cond['line']}]")
    
    # Add loops
    for i, loop in enumerate(flow_info.get("loops", [])):
        node_id = f"L{i}"
        lines.append(f"    B --> {node_id}[Loop Line {loop['line']}]")
    
    # Add end node
    lines.append("    B --> Z[End]")
    
    return "\n".join(lines)
