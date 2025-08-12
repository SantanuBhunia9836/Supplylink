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
import { Home, User, Package, ShoppingBag, Truck, Lock } from "lucide-react";

const SellerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("homepage");
  const [activeForm, setActiveForm] = useState(null);
  const [missingInfo, setMissingInfo] = useState({
    factory: false,
    factoryLocation: false,
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

      if (hasFactories) {
        setFactoryId(data.factories[0].id);
      }

      setMissingInfo({
        factory: !hasFactories,
        factoryLocation: !hasFactoryLocation,
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

  const tabs = [
    { id: "homepage", label: "Home", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "deliveries", label: "Deliveries", icon: Truck },
  ];

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

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

  const DesktopTabButton = ({ tabName, icon: Icon, label }) => {
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
        {isLocked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderActiveForm()}

      <div className="flex flex-col md:flex-row md:gap-6 h-full md:p-4">
        {/* Desktop Header */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
            <div className="text-2xl font-bold text-gray-800 p-3">
              Dashboard
            </div>
            {tabs.map((tab) => (
              <DesktopTabButton
                key={tab.id}
                tabName={tab.id}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </div>
        </div>

        <div className="flex-grow md:bg-white md:p-6 md:rounded-xl md:shadow-md md:overflow-y-auto">
          <div className="p-4 md:p-0 pb-20 md:pb-0">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200">
        <div className="relative">
          <div className="flex">
            {tabs.map((tab) => {
              const isLocked =
                !isProfileComplete && !["homepage", "profile"].includes(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  disabled={isLocked}
                  className={`flex-1 py-3 px-1 text-center text-xs font-medium transition-colors duration-300 flex flex-col items-center gap-1 ${
                    activeTab === tab.id ? "text-blue-600" : "text-gray-500"
                  } ${
                    isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <tab.icon className="w-5 h-5" />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div
            className="absolute top-0 h-1 bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${activeTabIndex * 100}%)`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
