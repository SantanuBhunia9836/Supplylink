// src/components/common/LocationModal.js
import React from "react";
import { useLocation } from "../../context/LocationContext";

const LocationModal = () => {
  const { locationError, locationLoading, getCurrentLocation } = useLocation();

  // Show modal only if there is an error
  if (!locationError) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Location Access Required
        </h3>
        <p className="text-gray-600 mb-4">
          We need your location to show you relevant local content. Please
          enable it in your browser settings.
        </p>
        {/* Display the specific error message from the context */}
        <p className="text-sm text-red-500 font-medium mb-4">{locationError}</p>
        <button
          onClick={getCurrentLocation} // Retry getting the location
          disabled={locationLoading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {locationLoading ? "Checking..." : "Retry"}
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
