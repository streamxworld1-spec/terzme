"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ArrowLeft, Plus, Sparkles, Check, SlidersHorizontal, ChevronDown, Heart, Star, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface CategoryViewProps {
  title: string;
  badge: string;
  categoryCode: string;
  description: string;
  products: Product[];
}

export function CategoryView({ title, badge, categoryCode, description, products }: CategoryViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeSort, setActiveSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (activeSort === "featured") {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    if (activeSort === "price-asc") {
      return a.price - b.price;
    }
    if (activeSort === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 my-auto py-8 z-30">
        
        {/* Dedicated Glassmorphic Filter & Sorting Compartment - Same Border Radius as Home */}
        <div 
          style={{ borderRadius: "1px" }}
          className="p-4 sm:p-5 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 relative z-40 text-neutral-950 bg-white"
        >
          
          {/* Left: Back button & "FILTER (X products)" Dropdown Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link 
              href="/collection"
              style={{ borderRadius: "1px" }}
              className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all border border-neutral-200 shadow-2xs group shrink-0 text-neutral-900"
              title="Bütün kolleksiyaya qayıt"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-900 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowFilterDropdown(false);
                }}
                style={{ borderRadius: "1px" }}
                className={`flex items-center gap-2.5 px-4 py-2.5 border text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  showCategoryDropdown
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                    : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 shadow-2xs"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>FILTER ({sortedProducts.length} products)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {/* Filter Category Dropdown Menu */}
              {showCategoryDropdown && (
                <div 
                  style={{ borderRadius: "1px" }}
                  className="absolute left-0 mt-2 w-64 p-2 bg-white border border-neutral-200 shadow-xl z-50 text-xs font-mono space-y-1 animate-in fade-in duration-200 text-neutral-900"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-b border-neutral-100 mb-1">
                    Bölmələr
                  </div>
                  {[
                    { id: "all", label: "Hamısı", href: "/collection" },
                    { id: "new-arrivals", label: "Yeni Gələnlər", href: "/collection/new-arrivals" },
                    { id: "bestsellers", label: "Ən Çox Satılanlar", href: "/collection/bestsellers" },
                    { id: "hoodies", label: "Hudilər & Sviterlər", href: "/collection/hoodies" },
                    { id: "t-shirts", label: "Qrafik Köynəklər", href: "/collection/t-shirts" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setShowCategoryDropdown(false);
                        router.push(cat.href);
                      }}
                      style={{ borderRadius: "1px" }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                        title.toLowerCase().includes(cat.label.toLowerCase().slice(0, 4))
                          ? "bg-neutral-950 text-white font-bold shadow-xs"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {title.toLowerCase().includes(cat.label.toLowerCase().slice(0, 4)) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: "Önə çıxanlar" Sorting Selector */}
          <div className="relative w-full sm:w-auto flex justify-end">
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowCategoryDropdown(false);
              }}
              style={{ borderRadius: "1px" }}
              className={`flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 border text-xs font-mono font-bold transition-all cursor-pointer w-full sm:w-auto ${
                showFilterDropdown
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                  : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 shadow-2xs"
              }`}
            >
              <span className="text-neutral-500 font-normal">Sırala:</span>
              <span className="font-grotesk font-bold text-neutral-950">
                {activeSort === "featured" ? "Önə çıxanlar" : activeSort === "price-asc" ? "Qiymət: Aşağıdan Yuxarıya" : "Qiymət: Yuxarıdan Aşağıya"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilterDropdown ? "rotate-180" : ""}`} />
            </button>

            {showFilterDropdown && (
              <div 
                style={{ borderRadius: "1px" }}
                className="absolute right-0 mt-2 w-56 p-2 bg-white border border-neutral-200 shadow-xl z-50 text-xs font-mono space-y-1 animate-in fade-in duration-200 text-neutral-900"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-b border-neutral-100 mb-1">
                  Sıralama Qaydası
                </div>
                {[
                  { id: "featured", label: "Önə çıxanlar" },
                  { id: "price-asc", label: "Qiymət: Aşağıdan Yuxarıya" },
                  { id: "price-desc", label: "Qiymət: Yuxarıdan Aşağıya" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setActiveSort(option.id as any);
                      setShowFilterDropdown(false);
                    }}
                    style={{ borderRadius: "1px" }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                      activeSort === option.id 
                        ? "bg-neutral-950 text-white font-bold shadow-xs" 
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                    }`}
                  >
                    <span>{option.label}</span>
                    {activeSort === option.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Product Grid with 6-col Layout - Exact Hazırda Populyar Style & Border Radius */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {sortedProducts.map((prod) => (
            <div 
              key={prod.id}
              style={{ borderRadius: "1px" }}
              className="bg-white rounded-[1px] border border-neutral-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300 group"
            >
              {/* Product Image Frame */}
              <div 
                style={{ borderRadius: "1px" }}
                className="relative w-full aspect-square bg-[#F7F7F7] flex items-center justify-center p-4 overflow-hidden rounded-[1px]"
              >
                {prod.featured && (
                  <span 
                    style={{ borderRadius: "1px" }}
                    className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-[1px] bg-[#0F3F2E] text-white text-[10px] font-mono font-bold z-10"
                  >
                    ÖNƏ ÇIXAN
                  </span>
                )}

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(prod);
                  }}
                  style={{ borderRadius: "1px" }}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-[1px] flex items-center justify-center shadow-xs transition-colors z-10 cursor-pointer ${
                    isInWishlist(prod.id)
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-white/80 hover:bg-white text-neutral-500 hover:text-red-500"
                  }`}
                  title={isInWishlist(prod.id) ? "Bəyəndiklərimdən çıxar" : "Bəyən"}
                >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(prod.id) ? "fill-red-600 stroke-red-600" : "stroke-[1.8]"}`} />
                </button>

                <Link href={`/product/${prod.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                  <img 
                    src={prod.mainImage} 
                    alt={prod.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                </Link>
              </div>

              {/* Content Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  {/* Store Name with verified check */}
                  <div className="flex items-center gap-1 text-[11px] font-sans text-neutral-500 font-medium">
                    <span className="truncate">{prod.designer || "TERZME STORE"}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-600/20 shrink-0" />
                  </div>

                  {/* Product Title */}
                  <Link href={`/product/${prod.id}`} className="hover:underline">
                    <h3 className="text-xs sm:text-sm font-bold font-sans text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-black cursor-pointer">
                      {prod.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 mt-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-neutral-800">4.9</span>
                    <span className="text-[10px]">(24)</span>
                  </div>
                </div>

                {/* Price and Add to Cart Button */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black font-mono text-neutral-950">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.featured && (
                      <span className="text-[10px] font-mono line-through text-neutral-400">
                        {formatPrice(Math.round(prod.price * 1.25))}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(prod)}
                    style={{ borderRadius: "1px" }}
                    className="w-8 h-8 rounded-[1px] bg-neutral-950 hover:bg-black text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                    title="Səbətə at"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
