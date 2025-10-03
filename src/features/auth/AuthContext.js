// AuthContext.js (UNCHANGED)

import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  apiLogin,
  apiLogout,
  getVendorProfile,
  getVendorStatus,
} from "../../services/api";
import { useLocation } from "../../context/LocationContext"; // Ensure this path is correct

// --- FullScreenLoader (UNCHANGED) ---
const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[9999] overflow-hidden">
    
    {/* A single container for all animated elements to control layering and positioning */}
    <div className="relative mb-2 flex justify-center items-center w-48 h-32">
      {/* ✨ MODIFIED: The streak container is now the same size as the logo */}
      <div className="absolute w-24 h-24 z-0">
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
      </div>

      {/* The Logo "car" (top layer) */}
      <img
        src="/supplylink-logo.png"
        alt="SupplyLink Logo"
        className="h-24 relative z-20 animate-logo-bob" 
      />
      
      {/* The scrolling road (middle layer, positioned below the main container) */}
      <div className="road-container absolute bottom-0 z-10">
        <div className="road-track">
          <div className="road-dash"></div>
          <div className="road-dash"></div>
          <div className="road-dash"></div>
          <div className="road-dash"></div>
          <div className="road-dash"></div>
          <div className="road-dash"></div>
          <div className="road-dash"></div>
          <div className="road-dash"></div>
        </div>
      </div>
    </div>

    {/* The rest of the loader content */}
    <div className="text-white text-3xl font-bold mt-2 mb-4 relative z-10">
      SupplyLink
    </div>
    <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden relative z-10">
      <div className="h-1 bg-blue-500 rounded-full animate-loader-progress"></div>
    </div>

    {/* All the animation styles are defined here */}
    <style>{`
      /* Logo "bob" animation */
      @keyframes logoBob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .animate-logo-bob {
        animation: logoBob 1.2s ease-in-out infinite;
      }

      /* Animation for the wind streaks */
      @keyframes windStream {
        0% { transform: translate(0, 0) scaleX(0.5); opacity: 1; }
        100% { transform: translate(-250px, var(--translate-y)) scaleX(1); opacity: 0; }
      }
      
      /* Style for a single streak of wind */
      .streak {
        position: absolute; width: 50px; height: 2px;
        background: linear-gradient(to left, transparent, rgba(139, 195, 255, 0.6));
        border-radius: 2px;
        opacity: 0;
        animation: windStream 1.2s ease-in infinite;
        transform-origin: left;
      }
      
      /* ✨ MODIFIED: Streaks now start from different points ON the car body */
      .streak:nth-child(1) { top: 30%; left: 70%; --translate-y: -8px; animation-delay: 0.1s; }
      .streak:nth-child(2) { top: 45%; left: 80%; --translate-y: 5px; animation-delay: 0.25s; height: 1px; }
      .streak:nth-child(3) { top: 60%; left: 75%; --translate-y: -5px; animation-delay: 0.4s; }
      .streak:nth-child(4) { top: 75%; left: 80%; --translate-y: 8px; animation-delay: 0.65s; height: 1px; }
      .streak:nth-child(5) { top: 55%; left: 70%; --translate-y: 0px; animation-delay: 0.8s; }
      .streak:nth-child(6) { top: 40%; left: 75%; --translate-y: -5px; animation-delay: 1s; }

      /* Animation and styles for the scrolling road */
      @keyframes moveRoad {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .road-container {
        width: 200px; height: 10px; overflow: hidden;
      }
      .road-track {
        width: 200%; height: 100%; display: flex; align-items: center;
        justify-content: space-around; animation: moveRoad 1s linear infinite;
      }
      .road-dash {
        height: 4px; background-color: rgba(255, 255, 255, 0.4); border-radius: 2px;
      }
      .road-dash:nth-child(odd) { width: 40px; }
      .road-dash:nth-child(even) { width: 20px; }

      /* Original progress bar animation */
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