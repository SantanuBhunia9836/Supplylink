// src / components / Seller / ProfileCompletionForms.js;
import React, { useState } from "react";
import {
  apiCreateFactory,
  apiCreateFactoryLocation,
  apiCreateVendorLocation,
} from "../../services/api";
import FactoryLocation from "./FactoryLocation"; // Re-using the advanced map component

// A reusable modal component to wrap our forms
const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

// Form for creating a new Factory/Shop
export const CreateFactoryForm = ({ onComplete, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    factory_type: "general",
    contact_number: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiCreateFactory(formData);
      onComplete(); // This will trigger a profile refresh in the dashboard
    } catch (err) {
      setError(err.message || "Failed to create factory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add Your Factory Details" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Factory/Business Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Factory Type*
          </label>
          <select
            name="factory_type"
            value={formData.factory_type}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="general">General</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="warehouse">Warehouse</option>
            <option value="retail">Retail</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Number*
          </label>
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end pt-4">
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
            {loading ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Form for adding a location (for a factory OR a vendor)
export const CreateLocationForm = ({
  onComplete,
  onClose,
  factoryId,
  isVendorLocation = false,
}) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isVendorLocation) {
        await apiCreateVendorLocation(formData);
      } else {
        await apiCreateFactoryLocation({ ...formData, factory_id: factoryId });
      }
      onComplete();
    } catch (err) {
      setError(err.message || "Failed to save location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        isVendorLocation
          ? "Add Your Primary Business Location"
          : "Add Factory Location"
      }
      onClose={onClose}
    >
      <FactoryLocation
        formData={formData}
        onFormDataChange={setFormData}
        onLocationSet={handleSubmit} // The confirm button inside FactoryLocation will now trigger the submit
      />
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {loading && (
        <p className="text-blue-500 text-sm mt-4">Saving location...</p>
      )}
    </Modal>
  );
};
