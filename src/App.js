// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SellerRegistration from './pages/SellerRegistration';
import SellerDetailPage from './pages/SellerDetailPage';


// This component now handles the view logic (which page to show)
function AppContent() {
  const { user, authLoading } = useContext(AuthContext);

  // Show a global loading spinner while checking for a token
  if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route path="/dashboard/*" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/seller-registration" element={user ? <SellerRegistration /> : <Navigate to="/login" />} />
        <Route path="/seller/:id" element={<SellerDetailPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// This is the main App component that wraps everything
function App() {
  return (
    <ErrorBoundary>
      <LocationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocationProvider>
    </ErrorBoundary>
  );
}

export default App;
