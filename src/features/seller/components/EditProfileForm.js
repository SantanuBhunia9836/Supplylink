// src/features/seller/components/EditProfileForm.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiEditSellerProfile } from "../../../services/api"; // Assuming this function is added to your api services

// Reusable modal component from other forms
const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

// Reusable input component
const FormInput = ({ label, name, value, onChange, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const EditProfileForm = ({ profile, onComplete, onClose }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form state with data from the profile prop
  useEffect(() => {
    if (profile) {
      const factory = profile.factories?.[0] || {};
      const location = factory.location || {};
      setFormData({
        email: profile.email || "",
        phone: profile.phone || "",
        factoryName: factory.name || "",
        factoryType: factory.factory_type || "general",
        factoryContact: factory.contact_number || "",
        address1: location.address_line1 || "",
        address2: location.address_line2 || "",
        city: location.city || "",
        state: location.state || "",
        postalCode: location.postal_code || "",
        country: location.country || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Construct the payload based on the API schema
    const payload = {
      seller: {
        id: profile.id,
        email: formData.email,
        phone: formData.phone,
      },
    };

    if (profile.factories?.[0]) {
      payload.factories = {
        id: profile.factories[0].id,
        name: formData.factoryName,
        factory_type: formData.factoryType,
        contact_number: formData.factoryContact,
      };
    }

    if (profile.factories?.[0]?.location) {
      payload.location = {
        id: profile.factories[0].location.id,
        address_line1: formData.address1,
        address_line2: formData.address2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postalCode,
      };
    }

    try {
      // This is the new API call to update the profile
      await apiEditSellerProfile(payload);
      toast.success("Profile updated successfully!");
      onComplete(); // Triggers a data refresh in the dashboard
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit My Profile" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Factory Details Section (only if a factory exists) */}
        {profile.factories?.[0] && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">
              Factory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Factory Name"
                name="factoryName"
                value={formData.factoryName || ""}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Factory Contact"
                name="factoryContact"
                value={formData.factoryContact || ""}
                onChange={handleChange}
                required
              />
              <div>
                <label
                  htmlFor="factoryType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Factory Type
                </label>
                <select
                  id="factoryType"
                  name="factoryType"
                  value={formData.factoryType || "general"}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="general">General</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Location Section (only if a location exists) */}
        {profile.factories?.[0]?.location && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Address Line 1"
                name="address1"
                value={formData.address1 || ""}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Address Line 2"
                name="address2"
                value={formData.address2 || ""}
                onChange={handleChange}
              />
              <FormInput
                label="City"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                required
              />
              <FormInput
                label="State"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode || ""}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Country"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileForm;