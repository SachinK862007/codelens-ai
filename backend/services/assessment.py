# backend/services/assessment.py
"""
Automated grading service
Evaluates code submissions against test cases and criteria
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import re

class TestCase(BaseModel):
    input: str
    expected_output: str
    description: str
    points: int = 1

class GradingCriteria(BaseModel):
    correctness_weight: float = 0.6
    style_weight: float = 0.2
    efficiency_weight: float = 0.2
    required_elements: List[str] = []
    forbidden_elements: List[str] = []

class AssessmentResult(BaseModel):
    passed: bool
    score: float
    max_score: float
    test_results: List[Dict[str, Any]]
    feedback: List[str]
    style_feedback: List[str]
    efficiency_feedback: List[str]
    missing_elements: List[str]
    forbidden_elements_found: List[str]

class AutomatedAssessor:
    """Automated code assessment and grading"""
    
    def __init__(self):
        self.style_checkers = {
            "indentation": self._check_indentation,
            "naming": self._check_naming_conventions,
            "comments": self._check_comments
        }
    
    def assess_submission(self, code: str, test_cases: List[TestCase], 
                         criteria: Optional[GradingCriteria] = None) -> AssessmentResult:
        """Assess code submission against test cases and criteria"""
        if criteria is None:
            criteria = GradingCriteria()
        
        # Run functional tests
        test_results = self._run_functional_tests(code, test_cases)
        
        # Check style
        style_feedback = self._check_style(code)
        
        # Check efficiency
        efficiency_feedback = self._check_efficiency(code)
        
        # Check required/forbidden elements
        missing_elements, forbidden_elements = self._check_elements(code, criteria)
        
        # Calculate score
        correctness_score = self._calculate_correctness_score(test_results, criteria)
        style_score = self._calculate_style_score(style_feedback, criteria)
        efficiency_score = self._calculate_efficiency_score(efficiency_feedback, criteria)
        
        total_score = (
            correctness_score * criteria.correctness_weight +
            style_score * criteria.style_weight +
            efficiency_score * criteria.efficiency_weight
        )
        
        max_score = sum(tc.points for tc in test_cases) if test_cases else 100
        
        passed = total_score >= (max_score * 0.7)  # 70% to pass
        
        return AssessmentResult(
            passed=passed,
            score=total_score,
            max_score=max_score,
            test_results=test_results,
            feedback=self._generate_feedback(test_results),
            style_feedback=style_feedback,
            efficiency_feedback=efficiency_feedback,
            missing_elements=missing_elements,
            forbidden_elements_found=forbidden_elements
        )
    
    def _run_functional_tests(self, code: str, test_cases: List[TestCase]) -> List[Dict[str, Any]]:
        """Run functional tests on code"""
        results = []
        
        for i, test_case in enumerate(test_cases):
            # In a real implementation, you would execute the code with the test input
            # For this demo, we'll simulate test results
            
            # Simple simulation - check if expected output is in code
            passed = test_case.expected_output.strip() in code or "print" in code.lower()
            
            results.append({
                "test_id": i,
                "description": test_case.description,
                "input": test_case.input,
                "expected": test_case.expected_output,
                "actual": "Simulated output",  # In real implementation, actual execution result
                "passed": passed,
                "points": test_case.points if passed else 0
            })
        
        return results
    
    def _check_style(self, code: str) -> List[str]:
        """Check code style and provide feedback"""
        feedback = []
        
        for checker_name, checker_func in self.style_checkers.items():
            result = checker_func(code)
            if result:
                feedback.append(result)
        
        return feedback
    
    def _check_indentation(self, code: str) -> Optional[str]:
        """Check indentation consistency"""
        lines = code.split('\n')
        indent_pattern = None
        issues = []
        
        for i, line in enumerate(lines):
            if line.strip():  # Non-empty line
                leading_spaces = len(line) - len(line.lstrip())
                if indent_pattern is None:
                    indent_pattern = leading_spaces
                elif leading_spaces != indent_pattern and leading_spaces > 0:
                    issues.append(f"Line {i+1}: Inconsistent indentation")
        
        return "Inconsistent indentation detected" if issues else None
    
    def _check_naming_conventions(self, code: str) -> Optional[str]:
        """Check variable/function naming conventions"""
        # Simple check for snake_case
        if re.search(r'[A-Z]{2,}', code):  # Multiple consecutive capitals
            return "Consider using snake_case for variable names"
        return None
    
    def _check_comments(self, code: str) -> Optional[str]:
        """Check for adequate comments"""
        lines = code.split('\n')
        code_lines = [line for line in lines if line.strip() and not line.strip().startswith('#')]
        comment_lines = [line for line in lines if line.strip().startswith('#')]
        
        if len(code_lines) > 5 and len(comment_lines) < len(code_lines) * 0.1:
            return "Consider adding more comments to explain complex logic"
        return None
    
    def _check_efficiency(self, code: str) -> List[str]:
        """Check for efficiency issues"""
        feedback = []
        
        # Check for obvious inefficiencies
        if "range(len(" in code:
            feedback.append("Consider using enumerate() instead of range(len())")
        
        if ".sort()" in code and "sorted(" in code:
            feedback.append("Avoid sorting the same data multiple times")
        
        return feedback
    
    def _check_elements(self, code: str, criteria: GradingCriteria) -> tuple:
        """Check for required and forbidden elements"""
        missing = []
        forbidden = []
        
        # Check required elements
        for element in criteria.required_elements:
            if element not in code:
                missing.append(element)
        
        # Check forbidden elements
        for element in criteria.forbidden_elements:
            if element in code:
                forbidden.append(element)
        
        return missing, forbidden
    
    def _calculate_correctness_score(self, test_results: List[Dict[str, Any]], 
                                   criteria: GradingCriteria) -> float:
        """Calculate correctness score"""
        total_points = sum(result["points"] for result in test_results)
        return total_points
    
    def _calculate_style_score(self, style_feedback: List[str], 
                              criteria: GradingCriteria) -> float:
        """Calculate style score (inverse of issues)"""
        max_style_points = 20  # Assuming 20 points for style
        issue_deduction = len(style_feedback) * 2  # 2 points per issue
        return max(0, max_style_points - issue_deduction)
    
    def _calculate_efficiency_score(self, efficiency_feedback: List[str], 
                                   criteria: GradingCriteria) -> float:
        """Calculate efficiency score"""
        max_efficiency_points = 20
        issue_deduction = len(efficiency_feedback) * 3  # 3 points per efficiency issue
        return max(0, max_efficiency_points - issue_deduction)
    
    def _generate_feedback(self, test_results: List[Dict[str, Any]]) -> List[str]:
        """Generate feedback based on test results"""
        feedback = []
        
        failed_tests = [t for t in test_results if not t["passed"]]
        if failed_tests:
            feedback.append(f"{len(failed_tests)} out of {len(test_results)} tests failed")
        
        passed_tests = [t for t in test_results if t["passed"]]
        if passed_tests:
            feedback.append(f"{len(passed_tests)} tests passed successfully")
        
        return feedback

# Global instance
assessor = AutomatedAssessor()
