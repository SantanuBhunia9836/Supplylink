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
// --- Context Imports ---
import { AuthContext, AuthProvider } from "./features/auth/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { CartProvider } from "./context/CartContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import AnimatedLoader, { RouteChangeLoader } from './components/common/AnimatedLoader';
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Layout & Component Imports ---
import LandingPageHeader from "./components/layout/LandingPageHeader";
import LandingPageFooter from "./components/layout/LandingPageFooter";
import MobileNavigation from "./components/layout/MobileNavigation";
import LocationPanel from "./components/common/LocationPanel";

// --- Page Imports ---
import LandingPage, { LoginPopup } from "./features/vendor/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import SellerRegistration from "./features/seller/pages/SellerRegistration";
import SellerDetailPage from "./features/seller/pages/SellerDetailPage";
// import ProductDetailPage from "./features/seller/pages/ProductDetailPage";
import CartPage from "./features/vendor/pages/CartPage";
// --- NEW: Import checkout pages ---
import CheckoutPage from "./features/vendor/pages/CheckoutPage";
import OrderSuccessPage from "./features/vendor/pages/OrderSuccessPage";


// --- Dashboard Imports ---
import VendorDashboard from "./features/vendor/components/VendorDashboard";
import SellerDashboard from "./features/seller/components/SellerDashboard";


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

const GlobalLoader = () => {
  const { isLoading } = useLoading();
  return isLoading ? <AnimatedLoader /> : null;
};

function AppContent() {
  const { user } = useContext(AuthContext);
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);

  const DashboardRedirect = () => {
    const { user } = useContext(AuthContext);
    return <Navigate to={user?.is_seller ? "/seller-dashboard" : "/vendor-dashboard"} replace />;
  };

  return (
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
      
      <GlobalLoader />
      <RouteChangeLoader />

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
            {/* <Route path="/product/:id" element={<ProductDetailPage />} /> */}
            <Route path="/cart" element={<CartPage />} />

            {/* --- NEW: Add protected routes for checkout and order success --- */}
            <Route
              path="/checkout"
              element={user ? <CheckoutPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/order-success"
              element={user ? <OrderSuccessPage /> : <Navigate to="/login" />}
            />
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
            path="/dashboard"
            element={user ? <DashboardRedirect /> : <Navigate to="/login" />}
          />
          <Route
            path="/vendor-dashboard/*"
            element={user ? <VendorDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/seller-dashboard/*"
            element={user?.is_seller ? <SellerDashboard /> : <Navigate to="/vendor-dashboard" />}
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
            <LoadingProvider>
              <AppContent />
            </LoadingProvider>
          </CartProvider>
        </AuthProvider>
      </LocationProvider>
    </GoogleOAuthProvider>
  );
}

export default App;