// frontend/src/pages/TryMePage.jsx
import React, { useState } from 'react';
import { FaMagic, FaCode, FaPlay } from 'react-icons/fa';
import CodeEditor from '../components/core/CodeEditor';
import ExecutionPanel from '../components/features/TryMe/ExecutionPanel';
import ChatInterface from '../components/core/ChatInterface';
import api from '../services/api';

const TryMePage = () => {
  const [code, setCode] = useState('# Welcome to CodeLens AI!\n# Try running this code to see execution visualization\n\nx = 5\ny = 10\nprint(f"The sum is: {x + y}")\n\nfor i in range(3):\n    print(f"Iteration {i}: {i * 2}")');
  const [trace, setTrace] = useState([]);
  const [flowchart, setFlowchart] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const handleRunCode = async (codeToRun) => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    
    try {
      const response = await api.post('/try-me/execute', {
        code: codeToRun,
        include_explanation: true,
        include_flowchart: true
      });
      
      const data = response.data;
      
      if (data.success) {
        setTrace(data.trace || []);
        setFlowchart(data.flowchart || '');
        setExplanation(data.explanation);
        setOutput(data.output || '');
      } else {
        setError(data.error || 'Execution failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Network error');
    } finally {
      setIsRunning(false);
    }
  };

  const handlePredictOutput = async () => {
    try {
      const response = await api.post('/try-me/predict-output', code);
      // Handle prediction response
    } catch (err) {
      console.error('Prediction error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaMagic className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Try Me</h1>
            <p className="text-gray-600">Visualize code execution step-by-step</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CodeEditor
              code={code}
              setCode={setCode}
              language="python"
              onRun={handleRunCode}
              isRunning={isRunning}
              height="300px"
            />
            
            {(output || error) && (
              <div className={`border rounded-lg p-4 ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <h3 className="font-medium mb-2">{error ? 'Error Output' : 'Program Output'}</h3>
                <pre className={`text-sm whitespace-pre-wrap ${error ? 'text-red-700' : 'text-green-700'}`}>
                  {error ? JSON.stringify(error, null, 2) : output}
                </pre>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <ExecutionPanel
              trace={trace}
              flowchart={flowchart}
              onStepChange={(stepIndex) => console.log('Step changed:', stepIndex)}
            />
          </div>
        </div>
      </div>
      
      {explanation && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaCode className="mr-2 text-blue-600" />
            AI Explanation
          </h2>
          <div className="space-y-4">
            {Array.isArray(explanation) ? (
              explanation.map((line, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="font-mono bg-gray-100 p-2 rounded mb-2">
                    Line {line.line_number}: {line.code}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Technical:</span> {line.technical_explanation}
                    </div>
                    <div>
                      <span className="font-medium">Purpose:</span> {line.purpose}
                    </div>
                    {line.analogy && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Analogy:</span> {line.analogy}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded">
                {JSON.stringify(explanation, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TryMePage;
