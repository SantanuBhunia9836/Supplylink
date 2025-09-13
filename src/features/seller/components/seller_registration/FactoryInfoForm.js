import React, { useState } from "react";
import { apiCreateFactory } from "../../../../services/api"; // Corrected path
import LoadingSpinner from "../../../../components/common/LoadingSpinner"; // Corrected path

// ... rest of the file remains the same ...

const FactoryInfoForm = ({ sellerId, onComplete }) => {
  const [factoryData, setFactoryData] = useState({
    name: "",
    factory_type: "general",
    contact_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputStyles =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = { ...factoryData, seller_id: sellerId };
      const result = await apiCreateFactory(payload);
      onComplete(result.id); // Pass the new factory ID back
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Factory / Business Information
      </h3>
      <p className="text-gray-500 -mt-4">
        Describe your primary place of business.
      </p>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Factory/Business Name *
        </label>
        <input
          type="text"
          id="name"
          value={factoryData.name}
          onChange={(e) =>
            setFactoryData({ ...factoryData, name: e.target.value })
          }
          required
          className={inputStyles}
        />
      </div>
      <div>
        <label
          htmlFor="factory_type"
          className="block text-sm font-medium text-gray-700"
        >
          Business Type *
        </label>
        <select
          id="factory_type"
          value={factoryData.factory_type}
          onChange={(e) =>
            setFactoryData({ ...factoryData, factory_type: e.target.value })
          }
          className={inputStyles}
        >
          <option value="factory">Factory</option>
          <option value="warehouse">Warehouse</option>
          <option value="shop">Shop</option>
          <option value="shop">Other</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="contact_number"
          className="block text-sm font-medium text-gray-700"
        >
          On-Site Contact Number *
        </label>
        <input
          type="tel"
          id="contact_number"
          value={factoryData.contact_number}
          onChange={(e) =>
            setFactoryData({ ...factoryData, contact_number: e.target.value })
          }
          required
          className={inputStyles}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? <LoadingSpinner /> : "Next: Set Location"}
      </button>
    </form>
  );
};

export default FactoryInfoForm;
