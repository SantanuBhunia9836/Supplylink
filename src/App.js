// src/App.js
import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
// ... existing code ...
import { AuthContext, AuthProvider } from "./features/auth/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Layout & Component Imports ---
import LandingPageHeader from "./components/layout/LandingPageHeader";
import LandingPageFooter from "./components/layout/LandingPageFooter";
import MobileNavigation from "./components/layout/MobileNavigation";
import LocationPanel from "./components/common/LocationPanel";
import Header from "./components/layout/Header";

// --- Page Imports ---
import LandingPage, { LoginPopup } from "./features/vendor/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
// ... existing code ...
import SellerRegistration from "./features/seller/pages/SellerRegistration"; // Corrected path and consolidated
import Dashboard from "./features/dashboard/pages/Dashboard";
import SellerDetailPage from "./features/seller/pages/SellerDetailPage"; // Corrected path to the page
import ProductDetailPage from "./features/vendor/pages/ProductDetailPage"; // Corrected path to the page
import CartPage from "./features/vendor/pages/CartPage"; // Corrected path to the page
import RegisterPage from "./features/auth/pages/RegisterPage"; // Corrected path to the page
// ... existing code ...

// ... existing code ...

const WebsiteLayout = ({ onLocationClick }) => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader
        onLoginClick={() => setIsLoginPopupOpen(true)}
        onSignupClick={() => navigate("/register")}
        onLocationClick={onLocationClick}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <LandingPageFooter />
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        onLogin={login}
      />
    </div>
  );
};

function AppContent() {
  const { user } = useContext(AuthContext);
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);

  return (
    // --- FIX: Added all required 'future' flags to opt-in to v7 behaviors ---
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastContainer
        position="top-right"
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
      <div className="flex flex-col min-h-screen pb-16 md:pb-0">
        <Routes>
          <Route
            element={
              <WebsiteLayout
                onLocationClick={() => setIsLocationPanelOpen(true)}
              />
            }
          >
            <Route path="/" element={<LandingPage />} />
            <Route path="/seller/:id" element={<SellerDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/seller-registration"
            element={user ? <SellerRegistration /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/*"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <MobileNavigation onLocationClick={() => setIsLocationPanelOpen(true)} />

      <LocationPanel
        isOpen={isLocationPanelOpen}
        onClose={() => setIsLocationPanelOpen(false)}
        onSuccess={() => {
          setIsLocationPanelOpen(false);
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="189626540628-goi86smbh3m8slu6i3pdka007kkvim09.apps.googleusercontent.com">
      <LocationProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </LocationProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
