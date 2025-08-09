import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../services/api";
import { CartContext } from "../context/CartContext"; // 1. Import CartContext

// --- Helper Icon Components for the quantity controller ---
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Get cart functions and state from context
  const { cartItems, addToCart, updateQuantity, removeFromCart } =
    useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) {
        setError("No product ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // The API should return an ID that is a number
        const productData = await getProductDetails(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  // 3. Add handler for updating quantity
  const handleQuantityUpdate = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const InfoCard = ({ label, value, className = "" }) => (
    <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800 capitalize">{value}</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  // 4. Check if this specific product is in the cart
  // Note: We parse 'id' from params to ensure the type matches the product.id in the cart
  const itemInCart = cartItems.find((item) => item.id === parseInt(id, 10));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-200">
              <img
                src={`https://placehold.co/600x600/EBF4FF/76A9FA?text=${product.name.replace(
                  /\s/g,
                  "+"
                )}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 flex flex-col">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-500 capitalize mb-6">
                {product.category}
              </p>

              <p className="text-gray-700 text-base mb-8 flex-grow">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <InfoCard
                  label="Price"
                  value={`₹${product.price} / ${product.qunatity_unit}`}
                />
                <InfoCard
                  label="Stock Status"
                  value={
                    product.stock_quantity > 0
                      ? `${product.stock_quantity} available`
                      : "Out of Stock"
                  }
                />
              </div>

              {/* 5. Conditionally render the button or quantity controller */}
              <div className="mt-auto">
                {itemInCart ? (
                  <div className="flex items-center justify-center">
                    <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            itemInCart.id,
                            itemInCart.quantity,
                            -1
                          )
                        }
                        className="p-3 text-gray-600 rounded-l-md hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>
                      <span className="w-16 text-center font-bold text-gray-800 text-lg border-x">
                        {itemInCart.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            itemInCart.id,
                            itemInCart.quantity,
                            1
                          )
                        }
                        className="p-3 text-blue-600 rounded-r-md hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={product.stock_quantity === 0}
                  >
                    {product.stock_quantity > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
