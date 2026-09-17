"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Vendor } from "@/app/actions";
import { ShieldCheck, Mail, ArrowRight, AlertCircle, CheckCircle2, Store, Lock, KeyRound } from "lucide-react";
import confetti from "canvas-confetti";

interface VendorAdminAuthGuardProps {
  vendor: Vendor | null;
  onAuthorized?: () => void;
}

export function VendorAdminAuthGuard({ vendor }: VendorAdminAuthGuardProps) {
  const { user, loginWithGoogleDirect, loginWithCredentials, openAuthModal } = useAuth();
  const [adminPassword, setAdminPassword] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Suggested emails based on current vendor or defaults
  const vendorEmail = vendor?.email?.toLowerCase().trim() || "";
  const vendorSuggestedName = vendor?.name || "Vendor";

  // Dedicated Super Admin Password Handler for Global Admin (/admin)
  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const enteredPass = adminPassword.trim();

    if (!enteredPass) {
      setErrorMsg("Zəhmət olmasa admin şifrəsini daxil edin.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Check for exact password: terzme1234
      if (enteredPass === "terzme1234") {
        loginWithGoogleDirect({
          id: "usr_super_admin",
          email: "admin@platform.local",
          name: "Super Admin",
          username: "admin",
          role: "admin",
        });
        setLoading(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setLoading(false);
        setErrorMsg("Daxil edilən admin şifrəsi yanlışdır. Yenidən cəhd edin.");
      }
    }, 400);
  };

  // Vendor store quick login handler
  const handleQuickLogin = (email: string, name: string) => {
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      loginWithGoogleDirect({
        email,
        name,
        role: "vendor",
        ownedStoreSlug: vendor?.slug,
        ownedStoreName: vendor?.name,
      });
      setLoading(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 400);
  };

  // Vendor store custom email handler
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const email = customEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg("Zəhmət olmasa Gmail / E-poçt ünvanınızı daxil edin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Düzgün bir Gmail və ya e-poçt ünvanı daxil edin.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginWithGoogleDirect({
        email,
        name: email.split("@")[0],
        role: "vendor",
        ownedStoreSlug: vendor?.slug,
        ownedStoreName: vendor?.name,
      });
      setLoading(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div 
        style={{ borderRadius: "1px" }}
        className="bg-white w-full max-w-xl p-8 sm:p-12 shadow-2xl border border-neutral-200 relative space-y-8 text-neutral-950"
      >
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div 
            style={{ borderRadius: "1px" }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-widest ${
              vendor 
                ? "bg-[#07241A]/5 border border-[#07241A]/20 text-[#07241A]" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {vendor ? (
              <>
                <ShieldCheck className="w-4 h-4 text-[#07241A]" />
                <span>VENDOR TƏHLÜKƏSİZLİK QORUMASI</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-red-600" />
                <span>ŞİFRƏLİ ADMIN GİRİŞİ</span>
              </>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-neutral-950">
            {vendor ? `${vendor.name} İDARƏ PANELİ` : "ADMIN PANELİNƏ GİRİŞ"}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 font-sans max-w-md mx-auto leading-relaxed">
            {vendor ? (
              <span>
                <strong className="text-neutral-900 font-bold">{vendor.name}</strong> mağazasının admin panelinə daxil olmaq üçün təsdiqlənmiş Gmail və ya rəsmi mağaza hesabı ilə giriş tələb olunur.
              </span>
            ) : (
              <span>
                Bu səhifə qorunur. TERZME Baş İnzibatçı (Super Admin) panelinə daxil olmaq üçün təyin edilmiş şifrəni daxil edin.
              </span>
            )}
          </p>
        </div>

        {/* Current logged in status if any */}
        {user && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="opacity-75 block text-[10px]">Cari hesab:</span>
              <span className="font-bold">{user.email}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 border border-amber-300">
              {vendor ? "Giriş icazəsi yoxdur" : "Super Admin deyil"}
            </span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div 
            style={{ borderRadius: "1px" }}
            className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-start gap-2 animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* CASE 1: GLOBAL ADMIN (/admin) -> DIRECT PASSWORD PROMPT */}
        {!vendor ? (
          <form onSubmit={handleAdminPasswordSubmit} className="space-y-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-700 font-bold tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-neutral-800" />
                <span>Admin Şifrəsi:</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Şəxsi admin şifrənizi daxil edin"
                  value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setErrorMsg(""); }}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-base font-mono text-neutral-900 tracking-wider shadow-2xs"
                />
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ borderRadius: "1px" }}
              className="w-full h-12 sm:h-13 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs sm:text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Yoxlanılır..." : "ŞİFRƏ İLƏ DAXİL OL"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* CASE 2: VENDOR STORE PANEL (/admin/stores/[slug]) -> STORE SPECIFIC LOGIN */
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase text-neutral-500 font-bold tracking-wider">
                {vendor.name} Rəsmi Girişi:
              </div>

              {vendorEmail && (
                <button
                  type="button"
                  onClick={() => handleQuickLogin(vendorEmail, `${vendorSuggestedName} Admin`)}
                  disabled={loading}
                  style={{ borderRadius: "1px" }}
                  className="w-full p-3.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 hover:border-neutral-950 transition-all flex items-center justify-between group cursor-pointer text-left shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#07241A] text-white flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black font-display uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                        <span>{vendor.name} Rəsmi Gmail</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500">{vendorEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    <span>Daxil Ol</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest shrink-0">
                VƏ YA MAĞAZA GMAIL ÜNVANI
              </span>
            </div>

            {/* Custom Gmail Input Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="magaza.sahibi@gmail.com"
                  value={customEmail}
                  onChange={(e) => { setCustomEmail(e.target.value); setErrorMsg(""); }}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ borderRadius: "1px" }}
                className="w-full h-11 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Yoxlanılır..." : "BU GMAIL İLƏ DAXİL OL"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <button
            type="button"
            onClick={openAuthModal}
            className="hover:underline text-neutral-700 font-bold cursor-pointer"
          >
            Standart Giriş Modalı
          </button>
          <span>TERZME SECURITY GATEWAY</span>
        </div>
      </div>
    </div>
  );
}
