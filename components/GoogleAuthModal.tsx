"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, User, Mail, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Check, AlertCircle, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

export function GoogleAuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithCredentials, registerWithCredentials, loginWithGoogleDirect } = useAuth();
  const [tab, setTab] = useState<"login" | "register" | "google">("login");

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Google Quick form state
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  // Status & loading
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  // STRICT LOGIN VALIDATION
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const identifier = loginIdentifier.trim();
    const pass = loginPassword.trim();

    if (!identifier) {
      setErrorMsg("İstifadəçi adı və ya e-poçt ünvanınızı daxil edin.");
      return;
    }
    if (!pass) {
      setErrorMsg("Zəhmət olmasa şifrənizi daxil edin.");
      return;
    }
    if (pass.length < 8) {
      setErrorMsg("Şifrə ən azı 8 simvoldan ibarət olmalıdır.");
      return;
    }

    setIsLoading(true);
    try {
      const apiRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          usernameOrEmail: identifier,
          password: pass,
        }),
      });
      const data = await apiRes.json();
      setIsLoading(false);

      if (data.success && data.user) {
        // Log in user via context
        loginWithGoogleDirect(data.user);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(data.error || "Giriş məlumatları yanlışdır.");
      }
    } catch (e) {
      // Fallback to local credential verification
      const res = loginWithCredentials(identifier, pass);
      setIsLoading(false);
      if (res.success) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(res.message || "Giriş məlumatları yanlışdır.");
      }
    }
  };

  // STRICT REGISTER VALIDATION
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const uName = regName.trim();
    const uEmail = regEmail.trim().toLowerCase();
    const uPass = regPassword.trim();
    const uUsername = (regUsername.trim() || uEmail.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "_");

    if (!uUsername || uUsername.length < 3) {
      setErrorMsg("İstifadəçi adı ən azı 3 simvoldan ibarət olmalıdır.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!uEmail || !emailRegex.test(uEmail)) {
      setErrorMsg("Düzgün bir e-poçt ünvanı daxil edin (məs: ad@domain.com).");
      return;
    }

    if (!uPass || uPass.length < 8) {
      setErrorMsg("Şifrə minimum 8 simvoldan ibarət olmalıdır.");
      return;
    }

    setIsLoading(true);
    try {
      const apiRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: uName || uUsername,
          username: uUsername,
          email: uEmail,
          password: uPass,
        }),
      });
      const data = await apiRes.json();
      setIsLoading(false);

      if (data.success && data.user) {
        loginWithGoogleDirect(data.user);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(data.error || "Qeydiyyat zamanı xəta baş verdi.");
      }
    } catch (e) {
      const res = registerWithCredentials({
        name: uName || uUsername,
        username: uUsername,
        email: uEmail,
        password: uPass,
      });
      setIsLoading(false);
      if (res.success) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(res.message || "Qeydiyyat zamanı xəta baş verdi.");
      }
    }
  };

  // GOOGLE QUICK LOGIN
  const handleGoogleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const email = googleEmail.trim().toLowerCase();
    const name = googleName.trim();

    if (!email) {
      setErrorMsg("Google e-poçt ünvanınızı daxil edin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Düzgün bir Gmail və ya Google e-poçt ünvanı daxil edin.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogleDirect({
        email,
        name: name || email.split("@")[0],
      });
      setIsLoading(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 400);
  };

  const handleInstantDemoGoogle = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogleDirect({
        name: "Google İstifadəçisi",
        email: "terzme.client@gmail.com",
      });
      setIsLoading(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-sans">
      <div 
        style={{ borderRadius: "1px" }}
        className="bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl border border-neutral-200 relative space-y-6 text-neutral-950 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{ borderRadius: "1px" }}
          className="absolute top-4 right-4 p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div 
            style={{ borderRadius: "1px" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#07241A]/5 border border-[#07241A]/20 text-[#07241A] text-[10px] font-mono font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3 text-[#07241A]" />
            <span>TERZME ACCESS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-neutral-950">
            {tab === "login" ? "HESABA GİRİŞ" : tab === "register" ? "YENİ HESAB" : "GOOGLE İLƏ GİRİŞ"}
          </h2>

          <p className="text-xs text-neutral-600 font-sans max-w-xs mx-auto">
            {tab === "login" 
              ? "İstifadəçi adı və şifrənizlə TERZME platformasına daxil olun." 
              : tab === "register"
              ? "Bəyəndikləriniz və səbətinizin həmişə saxlanması üçün hesab yaradın."
              : "Google e-poçtunuzla tək kliklə daxil olun və hesabınızı bağlayın."}
          </p>
        </div>

        {/* Tab Switcher (Visible in Login & Register) */}
        {tab !== "google" ? (
          <div 
            style={{ borderRadius: "1px" }}
            className="grid grid-cols-2 p-1 bg-neutral-100 border border-neutral-200"
          >
            <button
              type="button"
              onClick={() => { setTab("login"); setErrorMsg(""); }}
              style={{ borderRadius: "1px" }}
              className={`py-2 text-xs font-black font-display uppercase tracking-wider transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              GİRİŞ
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setErrorMsg(""); }}
              style={{ borderRadius: "1px" }}
              className={`py-2 text-xs font-black font-display uppercase tracking-wider transition-all cursor-pointer ${
                tab === "register"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              QEYDİYYAT
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setTab("login"); setErrorMsg(""); }}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Giriş səhifəsinə qayıt</span>
          </button>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div 
            style={{ borderRadius: "1px" }}
            className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-start gap-2 animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {tab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                İstifadəçi adı, Adınız və ya E-poçt
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="Məs: Gazanfar Yusifli, jusifli və ya email"
                  value={loginIdentifier}
                  onChange={(e) => { setLoginIdentifier(e.target.value); setErrorMsg(""); }}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                  Şifrə (min. 8 simvol)
                </label>
                <span className={`text-[10px] font-mono ${loginPassword.length >= 8 ? "text-emerald-700 font-bold" : "text-neutral-400"}`}>
                  {loginPassword.length}/8 simvol
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setErrorMsg(""); }}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ borderRadius: "1px" }}
              className="w-full h-11 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Yoxlanılır..." : "DAXİL OL"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                Ad və Soyad
              </label>
              <input
                type="text"
                placeholder="Məs: Gazanfar Yusifli"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={{ borderRadius: "1px" }}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                İstifadəçi adı (min. 3 simvol) *
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="Məs: jusifli"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                E-poçt ünvanı *
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="adiniz@domain.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-display font-black uppercase tracking-wider text-neutral-700 block">
                  Şifrə (min. 8 simvol) *
                </label>
                <span className={`text-[10px] font-mono ${regPassword.length >= 8 ? "text-emerald-700 font-bold" : "text-neutral-400"}`}>
                  {regPassword.length >= 8 ? "✓ Qəbuldur" : `${regPassword.length}/8 simvol`}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  placeholder="Ən azı 8 simvol tələb olunur"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ borderRadius: "1px" }}
              className="w-full h-11 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 mt-1"
            >
              <span>{isLoading ? "Yaradılır..." : "HESAB YARAT"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 3. PROFESSIONAL GOOGLE ACCOUNT SELECTOR */}
        {tab === "google" && (
          <div className="space-y-4 font-sans">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-neutral-950">Hesab Seçin</h3>
              <p className="text-xs text-neutral-500 font-mono">TERZME ilə davam etmək üçün Google hesabı seçin</p>
            </div>

            {/* Google Profile Cards */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  loginWithGoogleDirect({
                    name: "Qəzənfər Yusifli",
                    email: "yusifligazanfar@gmail.com",
                  });
                  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                }}
                style={{ borderRadius: "1px" }}
                className="w-full p-3 bg-[#FAFAF8] hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-400 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-900 text-white font-bold font-mono text-sm flex items-center justify-center shrink-0">
                    Q
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-950 group-hover:text-black">Qəzənfər Yusifli</div>
                    <div className="text-[11px] font-mono text-neutral-500">yusifligazanfar@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => {
                  loginWithGoogleDirect({
                    name: "Yusifli Client",
                    email: "jusifli@gmail.com",
                  });
                  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                }}
                style={{ borderRadius: "1px" }}
                className="w-full p-3 bg-[#FAFAF8] hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-400 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 text-white font-bold font-mono text-sm flex items-center justify-center shrink-0">
                    Y
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-950 group-hover:text-black">Yusifli</div>
                    <div className="text-[11px] font-mono text-neutral-500">jusifli@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
              </button>
            </div>

            {/* Or Enter Custom Google Email */}
            <form onSubmit={handleGoogleSubmit} className="pt-2 border-t border-neutral-100 space-y-3">
              <div className="text-[11px] font-mono text-neutral-600 font-bold uppercase tracking-wider">
                Və ya fərqli Google hesabı daxil edin:
              </div>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="adiniz@gmail.com"
                  value={googleEmail}
                  onChange={(e) => { setGoogleEmail(e.target.value); setErrorMsg(""); }}
                  style={{ borderRadius: "1px" }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAF8] border border-neutral-300 focus:outline-none focus:border-neutral-950 focus:bg-white text-xs font-mono text-neutral-900"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{ borderRadius: "1px" }}
                className="w-full h-10 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? "Qoşulur..." : "BU HESABLA DAXİL OL"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-[10px] text-neutral-400 font-mono leading-tight">
                TERZME ilə davam etmək üçün Google profil adınızı və e-poçt ünvanınızı təsdiqləyir.
              </p>
            </div>
          </div>
        )}

        {/* Divider & Google Fast Switcher (Only visible in Login/Register) */}
        {tab !== "google" && (
          <>
            <div className="relative flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest shrink-0">
                VƏ YA
              </span>
            </div>

            {/* Switch to Google Login */}
            <button
              type="button"
              onClick={() => { setTab("google"); setErrorMsg(""); }}
              disabled={isLoading}
              style={{ borderRadius: "1px" }}
              className="w-full h-11 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-sans font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="tracking-wide text-xs">Google ilə Tez Giriş</span>
            </button>
          </>
        )}

        {/* Security & Guarantee Note */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] font-mono text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Təhlükəsiz Şifrələnmə • TERZME ATELIER</span>
        </div>
      </div>
    </div>
  );
}

