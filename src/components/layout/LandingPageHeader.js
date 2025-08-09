// src/components/layout/LandingPageHeader.js
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import ProfileCompletionIndicator from "../common/ProfileCompletionIndicator";

const CartIcon = ({ cartCount }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/cart")}
      className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
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
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
          {cartCount}
        </span>
      )}
    </button>
  );
};

const AccountDropdown = ({
  isOpen,
  user,
  profileName,
  onClose,
  onDashboard,
  onLogout,
  onBecomeSeller,
  onLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-56 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-semibold text-gray-800 truncate">{profileName}</p>
      </div>

      <button
        onClick={onDashboard}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Dashboard
      </button>

      {user?.is_seller ? (
        <button
          onClick={onDashboard}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Seller Dashboard
        </button>
      ) : (
        <button
          onClick={onBecomeSeller}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Become a Seller
        </button>
      )}

      <button
        onClick={onLocation}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Location
      </button>
      <hr className="my-1" />
      <button
        onClick={onLogout}
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

const AuthStatus = ({ onLogin, onSignup, onLocationClick }) => (
  <div className="flex items-center space-x-3">
    <button
      onClick={onLocationClick}
      className="px-4 py-2 text-gray-600 hover:text-blue-700 font-medium transition-colors flex items-center"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Location
    </button>
    <button
      onClick={onLogin}
      className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
    >
      Login
    </button>
    <button
      onClick={onSignup}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Sign Up
    </button>
  </div>
);

const LandingPageHeader = ({
  onLoginClick,
  onSignupClick,
  onLocationClick,
}) => {
  const { user, logout, authLoading, profileCompletion } =
    useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [profileName, setProfileName] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      Promise.resolve(user)
        .then((profile) => {
          const possibleNames = [
            profile.name,
            profile.businessName,
            profile.full_name,
            profile.first_name,
            `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
            profile.email?.split("@")[0],
            profile.username,
          ].filter(Boolean);
          setProfileName(possibleNames[0] || "Account");
        })
        .finally(() => setProfileLoading(false));
    } else {
      setProfileName(null);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          SupplyLink
        </h1>
        <div className="flex items-center space-x-6">
          {authLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Checking...</span>
            </div>
          ) : user ? (
            <div
              className="relative flex items-center space-x-6"
              ref={dropdownRef}
            >
              <CartIcon cartCount={cartCount} />
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center space-x-2 pl-2 pr-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                <ProfileCompletionIndicator
                  profileCompletion={profileCompletion}
                  size={32}
                  strokeWidth={2}
                  showPercentage={true}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </ProfileCompletionIndicator>
                <span className="font-medium text-sm">
                  {profileLoading ? "Loading..." : profileName || "Account"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isAccountDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <AccountDropdown
                isOpen={isAccountDropdownOpen}
                user={user}
                profileName={profileName}
                onClose={() => setIsAccountDropdownOpen(false)}
                onDashboard={() => navigate("/dashboard")}
                onLogout={logout}
                onBecomeSeller={() => navigate("/seller-registration")}
                onLocation={onLocationClick}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <CartIcon cartCount={cartCount} />
              <AuthStatus
                onLogin={onLoginClick}
                onSignup={onSignupClick}
                onLocationClick={onLocationClick}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingPageHeader;
