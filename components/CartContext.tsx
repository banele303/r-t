"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  brand: string;
  color?: string;
  size?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("istore-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("istore-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, color?: string, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => 
        item._id === product._id && 
        item.color === color && 
        item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item._id === product._id && 
          item.color === color && 
          item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, color, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setItems((prev) => prev.filter((item) => 
      !(item._id === productId && item.color === color && item.size === size)
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
