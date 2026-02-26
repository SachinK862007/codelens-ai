// frontend/src/components/features/PracticeTask/SubmissionPanel.jsx
import React from 'react';
import { FaCheck, FaTimes, FaTrophy, FaStar } from 'react-icons/fa';

const SubmissionPanel = ({ result, onNextExercise, exercise }) => {
  if (!result) return null;

  return (
    <div className={`border rounded-lg p-4 ${
      result.success 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {result.success ? (
            <FaCheck className="text-green-500 text-xl" />
          ) : (
            <FaTimes className="text-red-500 text-xl" />
          )}
          <h3 className="font-bold text-lg">
            {result.success ? '✅ Success!' : '❌ Needs Improvement'}
          </h3>
        </div>
        
        {result.points_earned > 0 && (
          <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
            <FaStar className="text-yellow-500" />
            <span className="font-bold text-yellow-700">+{result.points_earned}</span>
          </div>
        )}
      </div>
      
      <p className="mb-4">{result.feedback}</p>
      
      {result.success && (
        <div className="bg-white border rounded p-3">
          <div className="font-medium text-green-700 mb-2">🏆 Achievement Unlocked!</div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <FaTrophy className="text-yellow-600" />
            </div>
            <div>
              <div className="font-medium">Problem Solver</div>
              <div className="text-xs text-gray-600">Completed {exercise?.title || 'this exercise'}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Points earned: <span className="font-bold">{result.points_earned}</span>
        </div>
        
        {result.next_exercise && (
          <button
            onClick={onNextExercise}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next Exercise
          </button>
        )}
      </div>
    </div>
  );
};

export default SubmissionPanel;
