import React, { useState } from "react";
import { apiCreateFactoryLocation } from "../../../services/api";
import FactoryLocation from "../FactoryLocation"; // Reusing the map component

const LocationStep = ({ factoryId, onComplete }) => {
  const [locationData, setLocationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ensure factoryId is included in the payload
      await apiCreateFactoryLocation({
        ...locationData,
        factory_id: factoryId,
      });
      onComplete();
    } catch (err) {
      setError(err.message || "Failed to save location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Pin Your Location
      </h3>
      <p className="text-gray-500 mb-6">
        Enter your address details or click on the map to set your business
        location.
      </p>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      <FactoryLocation
        formData={locationData}
        onFormDataChange={setLocationData}
        onLocationSet={handleLocationSubmit} // The button is inside FactoryLocation
      />
      {isLoading && (
        <p className="text-sm text-blue-600 mt-4">Saving location...</p>
      )}
    </div>
  );
};

export default LocationStep;
