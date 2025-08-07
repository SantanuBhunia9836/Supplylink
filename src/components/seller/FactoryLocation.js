// src/components/seller/FactoryLocation.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// This component will recenter the map when the position changes
const RecenterAutomatically = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);
    return null;
};

const LocationMarker = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const FactoryLocation = ({ formData, onFormDataChange, onLocationSet }) => {
  const initialPosition = [22.5726, 88.3639]; // Default to Kolkata

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.address) {
            const addr = data.address;
            onFormDataChange({
                ...formData,
                latitude: lat,
                longitude: lng,
                address_line1: `${addr.road || ''}, ${addr.suburb || ''}`,
                address_line2: addr.neighbourhood || '',
                city: addr.city || addr.town || addr.village || '',
                state: addr.state || '',
                postal_code: addr.postcode || '',
                country: addr.country || '',
            });
        }
    } catch (error) {
        console.error("Error fetching address from coordinates:", error);
    }
  };


  const handlePositionChange = (latlng) => {
    getAddressFromCoordinates(latlng.lat, latlng.lng);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
  };
  
  const currentPosition = formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Input Fields Column */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Line 1*</label>
          <input type="text" name="address_line1" value={formData.address_line1} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
          {/* FIX: Ensure the value is never undefined to prevent the controlled/uncontrolled warning */}
          <input type="text" name="address_line2" value={formData.address_line2 || ''} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City*</label>
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State*</label>
          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code*</label>
          <input type="text" name="postal_code" value={formData.postal_code} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country*</label>
          <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <button onClick={onLocationSet} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Confirm Location
        </button>
      </div>

      {/* Map Column */}
      <div className="h-96 md:h-full rounded-lg overflow-hidden z-0">
        <MapContainer center={initialPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker 
            position={currentPosition}
            onPositionChange={handlePositionChange}
          />
          <RecenterAutomatically position={currentPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default FactoryLocation;
