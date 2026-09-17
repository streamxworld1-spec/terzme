"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Disc3, ShieldCheck, Compass, Terminal, ExternalLink, Code2 } from "lucide-react";

export function Footer({ onNext }: { onNext?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <footer 
      className="w-full text-white z-40 relative border-t border-emerald-950"
      style={{
        background: "linear-gradient(180deg, #07241A 0%, #03140E 100%)",
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-12 md:py-16 flex flex-col gap-12">
        {/* ================= TIER 1: GIANT EDITORIAL BRAND TYPOGRAPHY ================= */}
        <div className="pb-8 border-b border-white/10 overflow-hidden w-full flex items-center justify-between">
          <h2 className="w-full text-center md:text-left text-[14vw] md:text-[11.5rem] lg:text-[14rem] font-black font-display tracking-tight text-white/95 hover:text-white transition-colors duration-500 leading-none select-text whitespace-nowrap">
            TERZME<span className="text-white ml-2 md:ml-4">.</span>
          </h2>
        </div>

        {/* ================= TIER 2: DEEP CATALOG DIRECTORY & EDITORIAL PILLARS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-2 border-b border-white/10 text-xs font-mono">
          
          {/* Column 1: Kolleksiyalar */}
          <div className="flex flex-col space-y-3">
            <span className="text-[11px] font-bold text-white uppercase tracking-widest font-grotesk block">
              KOLLEKSİYALAR
            </span>
            <div className="flex flex-col space-y-2 text-neutral-300 text-[11px]">
              <Link href="/collection" className="hover:text-white transition-colors">Bütün Məhsullar</Link>
              <Link href="/collection/new-arrivals" className="hover:text-white transition-colors">Yeni Buraxılışlar</Link>
              <Link href="/collection/bestsellers" className="hover:text-white transition-colors">Ən Çox Satılanlar</Link>
              <Link href="/collection/hoodies" className="hover:text-white transition-colors">Hudilər & Sviterlər</Link>
              <Link href="/collection/t-shirts" className="hover:text-white transition-colors">Qrafik Köynəklər</Link>
            </div>
          </div>

          {/* Column 2: Məlumat & Qulluq */}
          <div className="flex flex-col space-y-3">
            <span className="text-[11px] font-bold text-white uppercase tracking-widest font-grotesk block">
              KEYFİYYƏT VƏ QULLUQ
            </span>
            <div className="flex flex-col space-y-2 text-neutral-300 text-[11px]">
              <span className="text-white font-bold">450 GSM Premium Material</span>
              <span className="text-neutral-300">100% Təbii Pambıq</span>
              <span className="text-neutral-300">Soyuq Yuma (30°C)</span>
              <span className="text-neutral-300">Bakı Emalatxanası</span>
            </div>
          </div>

          {/* Column 3: Müştəri Xidmətləri */}
          <div className="flex flex-col space-y-3">
            <span className="text-[11px] font-bold text-white uppercase tracking-widest font-grotesk block">
              MÜŞTƏRİ XİDMƏTLƏRİ
            </span>
            <div className="flex flex-col space-y-2 text-neutral-300 text-[11px]">
              <Link href="/orders" className="hover:text-white transition-colors">Sifarişi İzlə</Link>
              <Link href="/cart" className="hover:text-white transition-colors">Səbət</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Əlaqə və Dəstək</Link>
              <a href="mailto:contact@terzme.com" className="text-emerald-300 font-bold hover:underline">contact@terzme.com</a>
            </div>
          </div>

          {/* Column 4: VIP Drop Bildirişləri */}
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-3">
            <span className="text-[11px] font-bold text-white uppercase tracking-widest font-grotesk block">
              ÖZƏL VIP BİLDİRİŞLƏR
            </span>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Yeni buraxılışlar və eksklüziv kolleksiyalar haqqında ilk siz xəbərdar olun.
            </p>
            <div className="relative flex items-center mt-1">
              <input 
                type="email" 
                placeholder="email@unvaniniz.com"
                className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-4 pr-12 text-xs text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 shadow-xs"
              />
              <button 
                className="absolute right-1.5 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs font-bold"
                title="Abunə ol"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>


        {/* ================= TIER 5: CREDITS & LEGAL ================= */}
        <div className="flex flex-col gap-4 text-xs font-mono text-neutral-300">

          {/* Sub Bottom Row: Simple, Clean & High-Contrast (100% Readable) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono">

            {/* Left: Simple Clean Developer Link */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-300">developed by</span>
              <a 
                href="https://www.codfy.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-black text-white underline underline-offset-4 decoration-emerald-400 hover:text-emerald-300 transition-colors"
              >
                codfy.
              </a>
            </div>


            {/* Right: Simple Legal Links */}
            <div className="flex items-center gap-4 text-xs font-bold text-white">
              <Link 
                href="/contact" 
                className="hover:text-emerald-300 hover:underline underline-offset-4 transition-all"
              >
                məxfilik siyasəti
              </Link>
              <span className="text-neutral-500">•</span>
              <Link 
                href="/contact" 
                className="hover:text-emerald-300 hover:underline underline-offset-4 transition-all"
              >
                istifadə şərtləri
              </Link>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}

