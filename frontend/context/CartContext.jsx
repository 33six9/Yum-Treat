"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "yumtreat_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        // ignore malformed cache
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((food, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === food._id);
      if (existing) {
        return prev.map((i) =>
          i._id === food._id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          _id: food._id,
          name: food.name,
          imageUrl: food.imageUrl,
          currentPrice: food.currentPrice,
          quantity: qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i._id !== id)
        : prev.map((i) => (i._id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotal, totalCount } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        subtotal: acc.subtotal + i.currentPrice * i.quantity,
        totalCount: acc.totalCount + i.quantity,
      }),
      { subtotal: 0, totalCount: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clearCart, subtotal, totalCount, hydrated }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
