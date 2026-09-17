"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Sparkles, 
  Scissors, 
  Layers, 
  MessageCircle, 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Truck 
} from "lucide-react";

export function AboutSection() {
  return (
    <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-8 z-30 relative">
      
      {/* Main Glassmorphic Container */}
      <div 
        className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.76) 0%, rgba(248, 243, 236, 0.56) 100%)",
          backdropFilter: "blur(48px) saturate(190%)",
          WebkitBackdropFilter: "blur(48px) saturate(190%)",
          border: "1.5px solid rgba(255, 255, 255, 0.9)",
          boxShadow: "0 35px 80px -20px rgba(0, 0, 0, 0.12), inset 0 2px 3px rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* Top Rim Light Gleam */}
        <div className="absolute top-0 left-20 right-20 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />

        {/* Section Top Header */}
        <div className="pb-10 border-b border-black/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
                [ BREND HAQQINDA ]
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-grotesk tracking-tight text-neutral-950 uppercase leading-none">
              MÜASİR KÜÇƏ DƏBİ<span className="text-amber-600">.</span>
            </h2>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs sm:text-sm font-mono text-neutral-600 max-w-sm">
              Minimalist forma, memarlıq kəsimləri və premium geyim sənəti.
            </p>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 items-start">
          
          {/* Left Column: Brand Story & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-[11px] font-mono font-bold tracking-wider uppercase">
              Maksimal rahatlıq, kompromissiz keyfiyyət
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-grotesk text-neutral-950 leading-tight">
              TERZME ATELIER — Bakıda fəaliyyət göstərən, minimalist dizayn və yüksək keyfiyyətli parçaları bir araya gətirən müstəqil moda evidir.
            </h3>

            <p className="text-sm sm:text-base font-sans text-neutral-700 leading-relaxed font-normal">
              Biz hər bir hoodie, t-shirt və dəstlərimizdə sıx toxunmuş ağır qrammajlı pambıqdan (450–480 GSM French Terry), xüsusi oversized kəsimlərdən və unikal detallardan istifadə edirik. Məqsədimiz gündəlik qarderobunuza həm maksimal rahatlıq, həm də fərqli və unikal küçə stili qatmaqdır.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">MATERIAL</span>
                <span className="text-xs font-black font-grotesk text-neutral-950 block">450 GSM French Terry</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">SİLOUET</span>
                <span className="text-xs font-black font-grotesk text-neutral-950 block">Boxy & Relaxed Oversized</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block mb-1">MƏKAN</span>
                <span className="text-xs font-black font-grotesk text-neutral-950 block">Bakı Emalatxanası</span>
              </div>
            </div>

            {/* Social Channels & Direct Contact Links */}
            <div className="pt-6 border-t border-black/[0.08]">
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold block mb-3">
                Sosial Şəbəkələr & Birbaşa Əlaqə
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a 
                  href="https://wa.me/994500000000" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-neutral-950 text-xs font-mono font-bold border border-white/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a 
                  href="https://instagram.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-neutral-950 text-xs font-mono font-bold border border-white/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <svg className="w-4 h-4 text-neutral-950 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a 
                  href="https://tiktok.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-neutral-950 text-xs font-mono font-bold border border-white/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <span className="w-4 h-4 flex items-center justify-center font-black text-xs">♪</span>
                  <span>TikTok</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Contact & Location Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div 
              className="rounded-2xl p-6 sm:p-8 bg-white/75 border border-white/95 shadow-xl relative overflow-hidden backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block">
                    Editorial №01
                  </span>
                  <h4 className="text-lg font-black font-grotesk text-neutral-950 uppercase">
                    TERZME Atelier
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-neutral-950 text-white">
                  2026
                </span>
              </div>

              {/* Contact Meta Details */}
              <div className="space-y-4 pt-6 text-xs font-mono">
                <div className="flex items-center justify-between py-2 border-b border-black/[0.04]">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-950" />
                    Əlaqə Nömrəsi:
                  </span>
                  <a href="tel:+994500000000" className="font-bold text-neutral-950 hover:underline">
                    +994 (50) 000-00-00
                  </a>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-black/[0.04]">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-950" />
                    E-Poçt:
                  </span>
                  <a href="mailto:info@terzme.com" className="font-bold text-neutral-950 hover:underline">
                    info@terzme.com
                  </a>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-black/[0.04]">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-950" />
                    Məkan:
                  </span>
                  <span className="font-bold text-neutral-950">
                    Bakı, Azərbaycan
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-neutral-950" />
                    Çatdırılma:
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px]">
                    Ölkə daxili sürətli & pulsuz
                  </span>
                </div>
              </div>

              {/* High Fashion Lookbook Preview Link */}
              <div className="mt-6 pt-4 border-t border-black/[0.08]">
                <Link
                  href="/collection"
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-grotesk font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all"
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
  );
}
