// src/context/AuthContext.js
import React, { useState, createContext, useCallback, useEffect } from "react";
import {
  apiLogin,
  apiLogout,
  getVendorProfile,
  getVendorStatus,
} from "../services/api";
// --- 1. IMPORT useLocation ---
import { useLocation } from "./LocationContext";

// --- Full Screen Loader Component (No changes needed here) ---
const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[9999]">
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
  // --- 2. GET THE LOCATION FUNCTION AND DATA ---
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
    setAuthLoading(true);
    try {
      const status = await getVendorStatus();

      if (status.is_login) {
        const profileData = await getVendorProfile();
        setUser({
          ...profileData,
          is_seller: status.is_seller,
          role: "vendor",
        });
        setProfileCompletion({
          profile_done: status.profile_done || 0,
          profile_creds: status.profile_creds || [],
          seller_profile_done: status.seller_profile_done || 0,
          seller_profile_creds: status.seller_profile_creds || [],
        });
      } else {
        clearUserData();
      }
    } catch (err) {
      console.error("Session validation failed", err);
      clearUserData();
    } finally {
      setAuthLoading(false);
    }
  }, [clearUserData]);

  // --- 3. ADD THIS useEffect TO REQUEST LOCATION ON APP LOAD ---
  useEffect(() => {
    // Only request location if it hasn't been fetched yet
    if (!location) {
      getCurrentLocation();
    }
  }, [location, getCurrentLocation]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(credentials);
      await validateSession();
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
