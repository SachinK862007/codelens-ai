# backend/services/ai_engine.py
"""
AI engine service for CodeLens AI
Integrates with Ollama local models for code assistance
"""

import os
import json
import requests
from typing import Dict, Any, Optional
import asyncio

class AIEngine:
    """
    AI engine that uses Ollama local models for code assistance
    """
    
    def __init__(self, api_key: Optional[str] = None, ollama_host: str = "http://localhost:11434"):
        self.ollama_host = ollama_host
        self.ollama_model = os.getenv("OLLAMA_MODEL", "qwen3-coder:480b-cloud")
    
    async def generate_response(self, system_prompt: str, user_content: str, 
                              model: str = None) -> Dict[str, Any]:
        """
        Generate AI response using Ollama
        """
        try:
            return await self._generate_ollama_response(system_prompt, user_content)
        except Exception as e:
            # Emergency fallback - return error response
            return {
                "success": False,
                "error": str(e),
                "response": "Sorry, I'm having trouble processing your request right now. Please ensure Ollama is running."
            }
    
    async def _generate_ollama_response(self, system_prompt: str, user_content: str) -> Dict[str, Any]:
        """Generate response using Ollama local model"""
        try:
            # Combine system prompt and user content
            full_prompt = f"{system_prompt}\n\n{user_content}"
            
            # Prepare request for Ollama
            payload = {
                "model": self.ollama_model,
                "prompt": full_prompt,
                "stream": False
            }
            
            # Make request to Ollama
            response = requests.post(
                f"{self.ollama_host}/api/generate",
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")
                
                # Try to parse as JSON
                try:
                    # Strip markdown code blocks if present
                    cleaned = response_text.strip()
                    if cleaned.startswith("```json"):
                        cleaned = cleaned[7:]
                    if cleaned.startswith("```"):
                        cleaned = cleaned[3:]
                    if cleaned.endswith("```"):
                        cleaned = cleaned[:-3]
                    cleaned = cleaned.strip()
                    
                    parsed_response = json.loads(cleaned)
                    return {
                        "success": True,
                        "response": parsed_response,
                        "provider": "ollama"
                    }
                except json.JSONDecodeError:
                    return {
                        "success": True,
                        "response": response_text,
                        "provider": "ollama"
                    }
            else:
                raise Exception(f"Ollama request failed with status {response.status_code}: {response.text}")
                
        except requests.ConnectionError:
            return {
                "success": False,
                "error": "Cannot connect to Ollama. Please ensure Ollama is running on " + self.ollama_host,
                "response": "AI service is not available. Please start Ollama with: ollama serve"
            }
        except requests.Timeout:
            return {
                "success": False,
                "error": "Ollama request timed out after 120 seconds",
                "response": "The AI request took too long. Please try again with simpler input."
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": "Sorry, I'm unable to process your request at the moment."
            }
    
    def get_code_explanation_prompt(self, language: str = "python") -> str:
        """Get standardized prompt for code explanation"""
        return f"""You are a patient programming tutor for {language} beginners.
Explain the following code line-by-line with these details:
1. Line number
2. What the line does technically
3. Why we do it this way (purpose)
4. A simple analogy to real life (if applicable)

Return ONLY valid JSON in this format:
[
  {{
    "line_number": 1,
    "code": "x = 5",
    "technical_explanation": "Assigns the integer value 5 to variable x",
    "purpose": "Creates a variable to store a numeric value for later use",
    "analogy": "Like putting the number 5 in a labeled box named 'x'"
  }},
  ...
]"""
    
    def get_debug_prompt(self) -> str:
        """Get standardized prompt for debugging"""
        return """Analyze this Python code execution and error.
Provide:
1. Simple explanation of what went wrong (like explaining to a 10-year-old)
2. The exact line causing the issue
3. Corrected code with explanation of changes
4. Mermaid flowchart showing the fixed logic flow

Return ONLY valid JSON:
{
  "error_explanation": "...",
  "problematic_line": "...",
  "corrected_code": "...",
  "changes_explanation": "...",
  "mermaid_flowchart": "graph TD\\n    A[Start] --> B[Fixed Code]"
}"""
    
    def get_project_planning_prompt(self) -> str:
        """Get standardized prompt for project planning"""
        return """You are a mentor helping students plan coding projects.
For the given idea, provide:
1. Project title
2. 5-7 step implementation plan
3. Algorithm pseudocode
4. Recommended programming language and why
5. File structure with purposes
6. Free learning resources
7. Common pitfalls and solutions
8. Mermaid flowchart of overall logic

Return ONLY valid JSON with keys:
title, steps, algorithm, language, files, resources, pitfalls, mermaid"""
