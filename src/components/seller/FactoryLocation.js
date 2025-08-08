// src/components/seller/FactoryLocation.js
import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- 1. NEW: A custom hook to debounce a value ---
// This hook waits for the user to stop typing before returning the latest value.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Cancel the timeout if value changes (e.g., user is still typing)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const RecenterAutomatically = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  return null;
};

const LocationMarker = ({ position, onPositionChange, map }) => {
  useEffect(() => {
    const handleClick = (e) => onPositionChange(e.latlng);
    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, onPositionChange]);
  return position ? <Marker position={position}></Marker> : null;
};

const FactoryLocation = ({ formData, onFormDataChange, onLocationSet }) => {
  const [map, setMap] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const initialPosition = [22.5937, 88.3549]; // Howrah

  // --- 2. DEBOUNCE THE ADDRESS FIELDS ---
  // We create a single debounced value from all address fields.
  // The API call will only be triggered based on this value.
  const debouncedAddress = useDebounce(
    {
      address_line1: formData.address_line1,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
      country: formData.country,
    },
    1500
  ); // 1.5-second delay

  // Reverse Geocoding (Coordinates -> Address) - No major change needed here
  const getAddressFromCoordinates = useCallback(
    async (lat, lng) => {
      setIsGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          onFormDataChange({
            ...formData,
            latitude: lat,
            longitude: lng,
            address_line1: `${addr.road || ""}, ${addr.suburb || ""}`.trim(),
            address_line2: addr.neighbourhood || "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            postal_code: addr.postcode || "",
            country: addr.country || "",
          });
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setIsGeocoding(false);
      }
    },
    [formData, onFormDataChange]
  );

  // --- 3. REWRITTEN useEffect FOR FORWARD GEOCODING (Address -> Coordinates) ---
  useEffect(() => {
    const { address_line1, city, postal_code, country, state } =
      debouncedAddress;
    // Only search if essential fields from the debounced address are present
    if (city && postal_code && country) {
      const getCoordinates = async () => {
        setIsGeocoding(true);
        const query = `street=${encodeURIComponent(
          address_line1 || ""
        )}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(
          state
        )}&postalcode=${encodeURIComponent(
          postal_code
        )}&country=${encodeURIComponent(country)}&format=json&limit=1`;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${query}`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const newLat = parseFloat(lat);
            const newLon = parseFloat(lon);
            // Only update if the coordinates have actually changed
            if (newLat !== formData.latitude || newLon !== formData.longitude) {
              onFormDataChange({
                ...formData, // Start with current form data
                ...debouncedAddress, // Overwrite address fields
                latitude: newLat,
                longitude: newLon,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        } finally {
          setIsGeocoding(false);
        }
      };

      getCoordinates();
    }
    // This effect now correctly depends ONLY on the debounced address object
  }, [debouncedAddress, onFormDataChange, formData]);

  const handlePositionChange = (latlng) => {
    getAddressFromCoordinates(latlng.lat, latlng.lng);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  const currentPosition =
    formData.latitude && formData.longitude
      ? [formData.latitude, formData.longitude]
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Input Fields Column */}
      <div className="space-y-4">
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            name="address_line2"
            value={formData.address_line2 || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
          />
        </div>
        {isGeocoding && (
          <p className="text-sm text-blue-600 animate-pulse">
            Finding location on map...
          </p>
        )}
        <button
          onClick={onLocationSet}
          disabled={isGeocoding}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isGeocoding ? "Locating..." : "Confirm Location"}
        </button>
      </div>

      {/* Map Column */}
      <div className="h-96 md:h-full rounded-lg overflow-hidden z-0">
        <MapContainer
          center={initialPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {map && (
            <LocationMarker
              position={currentPosition}
              onPositionChange={handlePositionChange}
              map={map}
            />
          )}
          <RecenterAutomatically position={currentPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default FactoryLocation;
