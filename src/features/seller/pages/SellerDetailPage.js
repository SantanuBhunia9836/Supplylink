// src/pages/SellerDetailPage.js

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { useLocation } from "../../../context/LocationContext";
// Import all API functions needed for this component
import { getSellerPageDetails, getProductDetails, searchSellers } from "../../../services/api";

// --- Helper Icon Components ---
const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);
const MinusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
  </svg>
);

// --- Sub-component for the Product Detail Popup ---
const ProductDetailPopup = ({ productId, onClose }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const productData = await getProductDetails(productId);
        setProduct(productData);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [productId]);

  const handleQuantityUpdate = (pId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(pId);
    } else {
      updateQuantity(pId, newQuantity);
    }
  };

  const itemInCart = product && cartItems.find((item) => item.id === product.id);

  const InfoCard = ({ label, value }) => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800 capitalize">{value}</p>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-4 text-center"><p className="text-red-600 font-semibold">{error}</p></div>
      );
    }
    if (!product) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-200">
           <img src={`https://placehold.co/600x600/EBF4FF/76A9FA?text=${product.name.replace(/\s/g, "+")}`} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-8 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-xl text-gray-500 capitalize mb-6">{product.category}</p>
          <p className="text-gray-700 text-base mb-8 flex-grow">{product.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <InfoCard label="Price" value={`₹${product.price} / ${product.qunatity_unit}`} />
            <InfoCard label="Stock Status" value={product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of Stock"} />
          </div>
          <div className="mt-auto">
            {itemInCart ? (
              <div className="flex items-center justify-center">
                 <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                    <button onClick={() => handleQuantityUpdate(itemInCart.id, itemInCart.quantity, -1)} className="p-3 text-gray-600 hover:bg-gray-100"><MinusIcon className="w-5 h-5" /></button>
                    <span className="w-16 text-center font-bold text-lg">{itemInCart.quantity}</span>
                    <button onClick={() => handleQuantityUpdate(itemInCart.id, itemInCart.quantity, 1)} className="p-3 text-blue-600 hover:bg-gray-100"><PlusIcon className="w-5 h-5" /></button>
                 </div>
              </div>
            ) : (
              <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700" disabled={product.stock_quantity === 0}>
                {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};


// --- Main Seller Detail Page Component ---
const SellerDetailPage = () => {
  const { id: factoryId } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const { location } = useLocation(); // Get user's location

  const [pageData, setPageData] = useState(null);
  const [factoryName, setFactoryName] = useState(""); // State for factory name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        // 1. Fetch the main page details first
        const pageDetailsData = await getSellerPageDetails(factoryId);
        setPageData(pageDetailsData);

        // 2. If location and seller ID are available, fetch sellers list to find the factory name
        if (location && pageDetailsData.seller?.id) {
          const sellerId = pageDetailsData.seller.id;
          
          // Assuming searchSellers can be called without filters to get all nearby sellers
          // or that it can accept a sellerId filter if the API supports it.
          const sellersListData = await searchSellers(
            location.latitude,
            location.longitude,
            {} // Pass empty filters or { sellerId: sellerId } if API supports it
          );
          
          if (Array.isArray(sellersListData)) {
            const currentFactoryInfo = sellersListData.find(
              (s) => s.factory_id === parseInt(factoryId, 10)
            );
            if (currentFactoryInfo && currentFactoryInfo.factory_name) {
              setFactoryName(currentFactoryInfo.factory_name);
            }
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load seller information.");
      } finally {
        setLoading(false);
      }
    };

    // Only run the effect if the location is available
    if (location || !factoryId) {
        loadSellerData();
    }
  }, [factoryId, location]);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleQuantityUpdate = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

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
          <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return null;
  }

  const { seller, factory } = pageData;
  const products = factory.products || [];
  const locationData = factory.location && factory.location[0];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
            Back
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6 border">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    {/* Store icon */}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{factoryName || "Factory"}</h1>
                    <p className="text-md text-gray-600 capitalize">{factory.factory_type || "General Store"}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.length > 0 ? (
                    products.map((product) => {
                      const itemInCart = cartItems.find((item) => item.id === product.id);
                      return (
                        <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border flex flex-col">
                          <div onClick={() => handleProductClick(product.id)} className="cursor-pointer flex-grow">
                            <img src={`https://placehold.co/400x300/EBF4FF/76A9FA?text=${product.name.replace(/\s/g, "+")}`} alt={product.name} className="w-full h-40 object-cover rounded-t-xl"/>
                            <div className="p-4">
                              <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                              <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{product.price}<span className="text-sm font-normal text-gray-600">/{product.qunatity_unit}</span>
                              </span>
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 border-t">
                            {itemInCart ? (
                              <div className="flex items-center justify-center">
                                <div className="flex items-center rounded-lg border bg-white">
                                  <button onClick={() => handleQuantityUpdate(product.id, itemInCart.quantity, -1)} className="p-2 text-gray-600 hover:bg-gray-100">
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  <span className="w-10 text-center font-semibold">{itemInCart.quantity}</span>
                                  <button onClick={() => handleQuantityUpdate(product.id, itemInCart.quantity, 1)} className="p-2 text-blue-600 hover:bg-gray-100">
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold" disabled={product.stock_quantity === 0}>
                                {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 md:col-span-3 text-center py-8">No products found for this seller.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 border sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{seller.vendor.name}</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 mt-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{getFullAddress(locationData)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-gray-700">{seller.phone || "Not available"}</span>
                  </div>
                  <div className="flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-700">{seller.email || "Not available"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && selectedProductId && (
        <ProductDetailPopup 
          productId={selectedProductId} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default SellerDetailPage;

