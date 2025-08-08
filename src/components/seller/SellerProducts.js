// src/components/seller/SellerProducts.js
import React, { useState } from "react";
import AddProductForm from "./AddProductForm"; // Import the new form component

const PlusIcon = (props) => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SellerProducts = ({ products, onProductsUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormComplete = () => {
    setIsModalOpen(false);
    onProductsUpdate(); // Refresh the profile data in the dashboard
  };

  return (
    <div>
      {isModalOpen && (
        <AddProductForm
          onComplete={handleFormComplete}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Products</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>

      <p className="mb-6 text-gray-600">
        Add, edit, and manage your product listings.
      </p>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">
          Current Product Summary ({products?.length || 0})
        </h3>
        {products && products.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {products.map((p) => (
              <li key={p.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{p.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {p.stock_quantity} {p.qunatity_unit}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h4>
            <p className="text-gray-500 mb-4">
              Click "Add New Product" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
