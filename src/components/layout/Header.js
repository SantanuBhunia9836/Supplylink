// src/components/layout/Header.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileCompletionIndicator from "../common/ProfileCompletionIndicator";

// --- Icon Components (no changes needed) ---
const BellIcon = (props) => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const UserIcon = (props) => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LogOutIcon = (props) => (
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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const SearchIcon = (props) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const MenuIcon = (props) => (
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
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const SpinnerIcon = (props) => (
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

const Header = ({ pageTitle }) => {
  const { user, logout, logoutLoading, profileCompletion } =
    useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 hidden md:block">
        {pageTitle}
      </h1>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <button className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="text-gray-500 hover:text-gray-700">
          <SearchIcon className="w-6 h-6" />
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2"
            >
              <ProfileCompletionIndicator
                profileCompletion={profileCompletion}
                size={40}
                strokeWidth={3}
                showPercentage={false}
              >
                {/* --- THIS IS THE FIX --- */}
                {/* The background is now smaller (w-8) than the indicator (size 40 / w-10) */}
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* The icon is also slightly smaller to maintain proportion */}
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
              </ProfileCompletionIndicator>

              <span className="text-gray-700 font-medium hidden sm:block">
                {user?.name || "User"}
              </span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 border border-gray-200">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">
                      {user?.name || user?.businessName}
                    </p>
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user?.is_seller ? "Seller Dashboard" : "Dashboard"}</span>
                  </button>
                  {user?.is_seller ? null : (
                    <button
                      onClick={() => navigate("/seller-registration")}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Become a Seller</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50"
                  >
                    {logoutLoading ? (
                      <SpinnerIcon className="w-4 h-4" />
                    ) : (
                      <LogOutIcon className="w-4 h-4" />
                    )}
                    <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 md:hidden z-20">
          <div className="p-4">
            <button
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/seller-registration");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded mt-1"
            >
              Become a Seller
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
