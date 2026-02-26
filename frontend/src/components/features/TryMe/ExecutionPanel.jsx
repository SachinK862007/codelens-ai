// frontend/src/components/features/TryMe/ExecutionPanel.jsx
import React, { useState } from 'react';
import { FaPlay, FaStepForward, FaStepBackward, FaPause } from 'react-icons/fa';
import Mermaid from 'mermaid';

const ExecutionPanel = ({ trace, flowchart, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Mermaid
  React.useEffect(() => {
    if (flowchart) {
      Mermaid.initialize({ startOnLoad: true });
    }
  }, [flowchart]);

  const handleStepForward = () => {
    if (currentStep < (trace?.length - 1 || 0)) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange && onStepChange(newStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange && onStepChange(newStep);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      if (currentStep < (trace?.length - 1 || 0)) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        onStepChange && onStepChange(newStep);
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  const currentTrace = trace?.[currentStep] || {};

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700">Execution Visualization</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Flowchart */}
        {flowchart && (
          <div className="border rounded p-3 bg-gray-50">
            <h4 className="font-medium mb-2">Control Flow</h4>
            <div className="mermaid overflow-x-auto">
              {flowchart}
            </div>
          </div>
        )}
        
        {/* Step Controls */}
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <FaStepBackward />
            </button>
            
            {isPlaying ? (
              <button
                onClick={() => setIsPlaying(false)}
                className="p-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <FaPause />
              </button>
            ) : (
              <button
                onClick={handlePlay}
                disabled={!trace || trace.length === 0}
                className="p-2 rounded bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
              >
                <FaPlay />
              </button>
            )}
            
            <button
              onClick={handleStepForward}
              disabled={currentStep >= (trace?.length - 1 || 0)}
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <FaStepForward />
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {trace?.length || 0}
          </div>
        </div>
        
        {/* Current Step Details */}
        {currentTrace && Object.keys(currentTrace).length > 0 && (
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">Current Execution State</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Event:</span> {currentTrace.event}
              </div>
              <div>
                <span className="font-medium">Line:</span> {currentTrace.line_number}
              </div>
              {currentTrace.function && (
                <div>
                  <span className="font-medium">Function:</span> {currentTrace.function}
                </div>
              )}
              
              {currentTrace.locals && Object.keys(currentTrace.locals).length > 0 && (
                <div>
                  <span className="font-medium">Variables:</span>
                  <div className="ml-4 mt-1 grid grid-cols-2 gap-1">
                    {Object.entries(currentTrace.locals).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-mono text-blue-600">{key}:</span>
                        <span className="ml-2 font-mono text-purple-600 truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Trace List */}
        {trace && trace.length > 0 && (
          <div className="border rounded">
            <h4 className="font-medium p-2 border-b">Execution Trace</h4>
            <div className="max-h-40 overflow-y-auto">
              {trace.map((step, index) => (
                <div 
                  key={index}
                  className={`p-2 border-b text-xs cursor-pointer hover:bg-gray-50 ${
                    index === currentStep ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => {
                    setCurrentStep(index);
                    onStepChange && onStepChange(index);
                  }}
                >
                  <div className="flex justify-between">
                    <span>Step {index + 1}</span>
                    <span className="bg-gray-200 px-1 rounded">
                      {step.event} @ line {step.line_number}
                    </span>
                  </div>
                  {index === currentStep && step.locals && (
                    <div className="text-gray-600 mt-1">
                      Variables: {Object.keys(step.locals).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionPanel;
