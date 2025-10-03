// src/components/Seller/SellerProfile.js
import React, { useState } from "react";
import EditProfileForm from "./EditProfileForm"; // Import the new form component
import { Edit } from "lucide-react"; // Import an icon for the button

const InfoCard = ({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="font-semibold text-gray-500 text-sm mb-2 tracking-wide uppercase">
      {title}
    </h3>
    <div className="text-gray-800 text-base">{children}</div>
  </div>
);

// A new component for prompting users to complete their profile
const ActionCard = ({ title, text, buttonLabel, onClick }) => (
  <div
    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow"
    role="alert"
  >
    <p className="font-bold">{title}</p>
    <p className="mb-3">{text}</p>
    <button
      onClick={onClick}
      className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
    >
      {buttonLabel}
    </button>
  </div>
);

const SellerProfile = ({ profile, missingInfo, onAction, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // State to control the edit modal

  const factory = profile?.factories?.[0];
  const location = factory?.location;

  const handleEditComplete = () => {
    setIsEditing(false);
    onProfileUpdate(); // Refresh the profile data in the parent component
  };

  return (
    <div>
      {/* Conditionally render the EditProfileForm modal */}
      {isEditing && (
        <EditProfileForm
          profile={profile}
          onComplete={handleEditComplete}
          onClose={() => setIsEditing(false)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        {/* Add the Edit Profile button */}
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center bg-blue-100 text-blue-700 font-bold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {/* --- DYNAMIC ACTION CARDS --- */}
      {missingInfo.factory && (
        <ActionCard
          title="Add Your Factory"
          text="Your factory details are missing. Please add them to continue."
          buttonLabel="Add Factory Details"
          onClick={() => onAction("ADD_FACTORY")}
        />
      )}
      {missingInfo.factoryLocation && (
        <ActionCard
          title="Add Factory Location"
          text="Your factory has no location specified. Please add it to appear in searches."
          buttonLabel="Add Factory Location"
          onClick={() => onAction("ADD_FACTORY_LOCATION")}
        />
      )}
      {missingInfo.vendorLocation && (
        <ActionCard
          title="Add Business Location"
          text="Your primary business location is missing."
          buttonLabel="Add Vendor Location"
          onClick={() => onAction("ADD_VENDOR_LOCATION")}
        />
      )}

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title="Email Address">
              <p>{profile?.email || "N/A"}</p>
            </InfoCard>
            <InfoCard title="Phone Number">
              <p>{profile?.phone || "N/A"}</p>
            </InfoCard>
          </div>
        </div>

        {factory && (
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">
              Factory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="Factory Name">
                <p>{factory.name}</p>
              </InfoCard>
              <InfoCard title="Factory Type">
                <p className="capitalize">{factory.factory_type}</p>
              </InfoCard>
              <InfoCard title="Factory Contact">
                <p>{factory.contact_number}</p>
              </InfoCard>
            </div>
          </div>
        )}

        {location && (
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="Address">
                <p>{`${location.address_line1}${
                  location.address_line2 ? `, ${location.address_line2}` : ""
                }`}</p>
              </InfoCard>
              <InfoCard title="City & State">
                <p>{`${location.city}, ${location.state}`}</p>
              </InfoCard>
              <InfoCard title="Postal Code">
                <p>{location.postal_code}</p>
              </InfoCard>
              <InfoCard title="Country">
                <p>{location.country}</p>
              </InfoCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;