"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRODUCTS, Product, CATEGORY_MAPPINGS, StandardCategory } from "@/data/products";
import { CATEGORIES_DATA } from "@/data/mockupData";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { 
  ArrowLeft, 
  Check, 
  SlidersHorizontal, 
  ChevronDown, 
  Heart, 
  Star, 
  ShoppingBag, 
  CheckCircle2, 
  Store,
  Layers,
  Sparkles
} from "lucide-react";

function CollectionContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const searchParam = searchParams.get("search");

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sync category param from URL if present
  useEffect(() => {
    if (catParam) {
      setActiveCategory(catParam.toLowerCase());
    } else {
      setActiveCategory("all");
    }
  }, [catParam]);

  // Load latest live products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  // Map product to standardized store name and slug
  const getProductStoreInfo = (prod: Product) => {
    const designer = (prod.designer || prod.vendorName || "TERZME STORE").trim();
    let storeSlug = prod.vendorId || "";
    if (!storeSlug) {
      if (designer.toLowerCase().includes("terzme")) storeSlug = "terzme-store";
      else if (designer.toLowerCase().includes("ag'gara") || designer.toLowerCase().includes("aggara")) storeSlug = "ag-gara";
      else if (designer.toLowerCase().includes("sabah")) storeSlug = "sabah-store";
      else if (designer.toLowerCase().includes("urban")) storeSlug = "urban-goods";
      else storeSlug = designer.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    return { storeName: designer, storeSlug };
  };

  // Helper to match category accurately across vendors
  const productMatchesCategory = (prod: Product, targetCat: string) => {
    if (targetCat === "all") return true;

    const catNormalized = targetCat.toLowerCase();
    const prodCat = (prod.category || "").toLowerCase();
    const prodMainCat = (prod.mainCategory || "").toLowerCase();
    const prodCategories = (prod.categories || []).map((c) => c.toLowerCase());

    // Exact direct matches
    if (prodCat === catNormalized || prodMainCat === catNormalized || prodCategories.includes(catNormalized)) {
      return true;
    }

    // Check mapping aliases if targetCat is one of standard 7 categories
    if (catNormalized in CATEGORY_MAPPINGS) {
      const aliases = CATEGORY_MAPPINGS[catNormalized as StandardCategory];
      const hasAliasMatch = aliases.some((alias) => 
        prodCat.includes(alias) || 
        prodMainCat.includes(alias) || 
        prodCategories.some((c) => c.includes(alias)) ||
        prod.name.toLowerCase().includes(alias)
      );
      if (hasAliasMatch) return true;
    }

    return false;
  };

  // Category & Search Filter
  const categoryFiltered = products.filter((p) => {
    // URL search query filter if user searched
    if (searchParam) {
      const q = searchParam.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesigner = (p.designer || "").toLowerCase().includes(q);
      const matchDesc = (p.description || "").toLowerCase().includes(q);
      if (!matchName && !matchDesigner && !matchDesc) return false;
    }

    return productMatchesCategory(p, activeCategory);
  });

  // Extract unique stores present in current category results
  const availableStores = Array.from(
    new Set(
      categoryFiltered.map((p) => {
        const { storeName } = getProductStoreInfo(p);
        return storeName;
      })
    )
  ).filter(Boolean);

  // Store filter
  const storeFiltered = selectedStore === "all"
    ? categoryFiltered
    : categoryFiltered.filter((p) => {
        const { storeName } = getProductStoreInfo(p);
        return storeName.toLowerCase() === selectedStore.toLowerCase();
      });

  // Sorting logic
  const sortedProducts = [...storeFiltered].sort((a, b) => {
    if (activeSort === "featured") {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    if (activeSort === "price-asc") {
      return a.price - b.price;
    }
    if (activeSort === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  const activeCategoryMeta = CATEGORIES_DATA.find((c) => c.slug === activeCategory);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 z-30 space-y-6">
        
        {/* TOP CATEGORY PILLS BAR (ALL 7 CORE CATEGORIES + BÜTÜN KATEQORİYALAR) */}
        <div className="bg-[#F5F5F5] border border-neutral-200 p-3 sm:p-4" style={{ borderRadius: "1px" }}>
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <span className="text-[11px] font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-800" />
              <span>Əsas Kateqoriyalar Vitrini</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
              Bütün mağazaların məhsulları bir yerdə
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {/* All Products option */}
            <Link
              href="/collection"
              style={{ borderRadius: "1px" }}
              className={`p-2 sm:p-2.5 text-center border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#07241A] text-white border-[#07241A] shadow-xs"
                  : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
              }`}
            >
              <span className="text-[11px] sm:text-xs font-grotesk font-bold uppercase leading-tight">
                Hamısı
              </span>
              <span className={`text-[9px] font-mono ${activeCategory === "all" ? "text-emerald-300" : "text-neutral-400"}`}>
                (Avtomobil xaric)
              </span>
            </Link>

            {/* 7 Standard Categories */}
            {CATEGORIES_DATA.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/collection?cat=${cat.slug}`}
                  style={{ borderRadius: "1px" }}
                  className={`p-2 sm:p-2.5 text-center border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? "bg-[#07241A] text-white border-[#07241A] shadow-xs"
                      : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  <span className="text-[11px] sm:text-xs font-grotesk font-bold uppercase leading-tight truncate w-full">
                    {cat.name}
                  </span>
                  <span className={`text-[9px] font-mono ${isSelected ? "text-emerald-300" : "text-neutral-400"}`}>
                    Kolleksiya
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CONTROLS COMPARTMENT: Title, Store Filter Pills & Sorting */}
        <div 
          style={{ borderRadius: "1px" }}
          className="p-4 sm:p-5 border border-neutral-200/90 shadow-2xs flex flex-col gap-4 relative z-40 text-neutral-950 bg-white"
        >
          {/* Header row: Page title, active badge, and sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <Link 
                href="/"
                style={{ borderRadius: "1px" }}
                className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all border border-neutral-200 shadow-2xs group shrink-0 text-neutral-900"
                title="Əsas səhifəyə qayıt"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-900 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-black font-grotesk uppercase tracking-tight text-neutral-950">
                    {activeCategoryMeta ? activeCategoryMeta.name : activeCategory === "all" ? "Bütün Kolleksiya" : activeCategory}
                  </h1>
                  <span 
                    style={{ borderRadius: "1px" }}
                    className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold uppercase border border-neutral-200"
                  >
                    {sortedProducts.length} məhsul
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                  Bu kateqoriyada fəaliyyət göstərən bütün mağazaların ortaq vitrini
                </p>
              </div>
            </div>

            {/* Right: Sorting Selector */}
            <div className="relative flex justify-end">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{ borderRadius: "1px" }}
                className={`flex items-center justify-between sm:justify-start gap-2 px-4 py-2 border text-xs font-mono font-bold transition-all cursor-pointer w-full sm:w-auto ${
                  showFilterDropdown
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                    : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 shadow-2xs"
                }`}
              >
                <span className="text-neutral-500 font-normal">Sırala:</span>
                <span className="font-grotesk font-bold text-neutral-950">
                  {activeSort === "featured" ? "Önə çıxanlar" : activeSort === "price-asc" ? "Qiymət: Aşağıdan Yuxarıya" : activeSort === "price-desc" ? "Qiymət: Yuxarıdan Aşağıya" : "Yeni Buraxılışlar"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilterDropdown ? "rotate-180" : ""}`} />
              </button>

              {showFilterDropdown && (
                <div 
                  style={{ borderRadius: "1px" }}
                  className="absolute right-0 top-full mt-2 w-56 p-2 bg-white border border-neutral-200 shadow-xl z-50 text-xs font-mono space-y-1 animate-in fade-in duration-200 text-neutral-900"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-b border-neutral-100 mb-1">
                    Sıralama Qaydası
                  </div>
                  {[
                    { id: "featured", label: "Önə çıxanlar" },
                    { id: "price-asc", label: "Qiymət: Aşağıdan Yuxarıya" },
                    { id: "price-desc", label: "Qiymət: Yuxarıdan Aşağıya" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setActiveSort(option.id as any);
                        setShowFilterDropdown(false);
                      }}
                      style={{ borderRadius: "1px" }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                        activeSort === option.id 
                          ? "bg-neutral-950 text-white font-bold shadow-xs" 
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                    >
                      <span>{option.label}</span>
                      {activeSort === option.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STORE FILTER PILLS: Filter products by specific store within this category */}
          {availableStores.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-emerald-800" />
                <span>Mağaza:</span>
              </span>

              <button
                onClick={() => setSelectedStore("all")}
                style={{ borderRadius: "1px" }}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  selectedStore === "all"
                    ? "bg-[#07241A] text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200"
                }`}
              >
                Bütün Mağazalar ({categoryFiltered.length})
              </button>

              {availableStores.map((store) => {
                const isSelected = selectedStore.toLowerCase() === store.toLowerCase();
                const storeCount = categoryFiltered.filter((p) => {
                  const { storeName } = getProductStoreInfo(p);
                  return storeName.toLowerCase() === store.toLowerCase();
                }).length;

                return (
                  <button
                    key={store}
                    onClick={() => setSelectedStore(isSelected ? "all" : store)}
                    style={{ borderRadius: "1px" }}
                    className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#07241A] text-white shadow-xs"
                        : "bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200"
                    }`}
                  >
                    <span>{store}</span>
                    <span className="text-[10px] opacity-75">({storeCount})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Grid with 6-col / 4-col Layout - Exact Hazırda Populyar Style */}
        {sortedProducts.length === 0 ? (
          <div 
            style={{ borderRadius: "1px" }}
            className="p-12 text-center bg-white border border-neutral-200 space-y-3"
          >
            <Store className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-lg font-bold font-grotesk uppercase text-neutral-900">
              Bu kateqoriyada hələlik məhsul tapılmadı
            </h3>
            <p className="text-xs font-mono text-neutral-500 max-w-md mx-auto">
              Mağazalarımız bu kateqoriyaya yeni məhsullar əlavə etdikcə burada birgə nümayiş olunacaq.
            </p>
            <Link
              href="/collection"
              style={{ borderRadius: "1px" }}
              className="inline-block px-5 py-2.5 bg-[#07241A] text-white text-xs font-mono font-bold uppercase mt-2"
            >
              Bütün Məhsullara Bax
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {sortedProducts.map((prod) => {
              const { storeName, storeSlug } = getProductStoreInfo(prod);
              const isLiked = isInWishlist(prod.id);

              return (
                <div 
                  key={prod.id}
                  style={{ borderRadius: "1px" }}
                  className="bg-white rounded-[1px] border border-neutral-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image Frame with Badges and Heart */}
                  <div 
                    style={{ borderRadius: "1px" }}
                    className="relative w-full aspect-square bg-[#F7F7F7] flex items-center justify-center p-4 overflow-hidden rounded-[1px]"
                  >
                    {prod.featured && (
                      <span 
                        style={{ borderRadius: "1px" }}
                        className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-[1px] bg-[#0F3F2E] text-white text-[10px] font-mono font-bold z-10"
                      >
                        ÖNƏ ÇIXAN
                      </span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(prod);
                      }}
                      style={{ borderRadius: "1px" }}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-[1px] flex items-center justify-center shadow-xs transition-colors z-10 cursor-pointer ${
                        isLiked 
                          ? "bg-red-50 text-red-600 border border-red-200" 
                          : "bg-white/90 hover:bg-white text-neutral-500 hover:text-red-500"
                      }`}
                      title={isLiked ? "Bəyəndiklərimdən çıxar" : "Bəyən"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-600 stroke-red-600" : "stroke-[1.8]"}`} />
                    </button>

                    <Link href={`/product/${prod.id}`} className="w-full h-full flex items-center justify-center">
                      <img 
                        src={prod.mainImage} 
                        alt={prod.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                      />
                    </Link>
                  </div>

                  {/* Content Body */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Store Name with verified check and link to store */}
                      <Link 
                        href={`/stores/${storeSlug}`}
                        className="flex items-center gap-1 text-[11px] font-sans text-neutral-600 hover:text-[#07241A] font-medium transition-colors"
                        title={`${storeName} mağazasına bax`}
                      >
                        <span className="truncate font-bold underline decoration-neutral-300 underline-offset-2 hover:decoration-emerald-700">
                          {storeName}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-600/20 shrink-0" />
                      </Link>

                      {/* Product Title */}
                      <Link href={`/product/${prod.id}`} className="hover:underline">
                        <h3 className="text-xs sm:text-sm font-bold font-sans text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-black cursor-pointer">
                          {prod.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-neutral-800">4.9</span>
                        <span className="text-[10px]">(24)</span>
                      </div>
                    </div>

                    {/* Price and Add to Cart Button */}
                    <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-black font-mono text-neutral-950">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.featured && (
                          <span className="text-[10px] font-mono line-through text-neutral-400">
                            {formatPrice(Math.round(prod.price * 1.25))}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(prod)}
                        style={{ borderRadius: "1px" }}
                        className="w-8 h-8 rounded-[1px] bg-neutral-950 hover:bg-black text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                        title="Səbətə at"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-neutral-500">
        Kolleksiya yüklənir...
      </div>
    }>
      <CollectionContent />
    </Suspense>
  );
}
