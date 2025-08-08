// src/services/api.js

/**
 * This file contains functions to interact with the live backend API.
 * This version relies solely on backend-managed session cookies for authentication.
 */

// --- BASE API URL ---
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://vend-sell.onrender.com";

// --- MOCK DATA (for functions without live endpoints yet) ---
const MOCK_PRODUCTS = [
  { id: 1, name: "Onions", category: "Vegetables", price: "₹30/kg" },
  { id: 2, name: "Tomatoes", category: "Vegetables", price: "₹40/kg" },
  { id: 3, name: "Chicken Breast", category: "Meat", price: "₹250/kg" },
];

const MOCK_SHOP_DASHBOARD = {
  stats: { activeOrders: 3, pendingDeliveries: 1, monthlySpend: 4150 },
  recentOrders: [
    { id: "ORD-001", date: "2024-01-15", status: "Completed", total: 1250 },
    {
      id: "ORD-002",
      date: "2024-01-14",
      status: "Out for Delivery",
      total: 800,
    },
  ],
};

// --- UTILITY FUNCTIONS ---
const handleApiError = (response, responseData) => {
  if (!response.ok) {
    let errorMessage = "Request failed";

    if (responseData) {
      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (typeof responseData === "object") {
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.detail) {
          if (typeof responseData.detail === "object") {
            errorMessage = `Validation Error: ${JSON.stringify(
              responseData.detail
            )}`;
          } else {
            errorMessage = responseData.detail;
          }
        } else if (Array.isArray(responseData)) {
          errorMessage = responseData.join(", ");
        } else {
          const errorValues = Object.values(responseData).flat();
          if (errorValues.length > 0) {
            errorMessage = errorValues.join(", ");
          }
        }
      }
    }

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

// --- AUTHENTICATION APIS ---
export const apiVendorRegister = async (registrationData) => {
  const endpoint = `${API_BASE_URL}/vendor/create`;

  const payload = {
    name: String(registrationData.name),
    email: String(registrationData.email),
    password: String(registrationData.password),
  };

  // Handle phone number logic for Google Sign-In
  if (registrationData.phone) {
    payload.phone = String(registrationData.phone);
  } else if (registrationData.password.startsWith("google_sub_")) {
    payload.phone = "0000000000";
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // For Google sign-in, we accept a 422/400 error if the user already exists.
    // The subsequent login call will handle authentication.
    if (!response.ok && ![422, 400].includes(response.status)) {
      const responseData = await response.json();
      let errorMessage = "Registration failed";
      if (responseData && responseData.detail) {
        if (Array.isArray(responseData.detail)) {
          errorMessage = responseData.detail
            .map((err) => `${err.loc[1]}: ${err.msg}`)
            .join(", ");
        } else {
          errorMessage = responseData.detail;
        }
      } else if (responseData && responseData.message) {
        errorMessage = responseData.message;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("Network error. Please check your connection.");
    }
    // Don't re-throw for existing user errors during Google sign-up
    if (error.message.includes("already exists")) {
      return;
    }
    throw error;
  }
};

export const getVendorStatus = async () => {
  const endpoint = `${API_BASE_URL}/vendor/vendor-status`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include", // This sends the session cookie
    });
    if (response.ok) {
      return await response.json();
    } else {
      return { is_login: false, is_seller: false };
    }
  } catch (error) {
    console.error("🚨 Vendor status check failed:", error);
    return { is_login: false, is_seller: false };
  }
};

export const apiLogin = async ({ username, password, role }) => {
  if (role !== "vendor")
    throw new Error(
      "Sorry, Shop login is not yet available. Please log in as a Vendor."
    );
  const endpoint = `${API_BASE_URL}/${role}/login/`;
  try {
    const formData = new URLSearchParams({
      grant_type: "password",
      username: String(username),
      password: String(password),
      scope: "",
      client_id: "",
      client_secret: "",
    });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData,
      credentials: "include", // Important for the backend to be able to set the cookie
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Login failed:", error);
    throw error;
  }
};

export const apiGoogleLogin = async (authCode) => {
  // The new endpoint for handling Google OAuth
  const endpoint = `${API_BASE_URL}/vendor/oauth/login`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // The backend expects an object with the authorization code from Google
      body: JSON.stringify({ code: authCode }),
      credentials: "include", // Important for the backend to set the session cookie
    });
    const responseData = await response.json();
    // Use the existing error handler
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Google login failed:", error);
    throw error;
  }
};

export const apiLogout = async () => {
  const endpoint = `${API_BASE_URL}/vendor/logout`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Sends the cookie to be cleared
    });
    return "Logout successful";
  } catch (error) {
    console.error(
      "🚨 Logout failed but proceeding with frontend state clearing.",
      error
    );
    // We don't re-throw the error, allowing frontend logout to complete regardless.
  }
};

