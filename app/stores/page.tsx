import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getVendors, getAllProducts } from "@/app/actions";
import { 
  Store, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Layers, 
  Phone, 
  Mail, 
  ShieldCheck,
  Plus
} from "lucide-react";

import { StoresListClient } from "@/components/StoresListClient";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const vendors = await getVendors();
  const allProducts = await getAllProducts();

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <section className="flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-8 pt-8 pb-24 relative z-10 space-y-12">
        {/* Header Hero Section */}
        <div 
          style={{ borderRadius: "1px" }}
          className="p-8 sm:p-12 border border-neutral-200/90 shadow-2xs relative overflow-hidden text-neutral-950 bg-white"
        >
          <div className="max-w-3xl space-y-4">
            <div 
              style={{ borderRadius: "1px" }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono uppercase tracking-widest font-bold shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-neutral-900" />
              <span>MULTİ-VENDOR PLATFORMASI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase leading-[1.05]">
              PARTNYOR MAĞAZALAR VƏ ATELİYELƏR
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed">
              TERZME ekosistemində fəaliyyət göstərən sertifikatlı dizayn atelyeləri, müstəqil modelyerlər və brendlər. Hər bir mağazanın özünəməxsus kataloqunu kəşf edin və birbaşa sifariş verin.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Yoxlanılmış Brendlər</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Birbaşa İstehsalçı Qiymətləri</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Orijinal Kapsul Kolleksiyalar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors with Interactive Filter & Search */}
        <StoresListClient initialVendors={vendors} allProducts={allProducts} />
      </section>

      <Footer />
    </main>
  );
}
