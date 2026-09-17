"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, 
  MapPin, 
  Phone, 
  Layers, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Search, 
  Filter
} from "lucide-react";
import { Vendor } from "@/app/actions";
import { Product } from "@/data/products";

interface StoresListClientProps {
  initialVendors: Vendor[];
  allProducts: Product[];
}

export function StoresListClient({ initialVendors, allProducts }: StoresListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract all categories dynamically and add preset common luxury categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialVendors.forEach((v) => {
      if (v.category) {
        cats.add(v.category);
      }
    });
    return ["ALL", ...Array.from(cats)];
  }, [initialVendors]);

  // Filter vendors based on category and search - ONLY SHOW ACTIVE on public showcase!
  const filteredVendors = useMemo(() => {
    return initialVendors
      .filter((v) => v.status === "active")
      .filter((vendor) => {
        const matchesCategory =
          selectedCategory === "ALL" ||
          vendor.category.toLowerCase().includes(selectedCategory.toLowerCase());

        const matchesSearch =
          searchQuery.trim() === "" ||
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.city.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      });
  }, [initialVendors, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & 'Mağaza Aç' action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-neutral-950">
            Aktiv Mağazalar ({filteredVendors.length})
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Bakı və regionlardan seçilmiş rəsmi tərəfdaşlarımız
          </p>
        </div>

        <Link
          href="/open-store"
          style={{ borderRadius: "1px" }}
          className="px-4 py-2 bg-[#07241A] hover:bg-[#051A13] text-white font-mono text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Mağaza Aç</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div 
        style={{ borderRadius: "1px" }}
        className="bg-white border border-neutral-200 p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs"
      >
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-mono text-neutral-400 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>KATEQORİYA:</span>
          </div>

          <button
            onClick={() => setSelectedCategory("ALL")}
            style={{ borderRadius: "1px" }}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-[#07241A] text-white shadow-xs"
                : "bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100/80 hover:text-emerald-950"
            }`}
          >
            Hamısı ({initialVendors.length})
          </button>

          {categories.filter((c) => c !== "ALL").map((cat) => {
            const count = initialVendors.filter((v) =>
              v.category.toLowerCase().includes(cat.toLowerCase())
            ).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ borderRadius: "1px" }}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#07241A] text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100/80 hover:text-emerald-950"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Mağaza axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: "1px" }}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 transition-colors"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredVendors.length === 0 && (
        <div 
          style={{ borderRadius: "1px" }}
          className="p-12 text-center bg-white border border-neutral-200 space-y-3"
        >
          <p className="text-sm font-mono text-neutral-600">
            Seçilmiş filtrə uyğun heç bir mağaza tapılmadı.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            style={{ borderRadius: "1px" }}
            className="px-4 py-2 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-mono uppercase font-bold cursor-pointer transition-all"
          >
            Filtrləri Sıfırla
          </button>
        </div>
      )}

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filteredVendors.map((vendor) => {
          const vendorProducts = allProducts.filter(
            (p) => p.vendorId === vendor.id || (vendor.id === "terzme-atelier" && !p.vendorId)
          );

          return (
            <div
              key={vendor.id}
              style={{ borderRadius: "1px" }}
              className="border border-neutral-200/90 shadow-2xs overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-lg hover:border-neutral-300 text-neutral-950 bg-white"
            >
              {/* Top Cover Banner */}
              <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-100">
                <img
                  src={vendor.coverImage}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Logo Overlay */}
                <div className="absolute bottom-4 left-6 flex items-end gap-3.5">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-lg shrink-0">
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-white pb-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg sm:text-xl font-black font-grotesk tracking-tight leading-none drop-shadow-sm">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-300 tracking-wider uppercase block mt-1">
                      {vendor.category}
                    </span>
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {vendor.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/90 text-neutral-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
                      SEÇİLMİŞ
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-md border border-white/20">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{vendor.rating || 4.9}</span>
                    <span className="opacity-70">({vendor.reviewCount || 50}+)</span>
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed line-clamp-2">
                    {vendor.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{vendor.city}</span>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{vendorProducts.length} Məhsul</span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA to View Storefront */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-neutral-500 font-bold">
                    Yaranma ili: {vendor.established || "2024"}
                  </span>

                  <Link
                    href={`/stores/${vendor.slug}`}
                    style={{ borderRadius: "1px" }}
                    className="px-5 py-2.5 bg-neutral-950 hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs group-hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Mağazaya Bax</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
