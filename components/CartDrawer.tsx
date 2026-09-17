"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Sparkles,
  Lock,
  ArrowUpRight,
  Package,
  Tag,
  CheckCircle2
} from "lucide-react";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart, totalItems } = useCart();
  const { formatPrice, convertPrice, currency } = useCurrency();
  const router = useRouter();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(150);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.freeShippingThreshold === "number") {
          setFreeShippingThreshold(data.freeShippingThreshold);
        }
      })
      .catch(() => {});
  }, []);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const isFreeShipping = remainingForFreeShipping === 0;

  const discountAmount = promoApplied ? totalPrice * 0.1 : 0;
  const shippingCost = isFreeShipping ? 0 : 5;
  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  const applyPromo = () => {
    if (promoCode.trim().length > 0) {
      setPromoApplied(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-[440px] h-full flex flex-col justify-between shadow-2xl overflow-hidden text-neutral-950 relative select-text selection:bg-neutral-900 selection:text-white"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 246, 240, 0.94) 100%)",
          backdropFilter: "blur(50px) saturate(200%)",
          WebkitBackdropFilter: "blur(50px) saturate(200%)",
          borderLeft: "1.5px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="p-6 pb-4 border-b border-black/[0.06] bg-white/50 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md shadow-black/10">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight font-grotesk text-neutral-950 flex items-center gap-2">
                  <span>SƏBƏT</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {totalItems} ədəd
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[10px] font-mono text-neutral-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Səbəti təmizlə"
                >
                  Təmizlə
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                title="Bağla"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 divide-y-0">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-2 py-10 my-auto">
              {/* Luxury Icon with ambient glow & floating animation */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-neutral-900/10 rounded-full blur-xl transform scale-150" />
                <div 
                  className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border border-white/80"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 235, 226, 0.75) 100%)",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.9)"
                  }}
                >
                  <ShoppingBag className="w-9 h-9 text-neutral-900 stroke-[1.5]" />
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-neutral-950 text-white text-[10px] font-mono font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    0
                  </span>
                </div>
              </div>

              {/* Headings */}
              <h3 className="text-xl font-black font-grotesk tracking-tight text-neutral-950">
                Səbətiniz hələlik boşdur
              </h3>
              <p className="text-xs text-neutral-500 mt-2 font-sans max-w-[260px] leading-relaxed">
                Eksklüziv geyimlər və xüsusi buraxılış modelləri kəşf edib zövqünüzə uyğun olanı seçin.
              </p>

              {/* Quick Category Discovery Pills */}
              <div className="mt-6 flex flex-wrap justify-center gap-1.5 max-w-[300px]">
                {[
                  { label: "Yeni Gələnlər", href: "/collection/new-arrivals" },
                  { label: "Ən Çox Satılanlar", href: "/collection/bestsellers" },
                  { label: "Hudilər", href: "/collection/hoodies" },
                  { label: "Qrafik Köynəklər", href: "/collection/t-shirts" },
                ].map((c) => (
                  <button
                    key={c.href}
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push(c.href);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white border border-black/[0.06] hover:border-black/20 text-[11px] font-mono text-neutral-700 hover:text-black transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Futuristic Discovery Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/collection");
                }}
                className="mt-7 w-full max-w-[300px] h-13 rounded-2xl bg-neutral-950 hover:bg-black text-white font-black text-xs uppercase tracking-widest font-grotesk flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer group"
              >
                <span>KOLLEKSİYANI KƏŞF ET</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const colorVal = typeof item.selectedColor === "string" ? item.selectedColor : (item.selectedColor as any)?.hex || "#000000";
              const isHex = colorVal.startsWith("#");

              return (
                <div
                  key={`${item.product.id}-${colorVal}-${item.selectedSize}-${idx}`}
                  className="group relative rounded-2xl p-3.5 flex gap-3.5 items-center bg-white/80 hover:bg-white border border-black/[0.06] shadow-xs hover:shadow-md transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.product.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-20 h-22 rounded-xl bg-gradient-to-b from-neutral-50 to-neutral-100 border border-black/[0.05] p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative"
                  >
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-bold text-xs font-grotesk text-neutral-950 hover:text-black line-clamp-1 leading-snug"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-300 hover:text-red-600 transition-colors p-1 -mr-1 cursor-pointer"
                        title="Məhsulu sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta Pills (Size & Color Swatch) */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono font-bold text-neutral-800 border border-black/[0.05]">
                        Ölçü: {item.selectedSize}
                      </span>
                      {colorVal && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono font-bold text-neutral-800 border border-black/[0.05]">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: isHex ? colorVal : "#222" }}
                          />
                          <span>Rəng</span>
                        </span>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/[0.04]">
                      <span className="font-black text-sm font-mono tracking-tight text-neutral-950">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      
                      {/* Modern Minimal Stepper */}
                      <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-black/[0.06]">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-neutral-700 hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
                          title="Azalt"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-mono font-black text-neutral-950 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-neutral-700 hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90"
                          title="Artır"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM CHECKOUT ACTIONS */}
        {cart.length > 0 && (
          <div className="p-6 pt-5 border-t border-black/[0.08] bg-white/80 backdrop-blur-md space-y-4">
            {/* PROMO / ATELIER CODE ACCORDION */}
            <div className="pt-1">
              <button
                onClick={() => setShowPromo(!showPromo)}
                className="text-[11px] font-mono text-neutral-500 hover:text-neutral-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                <span>{showPromo ? "Promokod xanasını bağla" : "Promokod və ya Endirim Kuponunuz var?"}</span>
              </button>

              {showPromo && (
                <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Kupon kodunu daxil edin"
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-100/90 border border-black/[0.08] text-xs font-mono uppercase text-neutral-900 placeholder:normal-case placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-950 focus:bg-white transition-all"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Tətbiq Et
                  </button>
                </div>
              )}
              {promoApplied && (
                <p className="text-[10px] font-mono text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>10% Atelier endirimi tətbiq edildi!</span>
                </p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs font-mono pt-1">
              <div className="flex justify-between text-neutral-500">
                <span>Ara cəm:</span>
                <span className="font-bold text-neutral-950">{formatPrice(totalPrice)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-700">
                  <span>Endirim (10%):</span>
                  <span className="font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Çatdırılma:</span>
                <span className={isFreeShipping ? "text-emerald-700 font-bold" : "text-neutral-950 font-bold"}>
                  {isFreeShipping ? "PULSUZ (ÖDƏNİŞSİZ)" : formatPrice(5)}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-base font-black text-neutral-950 pt-2.5 border-t border-black/[0.06]">
                <span className="font-grotesk tracking-tight uppercase text-xs sm:text-sm">
                  YEKUN MƏBLƏĞ:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Primary Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                router.push("/checkout");
              }}
              className="w-full h-14 bg-neutral-950 hover:bg-black text-white font-black rounded-2xl flex items-center justify-between px-6 text-xs uppercase tracking-widest font-grotesk transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                <span>SİFARİŞİ TAMAMLA</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-sm">
                <span>{formatPrice(finalTotal)}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Security & Guarantee Footer Badge */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Təhlükəsiz
              </span>
              <span>•</span>
              <span>24 Saatda Çatdırılma</span>
              <span>•</span>
              <span>14 Gün Dəyişmə</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
