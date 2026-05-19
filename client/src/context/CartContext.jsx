/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize state cleanly from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("Gen Z StoreCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Automatically track and save cart changes globally
  useEffect(() => {
    localStorage.setItem("Gen Z StoreCart", JSON.stringify(cart));
  }, [cart]);

  // Add Item Function
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Clean Quantity Sync Update Engine
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clean Item Eraser Function
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Badge Counter Calculator
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        cartItems: cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        getTotalItems, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};