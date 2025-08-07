// src/context/AuthContext.js
import React, { useState, createContext, useCallback, useEffect } from 'react';
import { apiLogin, apiLogout, getVendorProfile, getVendorStatus } from '../services/api';
import TokenManager from '../utils/tokenManager';

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
  const [token, setToken] = useState(() => TokenManager.getToken());
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialScreenLoading, setInitialScreenLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState({
    profile_done: 0,
    profile_creds: [],
    seller_profile_done: 0,
    seller_profile_creds: []
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialScreenLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const clearUserData = useCallback(() => {
    setUser(null);
    setToken(null);
    setProfileCompletion({
      profile_done: 0,
      profile_creds: [],
      seller_profile_done: 0,
      seller_profile_creds: []
    });
    TokenManager.clearToken();
  }, []);

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await apiLogout(token);
    } catch (err) {
      console.error("Logout API call failed", err);
    } finally {
      clearUserData();
      setLogoutLoading(false);
    }
  }, [clearUserData, token]);

  const validateSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      const status = await getVendorStatus();
      
      if (!status.is_login) {
        clearUserData();
      } else {
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
        
        const existingToken = TokenManager.getToken();
        if (!token && existingToken) {
          setToken(existingToken);
        }
      }
    } catch (err) {
      console.error("Session validation failed", err);
      clearUserData();
    } finally {
      setAuthLoading(false);
    }
  }, [clearUserData, token]);

  // *** FIX: The dependency array is now empty. This ensures validateSession
  // runs ONLY ONCE when the app first loads, and not after a logout. ***
  useEffect(() => {
    validateSession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await apiLogin(credentials);
      const authToken = responseData.token; 
      if (!authToken) throw new Error("Login successful, but no token was provided.");

      setToken(authToken);
      TokenManager.setToken(authToken);
      TokenManager.setUserRole(credentials.role);
      
      await validateSession();

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = { 
    user, 
    token, 
    loading, 
    logoutLoading, 
    error, 
    authLoading, 
    profileCompletion,
    login, 
    logout, 
    validateSession 
  };

  if (initialScreenLoading) {
    return <FullScreenLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
