"use client";

import React from "react";
import { Product } from "@/data/products";
import { X, CheckCircle, Sparkles } from "lucide-react";

export function DetailModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div
        className="w-full max-w-lg glass-dark rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SPEC SHEET // {product.code}</span>
        </div>

        <h3 className="text-2xl font-black tracking-tight mb-4">{product.name}</h3>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="glass-card-inner rounded-2xl p-4">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Material Structure
            </span>
            <p className="text-xs font-medium whitespace-pre-line leading-relaxed">
              {product.details.lining}
            </p>
          </div>

          <div className="glass-card-inner rounded-2xl p-4">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Pocket & Hardware
            </span>
            <p className="text-xs font-medium leading-relaxed">
              {product.details.pocket}
              <br />
              <span className="text-neutral-400 text-[11px]">{product.details.composition}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
            Technical Highlights
          </span>
          {product.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-neutral-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-white text-neutral-950 font-bold py-3 rounded-full hover:bg-neutral-200 transition-colors text-xs uppercase tracking-wider"
        >
          Close Specs
        </button>
      </div>
    </div>
  );
}
