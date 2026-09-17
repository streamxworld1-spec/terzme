"use client";

import React, { useState } from "react";
import { TerzmeHeader } from "@/components/TerzmeHeader";
import { TerzmeHero } from "@/components/TerzmeHero";
import { TerzmeCategoriesRow } from "@/components/TerzmeCategoriesRow";
import { TerzmePopularProducts } from "@/components/TerzmePopularProducts";
import { TerzmeStoresSection } from "@/components/TerzmeStoresSection";
import { TerzmeSellBanner } from "@/components/TerzmeSellBanner";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans bg-white text-neutral-950">
      
      {/* 1. EXACT TOP HEADER FROM SCREENSHOT */}
      <TerzmeHeader />

      {/* 2. EXACT HERO WITH GREEN HOODIE MODEL & 'TƏRZİNİ KƏŞF ET' */}
      <TerzmeHero />

      {/* 3. HORIZONTAL CATEGORIES ROW (Geyim, Ayaqqabı, Aksesuar, Beauty, Ev & Yaşam, Elektronika, Digər) */}
      <TerzmeCategoriesRow />

      {/* 4. HAZIRDA POPULYAR 6-CARD GRID (Oversize Hoodie, Air Force 1, Cap, T-shirt, Backpack, Parfum) */}
      <TerzmePopularProducts />

      {/* 5. MAĞAZALARI KƏŞF ET SECTION (TERZME STORE, AG'GARA, SABAH STORE, Urban Goods) */}
      <TerzmeStoresSection />

      {/* 6. TƏRZ ME-DƏ SAT BANNER WITH PERKS */}
      <TerzmeSellBanner />

      {/* 7. FOOTER & MODALS */}
      <Footer />
      <CartDrawer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </main>
  );
}
