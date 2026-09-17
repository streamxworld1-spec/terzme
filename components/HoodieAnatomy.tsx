"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { 
  Droplets, 
  Wind, 
  Flame, 
  Scissors, 
  ArrowDown, 
  ChevronRight,
  Sparkles
} from "lucide-react";

interface AnatomyStep {
  id: string;
  step: number;
  code: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  camera: {
    scale: number;
    originX: string;
    originY: string;
  };
  reticle: { x: number; y: number };
  specs: string[];
  metrics: { label: string; value: string }[];
}

const STEPS: AnatomyStep[] = [
  {
    id: "overview",
    step: 1,
    code: "01.OVERVIEW",
    title: "FULL ARCHITECTURE",
    subtitle: "KARABAKH EDITION // 2050",
    badge: "SYSTEM OVERVIEW",
    description: "Relaxed couture streetwear silhouette sculpted from 450 GSM organic heavyweight fleece with authentic Azerbaijani carpet iconography.",
    camera: { scale: 1.0, originX: "50%", originY: "50%" },
    reticle: { x: 50, y: 50 },
    specs: ["450 GSM FLEECE", "AZERBAIJAN STYLE", "OVERSIZED DRAPE"],
    metrics: [
      { label: "DENSITY", value: "450 GSM" },
      { label: "FABRICATION", value: "ORGANIC COMBED" },
      { label: "ORIGIN", value: "BAKU / AZ" }
    ]
  },
  {
    id: "hood",
    step: 2,
    code: "02.HOOD",
    title: "DOUBLE LAYERED HOOD",
    subtitle: "STRUCTURAL FORM FACTOR",
    badge: "ARCHITECTURE",
    description: "Double-thickness interlocking cotton construction that holds high structural volume and ergonomic contour without slouching.",
    camera: { scale: 2.5, originX: "50%", originY: "18%" },
    reticle: { x: 50, y: 35 },
    specs: ["DOUBLE-PLY FLEECE", "DRAWCORDLESS", "HIGH SHAPE RETENTION"],
    metrics: [
      { label: "PLY COUNT", value: "2-PLY" },
      { label: "VOLUME", value: "SELF-SUPPORTING" },
      { label: "SEAMS", value: "CONCEALED" }
    ]
  },
  {
    id: "shoulder",
    step: 3,
    code: "03.SEAM",
    title: "DROP SHOULDER SEAM",
    subtitle: "ERGONOMIC STREETWEAR DRAPE",
    badge: "TAILORING",
    description: "Extended dropped shoulder line tailored with 4-needle overlock reinforcement for seamless motion and contemporary boxy drape.",
    camera: { scale: 2.3, originX: "32%", originY: "32%" },
    reticle: { x: 42, y: 46 },
    specs: ["4-NEEDLE OVERLOCK", "RELAXED ARMHOLE", "HIGH MOBILITY"],
    metrics: [
      { label: "TENSION", value: "FLEX-LOCK" },
      { label: "DROP RATIO", value: "1:1.2" },
      { label: "FIT TYPE", value: "BOXY CUT" }
    ]
  },
  {
    id: "print",
    step: 4,
    code: "04.PRINT",
    title: "CARPET GRAPHIC PRINT",
    subtitle: "THIS IS AZERBAIJAN STYLE BALAM",
    badge: "HERITAGE ARTWORK",
    description: "High-density screenprint celebrating Azerbaijani heritage carpet geometry with durable, crack-resistant pigment formulation.",
    camera: { scale: 2.7, originX: "50%", originY: "53%" },
    reticle: { x: 50, y: 50 },
    specs: ["HD PIGMENT PRINT", "TRADITIONAL MOTIF", "CRACK-RESISTANT"],
    metrics: [
      { label: "TECHNIQUE", value: "HD SCREENPRINT" },
      { label: "PIGMENT", value: "BIO-POLYMER" },
      { label: "AUTHENTICITY", value: "VERIFIED" }
    ]
  },
  {
    id: "pocket",
    step: 5,
    code: "05.POCKET",
    title: "KANGAROO POCKET",
    subtitle: "FUNCTIONAL VOLUME",
    badge: "UTILITY",
    description: "Deep seamless hand-warmer pocket fortified with invisible security bar-tacks at high-stress tension points.",
    camera: { scale: 2.4, originX: "50%", originY: "68%" },
    reticle: { x: 50, y: 56 },
    specs: ["BAR-TACK REINFORCED", "DUAL ACCESS", "HEAVY FLEECE LINING"],
    metrics: [
      { label: "CAPACITY", value: "EXTENDED" },
      { label: "BAR-TACK", value: "QUAD-STITCH" },
      { label: "LINING", value: "THERMAL FLEECE" }
    ]
  },
  {
    id: "cuff",
    step: 6,
    code: "06.CUFF",
    title: "RIBBED CUFF & HEM",
    subtitle: "ELASTIC SHAPE RETENTION",
    badge: "HARDWARE",
    description: "Dense 2x2 spandex-ribbed cuffs and bottom hem maintaining elasticity and tension after repeated wear and washing.",
    camera: { scale: 2.6, originX: "24%", originY: "78%" },
    reticle: { x: 38, y: 62 },
    specs: ["2x2 SPANDEX RIB", "ELASTIC MEMORY", "DOUBLE STITCH HEM"],
    metrics: [
      { label: "RIB SPEC", value: "2x2 DENSE" },
      { label: "ELASTICITY", value: "+40% RECOVERY" },
      { label: "RECOVERY", value: "100% SHAPE" }
    ]
  },
];

