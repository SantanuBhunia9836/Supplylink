// src/components/common/LocationPanel.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiCreateVendorLocation } from '../../services/api';

// --- LEAFLET ICON FIX ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- MAP HELPER COMPONENTS ---
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
  return position === null ? null : <Marker position={position}></Marker>;
};

// --- MAIN LOCATION PANEL COMPONENT ---
const LocationPanel = ({ isOpen, onClose, onSuccess, apiSubmitFunction }) => {
  const [formData, setFormData] = useState({
    address_line1: '', address_line2: '', city: '', state: '',
    country: '', postal_code: '', latitude: '', longitude: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.address) {
            const addr = data.address;
            setFormData({
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

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setShowMap(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
          getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
          setIsGettingLocation(false);
        },
        () => {
          setErrors({ location: 'Unable to retrieve your location.' });
          setIsGettingLocation(false);
        }
    );
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.address_line1) newErrors.address_line1 = "Address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.postal_code) newErrors.postal_code = "Postal code is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.latitude || !formData.longitude) newErrors.form = "Please select a location on the map or use your current location.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submissionFunction = apiSubmitFunction || apiCreateVendorLocation;
      const result = await submissionFunction(formData);
      if (onSuccess) {
          onSuccess(result);
      } else {
          alert("Location saved successfully!");
          onClose();
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentPosition = formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Set Your Location</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className={`grid gap-8 transition-all duration-500 ease-in-out ${showMap ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
            <div className={`space-y-4 transition-transform duration-500 ${showMap ? '' : 'md:col-span-1'}`}>
                <div className="space-y-2">
                    <button type="button" onClick={getCurrentLocation} disabled={isGettingLocation} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                        {isGettingLocation ? 'Getting...' : 'Use My Current Location'}
                    </button>
                    <button type="button" onClick={() => setShowMap(!showMap)} className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300">
                        {showMap ? 'Hide Map' : 'Point on Map'}
                    </button>
                </div>
                
                <input type="text" name="address_line1" placeholder="Address Line 1 *" value={formData.address_line1} onChange={handleInputChange} required className="w-full p-3 border rounded-lg"/>
                <input type="text" name="address_line2" placeholder="Address Line 2" value={formData.address_line2 || ''} onChange={handleInputChange} className="w-full p-3 border rounded-lg"/>
                <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleInputChange} required className="w-full p-3 border rounded-lg"/>
                <input type="text" name="state" placeholder="State *" value={formData.state} onChange={handleInputChange} required className="w-full p-3 border rounded-lg"/>
                <input type="text" name="postal_code" placeholder="Postal Code *" value={formData.postal_code} onChange={handleInputChange} required className="w-full p-3 border rounded-lg"/>
                <input type="text" name="country" placeholder="Country *" value={formData.country} onChange={handleInputChange} required className="w-full p-3 border rounded-lg"/>
                {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
            </div>

            {showMap && (
                <div className="h-96 md:h-full rounded-lg overflow-hidden z-0 border">
                    <MapContainer center={[22.5726, 88.3639]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker position={currentPosition} onPositionChange={(latlng) => getAddressFromCoordinates(latlng.lat, latlng.lng)} />
                        <RecenterAutomatically position={currentPosition} />
                    </MapContainer>
                </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isSubmitting ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPanel;
