// frontend/src/components/core/VisualDebugger.jsx
import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';

const VisualDebugger = ({ trace, onStepChange, isPlaying, onPlayPause }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState(null);

  useEffect(() => {
    if (isAutoPlaying && trace && trace.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= trace.length) {
            setIsAutoPlaying(false);
            clearInterval(playInterval);
            return prev;
          }
          onStepChange && onStepChange(nextStep);
          return nextStep;
        });
      }, 1000);

      setPlayInterval(interval);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, trace, onStepChange, playInterval]);

  const handleStepForward = () => {
    if (trace && currentStep < trace.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange && onStepChange(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange && onStepChange(prevStep);
    }
  };

  const handlePlayPause = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      clearInterval(playInterval);
    } else {
      setIsAutoPlaying(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAutoPlaying(false);
    clearInterval(playInterval);
    onStepChange && onStepChange(0);
  };

  const currentTrace = trace?.[currentStep] || {};

  if (!trace || trace.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium mb-2">No Execution Data</h3>
        <p>Run code to see step-by-step execution visualization</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Execution Debugger</h3>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {trace.length}
        </div>
      </div>
      
      {/* Controls */}
      <div className="p-3 border-b bg-gray-50 flex justify-center space-x-2">
        <button
          onClick={handleStepBackward}
          disabled={currentStep === 0}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Step"
        >
          <FaStepBackward />
        </button>
        
        <button
          onClick={handlePlayPause}
          className={`p-2 rounded text-white ${
            isAutoPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          title={isAutoPlaying ? "Pause" : "Play"}
        >
          {isAutoPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <button
          onClick={handleStepForward}
          disabled={currentStep >= trace.length - 1}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Step"
        >
          <FaStepForward />
        </button>
        
        <button
          onClick={handleReset}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300"
          title="Reset"
        >
          <FaRedo />
        </button>
      </div>
      
      {/* Current Step Details */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Event Info */}
          <div className="border rounded p-3 bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Execution Event</h4>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Event:</span> {currentTrace.event || 'N/A'}</div>
              <div><span className="font-medium">Line:</span> {currentTrace.line_number || 'N/A'}</div>
              {currentTrace.function && (
                <div><span className="font-medium">Function:</span> {currentTrace.function}</div>
              )}
              {currentTrace.filename && (
                <div><span className="font-medium">File:</span> {currentTrace.filename}</div>
              )}
            </div>
          </div>
          
          {/* Variables State */}
          {currentTrace.locals && Object.keys(currentTrace.locals).length > 0 && (
            <div className="border rounded p-3 bg-green-50">
              <h4 className="font-medium text-green-800 mb-2">Variables</h4>
              <div className="max-h-32 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left">Variable</th>
                      <th className="text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(currentTrace.locals).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="font-mono text-blue-600">{key}</td>
                        <td className="font-mono text-purple-600 truncate">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Trace List */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Execution Trace</h4>
          <div className="max-h-40 overflow-y-auto border rounded">
            {trace.map((step, index) => (
              <div 
                key={index}
                className={`p-2 border-b text-xs cursor-pointer hover:bg-gray-50 ${
                  index === currentStep 
                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                    : 'last:border-0'
                }`}
                onClick={() => {
                  setCurrentStep(index);
                  onStepChange && onStepChange(index);
                }}
              >
                <div className="flex justify-between">
                  <span>Step {index + 1}</span>
                  <span className="bg-gray-200 px-1 rounded">
                    {step.event} @ line {step.line_number || 'N/A'}
                  </span>
                </div>
                {index === currentStep && step.locals && (
                  <div className="text-gray-600 mt-1 text-xs">
                    Variables: {Object.keys(step.locals).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDebugger;
