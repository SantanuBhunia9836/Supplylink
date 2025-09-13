// src/utils/tokenManager.js

/**
 * Token Manager - Centralized token management utility
 * Handles token storage, retrieval, and persistence across sessions
 */

const TOKEN_KEY = 'authToken';
const USER_ROLE_KEY = 'userRole';
const COOKIE_EXPIRY_DAYS = 7;

class TokenManager {
  /**
   * Get token from localStorage or cookies
   */
  static getToken() {
    // First try localStorage
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
      return localToken;
    }
    
    // Then try cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === TOKEN_KEY || name === 'access_token' || name === 'token') {
        return value;
      }
    }
    
    return null;
  }

  /**
   * Set token in both localStorage and cookies
   */
  static setToken(token) {
    if (!token) {
      this.clearToken();
      return;
    }

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    
    // Store in cookies for cross-tab persistence
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
    document.cookie = `${TOKEN_KEY}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  /**
   * Clear all authentication data
   */
  static clearToken() {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    
    // Clear cookies
    const cookieNames = [TOKEN_KEY, 'access_token', 'token'];
    cookieNames.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  /**
   * Check if token exists and is valid
   */
  static hasValidToken() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired (if it's a JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      // If it's not a JWT token, assume it's valid
      return true;
    }
  }

  /**
   * Get user role from localStorage
   */
  static getUserRole() {
    return localStorage.getItem(USER_ROLE_KEY);
  }

  /**
   * Set user role in localStorage
   */
  static setUserRole(role) {
    localStorage.setItem(USER_ROLE_KEY, role);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    return this.hasValidToken();
  }

  /**
   * Get authentication headers for API requests
   */
  static getAuthHeaders() {
    const token = this.getToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Refresh token if needed
   */
  static async refreshToken() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://vend-sell.onrender.com'}/vendor/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refresh_token: token })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newToken = data.access_token || data.token;
        if (newToken) {
          this.setToken(newToken);
          return newToken;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    // If refresh failed, clear token
    this.clearToken();
    return null;
  }
}

export default TokenManager; 