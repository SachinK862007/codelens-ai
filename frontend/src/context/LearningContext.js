// frontend/src/context/LearningContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    completedExercises: 0,
    totalExercises: 25,
    currentStreak: 0,
    totalPoints: 0,
    achievements: [],
    level: 1
  });

  const [currentExercise, setCurrentExercise] = useState(null);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('codelens-progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Failed to parse progress data:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('codelens-progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (newProgress) => {
    setProgress(prev => ({
      ...prev,
      ...newProgress
    }));
  };

  const completeExercise = (exerciseId, pointsEarned) => {
    setProgress(prev => ({
      ...prev,
      completedExercises: prev.completedExercises + 1,
      totalPoints: prev.totalPoints + pointsEarned,
      currentStreak: prev.currentStreak + 1
    }));

    setExerciseHistory(prev => [
      ...prev,
      { exerciseId, pointsEarned, completedAt: new Date().toISOString() }
    ]);
  };

  const unlockAchievement = (achievement) => {
    setProgress(prev => ({
      ...prev,
      achievements: [...prev.achievements, { ...achievement, unlocked: true }]
    }));
  };

  const getProgressPercentage = () => {
    return Math.min(100, (progress.completedExercises / progress.totalExercises) * 100);
  };

  return (
    <LearningContext.Provider value={{
      progress,
      currentExercise,
      exerciseHistory,
      updateProgress,
      completeExercise,
      unlockAchievement,
      getProgressPercentage,
      setCurrentExercise,
      setExerciseHistory
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
