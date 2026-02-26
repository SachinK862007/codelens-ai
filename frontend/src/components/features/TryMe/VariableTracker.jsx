// frontend/src/components/features/TryMe/VariableTracker.jsx
import React from 'react';
import { FaDatabase, FaSync } from 'react-icons/fa';

const VariableTracker = ({ variables, onRefresh, isTracking = true }) => {
  if (!variables || Object.keys(variables).length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-500 bg-gray-50">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium mb-2">No Variables Tracked</h3>
        <p>Run code to see variable values during execution</p>
      </div>
    );
  }

  const variableTypes = {
    'number': '🔢',
    'string': '📝',
    'boolean': '✅',
    'array': '📋',
    'object': '📦',
    'function': '⚡',
    'undefined': '❓',
    'null': '⭕'
  };

  const getVariableType = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'function') return 'function';
    return typeof value;
  };

  const getTypeIcon = (type) => {
    return variableTypes[type] || '❓';
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700 flex items-center">
          <FaDatabase className="mr-2 text-blue-500" />
          Variable Tracker
        </h3>
        <button
          onClick={onRefresh}
          disabled={!isTracking}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          title="Refresh Variables"
        >
          <FaSync />
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(variables).map(([name, value]) => {
            const type = getVariableType(value);
            const icon = getTypeIcon(type);
            
            return (
              <div 
                key={name} 
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-sm font-medium text-blue-600 break-all">
                      {name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className="mr-1">{icon}</span>
                      <span>{type}</span>
                    </div>
                  </div>
                  <div className="text-lg">
                    {icon}
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="text-xs text-gray-600">Value:</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 break-all max-h-20 overflow-y-auto">
                    {String(value)}
                  </div>
                </div>
                
                {type === 'array' && Array.isArray(value) && (
                  <div className="mt-2 text-xs text-gray-500">
                    Length: {value.length}
                  </div>
                )}
                
                {type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value) && (
                  <div className="mt-2 text-xs text-gray-500">
                    Properties: {Object.keys(value).length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {Object.keys(variables).length > 12 && (
          <div className="mt-3 text-center text-sm text-gray-500">
            Showing {Object.keys(variables).length} variables
          </div>
        )}
      </div>
    </div>
  );
};

export default VariableTracker;
