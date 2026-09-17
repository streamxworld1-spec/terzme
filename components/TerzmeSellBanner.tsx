"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Store, 
  Layers, 
  CreditCard, 
  Truck, 
  BarChart3, 
  Megaphone, 
  Package 
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Vendor } from "@/app/actions";

export function TerzmeSellBanner() {
  const { user } = useAuth();
  const [userStore, setUserStore] = React.useState<{ slug: string; name: string } | null>(null);

  React.useEffect(() => {
    if (!user) {
      setUserStore(null);
      return;
    }
    if (user.ownedStoreSlug) {
      setUserStore({ slug: user.ownedStoreSlug, name: user.ownedStoreName || "Mağazam" });
      return;
    }
    fetch("/api/vendors")
      .then((r) => r.json())
      .then((vendors: Vendor[]) => {
        if (Array.isArray(vendors) && user.email) {
          const userEmailNorm = user.email.toLowerCase().trim();
          const found = vendors.find((v) => {
            const vEmail = (v.email || "").toLowerCase().trim();
            const vOwner = (v.ownerEmail || "").toLowerCase().trim();
            return vEmail === userEmailNorm || vOwner === userEmailNorm;
          });
          if (found) setUserStore({ slug: found.slug, name: found.name });
        }
      })
      .catch(() => {});
  }, [user]);

  const perks = [
    { icon: Store, label: "Mağaza aç" },
    { icon: Layers, label: "Məhsul idarəetməsi" },
    { icon: Package, label: "Sifariş paneli" },
    { icon: CreditCard, label: "Ödəniş sistemi" },
    { icon: Truck, label: "TƏRZ ME KURYER XİDMƏTİ" },
    { icon: BarChart3, label: "Analitika" },
    { icon: Megaphone, label: "Reklam imkanları" },
  ];

  return (
    <section className="w-full bg-[#07241A] py-8 text-white border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          
          {/* LEFT: LOGO + TITLE */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-2 shrink-0">
              <img
                src="/trz-logo-white.png"
                alt="TRZ"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-grotesk tracking-tight text-white uppercase">
                Tərz Me-də sat
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-0.5">
                Öz biznesini Tərz Me-ə gətir. Minlərlə alıcıya çıxış əldə et.
              </p>
            </div>
          </div>

          {/* CENTER CTA BUTTON */}
          <div className="shrink-0">
            {userStore ? (
              <Link
                href={`/admin/stores/${userStore.slug}`}
                className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#07241A] font-black text-xs uppercase tracking-wider font-grotesk shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <span>MAĞAZAYA BAX ({userStore.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/open-store"
                className="px-6 py-3.5 rounded-xl bg-[#0F3F2E] hover:bg-[#15563f] text-white font-bold text-xs uppercase tracking-wider font-grotesk border border-emerald-500/40 shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <span>İNDİ MAĞAZA AÇ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* RIGHT ICONS BENEFIT STRIP */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-[11px] font-sans text-neutral-300 pt-2 xl:pt-0 border-t xl:border-t-0 border-white/10">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="whitespace-nowrap">{p.label}</span>
                </div>
              );
            })}
          </div>

          {/* BRAND BOX VISUAL ACCENT */}
          <div className="hidden 2xl:flex items-center pl-4 border-l border-white/10">
            <div className="w-16 h-12 rounded-lg bg-black border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-inner">
              TƏRZ ME
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
