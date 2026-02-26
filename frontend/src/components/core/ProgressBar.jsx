// frontend/src/components/core/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ 
  value, 
  maxValue = 100, 
  label = "", 
  showPercentage = true, 
  color = "blue",
  size = "md",
  animated = false 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  };
  
  const bgColorClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    red: "bg-red-100",
    yellow: "bg-yellow-100",
    purple: "bg-purple-100"
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`${sizeClasses[size]} ${bgColorClasses[color]} rounded-full overflow-hidden`}>
        <div 
          className={`${colorClasses[color]} ${animated ? 'transition-all duration-500 ease-out' : ''} h-full rounded-full`}
          style={{ width: `${percentage}%` }}
        >
          {animated && percentage > 0 && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          )}
        </div>
      </div>
      
      {!label && showPercentage && (
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">{value}/{maxValue}</span>
        </div>
      )}
    </div>
  );
};

export const CircularProgress = ({ 
  value, 
  maxValue = 100, 
  size = "md",
  color = "blue",
  showLabel = true 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const radius = size === "sm" ? 40 : size === "md" ? 60 : 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40"
  };
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} relative`}>
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color === "blue" ? "#3b82f6" : 
                   color === "green" ? "#10b981" : 
                   color === "red" ? "#ef4444" : 
                   color === "yellow" ? "#f59e0b" : "#8b5cf6"}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${textSizeClasses[size]} font-bold`}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-gray-700">
            {value}/{maxValue}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
