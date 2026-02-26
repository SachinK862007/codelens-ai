// frontend/src/components/features/Debug/SolutionPanel.jsx
import React, { useState } from 'react';
import { FaCheck, FaCode, FaCopy, FaDownload } from 'react-icons/fa';

const SolutionPanel = ({ solution, onApplyFix, onCopyCode }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('fix');

  const handleCopyCode = () => {
    if (solution?.fixed_code) {
      navigator.clipboard.writeText(solution.fixed_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyCode && onCopyCode(solution.fixed_code);
    }
  };

  const handleDownloadCode = () => {
    if (solution?.fixed_code) {
      const blob = new Blob([solution.fixed_code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fixed_code.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!solution) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
        <div className="text-4xl mb-4">💡</div>
        <h3 className="text-lg font-medium mb-2">No Solution Available</h3>
        <p>Analyze an error to generate a solution</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('fix')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'fix'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fixed Code
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'explanation'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Explanation
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'comparison'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Before/After
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'fix' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Solution Implemented
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  <FaCopy size={12} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <FaDownload size={12} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            
            <div>
              <div className="font-medium text-sm mb-1">Fixed Code:</div>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {solution.fixed_code || '// Fixed code will appear here'}
              </pre>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="font-medium text-green-800 mb-1">Changes Made:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {solution.changes?.map((change, index) => (
                  <li key={index} className="text-green-700">{change}</li>
                )) || [
                  'Added validation for empty collections',
                  'Implemented proper error handling',
                  'Improved code structure and readability'
                ].map((change, index) => (
                  <li key={index} className="text-green-700">{change}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onApplyFix && onApplyFix(solution.fixed_code)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Apply to Editor
              </button>
              <button
                onClick={() => onApplyFix && onApplyFix(solution.fixed_code, true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Solution
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'explanation' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Solution Explanation</h3>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-gray-700">
                  {solution.explanation || 'The solution addresses the root cause by implementing proper validation and error handling. The key changes include checking for edge cases before performing operations and providing meaningful feedback when errors occur.'}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Why This Fixes the Issue</h4>
              <div className="space-y-2">
                {solution.reasoning?.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                )) || [
                  'Prevents division by zero by checking collection length',
                  'Handles empty collections gracefully with default values',
                  'Improves code robustness and prevents crashes'
                ].map((reason, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Learning Points</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {solution.learning_points?.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  )) || [
                    'Always validate inputs before processing',
                    'Handle edge cases explicitly in your code',
                    'Use defensive programming techniques',
                    'Test your code with various input scenarios'
                  ].map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'comparison' && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Code Comparison</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-sm mb-1 text-red-600">Before (Problematic)</div>
                <pre className="bg-red-50 border border-red-200 p-3 rounded text-xs overflow-x-auto">
                  {solution.original_code || `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)  # Error here
    return average`}
                </pre>
              </div>
              
              <div>
                <div className="font-medium text-sm mb-1 text-green-600">After (Fixed)</div>
                <pre className="bg-green-50 border border-green-200 p-3 rounded text-xs overflow-x-auto">
                  {solution.fixed_code || `def calculate_average(numbers):
    if len(numbers) == 0:
        return 0
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)
    return average`}
                </pre>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="font-medium text-blue-800 mb-1">Key Differences:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {solution.differences?.map((diff, index) => (
                  <li key={index} className="text-blue-700">{diff}</li>
                )) || [
                  'Added validation check for empty collections',
                  'Implemented graceful handling of edge cases',
                  'Improved error prevention and code robustness'
                ].map((diff, index) => (
                  <li key={index} className="text-blue-700">{diff}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionPanel;
