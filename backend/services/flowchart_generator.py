# backend/services/flowchart_generator.py
"""
Flowchart generation service for CodeLens AI
Converts code structure and execution traces into visual flowcharts
"""

from typing import Dict, List, Any
import ast
import json

class FlowchartGenerator:
    """Generates flowcharts from code structure and execution data"""
    
    def __init__(self):
        self.node_counter = 0
    
    def generate_from_code(self, code: str, chart_type: str = "flow") -> str:
        """Generate flowchart from code structure"""
        try:
            tree = ast.parse(code)
            if chart_type == "flow":
                return self._generate_flowchart(tree)
            elif chart_type == "sequence":
                return self._generate_sequence_diagram(tree)
            else:
                return self._generate_basic_flowchart(tree)
        except Exception as e:
            return self._generate_error_chart(f"Error parsing code: {str(e)}")
    
    def generate_from_trace(self, trace_data: List[Dict[str, Any]]) -> str:
        """Generate flowchart from execution trace"""
        try:
            return self._generate_trace_flowchart(trace_data)
        except Exception as e:
            return self._generate_error_chart(f"Error generating trace chart: {str(e)}")
    
    def _generate_flowchart(self, tree: ast.AST) -> str:
        """Generate basic flowchart from AST"""
        lines = ["graph TD"]
        lines.append("    A[Start] --> B[Initialize]")
        
        # Process main code logic
        main_logic = self._analyze_main_logic(tree)
        current_node = "B"
        for i, logic_step in enumerate(main_logic):
            node_id = f"M{i}"
            lines.append(f"    {current_node} --> {node_id}[{logic_step}]")
            current_node = node_id
        
        lines.append(f"    {current_node} --> Z[End]")
        return "\n".join(lines)
    
    def _generate_sequence_diagram(self, tree: ast.AST) -> str:
        """Generate sequence diagram from AST showing function calls"""
        lines = ["sequenceDiagram"]
        lines.append("    participant Main")
        
        # Find all function definitions
        functions = []
        calls = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.append(node.name)
                lines.append(f"    participant {node.name}")
            elif isinstance(node, ast.Call):
                if hasattr(node.func, 'id'):
                    calls.append(node.func.id)
        
        # Add function call arrows
        for call_name in calls:
            if call_name in functions:
                lines.append(f"    Main->>+{call_name}: call()")
                lines.append(f"    {call_name}-->>-Main: return")
            else:
                lines.append(f"    Main->>Main: {call_name}()")
        
        if not calls:
            lines.append("    Main->>Main: Execute code")
        
        return "\n".join(lines)
    
    def _generate_basic_flowchart(self, tree: ast.AST) -> str:
        """Generate a simple basic flowchart from AST"""
        lines = ["graph TD"]
        lines.append("    START([Start])")
        
        steps = self._analyze_main_logic(tree)
        prev_node = "START"
        
        for i, step in enumerate(steps):
            node_id = f"S{i}"
            lines.append(f"    {prev_node} --> {node_id}[{step}]")
            prev_node = node_id
        
        lines.append(f"    {prev_node} --> END([End])")
        return "\n".join(lines)
    
    def _analyze_main_logic(self, tree: ast.AST) -> List[str]:
        """Analyze main code logic"""
        steps = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                steps.append("Variable Assignment")
            elif isinstance(node, ast.Call):
                if hasattr(node.func, 'id'):
                    steps.append(f"Call {node.func.id}")
            elif isinstance(node, ast.If):
                steps.append("Conditional Branch")
            elif isinstance(node, (ast.For, ast.While)):
                steps.append("Loop")
        return steps if steps else ["Main Execution"]
    
    def _generate_trace_flowchart(self, trace_data: List[Dict[str, Any]]) -> str:
        """Generate flowchart from execution trace"""
        if not trace_data:
            return "graph TD\n    A[No Trace Data] --> B[End]"
        
        lines = ["graph TD"]
        lines.append("    A[Start Execution] --> B0[Line 1]")
        
        for i, trace in enumerate(trace_data):
            node_id = f"B{i}"
            next_node_id = f"B{i+1}" if i < len(trace_data) - 1 else "C"
            event = trace.get("event", "unknown")
            line_num = trace.get("line_number", "N/A")
            label = f"Line {line_num}: {event}"
            lines.append(f"    {node_id}[{label}]")
            if i < len(trace_data) - 1:
                lines.append(f"    {node_id} --> {next_node_id}")
        
        lines.append("    C[End Execution]")
        return "\n".join(lines)
    
    def _generate_error_chart(self, error_message: str) -> str:
        """Generate error flowchart"""
        return f'''graph TD
    A[Error] --> B["{error_message}"]
    B --> C[Try Again]'''

# Global instance
flowchart_generator = FlowchartGenerator()
