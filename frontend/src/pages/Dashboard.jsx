// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { FaChartLine, FaTrophy, FaClock, FaStar } from 'react-icons/fa';
import Card from '../components/common/Card';
import ProgressBar, { CircularProgress } from '../components/core/ProgressBar';
import { useLearning } from '../context/LearningContext';

const Dashboard = () => {
  const { progress, getProgressPercentage } = useLearning();
  
  const achievements = [
    { name: "First Steps", icon: "👣", unlocked: true, date: "2024-01-15" },
    { name: "Debug Master", icon: "🐛", unlocked: true, date: "2024-01-20" },
    { name: "Consistency King", icon: "👑", unlocked: true, date: "2024-01-25" },
    { name: "Problem Solver", icon: "🧩", unlocked: false },
    { name: "Code Ninja", icon: "🥷", unlocked: false },
    { name: "Algorithm Expert", icon: "🧠", unlocked: false }
  ];

  const recentActivity = [
    { action: "Completed exercise", item: "Hello World Basics", points: 10, time: "2 hours ago" },
    { action: "Earned achievement", item: "Debug Master", points: 25, time: "1 day ago" },
    { action: "Used feature", item: "Project Ideas", points: 5, time: "2 days ago" },
    { action: "Submitted solution", item: "Variable Assignment", points: 15, time: "3 days ago" }
  ];

  const learningPaths = [
    { name: "Python Fundamentals", progress: 75, level: "Intermediate" },
    { name: "Web Development", progress: 45, level: "Beginner" },
    { name: "Data Structures", progress: 30, level: "Beginner" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {progress.user?.full_name || 'Student'}!</h1>
            <p className="text-xl">Continue your coding journey and master new skills</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{progress.currentStreak}</div>
            <div className="text-sm">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaChartLine className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{progress.completedExercises}</div>
          <div className="text-gray-600">Exercises Completed</div>
        </Card>

        <Card className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-green-100 rounded-full">
              <FaStar className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{progress.totalPoints}</div>
          <div className="text-gray-600">Points Earned</div>
        </Card>

        <Card className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaTrophy className="text-yellow-600 text-2xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {progress.achievements.filter(a => a.unlocked).length}
          </div>
          <div className="text-gray-600">Achievements</div>
        </Card>

        <Card className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaClock className="text-purple-600 text-2xl" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{progress.currentStreak}</div>
          <div className="text-gray-600">Day Streak</div>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Overall Progress" className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Learning Completion</span>
                <span className="font-bold">{getProgressPercentage().toFixed(1)}%</span>
              </div>
              <ProgressBar 
                value={progress.completedExercises} 
                maxValue={progress.totalExercises} 
                color="blue" 
                size="lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{progress.level}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(progress.totalPoints / 100)}
                </div>
                <div className="text-sm text-gray-600">Skill Points</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.floor(progress.totalPoints / 50)}
                </div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Achievements">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-3 rounded ${
                  achievement.unlocked 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-gray-50 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-xs text-gray-500">
                      Unlocked {achievement.date}
                    </div>
                  )}
                </div>
                {achievement.unlocked ? (
                  <FaStar className="text-yellow-500" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity and Learning Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.item}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{activity.time}</div>
                  {activity.points > 0 && (
                    <div className="text-xs font-medium text-green-600">+{activity.points} pts</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Learning Paths">
          <div className="space-y-4">
            {learningPaths.map((path, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-800">{path.name}</div>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {path.level}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <ProgressBar 
                      value={path.progress} 
                      maxValue={100} 
                      color="blue" 
                      size="sm"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {path.progress}%
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              View All Paths
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
