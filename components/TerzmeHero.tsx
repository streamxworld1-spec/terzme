"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Globe } from "lucide-react";

export function TerzmeHero() {
  return (
    <section className="relative w-full bg-[#061F16] overflow-hidden text-white min-h-[560px] lg:min-h-[640px] flex items-center">
      {/* BACKGROUND ACCENTS & RADIAL GLOW */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#051A13] via-[#07241A] to-[#0a3124] pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* SINGLE UNIFIED 4K ULTRA-HD FULL-WIDTH BACKGROUND PHOTO */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/terzme-hero-4k-clean.jpg"
          alt="TERZME Streetwear Hero Atmospheric Background"
          className="w-full h-full object-cover object-center brightness-105 contrast-105"
        />
        {/* Soft edge darkening to ensure 100% crisp readability for text & buttons */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#051A13]/85 via-transparent to-[#07241A]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061F16]/60 via-transparent to-[#061F16]/40" />
      </div>

      {/* INNER CONTENT GRID */}
      <div className="relative max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-16 flex flex-col lg:flex-row items-center justify-between z-10">
        
        {/* LEFT COPY & CTAS */}
        <div className="max-w-xl space-y-5">
          <span className="text-[13px] font-display font-black tracking-[0.28em] text-neutral-300 uppercase block drop-shadow-xs">
            TƏRZ ME
          </span>

          <h1 className="text-5xl sm:text-7xl lg:text-[90px] font-display font-black tracking-tight text-white uppercase leading-[0.90] drop-shadow-md">
            TƏRZİNİ<br />KƏŞF ET
          </h1>

          <p className="text-sm sm:text-base text-neutral-200 font-sans max-w-md leading-relaxed font-normal">
            Bir platforma. Minlərlə məhsul.<br />
            Yüzlərlə mağaza.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/collection"
              className="px-8 py-3.5 rounded-none bg-[#0F3F2E] hover:bg-[#134e39] text-white font-bold text-xs uppercase tracking-wider font-grotesk border border-emerald-500/30 shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>İNDİ AL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/stores"
              className="px-7 py-3.5 rounded-none bg-black/40 hover:bg-black/60 text-white font-bold text-xs uppercase tracking-wider font-grotesk border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              MAĞAZALARI KƏŞF ET
            </Link>
          </div>
        </div>

        {/* RIGHT SIDEBAR BRAND WATERMARK & LIFESTYLE BADGES */}
        <div className="hidden lg:flex flex-col items-end justify-between space-y-12 pr-6">
          <div className="text-right space-y-1">
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-400 block font-bold">
              STREETWEAR
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-400 block font-bold">
              FASHION
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-400 block font-bold">
              LIFESTYLE
            </span>
          </div>

          {/* TRZ ITALIC EMBLEM */}
          <div className="py-6">
            <span className="text-5xl font-black font-grotesk italic tracking-tighter text-white select-none">
              TRZ
            </span>
          </div>

          <div>
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-neutral-300">
              <Globe className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
