// src/App.js
import React, { useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SellerRegistration from "./pages/SellerRegistration";
import SellerDetailPage from "./pages/SellerDetailPage";
import ProductDetailPage from "./pages/ProductDetailPage"; // --- 1. IMPORT THE NEW PAGE ---
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import 'react-toastify/dist/ReactToastify.css'; // Make sure this is uncommented if you have style issues

// This component contains your app's routing logic.
// It needs to be a child of AuthProvider to access the `user` context.
function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
        />
        <Route path="/seller/:id" element={<SellerDetailPage />} />

        {/* --- 2. ADD THE ROUTE FOR THE PRODUCT DETAIL PAGE --- */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/seller-registration"
          element={user ? <SellerRegistration /> : <Navigate to="/login" />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// This is the main App component that sets up all the providers.
function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="189626540628-goi86smbh3m8slu6i3pdka007kkvim09.apps.googleusercontent.com">
        <LocationProvider>
          <AuthProvider>
            <AppContent />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AuthProvider>
        </LocationProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
