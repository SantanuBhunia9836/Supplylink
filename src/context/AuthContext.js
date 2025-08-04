// src/context/AuthContext.js
import React, { useState, createContext, useEffect } from 'react';
import { apiLogin, getProfile, apiLogout, getVendorProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
                                 try {
                       if (userRole === 'vendor') {
                         const profileData = await getVendorProfile(token);
                         setUser({ ...profileData, role: userRole });
                       } else {
                         const profileData = await getProfile(token, userRole);
                         setUser({ ...profileData, role: userRole });
                       }
                     } catch (profileErr) {
                       // Only clear token for authentication errors
                       if (profileErr.message && (
                         profileErr.message.includes('401') ||
                         profileErr.message.includes('403') ||
                         profileErr.message.includes('Unauthorized') ||
                         profileErr.message.includes('Forbidden')
                       )) {
                         sessionStorage.removeItem('authToken');
                         sessionStorage.removeItem('userRole');
                         setToken(null);
                       } else {
                         // Keep user logged in with minimal data for other errors
                         setUser({ role: userRole, name: 'User', email: 'user@example.com' });
                       }
                     }
          } else {
            sessionStorage.removeItem('authToken');
            setToken(null);
          }
        } catch (err) {
          const userRole = sessionStorage.getItem('userRole');
          if (userRole) {
            setUser({ role: userRole, name: 'User', email: 'user@example.com' });
          }
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
      
      const authToken = responseData.access_token || responseData.token || responseData.accessToken;
      
      if (!authToken) {
        throw new Error("Login successful, but no token was provided. Please check the response format.");
      }
      
      setToken(authToken);
      
      // Handle user data - it might be in different fields
      const userData = responseData.user || responseData.user_data || responseData;
      
      // Store token and role
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('userRole', credentials.role);
      
      // Set initial user data
      setUser({ ...userData, role: credentials.role });

      // Fetch complete profile data
      try {
        if (credentials.role === 'vendor') {
          const profileData = await getVendorProfile(authToken);
          setUser({ ...profileData, role: credentials.role });
        } else {
          const profileData = await getProfile(authToken, credentials.role);
          setUser({ ...profileData, role: credentials.role });
        }
      } catch (profileError) {
        // User is still logged in with basic data
        setUser({ role: credentials.role, name: 'User', email: credentials.username });
      }
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiLogout(token);
      }
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole');
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    authLoading,
    login,
    logout,
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
