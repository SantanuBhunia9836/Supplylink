// src/App.js
import React, { useContext, useState } from "react"; // Import useState
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Page Imports
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SellerRegistration from "./pages/SellerRegistration";
import SellerDetailPage from "./pages/SellerDetailPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";

// Component Imports
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MobileNavigation from "./components/layout/MobileNavigation"; // 1. Import MobileNavigation
import LocationPanel from "./components/common/LocationPanel"; // 2. Import LocationPanel

function AppContent() {
  const { user } = useContext(AuthContext);
  // 3. Manage state for the location panel here
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* ... your other routes remain unchanged ... */}
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
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/dashboard/*"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/seller-registration"
              element={user ? <SellerRegistration /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* 4. Render MobileNavigation and LocationPanel globally */}
        <MobileNavigation
          onLocationClick={() => setIsLocationPanelOpen(true)}
        />
        <LocationPanel
          isOpen={isLocationPanelOpen}
          onClose={() => setIsLocationPanelOpen(false)}
          onSuccess={() => setIsLocationPanelOpen(false)}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="189626540628-goi86smbh3m8slu6i3pdka007kkvim09.apps.googleusercontent.com">
        <LocationProvider>
          <AuthProvider>
            <CartProvider>
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
            </CartProvider>
          </AuthProvider>
        </LocationProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
