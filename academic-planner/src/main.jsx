import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';

// Styles
import './App.css';
// Toasts
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProgressProvider>
        <App />
        <Toaster position="top-right" />
      </ProgressProvider>
    </AuthProvider>
  </React.StrictMode>
);