// src/components/seller/FactoryLocation.js
import React, { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";

// --- Fix for default marker icon issue ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapViewUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const FactoryLocation = ({ formData, onFormDataChange, onLocationSet }) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const [isApiCoolingDown, setIsApiCoolingDown] = useState(false);

  const currentPosition =
    formData.latitude && formData.longitude
      ? [formData.latitude, formData.longitude]
      : null;

  const [mapCenter, setMapCenter] = useState(
    currentPosition || [22.5937, 88.3549]
  );

  // --- MODIFIED: The cooldown timer now precisely reflects the official policy ---
  const startApiCooldown = () => {
    setIsApiCoolingDown(true);
    setTimeout(() => {
      setIsApiCoolingDown(false);
    }, 5000); // Safely comply with the 1 req/sec limit (1000ms + 100ms buffer)
  };

  const getAddressFromCoordinates = useCallback(
    async (lat, lng) => {
      if (isApiCoolingDown) return;
      setIsGeocoding(true);
      setGeocodingError(null);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        if (!response.ok) throw new Error(`Network error (${response.status})`);
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          onFormDataChange({
            ...formData,
            latitude: lat,
            longitude: lng,
            address_line1:
              `${addr.road || ""}${addr.road && addr.suburb ? ", " : ""}${
                addr.suburb || ""
              }`.trim() || data.display_name.split(",")[0],
            address_line2: addr.neighbourhood || "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            postal_code: addr.postcode || "",
            country: addr.country || "",
          });
          toast.success("Address updated from map location.");
        } else {
          setGeocodingError(
            "Could not find a valid address for this location."
          );
        }
      } catch (error) {
        setGeocodingError(`Failed to fetch address: ${error.message}`);
      } finally {
        setIsGeocoding(false);
        startApiCooldown();
      }
    },
    [formData, onFormDataChange, isApiCoolingDown]
  );

  const handleForwardGeocode = async () => {
    if (isApiCoolingDown) return;
    const { address_line1, city, state, postal_code, country } = formData;
    if (!city || !country) {
      toast.warn("Please provide at least a City and Country to search.");
      return;
    }
    setIsGeocoding(true);
    setGeocodingError(null);
    const addressString = [address_line1, city, state, postal_code, country]
      .filter(Boolean)
      .join(", ");
    const query = `q=${encodeURIComponent(addressString)}&format=json&limit=1`;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${query}`
      );
      if (!response.ok) throw new Error(`Network error (${response.status})`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        onFormDataChange({
          ...formData,
          latitude: newPosition[0],
          longitude: newPosition[1],
        });
        setMapCenter(newPosition);
      } else {
        setGeocodingError(
          "Address not found. Please check your details and try again."
        );
      }
    } catch (error) {
      setGeocodingError(`Failed to fetch coordinates: ${error.message}`);
    } finally {
      setIsGeocoding(false);
      startApiCooldown();
    }
  };

  const handleMapClick = (latlng) => {
    onFormDataChange((prevData) => ({
      ...prevData,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
    toast.info(
      "Map pin updated. Click 'Get Address from Map Pin' to update fields."
    );
  };

  const handleGetAddressFromPin = () => {
    if (currentPosition) {
      getAddressFromCoordinates(currentPosition[0], currentPosition[1]);
    } else {
      toast.warn("Please select a location on the map first.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  const isButtonDisabled = isGeocoding || isApiCoolingDown;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        {geocodingError && (
          <div className="p-3 bg-red-100 text-red-800 border border-red-300 rounded-md text-sm">
            <p className="font-bold">Location Error</p>
            <p>{geocodingError}</p>
          </div>
        )}
        {isApiCoolingDown && (
          <div className="p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md text-sm">
            Please wait a moment before making another request.
          </div>
        )}
        {/* Input fields and buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address Line 1*
          </label>
          <input
            type="text"
            name="address_line1"
            value={formData.address_line1 || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City*
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State*
          </label>
          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code*
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country*
          </label>
          <input
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleForwardGeocode}
          disabled={isButtonDisabled}
          className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGeocoding ? "Searching..." : "Find on Map"}
        </button>

        <button
          type="button"
          onClick={handleGetAddressFromPin}
          disabled={isButtonDisabled || !currentPosition}
          className="w-full bg-gray-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGeocoding ? "Locating..." : "Get Address from Map Pin"}
        </button>

        <button
          onClick={onLocationSet}
          disabled={isButtonDisabled || !currentPosition}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isGeocoding
            ? "Please wait..."
            : isApiCoolingDown
            ? "Cooling down..."
            : "Confirm & Save Location"}
        </button>
      </div>

      <div className="h-96 md:h-full rounded-lg overflow-hidden z-0 shadow-lg border">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {currentPosition && <Marker position={currentPosition}></Marker>}
          <MapViewUpdater center={mapCenter} />
        </MapContainer>
      </div>
    </div>
  );
};

export default FactoryLocation;