export const getVendorProfile = async () => {
  const endpoint = `${API_BASE_URL}/vendor/profile`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Sends the session cookie for authentication
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    throw error;
  }
};

// --- NEW FUNCTION TO GET SELLER-SPECIFIC PROFILE ---
export const getSellerProfile = async () => {
  const endpoint = `${API_BASE_URL}/seller/profile`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Sends the session cookie for authentication
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    throw error;
  }
};

// --- VENDOR LOCATION API ---
export const apiCreateVendorLocation = async (locationData) => {
  const endpoint = `${API_BASE_URL}/vendor/location/create/`;
  const payload = {
    ...locationData,
    latitude: parseFloat(locationData.latitude) || 0,
    longitude: parseFloat(locationData.longitude) || 0,
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    throw error;
  }
};

// --- SELLER APIS ---

export const searchSellers = async (latitude, longitude, filters = {}) => {
  const endpoint = `${API_BASE_URL}/seller/search`;
  try {
    const payload = {
      latitude: latitude,
      longtitude: longitude,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = responseText;
      }
      return handleApiError(response, errorData);
    }

    const responseData = JSON.parse(responseText);
    return responseData;
  } catch (error) {
    console.error("🚨 Seller search failed:", error);
    throw error;
  }
};

export const getSellerDetails = async (sellerId) => {
  const endpoint = `${API_BASE_URL}/seller/profile/${sellerId}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Failed to fetch seller details:", error);
    throw error;
  }
};

export const getSellerProductsList = async (sellerId) => {
  const endpoint = `${API_BASE_URL}/seller/products-list?seller_id=${sellerId}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Failed to fetch seller products:", error);
    throw error;
  }
};

// --- NEWLY ADDED FUNCTIONS TO FIX ERRORS ---
export const getSellerProducts = async (sellerId, factoryId) => {
  const endpoint = `${API_BASE_URL}/seller/products?seller_id=${sellerId}&factory_id=${factoryId}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Failed to fetch seller products by factory:", error);
    throw error;
  }
};

export const getProductDetails = async (productId) => {
  const endpoint = `${API_BASE_URL}/seller/products/${productId}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Failed to fetch product details:", error);
    throw error;
  }
};
// --- END OF NEWLY ADDED FUNCTIONS ---

export const apiCreateSeller = async (sellerData) => {
  const endpoint = `${API_BASE_URL}/seller/create/`;
  const payload = {
    email: String(sellerData.email),
    phone: String(sellerData.phone),
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    throw error;
  }
};

export const apiCreateFactory = async (factoryData) => {
  const endpoint = `${API_BASE_URL}/seller/factories`;
  const payload = {
    seller_id: parseInt(factoryData.seller_id),
    name: String(factoryData.name),
    factory_type: String(factoryData.factory_type),
    contact_number: String(factoryData.contact_number),
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    throw error;
  }
};

export const apiCreateFactoryLocation = async (locationData) => {
  const endpoint = `${API_BASE_URL}/seller/factories/locations/`;
  const payload = {
    factory_id: parseInt(locationData.factory_id),
    address_line1: String(locationData.address_line1),
    address_line2: String(locationData.address_line2 || ""),
    city: String(locationData.city),
    state: String(locationData.state),
    country: String(locationData.country),
    postal_code: String(locationData.postal_code),
    latitude: parseFloat(locationData.latitude) || 0,
    longitude: parseFloat(locationData.longitude) || 0,
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    throw error;
  }
};

export const apiCreateProducts = async (products) => {
  const endpoint = `${API_BASE_URL}/seller/products/create/`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
      credentials: "include",
    });
    const responseData = await response.json();
    return handleApiError(response, responseData);
  } catch (error) {
    console.error("🚨 Product creation failed:", error);
    throw error;
  }
};

// --- MOCK FUNCTIONS TO FIX COMPILATION ERRORS ---

export const getShopDashboardData = async () => {
  console.log("Mocked getShopDashboardData");
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_SHOP_DASHBOARD), 500)
  );
};

export const testApiConnection = async () => {
  console.log("Mocked testApiConnection");
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          status: "ok",
          message: "Mock API connection is successful.",
        }),
      500
    )
  );
};

export const getProducts = async () => {
  console.log("Mocked getProducts");
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_PRODUCTS), 500)
  );
};

export const placeOrder = async (items) => {
  console.log("Mocked placeOrder:", items);
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ success: true, orderId: `MOCK-ORD-${Date.now()}` }),
      500
    )
  );
};
