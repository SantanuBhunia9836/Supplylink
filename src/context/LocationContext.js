// src/context/LocationContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

export const LocationContext = createContext();

// Reverse geocoding function to get city from coordinates
const getCityFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    if (!response.ok) throw new Error("Reverse geocoding failed");
    const data = await response.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      "Unknown Area"
    );
  } catch (error) {
    console.error("Could not fetch city name:", error);
    return "Unknown Area";
  }
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Fetches location using the browser's geolocation API
  const getCurrentLocation = useCallback(() => {
    if (locationLoading) return;

    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
      return;
    }

    const onSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      const city = await getCityFromCoords(latitude, longitude);

      const newLocation = { latitude, longitude, city };
      setLocation(newLocation);
      setLocationLoading(false);
    };

    const onError = (error) => {
      let errorMessage = "An unknown error occurred.";
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage =
          "Location access denied. Please enable it in your browser settings to find nearby sellers.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "Location information is currently unavailable.";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "Location request timed out.";
      }
      setLocationError(errorMessage);
      setLocationLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  }, [locationLoading]);

  // --- NEW FUNCTION ---
  // Manually updates the location in the context based on form data.
  // This will trigger any component using the `location` state to update.
  const updateLocation = useCallback(async (newLocationData) => {
    setLocationLoading(true);
    const city = await getCityFromCoords(
      newLocationData.latitude,
      newLocationData.longitude
    );
    setLocation({
      latitude: newLocationData.latitude,
      longitude: newLocationData.longitude,
      city: city,
    });
    setLocationLoading(false);
  }, []);

  const value = {
    location,
    locationLoading,
    locationError,
    getCurrentLocation,
    // --- FIX: Expose the new function through the context ---
    updateLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
