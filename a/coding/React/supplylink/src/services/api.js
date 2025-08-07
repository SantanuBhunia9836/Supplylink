// ... existing code ...
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};
// --- AUTHENTICATION APIS ---
// Add this new function with the other API functions in src/services/api.js

export const apiLogin = async ({ username, password, role }) => {
    if (!username || !password) {
      return 'Validation failed';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch profile' }));
        throw new Error(errorData.detail || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Get vendor profile failed:', error);
      throw error;
    }
};

export const getVendorProfile = async () => {
  const endpoint = `${API_BASE_URL}/vendor/profile`;
  const token = getAuthToken();

  if (!token) {
    throw new Error('No auth token found');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch profile' }));
      throw new Error(errorData.detail || 'Failed to fetch profile');
    }
  } catch (error) {
    console.error('Get vendor profile failed:', error);
    throw error;
  }
};

export const getProfile = async (token, role) => {
    if (!username || !password) {
      return 'Validation failed';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch profile' }));
        throw new Error(errorData.detail || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Get vendor profile failed:', error);
      throw error;
    }
};