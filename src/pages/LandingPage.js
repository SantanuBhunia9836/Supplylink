// src/pages/LandingPage.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import SellerListing from "../components/shop/SellerListing";

// --- Icon Components (These can stay here or be moved to a shared file) ---
const StoreIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7.88V10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.88" />
  </svg>
);
const TruckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 18H3c0-1.1.9-2 2-2v4c-1.1 0-2-.9-2-2z" />
    <path d="M19 18h2c0-1.1-.9-2-2-2v4c1.1 0 2-.9 2-2z" />
    <path d="M10 18h4" />
    <path d="M17 18v-5.17c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2V18" />
    <path d="M7 11V7.17c0-1.1.9-2 2-2h4l4 4" />
    <path d="M19 12h-4" />
    <path d="M10 18v4" />
    <path d="M14 18v4" />
  </svg>
);
const ZapIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ShieldCheckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const BarChartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);
const LoadingSpinner = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/**
 * The LoginPopup must be exported so App.js can import and use it.
 */
export const LoginPopup = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setStep("password");
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await onLogin({ username: email, password, role: "vendor" });
      onClose();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to SupplyLink
          </h2>
          <p className="text-gray-600">Sign in to your vendor account</p>
        </div>
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue
            </button>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/register");
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex justify-center items-center"
            >
              {isLoading ? <LoadingSpinner /> : "Login"}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { location, getCurrentLocation } = useLocation();

  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [location, getCurrentLocation]);

  return (
    <>
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            Connecting Local Shops with Reliable Vendors.
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-8 max-w-3xl mx-auto">
            Streamline your procurement. Find the best local suppliers for your
            daily needs.
          </p>
        </div>
      </header>

      <SellerListing />

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <StoreIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold">For Shops & Restaurants</h4>
              </div>
              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                <li>
                  <strong>Post Your Needs:</strong> Quickly create a list of all
                  the supplies you need.
                </li>
                <li>
                  <strong>Get Matched:</strong> Our app finds the nearest,
                  highest-rated vendors.
                </li>
                <li>
                  <strong>Receive Your Order:</strong> A single delivery brings
                  all your items to your doorstep.
                </li>
              </ol>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <TruckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold">For Vendors & Suppliers</h4>
              </div>
              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                <li>
                  <strong>Receive Orders:</strong> Get notified about new orders
                  from shops in your area.
                </li>
                <li>
                  <strong>Accept & Prepare:</strong> Accept the orders you can
                  fulfill and prepare them for pickup.
                </li>
                <li>
                  <strong>Fulfill & Get Paid:</strong> Our system consolidates
                  your deliveries into efficient routes.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-16">
            Why Choose SupplyLink?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div className="p-6">
              <ZapIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Efficiency Boost</h4>
              <p className="text-gray-600">
                Save hours every day by replacing multiple phone calls with a
                single order on our app.
              </p>
            </div>
            <div className="p-6">
              <ShieldCheckIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Verified Suppliers</h4>
              <p className="text-gray-600">
                We partner with trusted, high-quality local vendors to ensure
                you get the best products.
              </p>
            </div>
            <div className="p-6 sm:col-span-2 md:col-span-1">
              <BarChartIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Smart Analytics</h4>
              <p className="text-gray-600">
                Track your spending and order history with our easy-to-use
                dashboard analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
