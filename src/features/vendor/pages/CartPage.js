import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } =
    useContext(CartContext);
  const navigate = useNavigate();

  // This function now handles both incrementing and decrementing
  const handleQuantityUpdate = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    // If the new quantity is 0 or less, remove the item. Otherwise, update it.
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Review your items before checking out.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="mt-6 text-2xl font-semibold text-gray-800">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={`https://placehold.co/150x150/EBF4FF/76A9FA?text=${item.name.replace(
                      /\s/g,
                      "+"
                    )}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-grow ml-4">
                    <h3 className="font-bold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} / {item.qunatity_unit}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center bg-gray-100 rounded-full">
                      <button
                        onClick={() =>
                          handleQuantityUpdate(item.id, item.quantity, -1)
                        }
                        className="px-3 py-1 text-lg text-gray-600 hover:text-black rounded-l-full hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityUpdate(item.id, item.quantity, 1)
                        }
                        className="px-3 py-1 text-lg text-gray-600 hover:text-black rounded-r-full hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gray-900 mt-2 text-lg">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold text-xl text-gray-900">
                    <span>Order Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => navigate('/checkout')}  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mt-12 font-medium mx-auto"
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
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartPage;
