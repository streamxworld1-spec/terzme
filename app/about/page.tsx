"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ArrowUpRight, 
  Sparkles, 
  Scissors, 
  Layers, 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Flame,
  Award,
  Clock,
  Shirt
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      {/* Top Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Editorial About Section */}
      <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-24 z-30 relative flex-1 space-y-10">
        
        {/* Master Editorial Panel */}
        <div 
          style={{ borderRadius: "1px" }}
          className="relative p-8 sm:p-12 md:p-16 border border-neutral-200/90 shadow-2xs text-neutral-950 bg-white"
        >
          {/* Section Top Header with Exact PARTNYOR MAĞAZALAR Font (Kanit / font-display) */}
          <div className="pb-8 border-b border-neutral-200 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div 
                style={{ borderRadius: "1px" }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono uppercase tracking-widest font-bold shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>ATELIER MANİFESTİ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase leading-[1.05]">
                TERZME MANİFESTİ.
              </h1>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs sm:text-sm font-mono text-neutral-600 max-w-sm leading-relaxed font-medium">
                Minimalist forma, memarlıq kəsimləri və premium geyim sənəti.
              </p>
            </div>
          </div>

          {/* Editorial Visual Showcase (Lookbook Imagery) */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              style={{ borderRadius: "1px" }}
              className="relative h-64 sm:h-72 overflow-hidden border border-neutral-200 group bg-neutral-100"
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
                alt="TERZME Architecture Cut"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 block">Kəsim & Geometriya</span>
                <span className="text-sm font-black font-display uppercase tracking-tight">Memarlıq Silueti</span>
              </div>
            </div>

            <div 
              style={{ borderRadius: "1px" }}
              className="relative h-64 sm:h-72 overflow-hidden border border-neutral-200 group bg-neutral-100"
            >
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                alt="TERZME 450 GSM Heavyweight Terry"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 block">Premium Toxuma</span>
                <span className="text-sm font-black font-display uppercase tracking-tight">450 GSM French Terry</span>
              </div>
            </div>

            <div 
              style={{ borderRadius: "1px" }}
              className="relative h-64 sm:h-72 overflow-hidden border border-neutral-200 group bg-neutral-100"
            >
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop"
                alt="TERZME Baku Atelier Handcraft"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 block">Məhdud Buraxılış</span>
                <span className="text-sm font-black font-display uppercase tracking-tight">Bakı Atelyesi</span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 items-start">
            
            {/* Left Column: Brand Story, Manifesto, Quality Badges */}
            <div className="lg:col-span-7 space-y-6">

              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-neutral-950 leading-[1.15]">
                TERZME ATELIER — Bakıda fəaliyyət göstərən, minimalist dizayn və yüksək keyfiyyətli parçaları bir araya gətirən müstəqil moda evidir.
              </h2>

              <p className="text-sm sm:text-base font-sans text-neutral-600 leading-relaxed font-normal">
                Biz hər bir hoodie, t-shirt və dəstlərimizdə sıx toxunmuş ağır qrammajlı pambıqdan (450–480 GSM French Terry), xüsusi oversized kəsimlərdən və unikal detallardan istifadə edirik. Məqsədimiz gündəlik qarderobunuza həm maksimal rahatlıq, həm də fərqli və unikal küçə stili qatmaqdır.
              </p>

              {/* 3 Modern Quality Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-4 bg-[#FAFAF8] border border-neutral-200 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-neutral-900 mb-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-500">MATERIAL</span>
                  </div>
                  <span className="text-sm font-black font-display uppercase tracking-tight text-neutral-950 block">450 GSM French Terry</span>
                  <span className="text-[11px] font-sans text-neutral-600 block mt-1">100% Orqanik Daranmış Pambıq</span>
                </div>

                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-4 bg-[#FAFAF8] border border-neutral-200 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-neutral-900 mb-2">
                    <Scissors className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-500">SİLOUET</span>
                  </div>
                  <span className="text-sm font-black font-display uppercase tracking-tight text-neutral-950 block">Boxy & Oversized</span>
                  <span className="text-[11px] font-sans text-neutral-600 block mt-1">Düşük çiyin xüsusi kəsim</span>
                </div>

                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-4 bg-[#FAFAF8] border border-neutral-200 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-neutral-900 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-500">ZƏMANƏT</span>
                  </div>
                  <span className="text-sm font-black font-display uppercase tracking-tight text-neutral-950 block">Bakı Atelyesi</span>
                  <span className="text-[11px] font-sans text-neutral-600 block mt-1">Məhdud sayda buraxılış</span>
                </div>
              </div>

              {/* Atelier Pillars List */}
              <div className="pt-4 space-y-3 text-xs font-mono text-neutral-600">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sıx toxunmuş və çəkilməyə qarşı qabaqcadan preslənmiş premium materiallar</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>İkiqat tikiş gücləndirilməsi və elastik davamlı manjetlər</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hər bir parça üçün fərdi keyfiyyət nəzarəti və sertifikat</span>
                </div>
              </div>

            </div>

            {/* Right Column: Editorial Dossier Card */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div 
                style={{ borderRadius: "1px" }}
                className="p-7 sm:p-9 bg-[#FAFAF8] border border-neutral-200 shadow-2xs relative overflow-hidden text-neutral-950"
              >
                <div className="flex items-center justify-between pb-5 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block">
                      Editorial №01
                    </span>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight text-neutral-950">
                      TERZME Atelier
                    </h3>
                  </div>
                  <span 
                    style={{ borderRadius: "1px" }}
                    className="px-3.5 py-1 text-xs font-mono font-black bg-[#07241A] text-white shadow-2xs"
                  >
                    2026
                  </span>
                </div>

                {/* Contact Meta Details */}
                <div className="space-y-4 pt-6 text-xs font-mono">
                  <div className="flex items-center justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700" />
                      Əlaqə Nömrəsi:
                    </span>
                    <a href="tel:+994500000000" className="font-bold text-neutral-950 hover:underline">
                      +994 (50) 000-00-00
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-700" />
                      E-Poçt:
                    </span>
                    <a href="mailto:info@terzme.com" className="font-bold text-neutral-950 hover:underline">
                      info@terzme.com
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      Məkan:
                    </span>
                    <span className="font-bold text-neutral-950">
                      Bakı, Azərbaycan
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-neutral-500 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      Çatdırılma:
                    </span>
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px]"
                    >
                      Ölkə daxili sürətli & pulsuz
                    </span>
                  </div>
                </div>

                {/* High Fashion Lookbook Preview Link */}
                <div className="mt-8 pt-5 border-t border-neutral-200">
                  <Link
                    href="/collection"
                    style={{ borderRadius: "1px" }}
                    className="w-full py-3.5 px-4 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Kolleksiyanı Kəşf Et</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
