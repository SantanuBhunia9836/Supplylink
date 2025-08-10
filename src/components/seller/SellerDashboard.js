import React, { useState, useEffect, useCallback } from "react";
import { getSellerProfile } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import SellerHomepage from "./SellerHomepage";
import SellerProfile from "./SellerProfile";
import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";
import SellerDeliveries from "./SellerDeliveries";
import FactoryInfoForm from "./seller_registration/FactoryInfoForm";
import LocationStep from "./seller_registration/LocationStep";

// Icon Components
const HomeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);
const UserIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" />
  </svg>
);
const PackageIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const TruckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);
const ShoppingBagIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);
const LockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C9.24 2 7 4.24 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3z"></path>
  </svg>
);

const SellerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("homepage");
  const [activeForm, setActiveForm] = useState(null);
  const [missingInfo, setMissingInfo] = useState({
    factory: false,
    factoryLocation: false,
    vendorLocation: false,
  });
  const [sellerId, setSellerId] = useState(null);
  const [factoryId, setFactoryId] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSellerProfile();
      setProfile(data);
      setSellerId(data.id);

      const hasFactories = data.factories && data.factories.length > 0;
      const hasFactoryLocation = hasFactories && data.factories[0]?.location;
      const hasVendorLocation = data.locations && data.locations.length > 0;

      if (hasFactories) {
        setFactoryId(data.factories[0].id);
      }

      setMissingInfo({
        factory: !hasFactories,
        factoryLocation: !hasFactoryLocation,
        vendorLocation: !hasVendorLocation,
      });
    } catch (err) {
      setError("Failed to fetch your profile. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFormComplete = () => {
    setActiveForm(null);
    fetchProfile();
  };

  const isProfileComplete =
    !missingInfo.factory && !missingInfo.factoryLocation;

  // --- MODIFICATION: Moved FormWrapper outside of renderActiveForm ---
  const FormWrapper = ({ children, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="relative p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={() => setActiveForm(null)}
            className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-8 overflow-y-auto">{children}</div>
        <div className="p-4 bg-gray-50 text-right rounded-b-xl border-t flex-shrink-0">
          <button
            onClick={() => setActiveForm(null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveForm = () => {
    if (!profile) return null;

    switch (activeForm) {
      case "ADD_FACTORY":
        return (
          <FormWrapper title="Add Factory Information">
            <FactoryInfoForm
              sellerId={sellerId}
              onComplete={handleFormComplete}
            />
          </FormWrapper>
        );
      case "ADD_FACTORY_LOCATION":
        return (
          <FormWrapper title="Set Your Factory's Location">
            <LocationStep
              factoryId={factoryId}
              onComplete={handleFormComplete}
            />
          </FormWrapper>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (!profile) return null;
    switch (activeTab) {
      case "homepage":
        return <SellerHomepage profile={profile} />;
      case "profile":
        return (
          <SellerProfile
            profile={profile}
            missingInfo={missingInfo}
            onAction={setActiveForm}
          />
        );
      case "products":
        return (
          <SellerProducts profile={profile} onProductsUpdate={fetchProfile} />
        );
      case "orders":
        return <SellerOrders />;
      case "deliveries":
        return <SellerDeliveries />;
      default:
        return <SellerHomepage profile={profile} />;
    }
  };

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;
  if (error)
    return (
      <div className="text-center text-red-500 font-semibold p-10">{error}</div>
    );

  const TabButton = ({ tabName, icon: Icon, label }) => {
    const isLocked =
      !isProfileComplete && !["homepage", "profile"].includes(tabName);
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => !isLocked && setActiveTab(tabName)}
        disabled={isLocked}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-200"
        } ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {isLocked ? (
          <LockIcon className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full bg-gray-50 p-4">
      {renderActiveForm()}

      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
          <TabButton tabName="homepage" icon={HomeIcon} label="Homepage" />
          <TabButton tabName="profile" icon={UserIcon} label="Profile" />
          <TabButton
            tabName="products"
            icon={PackageIcon}
            label="My Products"
          />
          <TabButton tabName="orders" icon={ShoppingBagIcon} label="Orders" />
          <TabButton tabName="deliveries" icon={TruckIcon} label="Deliveries" />
        </div>
      </div>
      <div className="flex-grow bg-white p-6 rounded-xl shadow-md overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SellerDashboard;
