// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context
export const CartContext = createContext();

// 2. Create the Provider component
export const CartProvider = ({ children }) => {
  // State to hold the items in the cart
  const [cartItems, setCartItems] = useState([]);

  // Function to add an item to the cart
  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );

      // If item is already in cart, increase its quantity
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Otherwise, add the new item with a quantity of 1
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate the total number of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // The value that will be available to all consuming components
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
