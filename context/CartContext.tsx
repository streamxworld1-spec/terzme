"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getAccountKey = (u: any) => {
    if (!u) return "guest";
    return (u.username || u.email || u.id || "guest").toLowerCase().trim();
  };

  // Load cart whenever the active account changes
  useEffect(() => {
    const key = getAccountKey(user);
    try {
      const saved = localStorage.getItem(`terzme_cart_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      } else {
        // If logging into an account that has no cart yet, migrate guest cart if present
        if (key !== "guest") {
          const guestSaved = localStorage.getItem("terzme_cart_guest");
          if (guestSaved) {
            const guestCart = JSON.parse(guestSaved);
            if (Array.isArray(guestCart) && guestCart.length > 0) {
              setCart(guestCart);
              saveCartToStorage(key, guestCart);
              localStorage.removeItem("terzme_cart_guest");
              return;
            }
          }
        }
        setCart([]);
      }
    } catch (e) {
      console.error(e);
      setCart([]);
    }
  }, [user?.username, user?.email, user?.id]);

  const saveCartToStorage = (key: string, list: CartItem[]) => {
    try {
      localStorage.setItem(`terzme_cart_${key}`, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (product: Product, color?: string, size?: string) => {
    const selColor = color || product.colors[0];
    const selSize = size || product.sizes[0];
    const key = getAccountKey(user);

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selColor &&
          item.selectedSize === selSize
      );
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { product, selectedColor: selColor, selectedSize: selSize, quantity: 1 }];
      }
      saveCartToStorage(key, updated);
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const key = getAccountKey(user);
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      saveCartToStorage(key, updated);
      return updated;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    const key = getAccountKey(user);
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      saveCartToStorage(key, updated);
      return updated;
    });
  };

  const clearCart = () => {
    const key = getAccountKey(user);
    saveCartToStorage(key, []);
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
