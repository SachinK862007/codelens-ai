// frontend/src/components/features/PracticeTask/LevelSelector.jsx
import React from 'react';
import { FaLock, FaUnlock, FaCheck } from 'react-icons/fa';

const LevelSelector = ({ 
  currentLevel, 
  onLevelChange, 
  selectedLanguage, 
  onLanguageChange 
}) => {
  // Mock levels data
  const levels = [
    { id: 1, title: "Basics", description: "Variables, printing, basic syntax", completed: true },
    { id: 2, title: "Control Flow", description: "If/else, loops, conditions", completed: true },
    { id: 3, title: "Functions", description: "Creating and calling functions", completed: false },
    { id: 4, title: "Data Structures", description: "Lists, dictionaries, tuples", completed: false },
    { id: 5, title: "File I/O", description: "Reading and writing files", completed: false }
  ];

  const languages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '🌐' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'c', name: 'C', icon: '🇨' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Language Selector */}
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700 mb-2">Programming Language</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                selectedLanguage === lang.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Level Progress */}
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700 mb-2">Learning Levels</h3>
        <div className="space-y-2">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`p-3 rounded cursor-pointer ${
                currentLevel === level.id
                  ? 'bg-blue-100 border border-blue-300'
                  : level.completed
                  ? 'bg-green-50 hover:bg-green-100'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onLevelChange(level.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {level.completed ? (
                    <FaCheck className="text-green-500" />
                  ) : currentLevel === level.id ? (
                    <FaUnlock className="text-blue-500" />
                  ) : (
                    <FaLock className="text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium text-sm">Level {level.id}: {level.title}</div>
                    <div className="text-xs text-gray-600">{level.description}</div>
                  </div>
                </div>
                {currentLevel === level.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
