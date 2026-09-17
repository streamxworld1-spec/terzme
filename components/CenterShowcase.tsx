"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { 
  RotateCcw, 
  Search, 
  Sparkles,
  ArrowRight,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";

export function CenterShowcase({ onOpenAuth }: { onOpenAuth?: () => void }) {
  const [productIdx, setProductIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeHotspot, setActiveHotspot] = useState<string | null>("hs-1");
  const [isRotating, setIsRotating] = useState(false);

  const { addToCart } = useCart();
  const product = PRODUCTS[productIdx];

  const handleNextProduct = () => {
    setIsRotating(true);
    setTimeout(() => {
      setProductIdx((prev) => (prev + 1) % PRODUCTS.length);
      setIsRotating(false);
    }, 250);
  };

  return (
    <section className="center-showcase-wrapper w-full max-w-[1600px] mx-auto px-2 sm:px-6 my-auto pt-6 pb-8 z-30">
      {/* 1 ULTRA MASSIVE STANDALONE CARD WITH NAVBAR EMBEDDED INSIDE */}
      <div 
        className="relative rounded-[2.5rem] overflow-hidden shadow-[0_45px_110px_-20px_rgba(0,0,0,0.35)] border border-neutral-300/80 h-[720px] sm:h-[840px] md:h-[920px] lg:h-[980px] xl:h-[1040px] bg-neutral-200"
      >
        {/* EMBEDDED NAVBAR INSIDE THE CARD */}
        <div className="absolute top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-8">
          <Navbar onOpenAuth={onOpenAuth} className="!pt-4 sm:!pt-6 !max-w-[1500px] !px-0" />
        </div>

        {/* 2 PHOTOS FILLING THE ENTIRE CARD */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          {/* LEFT HALF */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
            <img
              src="https://i.pinimg.com/736x/86/64/c1/8664c11ee49eccc0e8f8426803e0465e.jpg"
              alt="TERZME Streetwear Lookbook 01"
              className="w-full h-full object-cover object-center grayscale-[40%] contrast-[1.04] brightness-[0.98] saturate-[85%]"
            />
          </div>

          {/* RIGHT HALF */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
            <img
              src="https://i.pinimg.com/736x/b9/9f/cd/b99fcd351aa9e8c6ea3b36abbae88e74.jpg"
              alt="TERZME Streetwear Lookbook 02"
              className="w-full h-full object-cover object-center grayscale-[40%] contrast-[1.04] brightness-[0.98] saturate-[85%]"
            />
          </div>
        </div>

        {/* CENTER PURE EDITORIAL TYPOGRAPHY (NO CARD / BOLD & MEANINGFUL) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center select-none w-full max-w-2xl px-4">
          <div className="flex flex-col items-center drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)]">
            <span className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.45em] text-neutral-300 uppercase font-bold">
              BİZİM KÜÇƏLƏR • BİZİM STİL
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-grotesk tracking-tight text-white uppercase mt-2 leading-[0.95]">
              SƏSİNİ GEYİN<span className="text-neutral-400">.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base font-sans text-neutral-200 font-medium tracking-wide mt-3 max-w-md mx-auto leading-relaxed drop-shadow-md">
              Kompromissiz keyfiyyət və memarlıq kəsimləri ilə fərqini göstər.
            </p>
          </div>
        </div>

        {/* BOTTOM GRADIENT VIGNETTE & EDITORIAL TYPOGRAPHY */}
        <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none p-6 sm:p-10 md:p-14 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-neutral-300 block">
              BAKU ATELIER • EDITION 2026
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-grotesk tracking-tight text-white uppercase leading-none">
              TERZME<span className="text-neutral-400">.</span>
            </h2>
          </div>

          <div className="text-left md:text-right max-w-sm">
            <p className="text-xs sm:text-sm font-sans text-neutral-200 font-medium leading-relaxed drop-shadow-sm">
              MÜASİR KÜÇƏ DƏBİ. Minimalist forma, memarlıq kəsimləri və premium geyim sənəti.
            </p>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mt-1 block">
              450 GSM FRENCH TERRY • HANDCRAFTED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
