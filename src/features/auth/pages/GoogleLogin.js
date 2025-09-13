// src/pages/GoogleLogin.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
// ... existing code ...
import { AuthContext } from "../AuthContext"; // Corrected path
import { apiVendorRegister, apiLogin } from "../../../services/api";
// ... existing code ...

// A monochrome version of the Google Icon that inherits its color (will be white)
const MonochromeGoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const GoogleLogin = () => {
  const { validateSession } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // This function is called after successfully getting user info from Google
  const handleGoogleAuthSuccess = async (googleUserData) => {
    setLoading(true);
    try {
      // Step 1: Prepare the registration data.
      const registrationData = {
        name: googleUserData.name,
        email: googleUserData.email,
        password: `google_sub_${googleUserData.sub}`,
        phone: "", // Phone is not provided by Google
      };

      // Step 2: Attempt to register the user.
      await apiVendorRegister(registrationData);

      // Step 3: Log the user in to create a session.
      await apiLogin({
        username: registrationData.email,
        password: registrationData.password,
        role: "vendor",
      });

      // Step 4: Validate the session to update the app's global state
      await validateSession();

      toast.success("Successfully signed in with Google!");
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      toast.error(err.message || "An error occurred during Google Sign-In.");
      console.error("Google Sign-In Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // This hook initiates the Google login flow
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user profile from Google using the access token
        const googleResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const googleUserData = await googleResponse.json();
        handleGoogleAuthSuccess(googleUserData);
      } catch (error) {
        toast.error("Failed to fetch user information from Google.");
        console.error("Google user info fetch error:", error);
      }
    },
    onError: (error) => {
      toast.error("Google authentication failed.");
      console.error("Google OAuth Error:", error);
    },
  });

  return (
    <div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => login()}
        disabled={loading}
        className="w-full flex items-center justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-semibold text-white bg-[linear-gradient(105deg,_#4285F4_0%,_#DB4437_33%,_#F4B400_67%,_#0F9D58_100%)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
      >
        <MonochromeGoogleIcon className="w-5 h-5 mr-3" />
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default GoogleLogin;
