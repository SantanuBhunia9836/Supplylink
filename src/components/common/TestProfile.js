// src/components/common/TestProfile.js

import React, { useState, useEffect, useContext } from 'react';
import { getVendorProfile } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const TestProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [tokenExists, setTokenExists] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('authToken'));

  useEffect(() => {
    setToken(sessionStorage.getItem('authToken'));
    setTokenExists(!!sessionStorage.getItem('authToken'));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        return;
      }
      try {
        const profileData = await getVendorProfile(token);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        setProfile(null);
        setError(err.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [user, token]);

  const possibleReasons = [];
  if (!tokenExists) {
    possibleReasons.push("Token not found in sessionStorage. Please log in.");
  }
  if (error && error.includes("401")) {
    possibleReasons.push("Invalid token. Please log in again.");
  }
  if (error && error.includes("Network error")) {
    possibleReasons.push("Network error. Please check your internet connection.");
  }
  if (error && error.includes("Token not found in cookies")) {
      possibleReasons.push("Token is not found in cookies. Ensure the API is setting the token in a cookie.");
  }
    

  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-semibold">Profile Data Test:</h2>

      <div className="mb-2">
        <strong>Token Status:</strong> {tokenExists ? 'Token Exists' : 'Token Not Found'}
      </div>

      {profile && (
        <div className="mb-2">
          <strong>API Response:</strong>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mb-2 text-red-500">
          <strong>Error:</strong> {error}
        </div>
      )}

      {possibleReasons.length > 0 && (
        <div className="mb-2">
          <strong>Possible Reasons:</strong>
          <ul>
            {possibleReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestProfile;
