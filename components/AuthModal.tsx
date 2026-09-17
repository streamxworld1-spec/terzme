"use client";

import React, { useState } from "react";
import { X, Lock, Mail, ArrowRight, Check } from "lucide-react";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div
        className="w-full max-w-sm glass-dark rounded-3xl p-6 border border-white/20 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">02® Member Access</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Access exclusive collections & early drops
          </p>
        </div>

        {success ? (
          <div className="my-8 text-center bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 text-emerald-300">
            <Check className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm font-semibold">Welcome Back!</p>
            <p className="text-xs text-emerald-400/80">Logged into 02 Studio</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@02studio.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Password / Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-white text-neutral-900 hover:bg-neutral-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow active:scale-98"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] text-neutral-500">
          SECURE PASSKEY LOGIN • ENCRYPTED BY 02® NETWORK
        </div>
      </div>
    </div>
  );
}
