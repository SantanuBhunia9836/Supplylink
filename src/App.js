// src/App.js
import React, { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; // Import the LoginPage

// This component now handles the view logic (which page to show)
function AppContent() {
  const { user, authLoading } = useContext(AuthContext);
  // State to control which auth page is visible when logged out
  const [authView, setAuthView] = useState('landing'); // 'landing', 'login', or 'register'

  // Show a global loading spinner while checking for a token
  if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      );
  }

  if (user) {
    return <Dashboard />;
  }
  
  // Logic to show the correct page when logged out
  switch(authView) {
    case 'login':
      return <LoginPage onShowRegister={() => setAuthView('register')} />;
    case 'register':
      return <RegisterPage onShowLogin={() => setAuthView('login')} />;
    default: // 'landing'
      return <LandingPage onShowLogin={() => setAuthView('login')} onShowRegister={() => setAuthView('register')} />;
  }
}

// This is the main App component that wraps everything
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