const DETAIL_CARDS = [
  {
    title: "DOUBLE LAYERED HOOD",
    subtitle: "01 / ARCHITECTURE",
    desc: "Engineered with double-thickness cotton fleece to maintain structural volume without slouching.",
    tag: "450 GSM",
  },
  {
    title: "DROP SHOULDER SEAM",
    subtitle: "02 / SILHOUETTE",
    desc: "Ergonomic dropped armhole contouring naturally around the body for ultimate comfort.",
    tag: "OVERSIZED FIT",
  },
  {
    title: "CARPET GRAPHIC EMBROIDERY",
    subtitle: "03 / ARTWORK",
    desc: "Authentic Azerbaijani Karabakh / Shirvan carpet ornamentation in high-definition pigment formulation.",
    tag: "HD PIGMENT",
  },
  {
    title: "KANGAROO POCKET",
    subtitle: "04 / UTILITY",
    desc: "Deep hand-warming pocket featuring hidden security bar-tacks at high-stress tension points.",
    tag: "REINFORCED",
  },
  {
    title: "RIBBED CUFF & SLEEVE",
    subtitle: "05 / HARDWARE",
    desc: "Dense cotton-elastane ribbing that contracts smoothly without tight pressure on wrists.",
    tag: "2x2 RIB KNIT",
  },
  {
    title: "SOFT & WARM FABRIC",
    subtitle: "06 / TEXTILE",
    desc: "65% combed organic cotton paired with 35% performance polyester for warmth without weight.",
    tag: "BRUSHED INTERIOR",
  },
];

const SIZE_CHART = [
  { size: "S", length: 67, chest: 112, shoulder: 56, sleeve: 55 },
  { size: "M", length: 69, chest: 116, shoulder: 58, sleeve: 56 },
  { size: "L", length: 71, chest: 120, shoulder: 60, sleeve: 57 },
  { size: "XL", length: 73, chest: 124, shoulder: 62, sleeve: 58 },
  { size: "XXL", length: 75, chest: 128, shoulder: 64, sleeve: 59 },
];

