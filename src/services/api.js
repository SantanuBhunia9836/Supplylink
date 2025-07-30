// src/services/api.js

/**
 * This file contains functions to interact with the live backend API.
 * It's designed to be universal, constructing API paths based on the user's role.
 */

// --- BASE API URL ---
// This is the only line you should need to change if the API server moves.
const API_BASE_URL = 'https://dummyjson.com/users';

// --- MOCK DATA (for features not yet connected to the backend) ---
const MOCK_PRODUCTS = [
    { id: 1, name: 'Onions', category: 'Vegetables', price: '₹30/kg' },
    { id: 2, name: 'Tomatoes', category: 'Vegetables', price: '₹40/kg' },
    { id: 3, name: 'Chicken Breast', category: 'Meat', price: '₹250/kg' },
];

/**
 * @description Registers a new user by calling the backend.
 * @param {object} registrationData - The full form data from the registration page.
 * @param {string} userRole - 'shop' or 'vendor'.
 * @returns {Promise<object>} The response from the backend.
 */
export const apiRegister = async (registrationData, userRole) => {
  // Universally construct the endpoint based on the selected role.
  const endpoint = `${API_BASE_URL}/${userRole}/create/`;
  
  // Map our frontend form names to the backend API's expected names.
  const payload = {
      name: registrationData.businessName,
      email: registrationData.email,
      password: registrationData.password,
      phone: registrationData.phone,
  };

  console.log(`API: Registering new ${userRole} at ${endpoint}`);
  console.log('Payload:', payload);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMessage = responseData.detail || responseData.message || `Registration failed. The server responded with status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return responseData;
};


/**
 * @description Logs in a user by calling the backend.
 * @param {object} credentials - { email, password, role }
 * @returns {Promise<object>} The user object, including the auth token.
 */
export const apiLogin = async ({ email, password, role }) => {
  // Universally construct the endpoint based on the selected role.
  const endpoint = `${API_BASE_URL}/${role}/login/`;
  
  // Map our frontend form names to the backend API's expected names.
  const payload = {
      username: email, // The API expects 'username', we are using the user's email.
      password: password,
  };

  console.log(`API: Logging in ${role} at ${endpoint}`);
  console.log('Payload:', payload);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const responseData = await response.json();

  if (!response.ok) {
    const errorMessage = responseData.detail || responseData.message || `Login failed. The server responded with status: ${response.status}`;
    throw new Error(errorMessage);
  }

  // We add the 'role' to the response data for use within the frontend.
  return { ...responseData, role };
};


/**
 * @description Fetches the profile of the currently logged-in user.
 * @param {string} token - The authentication token for the user.
 * @param {string} role - The role of the user, 'shop' or 'vendor'.
 * @returns {Promise<object>} The user's profile data.
 */
export const getProfile = async (token, role) => {
    // Universally construct the endpoint based on the user's role.
    const endpoint = `${API_BASE_URL}/${role}/profile/`;
    console.log(`API: Fetching profile from ${endpoint}`);

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the token for authorization
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile.');
    }

    return await response.json();
};

/**
 * @description Fetches all available products (using mock data for now).
 * @returns {Promise<Array<object>>} A list of product objects.
 */
export const getProducts = async () => {
    console.log("API: Fetching mock products...");
    // TODO: Replace with real API call when available.
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PRODUCTS), 500));
}

/**
 * @description Submits a new order (using mock data for now).
 * @param {Array<object>} items - The items in the order.
 * @param {string} userId - The ID of the user placing the order.
 * @returns {Promise<object>} A confirmation object.
 */
export const placeOrder = async (items, userId) => {
    console.log(`API: Placing mock order for user ${userId}`);
    // TODO: Replace with real API call when available.
    return new Promise(resolve => setTimeout(() => resolve({ success: true, orderId: `ORD-${Math.floor(Math.random() * 900) + 100}` }), 1000));
}
