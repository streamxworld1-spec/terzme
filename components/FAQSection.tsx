"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Qaytarma siyasətiniz nədir?",
    answer: "Sifarişinizi təhvil aldığınız andan etibarən 14 gün ərzində heç bir əlavə ödəniş olmadan geri qaytara və ya başqa ölçü ilə dəyişdirə bilərsiniz. Məhsul geyilməmiş, etiketi zədələnməmiş və orijinal TERZME Atelier qutusunda olmalıdır.",
  },
  {
    question: "Materiallarınız davamlı mənbələrdən əldə edilirmi?",
    answer: "Bəli, TERZME olaraq yalnız 100% sertifikatlaşdırılmış orqanik daranmış pambıq və premium 450 GSM French Terry parçalardan istifadə edirik. Bütün xammallarımız ətraf mühitə zərərsiz, dayanıqlı və etik istehsal standartlarına uyğundur.",
  },
  {
    question: "Məhsullarımı necə qorumalı və yumalıyam?",
    answer: "Geyimlərin ilkin formasını və toxumasını uzun illər qorumaq üçün onları tərsinə çevirərək 30°C dərəcədə, yumşaq dövriyyədə soyuq su ilə yumağınızı və birbaşa günəş işığı olmayan yerdə asaraq qurutmağınızı tövsiyə edirik.",
  },
  {
    question: "Beynəlxalq çatdırılma təklif edirsinizmi?",
    answer: "Bəli! Bakı və bütün Azərbaycan daxilinə kuryer çatdırılmamız 24 saat ərzində tam pulsuzdur. Həmçinin DHL Express vasitəsilə dünyanın 50-dən çox ölkəsinə sürətli qlobal çatdırılma həyata keçiririk.",
  },
  {
    question: "Ölçülər necədir?",
    answer: "Modellərimiz müasir 'Boxy & Relaxed Oversized' kəsimində hazırlanmışdır. Əgər klassik tam oturan görünüş istəyirsinizsə bir ölçü kiçik, rahat və brendin orijinal küçə stilini istəyirsinizsə öz standart ölçünüzü seçməyiniz məsləhətdir.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-6 sm:pb-8 z-30 relative">
      <div 
        className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(246, 240, 233, 0.52) 100%)",
          backdropFilter: "blur(48px) saturate(190%)",
          WebkitBackdropFilter: "blur(48px) saturate(190%)",
          border: "1.5px solid rgba(255, 255, 255, 0.9)",
          boxShadow: "0 35px 80px -20px rgba(0, 0, 0, 0.12), inset 0 2px 3px rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* Top Rim Light Gleam */}
        <div className="absolute top-0 left-20 right-20 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="mb-12 text-center md:text-left max-w-2xl">
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold block mb-2">
            MƏLUMAT VƏ DƏSTƏK
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-grotesk tracking-tight text-neutral-950 uppercase leading-tight">
            Tez-Tez Verilən Suallar
          </h2>
          <p className="mt-3 text-sm sm:text-base font-sans text-neutral-600 font-medium">
            Məhsullarımız və xidmətlərimiz haqqında bilməli olduğunuz hər şey.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen 
                    ? "bg-white/85 border-white shadow-lg" 
                    : "bg-white/45 hover:bg-white/65 border-white/80 shadow-xs"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <span className={`text-base sm:text-lg font-black font-grotesk tracking-tight transition-colors ${
                    isOpen ? "text-black" : "text-neutral-900 group-hover:text-black"
                  }`}>
                    {item.question}
                  </span>

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    isOpen
                      ? "bg-neutral-950 text-white shadow-md rotate-90"
                      : "bg-neutral-900/5 text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-1 text-xs sm:text-sm font-sans text-neutral-600 leading-relaxed border-t border-black/[0.04]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
