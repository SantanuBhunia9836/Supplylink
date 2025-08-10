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
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// --- Layout & Component Imports ---
import LandingPageHeader from "./components/layout/LandingPageHeader";
import LandingPageFooter from "./components/layout/LandingPageFooter";
import MobileNavigation from "./components/layout/MobileNavigation";
import LocationPanel from "./components/common/LocationPanel";
import Header from "./components/layout/Header";

// --- Page Imports ---
import LandingPage, { LoginPopup } from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import SellerDetailPage from "./pages/SellerDetailPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
// --- FIX: Import the SellerRegistration page ---
import SellerRegistration from "./pages/SellerRegistration";

/**
 * This layout component wraps all public-facing pages.
 */
const WebsiteLayout = () => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader
        onLoginClick={() => setIsLoginPopupOpen(true)}
        onSignupClick={() => navigate("/register")}
        onLocationClick={() => setIsLocationPanelOpen(true)}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <LandingPageFooter />
      {/* Popups are controlled by the layout */}
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
    <Router>
      <div className="flex flex-col min-h-screen pb-16 md:pb-0">
        <Routes>
          <Route element={<WebsiteLayout />}>
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

          {/* --- FIX: Add the route for Seller Registration --- */}
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
        onSuccess={() => setIsLocationPanelOpen(false)}
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
