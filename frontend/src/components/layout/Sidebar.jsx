// frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCode, 
  FaBug, 
  FaLightbulb, 
  FaGraduationCap, 
  FaTimes,
  FaUser,
  FaChartLine,
  FaCog
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/try-me', label: 'Try Me', icon: <FaCode /> },
    { path: '/debug', label: 'Debug', icon: <FaBug /> },
    { path: '/ideas', label: 'Ideas', icon: <FaLightbulb /> },
    { path: '/practice', label: 'Practice', icon: <FaGraduationCap /> },
    { path: '/analytics', label: 'Analytics', icon: <FaChartLine /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold">
                CL
              </div>
              <span className="text-xl font-bold text-gray-800">CodeLens AI</span>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} CodeLens AI
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
