// frontend/src/components/features/Debug/ErrorAnalyzer.jsx
import React, { useState } from 'react';
import { FaBug, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const ErrorAnalyzer = ({ error, onAnalyze, isAnalyzing = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    explanation: true,
    solution: true,
    prevention: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!error) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium mb-2">No Error Detected</h3>
        <p>Run code with errors to see analysis</p>
      </div>
    );
  }

  const errorType = error.type || 'UnknownError';
  const errorMessage = error.message || 'No error message provided';

  // Error type categorization
  const getErrorCategory = (type) => {
    const categories = {
      'SyntaxError': { color: 'red', icon: '❗' },
      'NameError': { color: 'orange', icon: '📛' },
      'TypeError': { color: 'yellow', icon: '🔄' },
      'ValueError': { color: 'purple', icon: '🔢' },
      'IndexError': { color: 'pink', icon: '📋' },
      'KeyError': { color: 'indigo', icon: '🔑' },
      'AttributeError': { color: 'teal', icon: '🔗' },
      'ZeroDivisionError': { color: 'red', icon: '➗' },
      'ImportError': { color: 'blue', icon: '📦' },
      'default': { color: 'gray', icon: '❓' }
    };
    
    return categories[type] || categories.default;
  };

  const category = getErrorCategory(errorType);

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className={`p-4 border-b bg-${category.color}-50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{errorType}</h3>
              <p className="text-sm text-gray-600">{errorMessage}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}>
            {category.color.charAt(0).toUpperCase() + category.color.slice(1)}
          </div>
        </div>
      </div>
      
      {/* Analysis Sections */}
      <div className="divide-y">
        {/* Explanation Section */}
        <div>
          <button
            onClick={() => toggleSection('explanation')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <FaInfoCircle className="text-blue-500" />
              <span className="font-medium">Error Explanation</span>
            </div>
            <span className="text-gray-400">
              {expandedSections.explanation ? '▲' : '▼'}
            </span>
          </button>
          
          {expandedSections.explanation && (
            <div className="px-4 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-gray-700">
                  {error.explanation || 'This error occurs when... (AI-generated explanation would appear here)'}
                </p>
                
                {error.example && (
                  <div className="mt-3">
                    <div className="font-medium text-sm mb-1">Example Scenario:</div>
                    <pre className="bg-white p-2 rounded text-xs">
                      {error.example}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Solution Section */}
        <div>
          <button
            onClick={() => toggleSection('solution')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <FaBug className="text-green-500" />
              <span className="font-medium">Solution & Fix</span>
            </div>
            <span className="text-gray-400">
              {expandedSections.solution ? '▲' : '▼'}
            </span>
          </button>
          
          {expandedSections.solution && (
            <div className="px-4 pb-4 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="font-medium text-green-800 mb-2">Recommended Fix:</div>
                <p className="text-gray-700">
                  {error.fix || 'Add proper validation checks before performing operations.'}
                </p>
              </div>
              
              {error.code_fix && (
                <div>
                  <div className="font-medium text-sm mb-1">Corrected Code:</div>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                    {error.code_fix}
                  </pre>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onAnalyze && onAnalyze('apply_fix')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Apply Fix
                </button>
                <button
                  onClick={() => onAnalyze && onAnalyze('explain_fix')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Explain Fix
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Prevention Section */}
        <div>
          <button
            onClick={() => toggleSection('prevention')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-yellow-500" />
              <span className="font-medium">Prevention Tips</span>
            </div>
            <span className="text-gray-400">
              {expandedSections.prevention ? '▲' : '▼'}
            </span>
          </button>
          
          {expandedSections.prevention && (
            <div className="px-4 pb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2">
                <div className="font-medium text-yellow-800">Best Practices:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {error.prevention_tips?.map((tip, index) => (
                    <li key={index} className="text-gray-700">{tip}</li>
                  )) || [
                    'Always validate inputs before processing',
                    'Handle edge cases explicitly',
                    'Use try-except blocks for error-prone operations',
                    'Add logging for debugging purposes'
                  ].map((tip, index) => (
                    <li key={index} className="text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
        <button
          onClick={() => onAnalyze && onAnalyze('retry')}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
        </button>
        <button
          onClick={() => onAnalyze && onAnalyze('similar_errors')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Similar Errors
        </button>
      </div>
    </div>
  );
};

export default ErrorAnalyzer;
