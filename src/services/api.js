// src/services/api.js

/**
 * This file contains functions to interact with the live backend API.
 */

// --- BASE API URL ---
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vend-sell.onrender.com';

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
    { id: 1, name: 'Onions', category: 'Vegetables', price: '₹30/kg' },
    { id: 2, name: 'Tomatoes', category: 'Vegetables', price: '₹40/kg' },
    { id: 3, name: 'Chicken Breast', category: 'Meat', price: '₹250/kg' },
    { id: 4, name: 'Rice', category: 'Grains', price: '₹60/kg' },
    { id: 5, name: 'Cooking Oil', category: 'Oils', price: '₹120/liter' },
    { id: 6, name: 'Milk', category: 'Dairy', price: '₹60/liter' },
];

const MOCK_SHOP_DASHBOARD = {
    stats: { activeOrders: 3, pendingDeliveries: 1, monthlySpend: 4150 },
    recentOrders: [
        { id: 'ORD-001', date: '2024-01-15', status: 'Completed', total: 1250 },
        { id: 'ORD-002', date: '2024-01-14', status: 'Out for Delivery', total: 800 },
        { id: 'ORD-003', date: '2024-01-13', status: 'Pending', total: 2100 },
    ]
};

const MOCK_VENDOR_DASHBOARD = {
    stats: { newRequests: 2, deliveriesToday: 5, weeklyRevenue: 12500 },
    incomingRequests: [
        { id: 'REQ-101', shopName: 'Pizza Palace', items: ['Onions', 'Tomatoes'], distance: '1.2km' },
        { id: 'REQ-102', shopName: 'Curry Corner', items: ['Chicken Breast', 'Ginger', 'Garlic'], distance: '2.5km' },
    ]
};

// --- UTILITY FUNCTIONS ---
const handleApiError = (response, responseData) => {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    
    // Handle different response formats
    if (responseData) {
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (typeof responseData === 'object') {
        // Handle object responses
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (Array.isArray(responseData)) {
          errorMessage = responseData.join(', ');
        } else {
          // Try to extract error from object values
          const errorValues = Object.values(responseData).flat();
          if (errorValues.length > 0) {
            errorMessage = errorValues.join(', ');
          }
        }
      }
    }
    
    // Add status code context for debugging
    if (response.status === 422) {
      errorMessage = `Validation Error: ${errorMessage}`;
    } else if (response.status === 401) {
      errorMessage = `Authentication Error: ${errorMessage}`;
    } else if (response.status === 404) {
      errorMessage = `Not Found: ${errorMessage}`;
    } else {
      errorMessage = `Error (${response.status}): ${errorMessage}`;
    }
    
    throw new Error(errorMessage);
  }
  return responseData;
};

// Helper function to parse validation errors
const parseValidationErrors = (responseData) => {
  if (responseData && responseData.detail && Array.isArray(responseData.detail)) {
    const errors = responseData.detail.map(error => {
      if (error.loc && error.loc.length > 0) {
        return `${error.loc[error.loc.length - 1]}: ${error.msg}`;
      }
      return error.msg;
    });
    return errors.join(', ');
  }
  return 'Validation failed';
};

// --- AUTHENTICATION APIS ---

