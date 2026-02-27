import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { VoiceContext } from '../../context/VoiceContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { isListening, toggleVoiceRecognition } = useContext(VoiceContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">CL</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">CodeLens AI</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <Link to="/try-me" className="text-gray-600 hover:text-blue-600 transition-colors">Try Me</Link>
                        <Link to="/debug" className="text-gray-600 hover:text-blue-600 transition-colors">Debug</Link>
                        <Link to="/ideas" className="text-gray-600 hover:text-blue-600 transition-colors">Ideas</Link>
                        <Link to="/practice" className="text-gray-600 hover:text-blue-600 transition-colors">Practice</Link>
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Voice Control Button */}
                        <button
                            onClick={toggleVoiceRecognition}
                            className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-all`}
                            aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden md:inline text-gray-700">{user.name}</span>
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Dashboard</Link>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Profile</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">Login</Link>
                                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
                    <nav className="flex flex-wrap gap-4">
                        <Link to="/try-me" className="text-gray-600 hover:text-blue-600 transition-colors">Try Me</Link>
                        <Link to="/debug" className="text-gray-600 hover:text-blue-600 transition-colors">Debug</Link>
                        <Link to="/ideas" className="text-gray-600 hover:text-blue-600 transition-colors">Ideas</Link>
                        <Link to="/practice" className="text-gray-600 hover:text-blue-600 transition-colors">Practice</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
