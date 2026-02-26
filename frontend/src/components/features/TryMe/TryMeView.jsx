// frontend/src/components/features/TryMe/TryMeView.jsx
import React, { useState } from 'react';
import { FaPlay, FaCode, FaChartLine, FaMagic } from 'react-icons/fa';
import CodeEditor from '../../core/CodeEditor';
import VisualDebugger from '../../core/VisualDebugger';
import FlowChart from '../../core/FlowChart';
import ChatInterface from '../../core/ChatInterface';
import ProgressBar from '../../core/ProgressBar';

const TryMeView = () => {
  const [code, setCode] = useState(`# Welcome to CodeLens AI Try Me!
# Run this code to see execution visualization

def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Calculate Fibonacci of 5
result = fibonacci(5)
print(f"Fibonacci of 5 is {result}")

# Simple loop example
for i in range(3):
    print(f"Iteration {i}: {i * 2}")`);

  const [trace, setTrace] = useState([]);
  const [flowchart, setFlowchart] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    setTrace([]);
    setFlowchart('');
    setExplanation('');
    setExecutionTime(0);
    
    try {
      // Simulate API call to backend
      // In real implementation: await api.post('/try-me/execute', { code })
      
      // Mock response for demo
      setTimeout(() => {
        const mockTrace = [
          { event: 'call', line_number: 3, function: 'fibonacci', locals: { n: 5 } },
          { event: 'line', line_number: 4, function: 'fibonacci', locals: { n: 5 } },
          { event: 'line', line_number: 6, function: 'fibonacci', locals: { n: 5 } },
          { event: 'call', line_number: 7, function: 'fibonacci', locals: { n: 4 } },
          { event: 'line', line_number: 8, function: 'fibonacci', locals: { n: 4, result: 3 } },
          { event: 'return', line_number: 8, function: 'fibonacci', locals: { result: 5 } }
        ];
        
        const mockFlowchart = `graph TD
    A[Start] --> B[Define fibonacci function]
    B --> C[Call fibonacci(5)]
    C --> D[Check n <= 1]
    D -->|No| E[Recursive calls]
    E --> F[fibonacci(4) + fibonacci(3)]
    F --> G[Return result]
    G --> H[Print result]
    H --> I[End]`;
        
        setTrace(mockTrace);
        setFlowchart(mockFlowchart);
        setOutput("Fibonacci of 5 is 5\nIteration 0: 0\nIteration 1: 2\nIteration 2: 4");
        setExecutionTime(0.125);
        setIsRunning(false);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to execute code');
      setIsRunning(false);
    }
  };

  const handleStepChange = (stepIndex) => {
    console.log('Step changed to:', stepIndex);
    // Handle step change if needed
  };

  const handleSendMessage = (message) => {
    const newMessage = { sender: 'user', text: message };
    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        sender: 'assistant',
        text: `I've analyzed your code. The fibonacci function uses recursion to calculate values. At line 7, it makes two recursive calls: fibonacci(4) and fibonacci(3). This creates a call tree that eventually returns the result 5.`,
        code: `# Fibonacci calculation visualization
# fibonacci(5) calls:
#   fibonacci(4) + fibonacci(3)
#   Which further breaks down to:
#   (fibonacci(3) + fibonacci(2)) + (fibonacci(2) + fibonacci(1))
#   And so on until base cases are reached`
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
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaMagic className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Try Me</h1>
            <p className="text-gray-600">Visualize code execution step-by-step with real-time variable tracking</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{trace.length}</div>
            <div className="text-sm text-gray-600">Execution Steps</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {executionTime > 0 ? `${executionTime.toFixed(3)}s` : '0s'}
            </div>
            <div className="text-sm text-gray-600">Execution Time</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(trace[0]?.locals || {}).length}
            </div>
            <div className="text-sm text-gray-600">Variables Tracked</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {flowchart ? '✓' : '○'}
            </div>
            <div className="text-sm text-gray-600">Flowchart Ready</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Code Editor and Output */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <CodeEditor
              code={code}
              setCode={setCode}
              language="python"
              onRun={handleRunCode}
              isRunning={isRunning}
              height="300px"
            />
          </div>
          
          {(output || error) && (
            <div className={`bg-white rounded-lg shadow p-4 ${error ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
              <h3 className="font-medium mb-2 flex items-center">
                {error ? '❌ Error Output' : '✅ Program Output'}
              </h3>
              <pre className={`whitespace-pre-wrap text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
                {error ? error : output}
              </pre>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            <VisualDebugger
              trace={trace}
              onStepChange={handleStepChange}
              isPlaying={isRunning}
              onPlayPause={() => setIsRunning(!isRunning)}
            />
          </div>
        </div>
        
        {/* Right Column - Flowchart and Chat */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <FlowChart 
              chartDefinition={flowchart} 
              title="Execution Flow"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={false}
              placeholder="Ask about the code execution..."
            />
          </div>
        </div>
      </div>
      
      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
        <div className="space-y-4">
          <ProgressBar 
            value={75} 
            maxValue={100} 
            label="Code Understanding" 
            color="blue" 
            animated 
          />
          <ProgressBar 
            value={60} 
            maxValue={100} 
            label="Debugging Skills" 
            color="green" 
            animated 
          />
          <ProgressBar 
            value={85} 
            maxValue={100} 
            label="Concept Mastery" 
            color="purple" 
            animated 
          />
        </div>
      </div>
    </div>
  );
};

export default TryMeView;
