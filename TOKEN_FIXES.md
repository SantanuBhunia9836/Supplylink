# Token and Cookie Storage Fixes

## 🔍 Issues Identified

1. **Token Storage Issue**: Tokens were only stored in `localStorage` but not properly synchronized with cookies
2. **Cookie Handling**: Backend was setting cookies, but frontend wasn't properly handling them
3. **Token Persistence**: On page refresh or new tab, tokens weren't properly retrieved
4. **Session Validation**: The `validateSession` function only checked `localStorage` but didn't check for cookies
5. **Cross-tab Persistence**: Tokens weren't shared across browser tabs

## ✅ Solutions Implemented

### 1. Enhanced Token Management (`src/utils/tokenManager.js`)

Created a centralized `TokenManager` class that handles:

- **Dual Storage**: Tokens stored in both `localStorage` and cookies
- **Cross-tab Persistence**: Cookies ensure tokens persist across browser tabs
- **Automatic Fallback**: Falls back to cookies if `localStorage` is empty
- **Token Validation**: Checks if JWT tokens are expired
- **Cleanup**: Properly clears all authentication data

```javascript
// Key methods:
TokenManager.getToken(); // Get token from localStorage or cookies
TokenManager.setToken(token); // Store token in both localStorage and cookies
TokenManager.clearToken(); // Clear all authentication data
TokenManager.hasValidToken(); // Check if token exists and is valid
TokenManager.isAuthenticated(); // Check if user is authenticated
```

### 2. Updated Authentication Context (`src/context/AuthContext.js`)

Enhanced the `AuthContext` to:

- **Use TokenManager**: Leverage the centralized token management
- **Improved Initialization**: Check both localStorage and cookies on app start
- **Better Session Validation**: Properly validate sessions using TokenManager
- **Consistent Token Handling**: Use TokenManager for all token operations

### 3. Enhanced API Service (`src/services/api.js`)

Updated API service to:

- **Consistent Token Usage**: Use TokenManager for all token operations
- **Proper Cookie Handling**: Include `credentials: "include"` for cookie-based auth
- **Better Error Handling**: Handle token expiration and refresh
- **Automatic Token Refresh**: Attempt to refresh expired tokens

### 4. Improved Login/Logout Flow

#### Login Process:

1. User submits credentials
2. API call includes `credentials: "include"` for cookie handling
3. Token extracted from response and stored using `TokenManager.setToken()`
4. Token stored in both `localStorage` and cookies
5. Session validated to fetch user profile

#### Logout Process:

1. API call to backend to clear server-side session
2. `TokenManager.clearToken()` clears all local authentication data
3. Both `localStorage` and cookies are cleared
4. User state reset

### 5. Cross-tab Persistence

**Before**: Tokens only in `localStorage` - lost on new tabs
**After**: Tokens in both `localStorage` and cookies - persist across tabs

```javascript
// Token storage strategy:
localStorage.setItem("authToken", token); // Primary storage
document.cookie = `authToken=${token}; expires=${expires}; path=/; SameSite=Lax`; // Cross-tab persistence
```

## 🔧 Technical Implementation

### Token Storage Strategy

```javascript
// Dual storage approach
const setAuthToken = (token) => {
  if (token) {
    // Store in localStorage for immediate access
    localStorage.setItem("authToken", token);

    // Store in cookies for cross-tab persistence
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days expiry
    document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    // Clear both storage mechanisms
    localStorage.removeItem("authToken");
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};
```

### Token Retrieval Strategy

```javascript
// Fallback approach
const getAuthToken = () => {
  // First try localStorage
  const localToken = localStorage.getItem("authToken");
  if (localToken) {
    return localToken;
  }

  // Then try cookies
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "authToken" || name === "access_token" || name === "token") {
      return value;
    }
  }

  return null;
};
```

### Session Validation

```javascript
// Enhanced session validation
const validateSession = useCallback(async () => {
  setAuthLoading(true);

  // Check for token using TokenManager
  const existingToken = TokenManager.getToken();

  if (!existingToken) {
    clearUserData();
    setAuthLoading(false);
    return;
  }

  try {
    const status = await getVendorStatus();
    if (!(status.is_login && status.is_seller)) {
      clearUserData();
    } else {
      // User is authenticated, fetch profile data
      const profileData = await getVendorProfile();
      setUser({
        ...profileData,
        is_seller: status.is_seller,
        role: status.is_seller ? "vendor" : "shop",
      });
      setProfileCompletion({ ...status });
    }
  } catch (err) {
    console.error("Session validation failed", err);
    clearUserData();
  } finally {
    setAuthLoading(false);
  }
}, [clearUserData, token]);
```

## 🎯 Benefits

### 1. **Persistent Authentication**

- ✅ Tokens persist across browser refreshes
- ✅ Tokens persist across new tabs/windows
- ✅ Tokens persist across browser sessions (until expiry)

### 2. **Improved User Experience**

- ✅ No need to re-login on page refresh
- ✅ Seamless experience across multiple tabs
- ✅ Automatic session restoration

### 3. **Better Security**

- ✅ Tokens stored with proper expiry
- ✅ Secure cookie settings (`SameSite=Lax`)
- ✅ Proper cleanup on logout

### 4. **Robust Error Handling**

- ✅ Graceful fallback if localStorage is unavailable
- ✅ Automatic token refresh when possible
- ✅ Proper error handling for network issues

## 🧪 Testing

### Test Cases

1. **Login and Refresh**

   - Login with valid credentials
   - Refresh the page
   - Verify user remains logged in

2. **Cross-tab Persistence**

   - Login in one tab
   - Open new tab
   - Verify user is logged in

3. **Logout and Cleanup**

   - Login and then logout
   - Verify all authentication data is cleared
   - Verify user is logged out in all tabs

4. **Token Expiration**

   - Login with valid credentials
   - Wait for token to expire (if JWT)
   - Verify user is logged out automatically

5. **Network Issues**
   - Login with valid credentials
   - Disconnect network
   - Verify graceful error handling

## 🚀 Usage

### For Developers

The token management is now completely transparent to components. Simply use the existing `AuthContext`:

```javascript
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyComponent = () => {
  const { user, token, login, logout, authLoading } = useContext(AuthContext);

  // Token management is handled automatically
  // No need to manually handle localStorage or cookies
};
```

### For API Calls

API calls automatically include the correct authentication headers:

```javascript
// Token is automatically included in headers
const response = await fetch("/api/endpoint", {
  headers: TokenManager.getAuthHeaders(),
  credentials: "include",
});
```

## 🔄 Migration Notes

### Breaking Changes

- None - all changes are backward compatible

### New Features

- Cross-tab authentication persistence
- Automatic token refresh
- Enhanced error handling
- Centralized token management

### Performance Impact

- Minimal - token retrieval is still O(1) for localStorage
- Slight overhead for cookie parsing (only when localStorage is empty)

## 📝 Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Offline Support**: Cache user data for offline usage
3. **Multi-device Sync**: Sync authentication across devices
4. **Enhanced Security**: Implement token rotation and refresh tokens
5. **Analytics**: Track authentication events and failures
