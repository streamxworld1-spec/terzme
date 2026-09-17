"use client";

import React from "react";
import Link from "next/link";
import { 
  Flame, 
  Heart, 
  ShoppingBag, 
  CheckCircle2, 
  Star, 
  ArrowRight 
} from "lucide-react";
import { POPULAR_PRODUCTS } from "@/data/mockupData";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";

export function TerzmePopularProducts() {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Helper to map PopularProduct to a standard Product for wishlist
  const getProductForWishlist = (item: any) => {
    const existing = PRODUCTS.find((p) => p.id === item.id);
    if (existing) return existing;
    return {
      id: item.id,
      code: "TRZ-" + item.id.toUpperCase(),
      categoryNumber: "01",
      name: item.name,
      subtitle: item.storeName,
      price: item.price,
      currency: "$",
      designer: item.storeName,
      season: "ARCHIVE 2026",
      category: "new-arrivals" as const,
      details: {
        title: item.name,
        studio: item.storeName,
        era: "2026",
        specs: ["PREMIUM FABRIC", "LIMITED RUN"],
        lining: "Organic Cotton",
        pocket: "Standard",
        composition: "100% Cotton",
      },
      mainImage: item.image,
      sideImage: item.image,
      sideTitle: "SIDE VIEW",
      sideSubtitle: item.name,
      hotspots: [],
      colors: ["#111111", "#ffffff"],
      sizes: ["S", "M", "L", "XL"],
      features: ["Breathable Cotton", "Heavyweight"],
    };
  };

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-6">
        
        {/* SECTION TITLE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-xl sm:text-2xl font-black font-grotesk tracking-tight text-neutral-950">
              Hazırda Populyar
            </h2>
          </div>

          <Link
            href="/collection"
            className="text-xs font-mono font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-1.5 transition-colors"
          >
            <span>Hamısına bax</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 PRODUCT CARDS IN A ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_PRODUCTS.map((item) => {
            const isLiked = isInWishlist(item.id);
            return (
              <div 
                key={item.id}
                style={{ borderRadius: "1px" }}
                className="group relative flex flex-col bg-white border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 hover:shadow-lg rounded-[1px] overflow-hidden justify-between"
              >
                {/* Image Frame */}
                <div 
                  style={{ borderRadius: "1px" }}
                  className="relative w-full aspect-square bg-[#F7F7F7] flex items-center justify-center p-4 overflow-hidden rounded-[1px]"
                >
                  {item.discountBadge && (
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-[1px] bg-[#0F3F2E] text-white text-[10px] font-mono font-bold z-10"
                    >
                      {item.discountBadge}
                    </span>
                  )}

                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(getProductForWishlist(item));
                    }}
                    style={{ borderRadius: "1px" }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-[1px] flex items-center justify-center shadow-xs transition-colors z-10 cursor-pointer ${
                      isLiked 
                        ? "bg-red-50 text-red-600 border border-red-200" 
                        : "bg-white/90 hover:bg-white text-neutral-500 hover:text-red-500"
                    }`}
                    title={isLiked ? "Bəyəndiklərimdən çıxar" : "Bəyən"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-600 stroke-red-600" : "stroke-[1.8]"}`} />
                  </button>

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Body */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Store Name with verified check */}
                    <div className="flex items-center gap-1 text-[11px] font-sans text-neutral-500 font-medium">
                      <span className="truncate">{item.storeName}</span>
                      {item.storeVerified && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-600/20 shrink-0" />
                      )}
                    </div>

                    {/* Product Title */}
                    <h3 className="text-xs sm:text-sm font-bold font-sans text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-black">
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-neutral-800">{item.rating}</span>
                      <span className="text-[10px]">({item.reviewCount})</span>
                    </div>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-black font-mono text-neutral-950">
                        {formatPrice(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-[10px] font-mono line-through text-neutral-400">
                          {formatPrice(item.oldPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          code: "POP",
                          categoryNumber: "01",
                          name: item.name,
                          subtitle: item.storeName,
                          price: item.price,
                          currency: "₼",
                          designer: item.storeName,
                          season: "2026",
                          category: "bestsellers",
                          details: {
                            title: item.name,
                            studio: item.storeName,
                            era: "2026",
                            specs: [],
                            lining: "Cotton",
                            pocket: "Yes",
                            composition: "Premium Cotton"
                          },
                          mainImage: item.image,
                          sideImage: item.image,
                          sideTitle: item.name,
                          sideSubtitle: item.storeName,
                          hotspots: [],
                          colors: ["#000000"],
                          sizes: ["M"],
                          features: []
                        })
                      }
                      style={{ borderRadius: "1px" }}
                      className="w-8 h-8 rounded-[1px] bg-neutral-950 hover:bg-black text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                      title="Səbətə at"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