export function HoodieAnatomy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [colorVariant, setColorVariant] = useState<"red" | "white">("red");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const clamped = Math.max(0, Math.min(latest, 0.999));
      const index = Math.min(
        Math.floor(clamped * STEPS.length),
        STEPS.length - 1
      );
      setActiveIdx(index);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  const activeStep = STEPS[activeIdx] || STEPS[0];

  return (
    <div 
      ref={containerRef}
      className="hoodie-anatomy-ultra bg-[#070709] text-white font-sans selection:bg-red-600 selection:text-white"
    >
      
      {/* ========================================================
          1. CINEMATIC FULLSCREEN VIEWPORT (400vh)
         ======================================================== */}
      <section className="relative w-full h-[400vh]">
        
        {/* STICKY VIEWPORT HUD */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 px-8 md:px-16 select-none">
          
          {/* ================= CINEMATIC BACKGROUND CAMERA ================= */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-[#070709]">
            
            {/* Dynamic Animated Camera Frame */}
            <motion.div
              animate={{
                scale: activeStep.camera.scale,
                transformOrigin: `${activeStep.camera.originX} ${activeStep.camera.originY}`,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full h-full relative flex items-center justify-center"
            >
              <img
                src={
                  colorVariant === "red"
                    ? "/hoodie/hoodie-main.png"
                    : "/hoodie/hoodie-white.png"
                }
                alt="Azerbaijan Style Hoodie"
                className="w-full h-full object-contain filter drop-shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
              />
            </motion.div>

            {/* Subtle Futuristic Grid & Vignette */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/70 via-transparent to-[#070709]/70 pointer-events-none" />
          </div>

          {/* ================= TOP HUD NAV ================= */}
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-30 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,1)] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 font-bold">
                TERZME // HOODIE ANATOMY 2050
              </span>
            </div>

            {/* Color Switcher */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-3xl border border-white/20 p-1.5 rounded-full shadow-2xl">
              <button
                onClick={() => setColorVariant("red")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  colorVariant === "red"
                    ? "bg-white text-black shadow-lg"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#cc1829]" />
                <span>KARABAKH RED</span>
              </button>
              <button
                onClick={() => setColorVariant("white")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  colorVariant === "white"
                    ? "bg-white text-black shadow-lg"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-300" />
                <span>RAW CHALK</span>
              </button>
            </div>
          </div>

          {/* ================= CENTER TARGET RETICLE HUD ================= */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <motion.div
              animate={{
                x: `${(activeStep.reticle.x - 50) * 8}px`,
                y: `${(activeStep.reticle.y - 50) * 6}px`,
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative w-28 h-28 flex items-center justify-center opacity-80"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />
              <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            </motion.div>
          </div>

          {/* ================= BOTTOM METRIC HUD CARDS ================= */}
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-auto z-30">
            
            {/* Left Glass Anatomy Detail Card */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="rounded-3xl p-8 backdrop-blur-3xl border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                  style={{
                    background: "linear-gradient(135deg, rgba(25, 25, 30, 0.75) 0%, rgba(15, 15, 18, 0.85) 100%)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-black bg-red-600 text-white px-3 py-1 rounded-full shadow-lg">
                        {activeStep.code}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
                        {activeStep.subtitle}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      STEP 0{activeStep.step} / 06
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                    {activeStep.title}
                  </h2>

                  <p className="text-sm text-neutral-300 leading-relaxed font-medium mt-4">
                    {activeStep.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10">
                    {activeStep.metrics.map((m, i) => (
                      <div key={i} className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                          {m.label}
                        </span>
                        <span className="text-xs font-mono font-black text-white block truncate">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Step Navigation Pills */}
            <div className="lg:col-span-6 flex flex-col items-end space-y-2.5">
              {STEPS.map((st, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (containerRef.current) {
                        const targetScroll =
                          containerRef.current.offsetTop +
                          (idx / (STEPS.length - 1)) *
                            (containerRef.current.offsetHeight - window.innerHeight);
                        window.scrollTo({ top: targetScroll, behavior: "smooth" });
                      }
                    }}
                    className={`px-5 py-3 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-4 ${
                      isActive
                        ? "bg-white text-black border-white shadow-2xl scale-105"
                        : "bg-black/40 text-neutral-400 hover:text-white border-white/10 hover:bg-black/60 backdrop-blur-md"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                        isActive ? "bg-black text-white" : "bg-white/10 text-neutral-300"
                      }`}
                    >
                      0{st.step}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider font-mono">
                      {st.title}
                    </span>
                    {isActive && <ChevronRight className="w-4 h-4 text-red-600 ml-1" />}
                  </button>
                );
              })}
            </div>

          </div>

          {/* ================= BOTTOM BAR HUD ================= */}
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between z-30 pt-4 border-t border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase">
              <ArrowDown className="w-4 h-4 animate-bounce text-red-500" />
              <span>SCROLL DOWN TO INSPECT ARCHITECTURE</span>
            </div>

            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeIdx === i
                      ? "w-14 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)]"
                      : "w-3 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm font-mono font-black text-white">
              0{activeIdx + 1} / 06
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. DETAILED ANATOMY CARDS GALLERY (White Luxury Section)
         ======================================================== */}
      <section className="w-full bg-[#fbfbf9] text-neutral-950 py-32 px-8 md:px-14 border-t border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 font-bold block mb-2">
                PRECISION CRAFTSMANSHIP
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-neutral-950">
                DETAILS & TAILORING
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
              Constructed with heavy 450 GSM fleece and reinforced seams to ensure an enduring silhouette through decades of wear.
            </p>
          </div>

          {/* 6 High-End Luxury Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DETAIL_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-3xl p-6 border border-black/[0.08] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="w-full h-64 rounded-2xl bg-neutral-100 overflow-hidden relative mb-6 flex items-center justify-center p-4">
                  <img
                    src="/hoodie/hoodie-main.png"
                    alt={card.title}
                    className="w-full h-full object-contain group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                  <span className="absolute top-4 right-4 bg-neutral-950 text-white text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {card.tag}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 block tracking-widest mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight text-neutral-950 group-hover:text-red-600 transition-colors">
                    {card.title}
                  </h3>
                  
                  <div className="w-0 group-hover:w-full h-[1.5px] bg-red-600 transition-all duration-500 my-3" />

                  <p className="text-xs text-neutral-600 font-medium leading-relaxed mt-2">
                    {card.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          3. SIZE CHART & MATERIAL CARE
         ======================================================== */}
      <section className="w-full bg-[#fbfbf9] text-neutral-950 py-24 px-8 md:px-14 border-t border-black/10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* SIZE CHART TABLE (Left 7 Cols) */}
          <div className="lg:col-span-7">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 font-bold block mb-2">
              FIT SPECIFICATIONS
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-950 mb-8">
              SIZE CHART (CM)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-950 text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                    <th className="py-4 px-3 font-black text-neutral-950">SIZE</th>
                    <th className="py-4 px-3">LENGTH</th>
                    <th className="py-4 px-3">CHEST</th>
                    <th className="py-4 px-3">SHOULDER</th>
                    <th className="py-4 px-3">SLEEVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-xs font-mono font-medium">
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-100/80 transition-colors">
                      <td className="py-4 px-3 font-black text-sm text-neutral-950">{row.size}</td>
                      <td className="py-4 px-3">{row.length}</td>
                      <td className="py-4 px-3">{row.chest}</td>
                      <td className="py-4 px-3">{row.shoulder}</td>
                      <td className="py-4 px-3">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] font-mono text-neutral-400 mt-4 italic">
              *Manual measurement may vary 1-3 cm depending on wash cycle.
            </p>
          </div>

          {/* MATERIAL & CARE INSTRUCTIONS (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-black/[0.08] shadow-sm">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 font-bold block mb-2">
              FABRICATION & MAINTENANCE
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950 mb-6">
              MATERIAL & CARE
            </h2>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-mono text-xs font-bold text-neutral-950">COMPOSITION</span>
                <span className="font-mono text-xs text-red-600 font-bold">450 GSM HEAVYWEIGHT</span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-neutral-950 h-full w-[65%]" title="65% Cotton" />
                <div className="bg-neutral-400 h-full w-[35%]" title="35% Polyester" />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-neutral-600 mt-2">
                <span>65% ORGANIC COMBED COTTON</span>
                <span>35% POLYESTER</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-medium text-neutral-700">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <Droplets className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>MACHINE WASH COLD (30°C / 85°F) WITH LIKE COLORS</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <Wind className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>DO NOT BLEACH • USE MILD DETERGENT ONLY</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <Flame className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>TUMBLE DRY LOW OR HANG DRY TO PRESERVE GRAPHIC</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                <Scissors className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>IRON LOW HEAT • DO NOT IRON DIRECTLY ON CARPET PRINT</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
              <span>DESIGNED BY TOKYO SHOP AZ</span>
              <span>MADE IN AZERBAIJAN</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
