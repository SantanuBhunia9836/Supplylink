import React, { useState } from "react";
import { apiCreateSeller } from "../../../../services/api";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

const SellerDetailsForm = ({ initialData, onComplete }) => {
  const [sellerData, setSellerData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputStyles =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCreateSeller(sellerData);
      onComplete(result.id); // Pass the new seller ID back to the parent
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Your Business Contact
      </h3>
      <p className="text-gray-500 -mt-4">
        Enter the primary contact details for your business.
      </p>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={sellerData.email}
          onChange={(e) =>
            setSellerData({ ...sellerData, email: e.target.value })
          }
          required
          className={inputStyles}
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          value={sellerData.phone}
          onChange={(e) =>
            setSellerData({ ...sellerData, phone: e.target.value })
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
        {isLoading ? <LoadingSpinner /> : "Next: Add Factory Info"}
      </button>
    </form>
  );
};

export default SellerDetailsForm;
