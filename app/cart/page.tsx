"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 my-auto py-8 z-30">
        <div 
          style={{ borderRadius: "1px" }}
          className="relative p-6 md:p-10 border border-neutral-200/90 shadow-2xs text-neutral-950 bg-white"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                style={{ borderRadius: "1px" }}
                className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors border border-neutral-200 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-900" />
              </Link>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">
                  02® STUDIO / BAG
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-grotesk text-neutral-950">
                  SHOPPING BAG ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h1>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-mono text-neutral-500 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Table / Grid */}
          {cart.length === 0 ? (
            <div className="py-24 text-center">
              <div 
                style={{ borderRadius: "1px" }}
                className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-neutral-500"
              >
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-grotesk text-neutral-950">Səbətiniz boşdur</h3>
              <p className="text-xs text-neutral-500 font-mono mt-2 mb-6">Yeni kolleksiyaları kəşf edərək məhsul əlavə edin.</p>
              <Link
                href="/collection"
                style={{ borderRadius: "1px" }}
                className="inline-flex items-center gap-2 bg-neutral-950 text-white px-7 py-3 text-xs font-bold font-grotesk uppercase tracking-wider hover:bg-black transition-all shadow-xs"
              >
                Kolleksiyaya Keç
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
              {/* Left Items Column */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                    style={{ borderRadius: "1px" }}
                    className="p-4 sm:p-5 bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-5 justify-between hover:border-neutral-300 transition-all"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div 
                        style={{ borderRadius: "1px" }}
                        className="w-20 h-20 bg-[#F7F7F7] border border-neutral-200 p-2 flex items-center justify-center shrink-0"
                      >
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                          {item.product.code} // {item.product.categoryNumber}
                        </span>
                        <h4 className="text-sm font-bold font-sans text-neutral-900">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-neutral-500 font-mono mt-1">
                          Size: <span className="text-neutral-950 font-bold">{item.selectedSize}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Controller */}
                      <div 
                        style={{ borderRadius: "1px" }}
                        className="flex items-center gap-2.5 bg-neutral-100 px-3 py-1 border border-neutral-200 shadow-2xs"
                      >
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center text-neutral-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-base font-bold font-mono text-neutral-950 min-w-[70px] text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 hover:bg-neutral-100 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Summary Column */}
              <div 
                style={{ borderRadius: "1px" }}
                className="lg:col-span-4 bg-[#FAFAF8] border border-neutral-200 p-6 h-fit space-y-6 shadow-2xs"
              >
                <h3 className="text-base font-bold font-grotesk uppercase tracking-wider pb-4 border-b border-neutral-200 text-neutral-950">
                  Sifariş Xülasəsi
                </h3>

                <div className="space-y-3 text-xs font-mono text-neutral-600">
                  <div className="flex justify-between">
                    <span>Məhsullar</span>
                    <span className="font-bold text-neutral-950">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standart Çatdırılma</span>
                    <span className="text-emerald-700 font-bold uppercase">Pulsuz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Təxmini Vergi</span>
                    <span className="font-bold text-neutral-950">{formatPrice(0)}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold font-grotesk text-neutral-950">
                    <span>Yekun Məbləğ</span>
                    <span className="font-mono font-black">{formatPrice(totalPrice, { showCode: true })}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  style={{ borderRadius: "1px" }}
                  className="w-full bg-neutral-950 hover:bg-black text-white font-black py-3.5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-grotesk transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Sifarişi Rəsmiləşdir</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-BIT ENCRYPTED LUXURY CHECKOUT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
