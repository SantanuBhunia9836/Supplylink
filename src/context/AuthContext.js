// src/context/AuthContext.js
import React, { useState, createContext, useEffect } from 'react';
import { apiLogin, getProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // For fully authenticated users
  const [guestInfo, setGuestInfo] = useState(null); // For temporary guest users
  const [token, setToken] = useState(() => sessionStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const userRole = sessionStorage.getItem('userRole');
          if (userRole) {
            const profileData = await getProfile(token, userRole);
            setUser({ ...profileData, role: userRole });
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('userRole');
          setToken(null);
        }
      }
      setAuthLoading(false);
    };
    validateToken();
  }, [token]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const responseData = await apiLogin(credentials);
      const authToken = responseData.token;
      if (!authToken) throw new Error("Login successful, but no token was provided.");
      
      setToken(authToken);
      setUser({ ...responseData.user, role: credentials.role });
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('userRole', credentials.role);
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setGuestInfo(null); // Also clear guest info on logout
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
  };

  // New function to set guest user info
  const setGuest = (info) => {
    setGuestInfo(info);
  };

  const value = {
    user,
    guestInfo,
    token,
    loading,
    error,
    authLoading,
    login,
    logout,
    setGuest, // Expose the new function
  };

  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
