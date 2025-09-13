import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  apiLogin,
  apiLogout,
  getVendorProfile,
  getVendorStatus,
} from "../../services/api";
import { useLocation } from "../../context/LocationContext"; // Ensure this path is correct

// --- FullScreenLoader (MODIFIED) ---
const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[9999]">
    {/* Logo added here */}
    <img
      src="/supplylink-logo.png"
      alt="SupplyLink Logo"
      className="h-24 mb-6 animate-pulse"
    />
    <div className="text-white text-3xl font-bold mb-4">SupplyLink</div>
    <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
      <div className="h-1 bg-blue-500 rounded-full animate-loader-progress"></div>
    </div>
    <style>{`
      @keyframes loader-progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-loader-progress {
        animation: loader-progress 1.5s infinite linear;
      }
    `}</style>
  </div>
);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { location, getCurrentLocation } = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState({
    profile_done: 0,
    profile_creds: [],
    seller_profile_done: 0,
    seller_profile_creds: [],
  });

  const clearUserData = useCallback(() => {
    setUser(null);
    setProfileCompletion({
      profile_done: 0,
      profile_creds: [],
      seller_profile_done: 0,
      seller_profile_creds: [],
    });
  }, []);

  const validateSession = useCallback(async () => {
    try {
      const status = await getVendorStatus();
      if (status.is_login) {
        const profileData = await getVendorProfile();
        const finalUser = {
          ...profileData,
          is_seller: status.is_seller,
          role: "vendor",
        };
        setUser(finalUser);
        setProfileCompletion({
          profile_done: status.profile_done || 0,
          profile_creds: status.profile_creds || [],
          seller_profile_done: status.seller_profile_done || 0,
          seller_profile_creds: status.seller_profile_creds || [],
        });
        return finalUser; // Return user data
      } else {
        clearUserData();
        return null;
      }
    } catch (err) {
      console.error("Session validation failed", err);
      clearUserData();
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [clearUserData]);

  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [location, getCurrentLocation]);

  useEffect(() => {
    const handler = setTimeout(() => {
      validateSession();
    }, 300);
    return () => clearTimeout(handler);
  }, [validateSession]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(credentials);
      // Capture the returned user object from validateSession
      const user = await validateSession();
      return user; // Return the user object to the login page
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout API call failed", err);
    } finally {
      clearUserData();
      setLogoutLoading(false);
    }
  }, [clearUserData]);

  const value = {
    user,
    loading,
    logoutLoading,
    error,
    authLoading,
    profileCompletion,
    login,
    logout,
    validateSession,
  };

  if (authLoading) {
    return <FullScreenLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};