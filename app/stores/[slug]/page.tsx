"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Product } from "@/data/products";
import { Vendor } from "@/app/actions";
import { 
  Store, 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  Search,
  Filter
} from "lucide-react";

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      fetch("/api/vendors").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json())
    ]).then(([vendorsData, prodsData]) => {
      if (Array.isArray(vendorsData)) {
        const found = vendorsData.find((v: Vendor) => v.slug === slug || v.id === slug);
        setVendor(found || null);
      }
      if (Array.isArray(prodsData)) {
        setProducts(prodsData);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 font-mono text-sm">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Mağaza yüklənir...</span>
        </div>
      </main>
    );
  }

  if (!vendor) {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-32 space-y-4">
          <h1 className="text-2xl font-black font-grotesk">Mağaza Tapılmadı</h1>
          <p className="text-neutral-500 font-mono text-xs">Axtardığınız tərəfdaş mağaza mövcud deyil və ya ünvanı dəyişib.</p>
          <Link href="/stores" className="inline-block px-5 py-2.5 bg-neutral-950 text-white rounded-xl font-mono text-xs">
            Bütün Mağazalara Qayıt
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  if (vendor.status === "pending") {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-28 px-4 space-y-5">
          <div className="w-16 h-16 bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto rounded-full">
            <Store className="w-8 h-8 stroke-[1.7]" />
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold uppercase tracking-wider inline-block">
            MODERASİYA VƏ TƏSDİQ GÖZLƏYİR
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-grotesk uppercase tracking-tight text-neutral-950">
            {vendor.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
            Bu mağaza üzrə müraciət qeydə alınıb və hazırda TERZME Baş İnzibatçısının təsdiqini gözləyir. Təsdiq edildikdən sonra ictimai vitrin və məhsullar alıcılar üçün aktiv olacaq.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link 
              href="/stores" 
              className="px-5 py-2.5 bg-[#07241A] text-white text-xs font-mono font-bold uppercase tracking-wider"
            >
              Bütün Mağazalara Bax
            </Link>
            <Link 
              href="/" 
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono font-bold uppercase tracking-wider"
            >
              Ana Səhifə
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (vendor.status === "suspended") {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-28 px-4 space-y-5">
          <div className="w-16 h-16 bg-neutral-100 border border-neutral-300 text-neutral-600 flex items-center justify-center mx-auto rounded-full">
            <Store className="w-8 h-8 stroke-[1.7]" />
          </div>
          <span className="px-3 py-1 bg-neutral-200 text-neutral-800 border border-neutral-300 text-xs font-mono font-bold uppercase tracking-wider inline-block">
            MAĞAZANIN FƏALİYYƏTİ MÜVƏQQƏTİ DAYANDIRILMIŞDIR
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-grotesk uppercase tracking-tight text-neutral-950">
            {vendor.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
            Bu mağazanın fəaliyyəti admin heyəti tərəfindən müvəqqəti olaraq dayandırılmışdır. Məhsullar canlı vitrindən çıxarılmışdır.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link 
              href="/stores" 
              className="px-5 py-2.5 bg-[#07241A] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl"
            >
              Digər Aktiv Mağazalara Bax
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (vendor.status === "rejected") {
    return (
      <main className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-28 px-4 space-y-4">
          <h1 className="text-2xl font-black font-grotesk uppercase text-red-600">Müraciət Təsdiqlənməyib</h1>
          <p className="text-neutral-600 font-sans text-xs">
            Bu mağazanın qeydiyyat müraciəti platforma standartlarına uyğun olmadığı üçün qəbul edilməmişdir.
          </p>
          {vendor.rejectionReason && (
            <p className="text-xs font-mono text-red-700 bg-red-50 p-3 border border-red-200">
              Səbəb: {vendor.rejectionReason}
            </p>
          )}
          <Link href="/stores" className="inline-block px-5 py-2.5 bg-neutral-950 text-white text-xs font-mono">
            Bütün Mağazalara Qayıt
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Filter products belonging to this vendor
  // For main atelier, display products that match or don't have explicit vendorId
  const storeProducts = products.filter((p) => {
    if (vendor.id === "terzme-atelier") {
      return !p.vendorId || p.vendorId === "terzme-atelier";
    }
    return p.vendorId === vendor.id;
  });

  // Custom vendor categories defined in admin panel (or fallback defaults)
  const vendorCategories = (vendor.categories && vendor.categories.length > 0)
    ? vendor.categories
    : ["Hoodies", "T-Shirts", "Pants", "Jackets", "Accessories"];

  const filteredProducts = storeProducts.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeCategory === "all") {
      return matchQuery;
    }

    const catNormalized = activeCategory.toLowerCase();
    const matchCat =
      p.category?.toLowerCase().includes(catNormalized) ||
      (p.categories && p.categories.some((c) => c.toLowerCase().includes(catNormalized))) ||
      p.name.toLowerCase().includes(catNormalized) ||
      p.subtitle?.toLowerCase().includes(catNormalized);

    return matchQuery && matchCat;
  });

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <section className="flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-8 pt-8 pb-24 relative z-10 space-y-10">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/stores"
            style={{ borderRadius: "1px" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 shadow-2xs transition-all cursor-pointer text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bütün Mağazalar</span>
          </Link>

          <span 
            style={{ borderRadius: "1px" }}
            className="text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 border border-emerald-200 font-bold"
          >
            Rəsmi Tərəfdaş Vitrini
          </span>
        </div>

        {/* Store Header Banner Card */}
        <div 
          style={{ borderRadius: "1px" }}
          className="border border-neutral-200/90 shadow-2xs overflow-hidden text-neutral-950 bg-white"
        >
          {/* Cover image */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-neutral-900">
            <img
              src={vendor.coverImage}
              alt={vendor.name}
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute top-6 right-6 flex items-center gap-2">
              <Link
                href={`/admin/stores/${vendor.slug}`}
                style={{ borderRadius: "1px" }}
                className="px-3.5 py-1.5 bg-[#07241A]/90 hover:bg-[#07241A] text-white text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vendor Paneli</span>
              </Link>
              <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{vendor.rating || 4.9}</span>
                <span className="opacity-70">({vendor.reviewCount || 50}+ rəy)</span>
              </span>
            </div>

            {/* Store title & details in cover */}
            <div className="absolute bottom-6 left-6 sm:left-10 flex flex-col sm:flex-row sm:items-end gap-5 text-white">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-white bg-white shadow-xl shrink-0">
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-black font-grotesk uppercase tracking-tight leading-none">
                    {vendor.name}
                  </h1>
                  {vendor.verified && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20 shrink-0" />
                  )}
                </div>
                <p className="text-xs sm:text-sm font-mono text-neutral-300">
                  {vendor.category} • Yaradılıb: {vendor.established || "2024"}
                </p>
              </div>
            </div>
          </div>

          {/* Details Bar */}
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-black/[0.06]">
            <p className="text-xs sm:text-sm text-neutral-700 font-sans max-w-2xl leading-relaxed">
              {vendor.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-neutral-600 shrink-0">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>{vendor.city}</span>
              </div>
              {vendor.phone && (
                <a href={`tel:${vendor.phone}`} className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span>{vendor.phone}</span>
                </a>
              )}
              {vendor.whatsapp && (
                <a 
                  href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold transition-colors"
                >
                  <span>💬 WhatsApp</span>
                </a>
              )}
              {vendor.instagram && (
                <a 
                  href={vendor.instagram.startsWith("http") ? vendor.instagram : `https://instagram.com/${vendor.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-pink-700 hover:text-pink-800 font-bold transition-colors"
                >
                  <span>📸 Instagram</span>
                </a>
              )}
              {vendor.shippingRates && (
                <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded text-neutral-800">
                  <span>📦 Karqo: {vendor.shippingRates.standardPrice || 5} ₼</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-grotesk uppercase tracking-tight text-neutral-950">
                Mağazanın Məhsulları ({storeProducts.length})
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                {vendor.name} kolleksiyası üzrə aktiv parçalar
              </p>
            </div>

            {/* Quick Search inside store */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Bu mağazada axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: "1px" }}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Store Category Filter Bar (Custom categories defined by store/admin) */}
          <div 
            style={{ borderRadius: "1px" }}
            className="bg-white border border-neutral-200 p-3 sm:p-4 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 mr-2 shrink-0">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-bold uppercase tracking-wider">KOLLEKSİYA:</span>
            </div>

            {/* All Products pill */}
            <button
              onClick={() => setActiveCategory("all")}
              style={{ borderRadius: "1px" }}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#07241A] text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100/80 hover:text-emerald-950"
              }`}
            >
              Hamısı ({storeProducts.length})
            </button>

            {/* Custom Category pills defined by store */}
            {vendorCategories.map((cat) => {
              const catNormalized = cat.toLowerCase();
              const count = storeProducts.filter((p) =>
                p.category?.toLowerCase().includes(catNormalized) ||
                (p.categories && p.categories.some((c) => c.toLowerCase().includes(catNormalized))) ||
                p.name.toLowerCase().includes(catNormalized) ||
                p.subtitle?.toLowerCase().includes(catNormalized)
              ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ borderRadius: "1px" }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#07241A] text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100/80 hover:text-emerald-950"
                  }`}
                >
                  {cat} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/60 border border-dashed border-neutral-300 space-y-3">
              <Store className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-bold text-base font-grotesk text-neutral-900">
                Bu mağazada axtarışa uyğun məhsul tapılmadı
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Açar sözü dəyişərək yenidən yoxlayın və ya bütün kolleksiyaya baxın.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{ borderRadius: "1px" }}
                  className="bg-white rounded-[1px] border border-neutral-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300 group"
                >
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

                    <Link href={`/product/${prod.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-sans text-neutral-500 font-medium">
                        <span className="truncate">{vendor.name}</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-600/20 shrink-0" />
                      </div>
                      <Link href={`/product/${prod.id}`} className="hover:underline">
                        <h3 className="text-xs sm:text-sm font-bold font-sans text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-black cursor-pointer">
                          {prod.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-neutral-800">4.9</span>
                        <span className="text-[10px]">(24)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-black font-mono text-neutral-950">
                          {formatPrice(prod.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(prod)}
                        style={{ borderRadius: "1px" }}
                        className="w-8 h-8 rounded-[1px] bg-neutral-950 hover:bg-black text-white flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                        title="Səbətə at"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
