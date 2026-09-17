import { Suspense } from "react";
import OrderTrackingClient from "./OrderTrackingClient";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TrackPage() {
  return (
    <main className="relative min-h-screen bg-white text-neutral-950 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <div className="relative z-40">
        <Navbar />
      </div>

      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-10 sm:py-14 z-30 flex-1">
        <Suspense fallback={<div className="text-center font-mono text-xs text-neutral-500 py-16">Yüklənir...</div>}>
          <OrderTrackingClient />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
