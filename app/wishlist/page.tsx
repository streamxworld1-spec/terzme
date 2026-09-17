"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  LogIn,
  Lock
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <div className="relative z-40">
        <Navbar />
      </div>

      <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 py-10 sm:py-14 z-30 flex-1">
        <div 
          style={{ borderRadius: "1px" }}
          className="relative p-6 sm:p-12 md:p-16 border border-neutral-200/90 shadow-2xs bg-white text-neutral-950 space-y-12"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
            <div className="space-y-3">
              <div 
                style={{ borderRadius: "1px" }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono uppercase tracking-widest font-bold shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>ŞƏXSİ ARCHIVE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase leading-[1.05]">
                BƏYƏNDİKLƏRİM
              </h1>
            </div>

            <div className="text-left md:text-right max-w-sm">
              <span 
                style={{ borderRadius: "1px" }}
                className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200 mb-1"
              >
                WISHLIST • {totalWishlistItems} ƏDƏD
              </span>
              <p className="text-xs font-mono text-neutral-500">
                Seçdiyiniz geyim və aksesuarları bir yerdə toplayın və asanlıqla səbətə əlavə edin.
              </p>
            </div>
          </div>

          {/* Unauthenticated State */}
          {!isAuthenticated ? (
            <div className="py-20 text-center space-y-6 max-w-md mx-auto">
              <div 
                style={{ borderRadius: "1px" }}
                className="w-16 h-16 bg-[#07241A]/5 border border-[#07241A]/20 text-[#07241A] flex items-center justify-center mx-auto"
              >
                <Lock className="w-7 h-7 stroke-[1.8]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-neutral-950">
                  WISHLIST ÜÇÜN HESAB TƏLƏB OLUNUR
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                  Bəyəndiyiniz eksklüziv parçaları arxivinizdə saxlamaq və istənilən cihazdan daxil olmaq üçün e-poçt və ya Google hesabınız ilə giriş edin.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={openAuthModal}
                  style={{ borderRadius: "1px" }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>DAXİL OL / QEYDİYYAT</span>
                </button>
                <Link
                  href="/collection"
                  style={{ borderRadius: "1px" }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-black font-display text-xs uppercase tracking-widest transition-all border border-neutral-200"
                >
                  <span>MƏHSULLARA BAX</span>
                </Link>
              </div>
            </div>
          ) : wishlist.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center space-y-5 max-w-md mx-auto">
              <div 
                style={{ borderRadius: "1px" }}
                className="w-16 h-16 bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto"
              >
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-neutral-950">
                  BƏYƏNDİYİNİZ MƏHSUL YOXDUR
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                  Kolleksiyadakı məhsulların üzərindəki ürək ikonuna klikləyərək istədiyiniz parçaları bura əlavə edə bilərsiniz.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/collection"
                  style={{ borderRadius: "1px" }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest transition-all shadow-2xs"
                >
                  <span>KOLLEKSİYANI KƏŞF ET</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Wishlist Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((prod) => (
                <div 
                  key={prod.id}
                  style={{ borderRadius: "1px" }}
                  className="group relative flex flex-col bg-white border border-neutral-200/90 hover:border-neutral-950 transition-all duration-300 shadow-2xs hover:shadow-lg overflow-hidden justify-between"
                >
                  {/* Image Frame */}
                  <div 
                    style={{ borderRadius: "1px" }}
                    className="relative w-full aspect-square bg-[#F7F7F7] flex items-center justify-center p-4 overflow-hidden"
                  >
                    <button 
                      onClick={() => removeFromWishlist(prod.id)}
                      style={{ borderRadius: "1px" }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 hover:bg-white text-neutral-500 hover:text-red-600 flex items-center justify-center shadow-xs transition-colors z-10 cursor-pointer border border-neutral-200"
                      title="Siyahıdan çıxar"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
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
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-sans text-neutral-500 font-medium">
                        <span className="truncate">{prod.designer || prod.subtitle || "TERZME STORE"}</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-600/20 shrink-0" />
                      </div>

                      <Link href={`/product/${prod.id}`}>
                        <h3 className="text-sm font-black font-display uppercase tracking-tight text-neutral-950 line-clamp-1 mt-1 group-hover:text-black hover:underline">
                          {prod.name}
                        </h3>
                      </Link>

                      <div className="mt-2 text-base font-black font-mono text-neutral-950">
                        {formatPrice(prod.price)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
                      <button
                        onClick={() => addToCart(prod)}
                        style={{ borderRadius: "1px" }}
                        className="flex-1 h-10 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>SƏBƏTƏ AT</span>
                      </button>

                      <Link
                        href={`/product/${prod.id}`}
                        style={{ borderRadius: "1px" }}
                        className="h-10 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-mono text-xs flex items-center justify-center transition-colors"
                        title="Ətraflı Bax"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
