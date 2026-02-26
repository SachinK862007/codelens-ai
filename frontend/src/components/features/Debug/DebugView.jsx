// frontend/src/components/features/Debug/DebugView.jsx
import React, { useState } from 'react';
import { FaBug, FaLightbulb, FaCode, FaChartLine, FaRedo } from 'react-icons/fa';
import CodeEditor from '../../core/CodeEditor';
import FlowChart from '../../core/FlowChart';
import ChatInterface from '../../core/ChatInterface';

const DebugView = () => {
  const [code, setCode] = useState(`# Example code with intentional error
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)  # Potential division by zero
    return average

# This will cause an error when numbers is empty
result = calculate_average([])
print(f"Average: {result}")`);

  const [errorMessage, setErrorMessage] = useState('');
  const [debugResult, setDebugResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patterns, setPatterns] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [suggestedFix, setSuggestedFix] = useState('');

  const handleAnalyzeError = async () => {
    setIsAnalyzing(true);
    setDebugResult(null);
    setPatterns(null);
    setSuggestedFix('');
    
    try {
      // Simulate API call to backend
      // In real implementation: await api.post('/debug/analyze', { code, error_message: errorMessage })
      
      // Mock response for demo
      setTimeout(() => {
        const mockDebugResult = {
          error_analysis: {
            type: "ZeroDivisionError",
            message: "division by zero",
            ai_explanation: "The error occurs because you're dividing by len(numbers), which is 0 when the list is empty. This causes a division by zero error."
          },
          problematic_line: "average = total / len(numbers)",
          corrected_code: `def calculate_average(numbers):
    if len(numbers) == 0:
        return 0  # or return None, or raise an exception
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)
    return average`,
          changes_explanation: "Added a check for empty list to prevent division by zero",
          mermaid_flowchart: `graph TD
    A[Start] --> B[Check if numbers is empty]
    B -->|Yes| C[Return 0 or handle empty case]
    B -->|No| D[Calculate total]
    D --> E[Divide by length]
    E --> F[Return average]
    C --> G[End]
    F --> G`
        };
        
        const mockPatterns = {
          patterns_identified: [
            {
              type: "division_by_zero",
              description: "Division by zero when divisor could be zero",
              line_numbers: [6],
              suggestion: "Always check if denominator is zero before division"
            },
            {
              type: "empty_collection",
              description: "Operations on potentially empty collections",
              line_numbers: [6],
              suggestion: "Validate collection before operations"
            }
          ]
        };
        
        setDebugResult(mockDebugResult);
        setPatterns(mockPatterns);
        setSuggestedFix(mockDebugResult.corrected_code);
        setIsAnalyzing(false);
      }, 2000);
      
    } catch (err) {
      console.error('Debug analysis error:', err);
      setIsAnalyzing(false);
    }
  };

  const handleIdentifyPatterns = async () => {
    try {
      // Simulate API call to backend
      // In real implementation: await api.post('/debug/identify-patterns', code)
      
      // Mock response for demo
      const mockPatterns = {
        patterns_identified: [
          {
            type: "boundary_condition",
            description: "Not handling edge cases like empty collections",
            line_numbers: [6],
            suggestion: "Add boundary condition checks"
          },
          {
            type: "assumption_error",
            description: "Assuming collections are never empty",
            line_numbers: [6],
            suggestion: "Validate assumptions with assertions or checks"
          }
        ],
        best_practices: [
          "Always validate inputs before processing",
          "Handle edge cases explicitly",
          "Use defensive programming techniques"
        ]
      };
      
      setPatterns(mockPatterns);
    } catch (err) {
      console.error('Pattern identification error:', err);
    }
  };

  const handleSendMessage = (message) => {
    const newMessage = { sender: 'user', text: message };
    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        sender: 'assistant',
        text: `Looking at your code, the main issue is a division by zero error. When \`numbers\` is an empty list, \`len(numbers)\` returns 0, causing the division to fail. You should add a check to handle empty lists before performing the division.`
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <FaBug className="text-red-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Debug Assistant</h1>
            <p className="text-gray-600">Find, understand, and fix errors with AI-powered assistance</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">ZeroDivisionError</div>
            <div className="text-sm text-gray-600">Primary Error Type</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Common Patterns Found</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-lg font-bold text-purple-600">1</div>
            <div className="text-sm text-gray-600">Fix Suggestion</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Code Editor and Error Input */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-700">Code with Error</h3>
            </div>
            <CodeEditor
              code={code}
              setCode={setCode}
              language="python"
              height="300px"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-700">Error Information</h3>
            </div>
            <div className="p-4">
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Enter error message (optional - will auto-detect)..."
                className="w-full h-24 border rounded p-3 text-sm"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={handleAnalyzeError}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  <FaBug />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Error'}</span>
                </button>
                
                <button
                  onClick={handleIdentifyPatterns}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  <FaLightbulb />
                  <span>Identify Patterns</span>
                </button>
                
                <button
                  onClick={() => setErrorMessage('ZeroDivisionError: division by zero')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Use Sample Error
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Analysis Results */}
        <div className="space-y-6">
          {isAnalyzing && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg font-medium">Analyzing your code...</span>
              </div>
              <p className="text-center text-gray-600 mt-2">
                Identifying the root cause and generating fix suggestions
              </p>
            </div>
          )}
          
          {debugResult && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b bg-red-50">
                <h3 className="font-medium text-red-800 flex items-center">
                  <FaBug className="mr-2" />
                  Error Analysis
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h4 className="font-medium text-red-800">Problem Identified</h4>
                  <p className="text-red-700 mt-1">{debugResult.error_analysis.ai_explanation}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Problematic Line</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm">
                    {debugResult.problematic_line}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Suggested Fix</h4>
                  <pre className="bg-green-50 p-3 rounded text-sm">
                    {debugResult.corrected_code}
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    {debugResult.changes_explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {patterns && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b bg-purple-50">
                <h3 className="font-medium text-purple-800 flex items-center">
                  <FaLightbulb className="mr-2" />
                  Common Patterns & Best Practices
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Identified Patterns</h4>
                  <div className="space-y-3">
                    {patterns.patterns_identified.map((pattern, index) => (
                      <div key={index} className="border-l-4 border-purple-300 pl-3">
                        <div className="font-medium text-purple-700">{pattern.type}</div>
                        <div className="text-sm text-gray-600">{pattern.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Lines: {pattern.line_numbers.join(', ')}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">Suggestion:</span> {pattern.suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {patterns.best_practices.map((practice, index) => (
                      <li key={index} className="text-gray-700">{practice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={false}
              placeholder="Ask questions about the error or debugging process..."
            />
          </div>
        </div>
      </div>
      
      {/* Flowchart Section */}
      {debugResult && debugResult.mermaid_flowchart && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium text-gray-700 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" />
              Fixed Logic Flow
            </h3>
          </div>
          <div className="p-4">
            <FlowChart 
              chartDefinition={debugResult.mermaid_flowchart} 
              title="Error Resolution Flow"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugView;
