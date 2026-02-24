'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
}
// interface activeOrders{
//   orderId: string;
//   status?: string;
//   createdAt?: string;
//   finalAmount?: number;
//   clientId: string;
// }

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  // activeOrders: activeOrders[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // const [items, setItems] = useState<CartItem[]>([]);

  // useEffect(() => {
  //   const saved = localStorage.getItem('restaurant-cart');
  //   if (saved) {
  //     setItems(JSON.parse(saved));
  //   }
  // }, []);

  const [items, setItems] = useState<CartItem[]>(() => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("restaurant-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    toast.success(`${item.name} added to cart!`);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item._id !== id));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        // activeOrders: [],
      }}
  
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}