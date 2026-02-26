// frontend/src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ 
  type = 'spinner', 
  size = 'md', 
  message = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`animate-spin rounded-full border-2 border-solid border-blue-500 border-t-transparent ${sizeClasses[size]}`}></div>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex space-x-1">
          <div className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce`}></div>
          <div className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
        </div>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    );
  }

  return null;
};

export default Loader;
