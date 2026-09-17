"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setIsSent(false);
      }, 4000);
    }, 800);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <div className="relative z-40">
        <Navbar />
      </div>

      <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 py-10 sm:py-14 z-30 flex-1">
        <div 
          style={{ borderRadius: "1px" }}
          className="relative p-6 sm:p-12 md:p-16 border border-neutral-200/90 shadow-2xs bg-white text-neutral-950 space-y-12"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
            <div className="space-y-3">
              <div 
                style={{ borderRadius: "1px" }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono uppercase tracking-widest font-bold shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>KONSİYERJ VƏ DƏSTƏK</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase leading-[1.05]">
                BİZİMLƏ ƏLAQƏ
              </h1>
            </div>

            <div className="text-left md:text-right max-w-sm">
              <span 
                style={{ borderRadius: "1px" }}
                className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200 mb-1"
              >
                ATELIER ARCHIVE 2026
              </span>
              <p className="text-xs font-mono text-neutral-500">
                Fərdi tikiş sifarişləri, unikal kolleksiyalar və müştəri konsiyerji.
              </p>
            </div>
          </div>

          {/* 2-Column Clean Minimal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Atelier Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-neutral-950 leading-tight">
                  TERZME ATELYESİ İLƏ ƏLAQƏ SAXLAYIN
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Fərdi tikiş sifarişləri, xüsusi ölçülər, unikal kolleksiyalar və ya sifarişinizin statusu ilə bağlı Bakı mərkəzindəki emalatxanamıza birbaşa müraciət edin.
                </p>
              </div>

              {/* Minimalist Flat Info Blocks */}
              <div className="space-y-4">
                {/* Location */}
                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-5 bg-[#FAFAF8] border border-neutral-200 shadow-2xs space-y-2 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                      FLAQMAN ATELYE
                    </span>
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200/80 text-neutral-800 font-bold"
                    >
                      BAKI
                    </span>
                  </div>
                  <p className="text-sm font-display font-black uppercase tracking-tight text-neutral-950">
                    NİZAMİ KÜÇƏSİ 42, BAKI, AZƏRBAYCAN
                  </p>
                  <p className="text-xs font-mono text-neutral-500">
                    B.e - Şənbə, 11:00 - 21:00
                  </p>
                </div>

                {/* Email */}
                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-5 bg-[#FAFAF8] border border-neutral-200 shadow-2xs space-y-2 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-800" />
                    RƏSMİ E-POÇT
                  </span>
                  <a 
                    href="mailto:contact@terzme.com" 
                    className="text-sm font-display font-black uppercase tracking-tight text-neutral-950 hover:underline block"
                  >
                    contact@terzme.com
                  </a>
                  <p className="text-xs font-mono text-neutral-500">
                    Konsiyerj: concierge@terzme.com
                  </p>
                </div>

                {/* Phone */}
                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-5 bg-[#FAFAF8] border border-neutral-200 shadow-2xs space-y-2 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-800" />
                      MÜŞTƏRİ XƏTTİ
                    </span>
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                    >
                      ONLİNE
                    </span>
                  </div>
                  <a 
                    href="tel:+994502223344" 
                    className="text-sm font-display font-black uppercase tracking-tight text-neutral-950 hover:underline block"
                  >
                    +994 50 222 33 44
                  </a>
                  <p className="text-xs font-mono text-neutral-500">
                    WhatsApp Konsiyerj Aktivdir
                  </p>
                </div>
              </div>

              {/* Official Channels */}
              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-display font-black uppercase tracking-wider text-neutral-500">
                  RƏSMİ KANALLAR:
                </span>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ borderRadius: "1px" }}
                  className="px-4 py-2 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-display font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <span>@TERZME</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Modern & Clean Contact Form */}
            <div 
              style={{ borderRadius: "1px" }}
              className="lg:col-span-7 p-7 sm:p-10 bg-[#FAFAF8] border border-neutral-200 shadow-2xs relative"
            >
              {isSent ? (
                <div className="py-20 text-center space-y-4">
                  <div 
                    style={{ borderRadius: "1px" }}
                    className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-neutral-950">
                    MESAJINIZ GÖNDƏRİLDİ!
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed font-mono">
                    Müraciətiniz qeydə alındı. Konsiyerj komandamız qısa zamanda sizinlə əlaqə saxlayacaq.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                    <h3 className="text-base font-black font-display uppercase tracking-tight text-neutral-950">
                      BİRBAŞA MESAJ GÖNDƏRİN
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest">
                      SECURE TRANSMISSION
                    </span>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                        ADINIZ VƏ SOYADINIZ
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ad və soyadınızı daxil edin"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ borderRadius: "1px" }}
                        className="w-full bg-white border border-neutral-200 px-4 py-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                        E-POÇT ÜNVANINIZ
                      </label>
                      <input 
                        type="email" 
                        required
                        placeholder="adiniz@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ borderRadius: "1px" }}
                        className="w-full bg-white border border-neutral-200 px-4 py-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                        MESAJINIZ
                      </label>
                      <textarea 
                        rows={5}
                        required
                        placeholder="Müraciətinizi və ya sifariş detallarını qeyd edin..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        style={{ borderRadius: "1px" }}
                        className="w-full bg-white border border-neutral-200 px-4 py-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 resize-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ borderRadius: "1px" }}
                    className="w-full h-12 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 font-mono">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        GÖNDƏRİLİR...
                      </span>
                    ) : (
                      <>
                        <span>MESAJI GÖNDƏR</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
