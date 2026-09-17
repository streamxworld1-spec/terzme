"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getOrders, Order } from "@/app/actions";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ArrowLeft, Package, Lock, LogIn, Sparkles, User, ExternalLink, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { formatPrice } = useCurrency();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setAllOrders(data || []);
      setIsLoading(false);
    });
  }, []);

  // Filter orders for the active account (admin can view all or own)
  const userOrders = React.useMemo(() => {
    if (!user) return [];

    // Also merge with any local client orders for this account
    let localSaved: Order[] = [];
    try {
      const localStr = localStorage.getItem(`terzme_orders_${user.id || user.username}`);
      if (localStr) localSaved = JSON.parse(localStr);
    } catch (e) {}

    if (user.role === "admin") {
      return allOrders;
    }

    const filteredServer = allOrders.filter(
      (o) =>
        o.userId === user.id ||
        (o.username && o.username.toLowerCase() === (user.username || "").toLowerCase()) ||
        (o.userEmail && o.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (o.customer?.email && o.customer.email.toLowerCase() === user.email.toLowerCase())
    );

    // Merge without duplicates by ID
    const mergedMap = new Map<string, Order>();
    localSaved.forEach((o) => mergedMap.set(o.id, o));
    filteredServer.forEach((o) => mergedMap.set(o.id, o));
    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allOrders, user]);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 my-auto py-10 z-30 flex-1">
        <div 
          style={{ borderRadius: "1px" }}
          className="relative p-8 md:p-12 border border-neutral-200/90 shadow-2xs text-neutral-950 bg-white"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                style={{ borderRadius: "1px" }}
                className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors border border-neutral-200 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-900" />
              </Link>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">
                  {user?.role === "admin" ? "SİSTEM SİFARİŞ BAZASI" : "ŞƏXSİ SİFARİŞ TARİXÇƏSİ"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display uppercase text-neutral-950">
                  {user ? `${user.name} — SİFARİŞLƏRİM (${userOrders.length})` : "SİFARİŞLƏRİM"}
                </h1>
              </div>
            </div>

            {user && (
              <div className="text-left md:text-right font-mono text-xs text-neutral-500">
                <span 
                  style={{ borderRadius: "1px" }}
                  className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold"
                >
                  HESAB: @{user.username || user.email.split("@")[0]}
                </span>
              </div>
            )}
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
                  SİFARİŞLƏRİNİZƏ BAXMAQ ÜÇÜN DAXİL OLUN
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                  Hesabınıza daxil olaraq verdiyiniz sifarişlərin statusunu, çatdırılma məlumatlarını və qəbzlərini izləyə bilərsiniz.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={openAuthModal}
                  style={{ borderRadius: "1px" }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>HESABA DAXİL OL</span>
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="py-20 text-center font-mono text-xs text-neutral-500">
              Sifarişlər yüklənir...
            </div>
          ) : userOrders.length === 0 ? (
            <div className="py-24 text-center space-y-3 max-w-md mx-auto">
              <Package className="w-12 h-12 text-neutral-400 mx-auto" />
              <h3 className="text-lg font-bold font-display uppercase text-neutral-950">
                Hələlik heç bir sifarişiniz yoxdur
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Bəyəndiyiniz məhsulları səbətə əlavə edərək ilk sifarişinizi rəsmiləşdirə bilərsiniz.
              </p>
              <div className="pt-2">
                <Link
                  href="/collection"
                  style={{ borderRadius: "1px" }}
                  className="inline-block px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Kolleksiyaya Keç
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {userOrders.map((order) => (
                <div 
                  key={order.id}
                  style={{ borderRadius: "1px" }}
                  className="p-6 bg-[#FAFAF8] border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      style={{ borderRadius: "1px" }}
                      className="w-12 h-12 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-950 shrink-0 mt-1"
                    >
                      <Package className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold font-mono text-neutral-950">{order.id}</span>
                        <span 
                          style={{ borderRadius: "1px" }}
                          className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                        >
                          {order.payment}
                        </span>
                        <span 
                          style={{ borderRadius: "1px" }}
                          className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200 text-neutral-800 font-bold"
                        >
                          {order.fulfillment || order.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 font-medium">
                        Tarix: <span className="text-neutral-950 font-mono">{order.date || order.createdAt?.split("T")[0]}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        Ünvan: {order.customer?.address || "Bakı"}
                      </p>
                      <div className="pt-1">
                        <Link 
                          href={`/track?code=${order.trackingCode}`}
                          className="text-[11px] font-mono text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
                        >
                          <span>Canlı İzlə ({order.trackingCode})</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Items previews & Total */}
                  <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-neutral-200">
                    <div className="flex -space-x-3 overflow-hidden">
                      {(order.items || order.products || []).slice(0, 3).map((p: any, idx: number) => (
                        <img 
                          key={idx} 
                          src={p.image || "/hoodie/hoodie-main.png"} 
                          alt={p.name} 
                          className="w-10 h-10 rounded-full bg-white border-2 border-neutral-200 object-contain p-0.5" 
                        />
                      ))}
                      {((order.items || order.products || []).length > 3) && (
                        <div className="w-10 h-10 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center text-[10px] font-mono text-neutral-900 font-bold">
                          +{((order.items || order.products || []).length) - 3}
                        </div>
                      )}
                    </div>

                    <div className="text-right leading-none">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                        {(order.items || order.products || []).length} ƏDƏD
                      </span>
                      <span className="text-lg font-bold font-mono text-neutral-950">
                        {formatPrice(order.totalAmount || 0, { showCode: true })}
                      </span>
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
