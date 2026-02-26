// frontend/src/pages/Profile.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaTrophy, FaChartLine } from 'react-icons/fa';
import Card from '../components/common/Card';
import ProgressBar from '../components/core/ProgressBar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      fullName: user?.full_name || '',
      email: user?.email || '',
      username: user?.username || ''
    });
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update profile
      updateProfile(profileData);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error('Update failed:', err);
      setLoading(false);
    }
  };

  // Mock statistics data
  const stats = [
    { label: "Exercises Completed", value: "42", icon: <FaChartLine /> },
    { label: "Points Earned", value: "1,250", icon: <FaTrophy /> },
    { label: "Achievements", value: "12", icon: <FaTrophy /> },
    { label: "Member Since", value: "Jan 2024", icon: <FaCalendar /> }
  ];

  const learningStats = [
    { language: "Python", progress: 85, level: "Advanced" },
    { language: "JavaScript", progress: 65, level: "Intermediate" },
    { language: "C++", progress: 40, level: "Beginner" }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center">
              <FaUser className="text-gray-600 text-4xl" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.full_name || user?.username || 'User Profile'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Premium Member
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active Learner
                </span>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      {isEditing && (
        <Card title="Edit Profile">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="flex justify-center mb-2 text-blue-500">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Learning Progress */}
      <Card title="Learning Progress">
        <div className="space-y-6">
          {learningStats.map((stat, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{stat.language}</span>
                <span className="text-sm text-gray-500">{stat.level}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <ProgressBar 
                    value={stat.progress} 
                    maxValue={100} 
                    color="blue"
                    size="sm"
                  />
                </div>
                <div className="text-sm font-medium text-gray-600 w-10">
                  {stat.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card title="Recent Achievements">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Debug Master", icon: "🐛", date: "2024-01-20" },
            { name: "Consistency King", icon: "👑", date: "2024-01-25" },
            { name: "Problem Solver", icon: "🧩", date: "2024-01-28" },
            { name: "Code Ninja", icon: "🥷", date: "2024-02-01" }
          ].map((achievement, index) => (
            <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="font-medium text-gray-800 text-sm">{achievement.name}</div>
              <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
