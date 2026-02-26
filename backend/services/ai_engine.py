# backend/services/ai_engine.py
"""
AI engine service for CodeLens AI
Integrates Claude API with Ollama fallback for code assistance
"""

import os
import json
import subprocess
import requests
from typing import Dict, Any, Optional
from anthropic import Anthropic
import asyncio

class AIEngine:
    """
    AI engine that supports multiple providers with fallback
    Primary: Claude API, Fallback: Ollama local models
    """
    
    def __init__(self, claude_api_key: Optional[str] = None, ollama_host: str = "http://localhost:11434"):
        self.claude_api_key = claude_api_key or os.getenv("CLAUDE_API_KEY", "")
        self.ollama_host = ollama_host
        self.claude_client = None
        
        # Initialize Claude client if API key available
        if self.claude_api_key:
            try:
                self.claude_client = Anthropic(api_key=self.claude_api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Claude client: {e}")
    
    async def generate_response(self, system_prompt: str, user_content: str, 
                              model: str = "claude-3-5-sonnet-20240620") -> Dict[str, Any]:
        """
        Generate AI response with fallback mechanism
        """
        try:
            # Try Claude first if available
            if self.claude_client:
                return await self._generate_claude_response(system_prompt, user_content, model)
            else:
                # Fallback to Ollama
                return await self._generate_ollama_response(system_prompt, user_content)
        except Exception as e:
            # Emergency fallback - return error response
            return {
                "success": False,
                "error": str(e),
                "response": "Sorry, I'm having trouble processing your request right now."
            }
    
    async def _generate_claude_response(self, system_prompt: str, user_content: str, 
                                      model: str) -> Dict[str, Any]:
        """Generate response using Claude API"""
        try:
            response = self.claude_client.messages.create(
                model=model,
                max_tokens=2048,
                temperature=0.3,
                system=system_prompt,
                messages=[{"role": "user", "content": user_content}]
            )
            
            text_response = response.content[0].text
            
            # Try to parse as JSON if it looks like JSON
            try:
                parsed_response = json.loads(text_response)
                return {
                    "success": True,
                    "response": parsed_response,
                    "provider": "claude"
                }
            except json.JSONDecodeError:
                return {
                    "success": True,
                    "response": text_response,
                    "provider": "claude"
                }
                
        except Exception as e:
            # If Claude fails, fallback to Ollama
            print(f"Claude API error: {e}")
            return await self._generate_ollama_response(system_prompt, user_content)
    
    async def _generate_ollama_response(self, system_prompt: str, user_content: str) -> Dict[str, Any]:
        """Generate response using Ollama local model"""
        try:
            # Combine system prompt and user content
            full_prompt = f"{system_prompt}\n\n{user_content}"
            
            # Prepare request for Ollama
            payload = {
                "model": "codellama:7b-instruct",
                "prompt": full_prompt,
                "stream": False
            }
            
            # Make request to Ollama
            response = requests.post(
                f"{self.ollama_host}/api/generate",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")
                
                # Try to parse as JSON
                try:
                    parsed_response = json.loads(response_text)
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
                raise Exception(f"Ollama request failed with status {response.status_code}")
                
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
