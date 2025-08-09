import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

// Import the new modular components
import SellerDetailsForm from "../components/seller/seller_registration/SellerDetailsForm";
import FactoryInfoForm from "../components/seller/seller_registration/FactoryInfoForm";
import LocationStep from "../components/seller/seller_registration/LocationStep";
import ProductStep from "../components/seller/seller_registration/ProductStep";

// --- Helper & Icon Components ---
const ArrowLeftIcon = (props) => (
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
    {...props}
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ProgressTracker = ({ currentStep }) => {
  const steps = ["Seller Details", "Factory Info", "Location", "Add Products"];
  return (
    <div className="w-full px-8 pt-8">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep > index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > index ? "✓" : index + 1}
              </div>
              <span
                className={`ml-3 font-medium transition-colors duration-300 ${
                  currentStep >= index ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out mx-4 border-gray-200"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---
const SellerRegistration = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [sellerId, setSellerId] = useState(null);
  const [factoryId, setFactoryId] = useState(null);

  const handlePrevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SellerDetailsForm
            initialData={{ email: user?.email || "", phone: user?.phone || "" }}
            onComplete={(newSellerId) => {
              setSellerId(newSellerId);
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <FactoryInfoForm
            sellerId={sellerId}
            onComplete={(newFactoryId) => {
              setFactoryId(newFactoryId);
              setStep(3);
            }}
          />
        );
      case 3:
        return (
          <LocationStep factoryId={factoryId} onComplete={() => setStep(4)} />
        );
      case 4:
        return (
          <ProductStep
            sellerId={sellerId}
            factoryId={factoryId}
            onComplete={() => {
              toast.success("Registration complete! Welcome to the dashboard.");
              navigate("/dashboard");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 flex items-center space-x-4 border-b">
          <button
            onClick={() => (step > 1 ? handlePrevStep() : navigate(-1))}
            className="text-gray-500 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Become a Seller</h1>
        </div>
        <ProgressTracker currentStep={step} />
        <div className="p-8">{renderStep()}</div>
      </div>
    </div>
  );
};

export default SellerRegistration;
