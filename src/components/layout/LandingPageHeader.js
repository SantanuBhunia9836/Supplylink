// src/components/layout/LandingPageHeader.js
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../features/auth/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useLocation as useLocationContext } from "../../context/LocationContext";
import ProfileCompletionIndicator from "../common/ProfileCompletionIndicator";
import { getVendorLocations } from "../../services/api";

const CartIcon = ({ cartCount }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/cart")}
      className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
          {cartCount}
        </span>
      )}
    </button>
  );
};

const AccountDropdown = ({
  user,
  profileName,
  onVendorDashboard,
  onSellerDashboard,
  onLogout,
  onBecomeSeller,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-56 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-semibold text-gray-800 truncate">{profileName}</p>
      </div>

      <button
        onClick={onVendorDashboard}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          ></path>
        </svg>
        Vendor Dashboard
      </button>

      {user?.is_seller && (
        <button
          onClick={onSellerDashboard}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Seller Dashboard
        </button>
      )}

      {!user?.is_seller && (
        <button
          onClick={onBecomeSeller}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Become a Seller
        </button>
      )}
      <hr className="my-1" />
      <button
        onClick={onLogout}
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

const LocationDropdown = ({
  isOpen,
  locations,
  onSelect,
  onDetect,
  loading,
}) => {
  if (!isOpen) return null;

  const formatAddress = (loc) => {
    const parts = [
      loc.address_line1,
      loc.address_line2,
      loc.city,
      loc.state,
      loc.postal_code,
    ]
      .filter(Boolean)
      .join(", ");
    return parts;
  };

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-64 z-50">
      <button
        onClick={onDetect}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Detect Current Location
      </button>
      <hr className="my-1" />
      <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">
        Saved Locations
      </div>
      {loading ? (
        <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
      ) : locations.length > 0 ? (
        locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelect(loc)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            {formatAddress(loc)}
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-gray-500">
          No saved locations.
        </div>
      )}
    </div>
  );
};

const AuthStatus = ({ onLogin, onSignup, onLocationClick }) => (
  <div className="flex items-center space-x-3">
    <button
      onClick={onLocationClick}
      className="px-4 py-2 text-gray-600 hover:text-blue-700 font-medium transition-colors flex items-center"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Location
    </button>
    <button
      onClick={onLogin}
      className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
    >
      Login
    </button>
    <button
      onClick={onSignup}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Sign Up
    </button>
  </div>
);

const LandingPageHeader = ({
  onLoginClick,
  onSignupClick,
  onLocationClick,
}) => {
  const { user, logout, authLoading, profileCompletion } =
    useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const {
    location: currentLocation,
    updateLocation,
    getCurrentLocation,
    locationLoading,
  } = useLocationContext();

  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [profileName, setProfileName] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const accountDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      Promise.resolve(user)
        .then((profile) => {
          const possibleNames = [
            profile.name,
            profile.businessName,
            profile.full_name,
            profile.first_name,
            `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
            profile.email?.split("@")[0],
            profile.username,
          ].filter(Boolean);
          setProfileName(possibleNames[0] || "Account");
        })
        .finally(() => setProfileLoading(false));
    } else {
      setProfileName(null);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchLocations = async () => {
        setLocationsLoading(true);
        try {
          const data = await getVendorLocations();
          setLocations(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed to fetch saved locations:", error.message);
          setLocations([]);
        } finally {
          setLocationsLoading(false);
        }
      };
      fetchLocations();
    } else {
      setLocations([]);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (loc) => {
    updateLocation(loc);
    setIsLocationDropdownOpen(false);
  };

  const handleDetectLocation = () => {
    getCurrentLocation();
    setIsLocationDropdownOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/supplylink-logo.png"
            alt="SupplyLink Logo"
            className="h-10 w-auto mr-3 animate-slideIn"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SupplyLink
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          {authLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Checking...</span>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <CartIcon cartCount={cartCount} />

              <div className="relative" ref={locationDropdownRef}>
                <button
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium hidden md:inline">
                    {locationLoading
                      ? "..."
                      : currentLocation?.city || "Set Location"}
                  </span>
                </button>
                <LocationDropdown
                  isOpen={isLocationDropdownOpen}
                  locations={locations}
                  loading={locationsLoading}
                  onSelect={handleSelectLocation}
                  onDetect={handleDetectLocation}
                />
              </div>

              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                  className="flex items-center space-x-2 pl-2 pr-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <ProfileCompletionIndicator
                    profileCompletion={profileCompletion}
                    size={32}
                    strokeWidth={2}
                    showPercentage={true}
                    displayType="profile"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </ProfileCompletionIndicator>
                  <span className="font-medium text-sm">
                    {profileLoading ? "Loading..." : profileName || "Account"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isAccountDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AccountDropdown
                  isOpen={isAccountDropdownOpen}
                  user={user}
                  profileName={profileName}
                  onClose={() => setIsAccountDropdownOpen(false)}
                  onVendorDashboard={() => navigate("/vendor-dashboard")}
                  onSellerDashboard={() => navigate("/seller-dashboard")}
                  onLogout={logout}
                  onBecomeSeller={() => navigate("/seller-registration")}
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <CartIcon cartCount={cartCount} />
              <AuthStatus
                onLogin={onLoginClick}
                onSignup={onSignupClick}
                onLocationClick={onLocationClick}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingPageHeader;