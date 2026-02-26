// frontend/src/pages/PracticePage.jsx
import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaMedal, FaTrophy, FaStar } from 'react-icons/fa';
import CodeEditor from '../components/core/CodeEditor';
import api from '../services/api';

const PracticePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [codeSubmission, setCodeSubmission] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    loadExercises();
    loadProgress();
  }, [selectedLanguage, currentLevel]);

  const loadExercises = async () => {
    try {
      const response = await api.post('/practice/get-exercises', {
        language: selectedLanguage,
        difficulty: 'beginner',
        current_level: currentLevel
      });
      setExercises(response.data.exercises);
      if (response.data.exercises.length > 0) {
        setCurrentExercise(response.data.exercises[0]);
        setCodeSubmission(response.data.exercises[0].solution_template || '');
      }
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  };

  const loadProgress = async () => {
    try {
      // Mock progress for demo
      setUserProgress({
        completed_exercises: 3,
        total_exercises: 15,
        current_streak: 5,
        total_points: 125,
        achievements: ['First Steps', 'Debug Master', 'Consistency King']
      });
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const handleSubmit = async () => {
    if (!currentExercise) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/practice/submit-exercise', {
        exercise_id: currentExercise.id,
        code_submission: codeSubmission
      });
      setSubmissionResult(response.data);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextExercise = () => {
    if (submissionResult?.next_exercise) {
      const nextEx = exercises.find(ex => ex.id === submissionResult.next_exercise);
      if (nextEx) {
        setCurrentExercise(nextEx);
        setCodeSubmission(nextEx.solution_template || '');
        setSubmissionResult(null);
      }
    }
  };

  const progressPercentage = userProgress 
    ? Math.min(100, (userProgress.completed_exercises / userProgress.total_exercises) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaGraduationCap className="text-green-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Practice Tasks</h1>
            <p className="text-gray-600">Level up your coding skills with guided exercises</p>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{userProgress?.completed_exercises || 0}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{userProgress?.current_streak || 0}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{userProgress?.total_points || 0}</div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
        </div>
        
        {/* Language Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['python', 'c', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedLanguage === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exercise List */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Available Exercises</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`p-3 rounded cursor-pointer border ${
                      currentExercise?.id === exercise.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCurrentExercise(exercise);
                      setCodeSubmission(exercise.solution_template || '');
                      setSubmissionResult(null);
                    }}
                  >
                    <div className="font-medium">{exercise.title}</div>
                    <div className="text-sm text-gray-600">{exercise.description}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        Level {exercise.id}
                      </span>
                      <span className="text-xs text-yellow-600">
                        {exercise.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Exercise Detail & Editor */}
          <div className="lg:col-span-2 space-y-4">
            {currentExercise && (
              <>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{currentExercise.title}</h3>
                      <p className="text-gray-600">{currentExercise.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {currentExercise.difficulty}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {currentExercise.points} pts
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Concepts Covered</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentExercise.concepts_covered?.map((concept, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Hints</h4>
                      <ul className="text-sm space-y-1">
                        {currentExercise.hints?.map((hint, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <CodeEditor
                    code={codeSubmission}
                    setCode={setCodeSubmission}
                    language={selectedLanguage}
                    height="300px"
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaStar />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
                    </button>
                    
                    {submissionResult && submissionResult.level_completed && (
                      <div className="text-green-600 font-medium">
                        🎉 Level Completed!
                      </div>
                    )}
                  </div>
                </div>
                
                {submissionResult && (
                  <div className={`border rounded-lg p-4 ${
                    submissionResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className="font-medium mb-2">
                      {submissionResult.success ? '✅ Success!' : '❌ Needs Improvement'}
                    </h3>
                    <p className="mb-3">{submissionResult.feedback}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        Points earned: <span className="font-bold">{submissionResult.points_earned}</span>
                      </div>
                      
                      {submissionResult.next_exercise && (
                        <button
                          onClick={handleNextExercise}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Next Exercise
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
