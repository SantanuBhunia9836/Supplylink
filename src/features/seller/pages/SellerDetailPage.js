// src/pages/SellerDetailPage.js

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
// MODIFIED: Import the new API function
import { getSellerPageDetails } from "../../../services/api";

// --- Helper Icon Components (no changes) ---
const PlusIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);
const MinusIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
      clipRule="evenodd"
    />
  </svg>
);

const SellerDetailPage = () => {
  // The 'id' from the URL is now treated as the factoryId
  const { id: factoryId } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } =
    useContext(CartContext);

  // MODIFIED: Use a single state for all page data
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSellerData = async () => {
      if (!factoryId) {
        setError("No factory ID found in URL. Please go back and try again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // MODIFIED: Single API call to fetch all data
        const data = await getSellerPageDetails(factoryId);
        setPageData(data);
      } catch (err) {
        setError(err.message || "Failed to load seller information.");
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [factoryId]);

  const handleQuantityUpdate = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // MODIFIED: Handles the new location array structure
  const getFullAddress = (location) => {
    if (!location) return "Address not available";
    return [
      location.address_line1,
      location.address_line2,
      location.city,
      location.state,
      location.country,
      location.postal_code,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-40 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // MODIFIED: Destructure data from the new pageData state object
  const { seller, factory } = pageData;
  const products = factory.products || [];
  const location = factory.location && factory.location[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          {/* ... Back button icon ... */}
          Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  {/* ... Store icon ... */}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {seller.vendor.name}
                  </h1>
                  <p className="text-md text-gray-600 capitalize">
                    {factory.factory_type || "General Store"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.length > 0 ? (
                  products.map((product) => {
                    const itemInCart = cartItems.find(
                      (item) => item.id === product.id
                    );
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border flex flex-col"
                      >
                        <div
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="cursor-pointer flex-grow"
                        >
                          <img
                            src={`https://placehold.co/400x300/EBF4FF/76A9FA?text=${product.name.replace(
                              /\s/g,
                              "+"
                            )}`}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-t-xl"
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800 truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 capitalize">
                              {product.category}
                            </p>
                            <span className="text-lg font-semibold text-gray-900">
                              ₹{product.price}
                              <span className="text-sm font-normal text-gray-600">
                                /{product.qunatity_unit}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t">
                          {itemInCart ? (
                            <div className="flex items-center justify-center">
                              <div className="flex items-center rounded-lg border bg-white">
                                <button
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      product.id,
                                      itemInCart.quantity,
                                      -1
                                    )
                                  }
                                  className="p-2 text-gray-600 hover:bg-gray-100"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-semibold">
                                  {itemInCart.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      product.id,
                                      itemInCart.quantity,
                                      1
                                    )
                                  }
                                  className="p-2 text-blue-600 hover:bg-gray-100"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                              disabled={product.stock_quantity === 0}
                            >
                              {product.stock_quantity > 0
                                ? "Add to Cart"
                                : "Out of Stock"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 md:col-span-3 text-center py-8">
                    No products found for this seller.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  {/* ... Location icon ... */}
                  <span className="text-gray-700">
                    {getFullAddress(location)}
                  </span>
                </div>
                <div className="flex items-center">
                  {/* ... Phone icon ... */}
                  <span className="text-gray-700">
                    {seller.phone || "Not available"}
                  </span>
                </div>
                <div className="flex items-center">
                  {/* ... Email icon ... */}
                  <span className="text-gray-700">
                    {seller.email || "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailPage;
