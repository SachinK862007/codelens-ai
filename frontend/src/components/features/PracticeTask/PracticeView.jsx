// frontend/src/components/features/PracticeTask/PracticeView.jsx
import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaMedal, FaTrophy, FaStar, FaPlay, FaCheck } from 'react-icons/fa';
import CodeEditor from '../../core/CodeEditor';
import ProgressBar, { CircularProgress } from '../../core/ProgressBar';
import LevelSelector from './LevelSelector';
import ExerciseRunner from './ExerciseRunner';
import SubmissionPanel from './SubmissionPanel';

const PracticeView = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [codeSubmission, setCodeSubmission] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('practice');

  // Mock user progress
  useEffect(() => {
    setUserProgress({
      completed_exercises: 8,
      total_exercises: 25,
      current_streak: 7,
      total_points: 340,
      achievements: [
        { id: 1, name: "First Steps", icon: "👣", unlocked: true },
        { id: 2, name: "Debug Master", icon: "🐛", unlocked: true },
        { id: 3, name: "Consistency King", icon: "👑", unlocked: true },
        { id: 4, name: "Problem Solver", icon: "🧩", unlocked: false }
      ]
    });
  }, []);

  // Mock exercises
  useEffect(() => {
    const mockExercises = [
      {
        id: 1,
        title: "Hello World",
        description: "Print 'Hello, World!' to the console",
        difficulty: "beginner",
        language: "python",
        points: 10,
        template: "# Write your code here\nprint('Hello, World!')",
        solution: "print('Hello, World!')",
        hints: ["Use the print() function", "Don't forget the exclamation mark"]
      },
      {
        id: 2,
        title: "Variable Assignment",
        description: "Create variables and perform basic arithmetic",
        difficulty: "beginner",
        language: "python",
        points: 15,
        template: "# Create variables\nx = \ny = \nresult = ",
        solution: "x = 10\ny = 5\nresult = x + y\nprint(result)",
        hints: ["Assign numbers to variables", "Use + operator for addition"]
      },
      {
        id: 3,
        title: "Conditional Statements",
        description: "Use if/else to make decisions",
        difficulty: "beginner",
        language: "python",
        points: 20,
        template: "# Check if a number is positive\nnumber = 5\nif :\n    print('Positive')\nelse:\n    print('Negative or zero')",
        solution: "number = 5\nif number > 0:\n    print('Positive')\nelse:\n    print('Negative or zero')",
        hints: ["Use > operator for greater than", "Remember the colon after if/else"]
      }
    ];
    
    setExercises(mockExercises);
    if (mockExercises.length > 0) {
      setCurrentExercise(mockExercises[0]);
      setCodeSubmission(mockExercises[0].template);
    }
  }, [selectedLanguage]);

  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
    setCodeSubmission(exercise.template);
    setSubmissionResult(null);
  };

  const handleSubmit = async () => {
    if (!currentExercise) return;
    
    setIsSubmitting(true);
    
    // Simulate submission processing
    setTimeout(() => {
      const isCorrect = codeSubmission.trim() === currentExercise.solution.trim();
      
      const result = {
        success: isCorrect,
        feedback: isCorrect 
          ? "Excellent! Your solution is correct." 
          : "Almost there! Check your syntax and logic.",
        points_earned: isCorrect ? currentExercise.points : 0,
        next_exercise: isCorrect ? (currentExercise.id + 1) : null,
        level_completed: isCorrect && currentExercise.id === exercises.length
      };
      
      setSubmissionResult(result);
      setIsSubmitting(false);
      
      // Update progress if successful
      if (isCorrect && userProgress) {
        setUserProgress(prev => ({
          ...prev,
          completed_exercises: prev.completed_exercises + 1,
          total_points: prev.total_points + currentExercise.points
        }));
      }
    }, 1500);
  };

  const handleNextExercise = () => {
    if (submissionResult?.next_exercise) {
      const nextEx = exercises.find(ex => ex.id === submissionResult.next_exercise);
      if (nextEx) {
        handleExerciseSelect(nextEx);
      }
    }
  };

  const progressPercentage = userProgress 
    ? Math.min(100, (userProgress.completed_exercises / (userProgress.total_exercises || 25)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaGraduationCap className="text-green-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Practice Tasks</h1>
            <p className="text-gray-600">Level up your coding skills with guided exercises</p>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{userProgress?.completed_exercises || 0}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
            <CircularProgress 
              value={progressPercentage} 
              maxValue={100} 
              size="sm" 
              color="green"
              showLabel={false}
            />
            <div className="text-sm text-green-800 mt-2">Progress</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">{userProgress?.current_streak || 0}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-600">{userProgress?.total_points || 0}</div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-600">
              {userProgress?.achievements?.filter(a => a.unlocked).length || 0}
            </div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="flex flex-wrap gap-2">
          {userProgress?.achievements?.map((achievement) => (
            <div 
              key={achievement.id}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                achievement.unlocked 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              <span>{achievement.icon}</span>
              <span>{achievement.name}</span>
              {achievement.unlocked && <FaStar className="text-yellow-500" />}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Levels and Exercises */}
        <div className="lg:col-span-1">
          <LevelSelector 
            currentLevel={currentLevel}
            onLevelChange={setCurrentLevel}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          
          <div className="bg-white rounded-lg shadow mt-4">
            <div className="p-3 border-b bg-gray-50">
              <h3 className="font-medium text-gray-700">Exercises</h3>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-3 rounded cursor-pointer mb-1 ${
                    currentExercise?.id === exercise.id
                      ? 'bg-blue-100 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm">{exercise.title}</div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`text-xs ${
                            i < Math.floor(exercise.points / 10) 
                              ? 'text-yellow-500' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {exercise.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Area - Exercise Runner */}
        <div className="lg:col-span-3 space-y-6">
          {currentExercise ? (
            <>
              <ExerciseRunner 
                exercise={currentExercise}
                code={codeSubmission}
                setCode={setCodeSubmission}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submissionResult={submissionResult}
              />
              
              {submissionResult && (
                <SubmissionPanel 
                  result={submissionResult}
                  onNextExercise={handleNextExercise}
                  exercise={currentExercise}
                />
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              <FaGraduationCap className="mx-auto text-4xl mb-4 text-green-400" />
              <h3 className="text-lg font-medium mb-2">Select an Exercise</h3>
              <p>Choose an exercise from the sidebar to get started</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <ProgressBar 
          value={userProgress?.completed_exercises || 0}
          maxValue={userProgress?.total_exercises || 25}
          label="Overall Progress"
          color="green"
          animated
        />
      </div>
    </div>
  );
};

export default PracticeView;
