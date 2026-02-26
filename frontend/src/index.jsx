// frontend/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { VoiceProvider } from './context/VoiceContext';
import { LearningProvider } from './context/LearningContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VoiceProvider>
          <LearningProvider>
            <App />
          </LearningProvider>
        </VoiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