export const apiLogin = async ({ username, password, role }) => {
  if (role !== 'vendor') throw new Error('Sorry, Shop login is not yet available. Please log in as a Vendor.');
  
  const endpoint = `${API_BASE_URL}/${role}/login/`;
  
  // Use form-encoded data since that's the working format
  const formData = new URLSearchParams({
    grant_type: 'password',
    username: String(username),
    password: String(password),
    scope: '',
    client_id: '',
    client_secret: ''
  });
  
  try {
    const response = await fetch(endpoint, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }, 
      body: formData,
      credentials: "include"
    });
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      responseData = await response.text();
    }
    
    // If successful, return the result
    if (response.ok) {
      const result = handleApiError(response, responseData);
      return { ...result, role };
    }
    
    // Handle specific error cases
    if (response.status === 401) {
      throw new Error('Incorrect email or password. Please check your credentials.');
    } else if (response.status === 422) {
      const validationError = parseValidationErrors(responseData);
      throw new Error(`Validation Error: ${validationError}`);
    } else {
      const result = handleApiError(response, responseData);
      return { ...result, role };
    }
    
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const getProfile = async (token, role) => {
    if (role !== 'vendor') throw new Error('Cannot fetch profile: Invalid user role specified.');
    
    const endpoint = `${API_BASE_URL}/${role}/profile/`;
    
    try {
      const response = await fetch(endpoint, { 
        method: 'GET', 
        headers: { 
          'Content-Type': 'application/json', 
          
          // 'Authorization': `Bearer ${token}` 
        } ,
        credentials: "include"
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        responseData = await response.text();
      }
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch profile.';
        if (responseData) {
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (typeof responseData === 'object') {
            if (responseData.message) {
              errorMessage = responseData.message;
            } else if (responseData.error) {
              errorMessage = responseData.error;
            } else if (responseData.detail) {
              errorMessage = responseData.detail;
            } else {
              const errorValues = Object.values(responseData).flat();
              if (errorValues.length > 0) {
                errorMessage = errorValues.join(', ');
              }
            }
          }
        }
        throw new Error(errorMessage);
      }
      
      return responseData;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
};

export const apiLogout = async (token) => {
  const endpoint = `${API_BASE_URL}/vendor/logout`;
  
  try {
    const response = await fetch(endpoint, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    let responseData;
    try {
      responseData = await response.text(); // Return as string as specified
    } catch (parseError) {
      responseData = 'Logout successful';
    }
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// --- SELLER REGISTRATION API ---

export const apiSellerRegistration = async (sellerData) => {
  const endpoint = `${API_BASE_URL}/seller/create`;
  
  const payload = {
    email: String(sellerData.email),
    phone: String(sellerData.phone),
    id: parseInt(sellerData.id) || 0,
    vendor_id: parseInt(sellerData.vendor_id) || 0,
    created_at: new Date().toISOString(),
    factories: Array.isArray(sellerData.factories) ? sellerData.factories : [],
    products: Array.isArray(sellerData.products) ? sellerData.products : []
  };
  
  try {
    const response = await fetch(endpoint, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// --- NEW DASHBOARD APIS ---

/**
 * @description Fetches the dashboard summary data for a shop.
 * @returns {Promise<object>}
 */
export const getShopDashboardData = async () => {
    // TODO: Replace with a real API call when available.
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SHOP_DASHBOARD), 1000));
};

/**
 * @description Fetches the dashboard summary data for a vendor.
 * @returns {Promise<object>}
 */
export const getVendorDashboardData = async () => {
    // TODO: Replace with a real API call when available.
    return new Promise(resolve => setTimeout(() => resolve(MOCK_VENDOR_DASHBOARD), 1000));
};

// --- OTHER APIS ---

export const getProducts = async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PRODUCTS), 500));
}

export const placeOrder = async (items, userId) => {
    return new Promise(resolve => setTimeout(() => resolve({ 
      success: true, 
      orderId: `ORD-${Math.floor(Math.random() * 900) + 100}` 
    }), 1000));
}

// --- LOCATION API ---

export const apiCreateLocation = async (locationData) => {
  const endpoint = `${API_BASE_URL}/vendor/location/create`;
  
  const payload = {
    address_line1: String(locationData.address_line1),
    address_line2: String(locationData.address_line2 || ''),
    city: String(locationData.city),
    state: String(locationData.state),
    country: String(locationData.country),
    postal_code: String(locationData.postal_code),
    latitude: parseFloat(locationData.latitude) || 0,
    longitude: parseFloat(locationData.longitude) || 0
  };
  
  try {
    const response = await fetch(endpoint, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      responseData = await response.text();
    }
    
    if (!response.ok) {
      let errorMessage = 'Location creation failed';
      if (responseData) {
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (typeof responseData === 'object') {
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseData.detail) {
            errorMessage = responseData.detail;
          } else {
            const errorValues = Object.values(responseData).flat();
            if (errorValues.length > 0) {
              errorMessage = errorValues.join(', ');
            }
          }
        }
      }
      throw new Error(errorMessage);
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const searchSellers = async (latitude, longitude, filters = {}) => {
  const endpoint = `${API_BASE_URL}/seller/search`;
  
  try {
    const queryParams = new URLSearchParams();
    
    // Add filter parameters if provided
    if (filters.city) {
      queryParams.append('city', filters.city);
    }
    if (filters.sellerType) {
      queryParams.append('seller_type', filters.sellerType);
    }
    if (filters.range) {
      queryParams.append('range', filters.range);
    }
    
    const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: latitude,
        longtitude: longitude // Note: API uses 'longtitude' not 'longitude'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Search failed');
    }
    
    const responseData = await response.text(); // API returns string
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const getVendorProfile = async (token) => {
  const endpoint = `${API_BASE_URL}/vendor/profile`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch profile');
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const getSellerProducts = async (factoryId, sellerId = null) => {
  const endpoint = `${API_BASE_URL}/seller/products`;
  
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('factory_id', factoryId);
    if (sellerId) {
      queryParams.append('seller_id', sellerId);
    }
    
    const url = `${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch products');
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const getSellerProduct = async (productId) => {
  const endpoint = `${API_BASE_URL}/seller/products/${productId}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch product');
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
