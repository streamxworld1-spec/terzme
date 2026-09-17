"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Vendor } from "@/app/actions";

export function TerzmeStoresSection() {
  const [stores, setStores] = useState<Vendor[]>([]);

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const approved = data.filter((s: Vendor) => s.status === "active");
          setStores(approved.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  if (stores.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#051A13] py-14 text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-grotesk tracking-tight uppercase">
              Mağazaları Kəşf Et
            </h2>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              100+ mağazanı kəşf et
            </p>
          </div>

          <Link
            href="/stores"
            className="px-5 py-2 rounded-xl border border-white/20 hover:border-white text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
          >
            <span>Bütün mağazalar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 STORES CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden relative group hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Photo Split / Banner */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src={store.coverImage}
                  alt={store.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Left Brand Badge / Emblem on card */}
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20">
                    <span className="font-grotesk font-black text-xs tracking-wider uppercase text-white">
                      {store.name.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Bottom Store Info */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-black font-grotesk tracking-tight text-white uppercase">
                      {store.name}
                    </h3>
                    {store.verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] font-mono text-neutral-300">
                    {store.category}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                    <span>★ {store.rating || 4.9}</span>
                    <span>|</span>
                    <span>{store.reviewCount || 90} məhsul</span>
                  </div>
                </div>
              </div>

              {/* Action Button at bottom */}
              <div className="p-3 bg-black/60 border-t border-white/5">
                <Link
                  href={`/stores/${store.slug}`}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center transition-all"
                >
                  MAĞAZAYA BAX
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
