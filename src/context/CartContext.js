// src/context/CartContext.js

import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    try {
      const localData = localStorage.getItem("cart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse cart data from localStorage", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart data to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      if (itemInCart) {
        // If item is already in cart, increase quantity by 1
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Otherwise, add new item with quantity of 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // --- 1. THE MISSING FUNCTION DEFINITION ---
  // This function allows changing the quantity of an item in the cart.
  const updateQuantity = (productId, newQuantity) => {
    // Ensure newQuantity is a valid number and at least 1
    const quantity = Math.max(1, Number(newQuantity));
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  // Calculate total price and item count
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);

  const cartCount = cartItems.reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );

  // --- 2. THE FIX IS HERE ---
  // Ensure `updateQuantity` is included in the value passed to the provider.
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity, // This makes the function available to all consumer components
    totalPrice,
    cartCount,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
