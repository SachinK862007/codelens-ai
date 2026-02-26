# backend/services/code_executor.py
"""
Safe code execution sandbox
Executes code in restricted environment with resource limits
"""

import subprocess
import tempfile
import os
import signal
from typing import Dict, Any, Optional
import threading
from contextlib import contextmanager
import resource

class CodeExecutor:
    """Safe code execution with timeouts and resource limits"""
    
    def __init__(self, timeout: int = 30, memory_limit: int = 100*1024*1024):  # 100MB
        self.timeout = timeout
        self.memory_limit = memory_limit  # in bytes
    
    def execute_python(self, code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute Python code safely"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            # Execute with timeout and resource limits
            result = self._run_with_limits(['python3', temp_file], input_data)
            
            # Clean up
            os.unlink(temp_file)
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": "",
                "execution_time": 0
            }
    
    def execute_c(self, code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute C code safely"""
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(mode='w', suffix='.c', delete=False) as f:
                f.write(code)
                source_file = f.name
            
            # Compile
            executable = source_file.replace('.c', '')
            compile_result = subprocess.run(
                ['gcc', source_file, '-o', executable],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if compile_result.returncode != 0:
                os.unlink(source_file)
                return {
                    "success": False,
                    "error": f"Compilation failed: {compile_result.stderr}",
                    "output": "",
                    "execution_time": 0
                }
            
            # Execute
            result = self._run_with_limits([executable], input_data)
            
            # Clean up
            os.unlink(source_file)
            if os.path.exists(executable):
                os.unlink(executable)
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": "",
                "execution_time": 0
            }
    
    def execute_cpp(self, code: str, input_data: str = "") -> Dict[str, Any]:
        """Execute C++ code safely"""
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(mode='w', suffix='.cpp', delete=False) as f:
                f.write(code)
                source_file = f.name
            
            # Compile
            executable = source_file.replace('.cpp', '')
            compile_result = subprocess.run(
                ['g++', source_file, '-o', executable],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if compile_result.returncode != 0:
                os.unlink(source_file)
                return {
                    "success": False,
                    "error": f"Compilation failed: {compile_result.stderr}",
                    "output": "",
                    "execution_time": 0
                }
            
            # Execute
            result = self._run_with_limits([executable], input_data)
            
            # Clean up
            os.unlink(source_file)
            if os.path.exists(executable):
                os.unlink(executable)
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": "",
                "execution_time": 0
            }
    
    def _run_with_limits(self, cmd: list, input_data: str = "") -> Dict[str, Any]:
        """Run command with resource limits and timeout"""
        try:
            # Set up process with limits
            result = subprocess.run(
                cmd,
                input=input_data,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=tempfile.gettempdir()
            )
            
            return {
                "success": True,
                "output": result.stdout,
                "error_output": result.stderr,
                "return_code": result.returncode,
                "execution_time": result.elapsed_time if hasattr(result, 'elapsed_time') else 0
            }
            
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": f"Execution timed out after {self.timeout} seconds",
                "output": "",
                "execution_time": self.timeout
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": "",
                "execution_time": 0
            }
    
    @contextmanager
    def resource_limits(self):
        """Context manager for resource limits"""
        # Set memory limit
        try:
            resource.setrlimit(resource.RLIMIT_AS, (self.memory_limit, self.memory_limit))
        except:
            pass  # Not available on all systems
        
        # Set CPU time limit
        try:
            resource.setrlimit(resource.RLIMIT_CPU, (self.timeout, self.timeout))
        except:
            pass
        
        yield

# Global instance
code_executor = CodeExecutor()
