// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import TryMePage from './pages/TryMePage';
import DebugPage from './pages/DebugPage';
import IdeasPage from './pages/IdeasPage';
import PracticePage from './pages/PracticePage';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('codelens-user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('codelens-user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('codelens-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codelens-user');
    localStorage.removeItem('access_token');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/try-me" element={<TryMePage />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
