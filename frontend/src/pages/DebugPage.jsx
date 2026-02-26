// frontend/src/pages/DebugPage.jsx
import React, { useState } from 'react';
import { FaBug, FaLightbulb, FaChartLine } from 'react-icons/fa';
import CodeEditor from '../components/core/CodeEditor';
import ChatInterface from '../components/core/ChatInterface';
import api from '../services/api';

const DebugPage = () => {
  const [code, setCode] = useState(`# Example with intentional error
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)  # Potential division by zero
    return average

# This will cause an error
result = calculate_average([])
print(f"Average: {result}")`);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [debugResult, setDebugResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patterns, setPatterns] = useState(null);

  const handleAnalyzeError = async () => {
    setIsAnalyzing(true);
    try {
      const response = await api.post('/debug/analyze', {
        code: code,
        error_message: errorMessage
      });
      
      setDebugResult(response.data);
    } catch (err) {
      console.error('Debug error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIdentifyPatterns = async () => {
    try {
      const response = await api.post('/debug/identify-patterns', code);
      setPatterns(response.data);
    } catch (err) {
      console.error('Pattern identification error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <FaBug className="text-red-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Debug Assistant</h1>
            <p className="text-gray-600">Find and fix errors with AI-powered assistance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Code with Error</h3>
              <CodeEditor
                code={code}
                setCode={setCode}
                language="python"
                height="250px"
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Error Information</h3>
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Enter error message (optional - will auto-detect)"
                className="w-full h-24 border rounded p-2 text-sm"
              />
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleAnalyzeError}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  <FaBug />
                  <span>Analyze Error</span>
                </button>
                
                <button
                  onClick={handleIdentifyPatterns}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  <FaLightbulb />
                  <span>Identify Patterns</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {isAnalyzing && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Analyzing code...</span>
                </div>
              </div>
            )}
            
            {debugResult && (
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-lg flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-500" />
                  Error Analysis
                </h3>
                
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h4 className="font-medium text-red-800">Problem Identified</h4>
                  <p className="text-red-700">{debugResult.error_analysis?.ai_explanation}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Corrected Code</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {debugResult.corrected_code}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Explanation of Changes</h4>
                  <p className="text-gray-700">{debugResult.explanation}</p>
                </div>
                
                {debugResult.flowchart && (
                  <div>
                    <h4 className="font-medium mb-2">Fixed Logic Flow</h4>
                    <div className="mermaid bg-white p-3 rounded border">
                      {debugResult.flowchart}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {patterns && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <FaChartLine className="mr-2 text-purple-600" />
                  Common Patterns Identified
                </h3>
                <div className="space-y-2">
                  {patterns.patterns_identified?.map((pattern, index) => (
                    <div key={index} className="border-b pb-2 last:border-0">
                      <div className="font-medium text-purple-700">{pattern.type}</div>
                      <div className="text-sm text-gray-600">{pattern.description}</div>
                      <div className="text-sm text-blue-600">Lines: {pattern.line_numbers?.join(', ')}</div>
                      <div className="text-sm mt-1">Suggestion: {pattern.suggestion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
