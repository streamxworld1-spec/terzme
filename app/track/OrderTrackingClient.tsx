"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderByTrackingCode, Order } from "@/app/actions";
import { 
  Search, 
  Package, 
  Clock, 
  RefreshCw, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const STEPS: { status: Order["status"]; label: string; desc: string; icon: any }[] = [
  { status: "Qəbul edildi", label: "SİFARİŞ ALINDI", desc: "Sistemdə qeydə alındı və təsdiqləndi", icon: Clock },
  { status: "Hazırlanır", label: "HAZIRLANIR", desc: "Atelyedə dərzilər tərəfindən paketlənir", icon: RefreshCw },
  { status: "Çatdırılmada", label: "KURYERDƏ", desc: "Bakı daxili ünvana yola çıxdı", icon: Truck },
  { status: "Təhvil verildi", label: "TƏHVİL VERİLDİ", desc: "Sifariş alıcıya uğurla çatdırıldı", icon: CheckCircle2 },
];

export default function OrderTrackingClient() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const [code, setCode] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (trackingCodeToSearch: string) => {
    if (!trackingCodeToSearch.trim()) return;
    setLoading(true);
    setSearched(true);
    const result = await getOrderByTrackingCode(trackingCodeToSearch.trim());
    setOrder(result || null);
    setLoading(false);
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const getStepIndex = (status: Order["status"]) => {
    switch (status) {
      case "Qəbul edildi":
        return 0;
      case "Hazırlanır":
        return 1;
      case "Çatdırılmada":
        return 2;
      case "Təhvil verildi":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : -1;

  return (
    <div 
      style={{ borderRadius: "1px" }}
      className="relative p-6 sm:p-12 md:p-16 border border-neutral-200/90 shadow-2xs bg-white text-neutral-950 space-y-12"
    >
      {/* Top Header Badge & Titles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
        <div className="space-y-3">
          <div 
            style={{ borderRadius: "1px" }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono uppercase tracking-widest font-bold shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>CANLI İZLƏMƏ SİSTEMİ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase leading-[1.05]">
            SİFARİŞİNİ İZLƏ
          </h1>
        </div>

        <div className="text-left md:text-right max-w-sm">
          <span 
            style={{ borderRadius: "1px" }}
            className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200 mb-1"
          >
            LIVE ATELIER DISPATCH
          </span>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Sifariş zamanı sizə təqdim olunan 6 rəqəmli izləmə kodunu (məs: TRZ-492019) və ya Sifariş ID-sini daxil edin.
          </p>
        </div>
      </div>

      {/* Modern & Flat Search Bar */}
      <div className="max-w-2xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(code);
          }}
          style={{ borderRadius: "1px" }}
          className="p-2 sm:p-2.5 bg-[#FAFAF8] border border-neutral-300 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-neutral-950 transition-colors"
        >
          <div className="flex items-center flex-1 px-3 gap-2.5">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="İzləmə kodu (TRZ-XXXXXX və ya ORD-XXXXXX)..."
              className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-neutral-950 font-mono tracking-wide focus:outline-none placeholder:text-neutral-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            style={{ borderRadius: "1px" }}
            className="h-11 sm:h-12 px-7 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2 font-mono">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                YOXLAYIR...
              </span>
            ) : (
              <>
                <span>Axtar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick hint */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-3 px-1">
          <span>Nümunə kod: <button type="button" onClick={() => { setCode("TRZ-492019"); handleSearch("TRZ-492019"); }} className="underline hover:text-neutral-950 font-semibold cursor-pointer">TRZ-492019</button></span>
          <Link href="/orders" className="hover:text-neutral-950 underline underline-offset-2">
            Nömrə ilə axtarış →
          </Link>
        </div>
      </div>

      {/* Result Display */}
      {order ? (
        <div 
          style={{ borderRadius: "1px" }}
          className="border border-neutral-200 bg-[#FAFAF8] shadow-2xs overflow-hidden"
        >
          {/* Order Meta Header */}
          <div className="p-6 sm:p-8 bg-white border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-display font-black uppercase tracking-widest text-neutral-500">
                SİFARİŞ İZLƏMƏ KODU
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-neutral-950">
                {order.trackingCode}
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                </span>
                <span>•</span>
                <span>{new Date(order.createdAt).toLocaleTimeString("az-AZ")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span className="text-[10px] font-display font-black uppercase tracking-widest text-neutral-500">
                STATUS
              </span>
              <span 
                style={{ borderRadius: "1px" }}
                className="px-4 py-2 text-xs font-display font-black uppercase tracking-wider bg-[#07241A] text-white shadow-2xs inline-flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {order.status}
              </span>
            </div>
          </div>

          {/* Stepper / Timeline */}
          <div className="p-6 sm:p-10 border-b border-neutral-200 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = currentStep >= idx;
                const isCurrent = currentStep === idx;

                return (
                  <div key={idx} className="relative flex flex-col items-center text-center space-y-3">
                    <div
                      style={{ borderRadius: "1px" }}
                      className={`w-12 h-12 flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[#07241A] text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                      } ${isCurrent ? "ring-2 ring-neutral-950 scale-105" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-xs font-display font-black uppercase tracking-wider ${isCompleted ? "text-neutral-950" : "text-neutral-400"}`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] font-sans text-neutral-500 max-w-[180px] mx-auto leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details 2-Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Delivery address */}
            <div 
              style={{ borderRadius: "1px" }}
              className="p-5 bg-white border border-neutral-200 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  ÇATDIRILMA ÜNVANI
                </span>
                <span 
                  style={{ borderRadius: "1px" }}
                  className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 font-bold"
                >
                  BAKI
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-display font-black uppercase tracking-tight text-neutral-950 text-sm">
                  {order.customer.fullName}
                </p>
                <p className="text-neutral-600 font-mono">{order.customer.phone}</p>
                <p className="text-neutral-700 font-sans leading-relaxed pt-1">
                  {order.customer.address}, {order.customer.city}
                </p>
              </div>
            </div>

            {/* Package Items */}
            <div 
              style={{ borderRadius: "1px" }}
              className="p-5 bg-white border border-neutral-200 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-800" />
                  PAKET DAXİLİNDƏ
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {order.items.length} ƏDƏD MƏHSUL
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-neutral-100 last:border-0">
                    <span className="text-neutral-900 font-sans">
                      <span className="font-semibold">{item.name}</span>{" "}
                      {item.size && <span className="text-neutral-500 font-mono">[{item.size}]</span>} × {item.quantity}
                    </span>
                    <span className="font-mono font-bold text-neutral-950">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-center">
                  <span className="font-display font-black uppercase tracking-wider text-xs text-neutral-950">
                    TOPLAM MƏBLƏĞ:
                  </span>
                  <span className="text-base font-display font-black text-neutral-950">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : searched && !loading ? (
        <div 
          style={{ borderRadius: "1px" }}
          className="p-10 sm:p-14 text-center bg-[#FAFAF8] border border-neutral-200 shadow-2xs max-w-xl mx-auto space-y-4"
        >
          <div 
            style={{ borderRadius: "1px" }}
            className="w-12 h-12 bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200"
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl uppercase tracking-tight text-neutral-950">
            SİFARİŞ TAPILMADI
          </h3>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Daxil etdiyiniz kod üzrə heç bir aktiv sifariş tapılmadı. Zəhmət olmasa izləmə kodunu düzgün yazdığınızdan əmin olun.
          </p>
          <div className="pt-2">
            <Link
              href="/orders"
              className="inline-block text-xs font-display font-black uppercase tracking-wider text-neutral-950 underline underline-offset-4 hover:text-black"
            >
              Telefon nömrəsi ilə sifarişlərə bax →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
