"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const getAccountKey = (u: any) => {
    if (!u) return null;
    return (u.username || u.email || u.id || "").toLowerCase().trim();
  };

  // Load wishlist whenever the active user account changes
  useEffect(() => {
    const key = getAccountKey(user);
    if (!key) {
      setWishlist([]);
      return;
    }

    try {
      const saved = localStorage.getItem(`terzme_wishlist_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } else {
        setWishlist([]);
      }
    } catch (e) {
      console.error("Wishlist load error:", e);
      setWishlist([]);
    }
  }, [user?.username, user?.email, user?.id]);

  const saveToStorage = (key: string | null, list: Product[]) => {
    if (!key) return;
    try {
      localStorage.setItem(`terzme_wishlist_${key}`, JSON.stringify(list));
    } catch (e) {
      console.error("Wishlist save error:", e);
    }
  };

  const addToWishlist = (product: Product) => {
    if (!isAuthenticated || !user) {
      openAuthModal();
      return;
    }
    const key = getAccountKey(user);
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      const updated = [...prev, product];
      saveToStorage(key, updated);
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    const key = getAccountKey(user);
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveToStorage(key, updated);
      return updated;
    });
  };

  const toggleWishlist = (product: Product) => {
    if (!isAuthenticated || !user) {
      openAuthModal();
      return false;
    }
    const key = getAccountKey(user);
    let isAdded = false;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
        isAdded = false;
      } else {
        updated = [...prev, product];
        isAdded = true;
      }
      saveToStorage(key, updated);
      return updated;
    });
    return true;
  };

  const isInWishlist = (productId: string) => {
    if (!isAuthenticated || !user) return false;
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: isAuthenticated ? wishlist : [],
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        totalWishlistItems: isAuthenticated ? wishlist.length : 0,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
