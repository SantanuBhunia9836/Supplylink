// src/components/common/LocationPanel.js
import React, { useState } from 'react';
import { apiCreateLocation } from '../../services/api';

const LocationPanel = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const clearLocation = () => {
    setFormData(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
    setErrors(prev => ({ ...prev, location: null }));
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setErrors({});

    if (!navigator.geolocation) {
      setErrors({ location: 'Geolocation is not supported by this browser.' });
      setIsGettingLocation(false);
      return;
    }

    // First attempt with high accuracy and shorter timeout
    const getLocationWithOptions = (options, attemptNumber = 1) => {
      const timeoutId = setTimeout(() => {
        if (attemptNumber < 3) {
          console.log(`Location attempt ${attemptNumber} timed out, trying with different options...`);
          // Try with different options for subsequent attempts
          const fallbackOptions = {
            enableHighAccuracy: false,
            timeout: 15000, // 15 seconds
            maximumAge: 60000 // 1 minute cache
          };
          getLocationWithOptions(fallbackOptions, attemptNumber + 1);
        } else {
          setErrors({ 
            location: 'Unable to get location after multiple attempts. Please check your internet connection and location permissions, or enter your address manually.' 
          });
          setIsGettingLocation(false);
        }
      }, options.timeout + 1000); // Add 1 second buffer

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          
          // Set coordinates first
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          
          console.log('Location obtained:', { latitude, longitude });
          
          // Now get address details using reverse geocoding
          setIsLookingUpAddress(true);
          setGeocodingStatus('');
          try {
            const address = await getAddressFromCoordinates(latitude, longitude);
            if (address) {
              setFormData(prev => ({
                ...prev,
                address_line1: address.street || '',
                city: address.city || '',
                state: address.state || '',
                country: address.country || '',
                postal_code: address.postal_code || ''
              }));
              console.log('Address obtained:', address);
            } else {
              console.log('No address data available, but coordinates are saved');
            }
          } catch (error) {
            console.log('Could not get address details, but coordinates are available');
          } finally {
            setIsLookingUpAddress(false);
          }
          
          setIsGettingLocation(false);
        },
        (error) => {
          clearTimeout(timeoutId);
          let errorMessage = 'Failed to get location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings and refresh the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your internet connection and try again.';
              break;
            case error.TIMEOUT:
              if (attemptNumber < 3) {
                console.log(`Timeout on attempt ${attemptNumber}, retrying...`);
                // Try again with different options
                const fallbackOptions = {
                  enableHighAccuracy: false,
                  timeout: 10000, // 10 seconds for final attempt
                  maximumAge: 300000 // 5 minutes cache
                };
                getLocationWithOptions(fallbackOptions, attemptNumber + 1);
                return;
              } else {
                errorMessage = 'Location request timed out after multiple attempts. Please check your internet connection or enter your address manually.';
              }
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location. Please try again or enter your address manually.';
          }
          
          setErrors({ location: errorMessage });
          setIsGettingLocation(false);
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true, // Start with high accuracy
          timeout: 20000, // 20 seconds for first attempt
          maximumAge: 300000 // 5 minutes cache
        }
      );
    };

    getLocationWithOptions({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 300000
    });
  };

  // Function to get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      console.log('Starting reverse geocoding for:', { latitude, longitude });
      
      // Try multiple geocoding services for better coverage
      const address = await tryMultipleGeocodingServices(latitude, longitude);
      
      if (address) {
        console.log('Address obtained:', address);
        return address;
      } else {
        console.log('No address data available from any service');
        return null;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  // Try multiple geocoding services
  const tryMultipleGeocodingServices = async (latitude, longitude) => {
    const services = [
      { name: 'Nominatim', fn: () => tryNominatim(latitude, longitude) },
      { name: 'Fallback', fn: () => tryFallbackGeocoding(latitude, longitude) },
      { name: 'Google', fn: () => tryGoogleGeocoding(latitude, longitude) },
      { name: 'LocationIQ', fn: () => tryLocationIQ(latitude, longitude) }
    ];

    for (let i = 0; i < services.length; i++) {
      try {
        const serviceName = services[i].name;
        console.log(`Trying geocoding service ${i + 1} (${serviceName})...`);
        setGeocodingStatus(`Trying ${serviceName}...`);
        
        const address = await services[i].fn();
        if (address && (address.street || address.city || address.country)) {
          console.log(`${serviceName} returned address:`, address);
          setGeocodingStatus(`✓ ${serviceName} succeeded`);
          return address;
        } else {
          console.log(`${serviceName} returned no valid address data`);
          setGeocodingStatus(`✗ ${serviceName} - no address data`);
        }
      } catch (error) {
        console.log(`Service ${i + 1} failed:`, error.message);
        setGeocodingStatus(`✗ Service ${i + 1} failed: ${error.message}`);
      }
    }
    setGeocodingStatus('All services failed');
    return null;
  };

  // Nominatim (OpenStreetMap) - Free, no API key
  const tryNominatim = async (latitude, longitude) => {
    try {
      console.log('Trying Nominatim service...');
      
      // Try with CORS proxy if direct request fails
      const urls = [
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en&zoom=18`,
        `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en&zoom=18`
      ];
      
      for (let i = 0; i < urls.length; i++) {
        try {
          console.log(`Trying Nominatim with URL ${i + 1}:`, urls[i]);
          
          const response = await fetch(urls[i], {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'SupplyLink-App/1.0'
            },
            mode: 'cors'
          });
          
          if (!response.ok) {
            console.error('Nominatim response not ok:', response.status, response.statusText);
            if (i === urls.length - 1) {
              throw new Error(`Nominatim request failed: ${response.status} ${response.statusText}`);
            }
            continue; // Try next URL
          }
          
          const data = await response.json();
          console.log('Nominatim raw response:', data);
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          const address = data.address || {};
          const result = {
            street: address.road ? `${address.house_number || ''} ${address.road}`.trim() : '',
            city: address.city || address.town || address.village || address.suburb || '',
            state: address.state || address.province || address.county || '',
            country: address.country || '',
            postal_code: address.postcode || ''
          };
          
          console.log('Nominatim parsed address:', result);
          return result;
        } catch (error) {
          console.error(`Nominatim attempt ${i + 1} failed:`, error);
          if (i === urls.length - 1) {
            throw error;
          }
          // Continue to next URL
        }
      }
    } catch (error) {
      console.error('Nominatim service error:', error);
      throw error;
    }
  };

  // Google Geocoding API (requires API key, but we'll try without)
  const tryGoogleGeocoding = async (latitude, longitude) => {
    // Note: This would require a Google API key in production
    // For now, we'll skip this service
    throw new Error('Google Geocoding requires API key');
  };

  // LocationIQ (free tier available)
  const tryLocationIQ = async (latitude, longitude) => {
    // Note: This would require an API key
    // For now, we'll skip this service
    throw new Error('LocationIQ requires API key');
  };

  // Fallback service using a simple reverse geocoding API
  const tryFallbackGeocoding = async (latitude, longitude) => {
    try {
      console.log('Trying fallback geocoding service...');
      
      // Using a simple reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors'
        }
      );
      
      if (!response.ok) {
        throw new Error(`Fallback service failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fallback service response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return {
        street: data.street || data.locality || '',
        city: data.city || data.locality || '',
        state: data.principalSubdivision || data.administrativeArea || '',
        country: data.countryName || '',
        postal_code: data.postcode || ''
      };
    } catch (error) {
      console.error('Fallback geocoding service error:', error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.address_line1) {
      newErrors.address_line1 = 'Address is required.';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required.';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required.';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required.';
    }
    
    if (!formData.postal_code) {
      newErrors.postal_code = 'Postal code is required.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});
      
      try {
        const result = await apiCreateLocation(formData);
        console.log("Location creation successful!", result);
        alert("Location saved successfully!");
        onSuccess && onSuccess(result);
        onClose();
      } catch (error) {
        console.error("Location creation error:", error);
        setErrors({ form: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Add Your Location</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>
          <p className="text-gray-600 mt-2">Set your business location for better service delivery</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Access Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800">Get Current Location</h3>
                                     <p className="text-sm text-blue-600 mt-1">
                     Allow location access to automatically fill coordinates and address details
                   </p>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                                     {isGettingLocation ? (
                     <div className="flex items-center">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                       Getting Location & Address...
                     </div>
                   ) : 'Get Location'}
                </button>
              </div>
              {errors.location && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 mb-2">{errors.location}</p>
                                     <div className="text-xs text-gray-600 space-y-1">
                     <p>• Check that location services are enabled in your browser</p>
                     <p>• Ensure you have a stable internet connection</p>
                     <p>• Try refreshing the page and allowing location access</p>
                     <p>• Address lookup requires internet connection</p>
                     <p>• You can still manually enter your address below</p>
                   </div>
                </div>
              )}
                             {formData.latitude && formData.longitude && (
                 <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                   <p className="text-sm text-green-700">
                     ✓ Location obtained: {formData.latitude}, {formData.longitude}
                   </p>
                   {isLookingUpAddress && (
                     <div className="text-xs text-blue-600 mt-1">
                       <p>🔍 Looking up address details...</p>
                       {geocodingStatus && (
                         <p className="text-xs text-gray-600 mt-1">{geocodingStatus}</p>
                       )}
                     </div>
                   )}
                   {!isLookingUpAddress && formData.address_line1 && (
                     <p className="text-xs text-green-600 mt-1">
                       ✓ Address details filled automatically
                     </p>
                   )}
                   {!isLookingUpAddress && !formData.address_line1 && (
                     <div className="mt-2">
                       <p className="text-xs text-orange-600 mb-1">
                         ⚠️ Address details not available automatically
                       </p>
                       <div className="space-y-2">
                         <button
                           type="button"
                           onClick={async () => {
                             setIsLookingUpAddress(true);
                             try {
                               const address = await getAddressFromCoordinates(formData.latitude, formData.longitude);
                               if (address) {
                                 setFormData(prev => ({
                                   ...prev,
                                   address_line1: address.street || '',
                                   city: address.city || '',
                                   state: address.state || '',
                                   country: address.country || '',
                                   postal_code: address.postal_code || ''
                                 }));
                               }
                             } catch (error) {
                               console.log('Manual address lookup failed:', error);
                             } finally {
                               setIsLookingUpAddress(false);
                             }
                           }}
                           className="text-xs text-blue-600 hover:text-blue-800 underline"
                         >
                           Try again to get address
                         </button>
                         <button
                           type="button"
                           onClick={async () => {
                             console.log('Testing reverse geocoding with sample coordinates...');
                             const testLat = 40.7128;
                             const testLon = -74.0060;
                             try {
                               const address = await getAddressFromCoordinates(testLat, testLon);
                               console.log('Test result:', address);
                               alert(`Test completed. Check console for details. Address: ${JSON.stringify(address)}`);
                             } catch (error) {
                               console.error('Test failed:', error);
                               alert(`Test failed: ${error.message}`);
                             }
                           }}
                           className="text-xs text-green-600 hover:text-green-800 underline ml-2"
                         >
                           Test with sample coordinates
                         </button>
                       </div>
                     </div>
                   )}
                 </div>
               )}
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  id="address_line1"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  placeholder="Street address, P.O. box, company name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address_line1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address_line1 && <p className="mt-1 text-sm text-red-600">{errors.address_line1}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="address_line2"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State or Province"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Postal code"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.postal_code ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
              </div>
            </div>

            {/* Coordinates */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Coordinates</h3>
                {formData.latitude && formData.longitude && (
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Clear coordinates
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.form}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationPanel; 