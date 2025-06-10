// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);

  // Carrega carrinho e cupom do localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCartItems([]);
      }
    }
    const storedCupom = localStorage.getItem('coupon');
    if (storedCupom) {
      try {
        setCoupon(JSON.parse(storedCupom));
      } catch {
        setCoupon(null);
      }
    }
  }, []);

  // Persiste carrinho e cupom
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('coupon');
    }
  }, [coupon]);

  const addToCart = (item) => {
    setCartItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      const normalizedItem = {
        ...item,
        price: typeof item.price === 'string'
          ? parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.'))
          : Number(item.price) || 0
      };
      return [...prev, normalizedItem];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // novos métodos de cupom
  const applyCoupon = (c) => setCoupon(c);
  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}
