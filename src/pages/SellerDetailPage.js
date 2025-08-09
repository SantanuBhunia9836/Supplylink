// src/pages/SellerDetailPage.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSellerProducts } from "../services/api";
import { CartContext } from "../context/CartContext";

// --- Helper Icon Components for the new controller ---
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
  const { id: sellerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, addToCart, updateQuantity, removeFromCart } =
    useContext(CartContext);

  const [seller, setSeller] = useState(location.state?.seller || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!seller) {
        setError(
          "Seller information is missing. Please return to the previous page and select a seller."
        );
        setLoading(false);
        return;
      }
      const factoryId = seller.factory_id;
      if (!factoryId) {
        setError("Could not find a factory for this seller.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const productsData = await getSellerProducts(sellerId, factoryId);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [seller, sellerId]);

  const handleQuantityUpdate = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const getFullAddress = (loc) => {
    if (!loc) return "Address not available";
    return [
      loc.address_line1,
      loc.address_line2,
      loc.city,
      loc.state,
      loc.country,
      loc.postal_code,
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
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
  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {seller.factory_name}
                  </h1>
                  <p className="text-md text-gray-600 capitalize">
                    {seller.factory_type || "Seller"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  [...Array(3)].map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length > 0 ? (
                  products.map((product) => {
                    const itemInCart = cartItems.find(
                      (item) => item.id === product.id
                    );

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col"
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
                            <h3 className="font-bold text-gray-800 text-md truncate">
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

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          {itemInCart ? (
                            <div className="flex items-center justify-center">
                              <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                                <button
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      product.id,
                                      itemInCart.quantity,
                                      -1
                                    )
                                  }
                                  className="p-2 text-gray-600 rounded-l-md hover:bg-gray-100 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-semibold text-gray-800 text-md border-x">
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
                                  className="p-2 text-blue-600 rounded-r-md hover:bg-gray-100 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
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
                  <p className="text-gray-500 md:col-span-2 xl:col-span-3 text-center py-8">
                    No products found for this seller.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 mt-1 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {getFullAddress(seller.factory_location)}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {seller.phone || "Phone not available"}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {seller.email || "Email not available"}
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
