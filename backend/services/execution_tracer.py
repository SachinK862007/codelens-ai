# backend/services/execution_tracer.py
"""
Code execution tracer service
Captures real-time execution state for visualization
"""

import sys
import io
import traceback
import json
from typing import List, Dict, Any
import ast
import threading
import time

class ExecutionTracer:
    """
    Traces Python code execution and captures variable states
    Uses sys.settrace for detailed execution monitoring
    """
    
    def __init__(self):
        self.trace_data = []
        self.lock = threading.Lock()
        self._output_buffer = []
        
    def trace_function(self, frame, event, arg):
        """Trace function called on each execution event"""
        if event not in ("line", "return", "exception", "call"):
            return self.trace_function
            
        with self.lock:
            trace_entry = {
                "event": event,
                "line_number": frame.f_lineno,
                "filename": frame.f_code.co_filename,
                "function": frame.f_code.co_name,
                "timestamp": time.time()
            }
            
            # Capture local variables for line events
            if event == "line":
                locals_snapshot = {}
                for name, value in frame.f_locals.items():
                    try:
                        # Handle complex objects gracefully
                        if hasattr(value, '__dict__') or isinstance(value, (list, dict, tuple)):
                            locals_snapshot[name] = str(type(value).__name__)
                        else:
                            locals_snapshot[name] = repr(value)[:100]  # Limit length
                    except Exception:
                        locals_snapshot[name] = "<unrepresentable>"
                        
                trace_entry["locals"] = locals_snapshot
                
            self.trace_data.append(trace_entry)
            
        return self.trace_function
    
    def execute_with_trace(self, code: str) -> Dict[str, Any]:
        """
        Execute code with tracing enabled
        Returns execution results and trace data
        """
        # Reset trace data
        self.trace_data = []
        self._output_buffer = []
        
        # Prepare execution environment
        globals_dict = {
            "__builtins__": __builtins__,
        }
        locals_dict = {}
        
        # Capture stdout/stderr
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        original_stdout = sys.stdout
        original_stderr = sys.stderr
        sys.stdout = stdout_capture
        sys.stderr = stderr_capture
        
        execution_result = {
            "success": False,
            "output": "",
            "error": None,
            "trace": [],
            "execution_time": 0
        }
        
        try:
            # Set trace function
            sys.settrace(self.trace_function)
            
            # Record start time
            start_time = time.time()
            
            # Execute the code
            exec(code, globals_dict, locals_dict)
            
            # Record end time
            execution_result["execution_time"] = time.time() - start_time
            
            # Success
            execution_result["success"] = True
            execution_result["output"] = stdout_capture.getvalue()
            
        except Exception as e:
            # Capture exception details
            execution_result["error"] = {
                "type": type(e).__name__,
                "message": str(e),
                "traceback": traceback.format_exc()
            }
        finally:
            # Restore stdout/stderr
            sys.stdout = original_stdout
            sys.stderr = original_stderr
            
            # Remove trace function
            sys.settrace(None)
            
            # Add captured output
            stdout_content = stdout_capture.getvalue()
            stderr_content = stderr_capture.getvalue()
            
            if stdout_content:
                execution_result["console_output"] = stdout_content
            if stderr_content:
                execution_result["error_output"] = stderr_content
                
            # Add trace data
            execution_result["trace"] = self.trace_data.copy()
        
        return execution_result
    
    def analyze_control_flow(self, code: str) -> Dict[str, Any]:
        """
        Analyze code structure and generate control flow information
        """
        try:
            tree = ast.parse(code)
            flow_info = {
                "functions": [],
                "loops": [],
                "conditionals": [],
                "variables": [],
                "complexity": 0
            }
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    flow_info["functions"].append({
                        "name": node.name,
                        "line": node.lineno,
                        "args": [arg.arg for arg in node.args.args]
                    })
                elif isinstance(node, (ast.For, ast.While)):
                    flow_info["loops"].append({
                        "type": type(node).__name__,
                        "line": node.lineno
                    })
                elif isinstance(node, ast.If):
                    flow_info["conditionals"].append({
                        "line": node.lineno
                    })
                elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
                    if node.id not in flow_info["variables"]:
                        flow_info["variables"].append(node.id)
            
            # Calculate cyclomatic complexity approximation
            flow_info["complexity"] = len(flow_info["conditionals"]) + len(flow_info["loops"]) + 1
            
            return flow_info
        except Exception as e:
            return {"error": f"Failed to analyze control flow: {str(e)}"}
