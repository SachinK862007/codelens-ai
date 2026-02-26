// frontend/src/hooks/useLearningProgress.js
import { useState, useEffect } from 'react';

export const useLearningProgress = (userId) => {
  const [progress, setProgress] = useState({
    completedExercises: 0,
    totalExercises: 25,
    currentStreak: 0,
    totalPoints: 0,
    achievements: [],
    level: 1
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching progress data
    const fetchProgress = async () => {
      try {
        // In real implementation: const response = await api.get(`/progress/${userId}`)
        
        // Mock data for demo
        const mockProgress = {
          completedExercises: 8,
          totalExercises: 25,
          currentStreak: 7,
          totalPoints: 340,
          achievements: [
            { id: 1, name: "First Steps", icon: "👣", unlocked: true, date: "2024-01-15" },
            { id: 2, name: "Debug Master", icon: "🐛", unlocked: true, date: "2024-01-20" },
            { id: 3, name: "Consistency King", icon: "👑", unlocked: true, date: "2024-01-25" },
            { id: 4, name: "Problem Solver", icon: "🧩", unlocked: false }
          ],
          level: 2
        };

        setProgress(mockProgress);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  const updateProgress = (newProgress) => {
    setProgress(prev => ({
      ...prev,
      ...newProgress
    }));
  };

  const getProgressPercentage = () => {
    return Math.min(100, (progress.completedExercises / progress.totalExercises) * 100);
  };

  return {
    progress,
    loading,
    updateProgress,
    getProgressPercentage
  };
};
