// src/pages/dashboard/CreateOrder.js
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { getProducts, placeOrder } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreateOrder = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToOrder = (productToAdd) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
  };

  const handleRemoveFromOrder = (productId) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handlePlaceOrder = async () => {
    if (orderItems.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const result = await placeOrder(orderItems, user.id);
      toast.success(`Order placed successfully! Order ID: ${result.orderId}`);
      setOrderItems([]); // Clear the order summary
    } catch (err) {
      toast.error("There was an error placing your order.");
      console.error(err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading products..." />;
  if (error)
    return (
      <div className="text-center text-red-500 font-semibold p-10">{error}</div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Product Listing */}
      <div className="flex-grow bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Select Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex flex-col justify-between transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-bold text-lg text-gray-800">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-md font-semibold text-green-600 mt-2">
                  {product.price}
                </p>
              </div>
              <button
                onClick={() => handleAddToOrder(product)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Order Summary Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow self-start sticky top-6">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        <div className="space-y-3 text-gray-700 min-h-[150px]">
          {orderItems.length === 0 ? (
            <p className="text-gray-500 text-center pt-10">
              Your order is empty.
            </p>
          ) : (
            orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRemoveFromOrder(item.id)}
                    className="w-6 h-6 bg-gray-200 rounded-full text-lg font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-semibold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleAddToOrder(item)}
                    className="w-6 h-6 bg-gray-200 rounded-full text-lg font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || orderItems.length === 0}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CreateOrder;
