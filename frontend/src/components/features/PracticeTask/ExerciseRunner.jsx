// frontend/src/components/features/PracticeTask/ExerciseRunner.jsx
import React from 'react';
import { FaPlay, FaLightbulb, FaQuestionCircle } from 'react-icons/fa';
import CodeEditor from '../../core/CodeEditor';

const ExerciseRunner = ({ 
  exercise, 
  code, 
  setCode, 
  onSubmit, 
  isSubmitting, 
  submissionResult 
}) => {
  if (!exercise) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-medium mb-2">No Exercise Selected</h3>
        <p>Choose an exercise from the sidebar to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Exercise Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{exercise.title}</h2>
            <p className="text-gray-600 mt-1">{exercise.description}</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {exercise.difficulty}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {exercise.points} pts
            </span>
          </div>
        </div>
      </div>
      
      {/* Exercise Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Instructions */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <FaQuestionCircle className="mr-2 text-blue-500" />
              Instructions
            </h3>
            <div className="prose text-sm">
              <p>Complete the code below according to the requirements:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fill in the missing parts</li>
                <li>Make sure your code runs without errors</li>
                <li>Test your solution before submitting</li>
              </ul>
            </div>
            
            {exercise.hints && exercise.hints.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <FaLightbulb className="mr-1 text-yellow-500" />
                  Hints
                </h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {exercise.hints.map((hint, index) => (
                    <li key={index} className="text-gray-600">{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Code Editor */}
          <div>
            <CodeEditor
              code={code}
              setCode={setCode}
              language={exercise.language}
              height="300px"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <FaPlay />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseRunner;
