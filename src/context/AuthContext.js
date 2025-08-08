// src/context/AuthContext.js
import React, { useState, createContext, useCallback, useEffect } from 'react';
import { apiLogin, apiLogout, getVendorProfile, getVendorStatus } from '../services/api';

// --- Full Screen Loader Component ---
const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[9999]">
    <div className="text-white text-3xl font-bold mb-4">
      SupplyLink
    </div>
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState({
    profile_done: 0,
    profile_creds: [],
    seller_profile_done: 0,
    seller_profile_creds: []
  });

  // This function now only clears React state.
  const clearUserData = useCallback(() => {
    setUser(null);
    setProfileCompletion({
      profile_done: 0,
      profile_creds: [],
      seller_profile_done: 0,
      seller_profile_creds: []
    });
  }, []);

  // This function now relies entirely on the backend to validate the session cookie.
  const validateSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      const status = await getVendorStatus();
      
      if (status.is_login) {
        // If logged in, fetch user data.
        const profileData = await getVendorProfile();
        setUser({
          ...profileData,
          is_seller: status.is_seller,
          role: 'vendor',
        });
        setProfileCompletion({
          profile_done: status.profile_done || 0,
          profile_creds: status.profile_creds || [],
          seller_profile_done: status.seller_profile_done || 0,
          seller_profile_creds: status.seller_profile_creds || []
        });
      } else {
        // If not logged in, clear any existing user data.
        clearUserData();
      }
    } catch (err) {
      console.error("Session validation failed", err);
      clearUserData();
    } finally {
      setAuthLoading(false);
    }
  }, [clearUserData]);

  // On every initial page load, we ask the backend to validate the session.
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // The backend will set the session cookie upon successful login.
      await apiLogin(credentials);
      // After login, re-validate the session to fetch user data.
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
      // Tell the backend to clear the session cookie.
      await apiLogout();
    } catch (err) {
      console.error("Logout API call failed", err);
    } finally {
      // Clear user data from the frontend state.
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
    validateSession 
  };

  if (authLoading) {
    return <FullScreenLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
