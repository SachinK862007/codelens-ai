// frontend/src/components/auth/Profile.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = ({ user, onUpdateProfile }) => {
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
      // Simulate API call
      setTimeout(() => {
        onUpdateProfile(profileData);
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Update failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
          )}
        </div>
        
        {isEditing ? (
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
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <FaSave />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
                <FaUser className="text-gray-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  {user?.full_name || user?.username}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Member since</div>
                <div className="font-medium">January 2024</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Account Status</div>
                <div className="font-medium text-green-600">Active</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
