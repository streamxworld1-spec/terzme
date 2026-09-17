"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveProductAction } from "@/app/actions";
import { ArrowLeft, Save, Check, Sparkles, Flame, Shirt, Layers, ExternalLink, CheckSquare, Square } from "lucide-react";
import { ImageUploadField } from "@/components/ImageUploadField";

const SECTIONS = [
  {
    id: "new-arrivals",
    title: "YENİ BURAXILIŞLAR",
    subtitle: "Mövsümün ən son unikal küçə tərzi",
    badge: "YENİ",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Sparkles,
    route: "/collection/new-arrivals",
    details: "Ana Səhifə Vitrini + /collection/new-arrivals",
  },
  {
    id: "bestsellers",
    title: "ƏN ÇOX SATILANLAR",
    subtitle: "İkonik və ən çox seçilən parçalar",
    badge: "HOT",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Flame,
    route: "/collection/bestsellers",
    details: "Ana Səhifə 'ƏN ÇOX SATILANLAR' Karuseli + /collection/bestsellers",
  },
  {
    id: "t-shirts",
    title: "QRAFİK KÖYNƏKLƏR",
    subtitle: "280 GSM premium qalın pambıq",
    badge: "280 GSM",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Shirt,
    route: "/collection/t-shirts",
    details: "Qrafik Köynəklər Bölməsi (/collection/t-shirts)",
  },
  {
    id: "hoodies",
    title: "HUDİLƏR VƏ SVİTERLƏR",
    subtitle: "Azərbaycan tərzi 450 GSM fleece",
    badge: "BALAM",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Layers,
    route: "/collection/hoodies",
    details: "Hudilər və Sviterlər Bölməsi (/collection/hoodies)",
  },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [vendorsList, setVendorsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState("terzme-atelier");

  useState(() => {
    fetch("/api/vendors")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVendorsList(data);
      })
      .catch(() => {});
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  // Multi-select categories state (can select multiple sections at once!)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["new-arrivals"]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sizes, setSizes] = useState("S, M, L, XL");

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Keep at least one category selected
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const selectAllCategories = () => {
    if (selectedCategories.length === SECTIONS.length) {
      setSelectedCategories(["new-arrivals"]);
    } else {
      setSelectedCategories(SECTIONS.map((s) => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || selectedCategories.length === 0) return;
    setIsSubmitting(true);

    try {
      const sizeList = sizes
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const primaryCategory = selectedCategories[0];
      const primaryBadge = SECTIONS.find((s) => s.id === primaryCategory)?.badge || "YENİ";

      const selectedVendorObj = vendorsList.find((v) => v.id === selectedVendorId);

      await saveProductAction({
        name,
        price: parseFloat(price) || 0,
        category: primaryCategory as any,
        categories: selectedCategories,
        badge: primaryBadge,
        vendorId: selectedVendorId,
        vendorName: selectedVendorObj?.name || "TERZME Main Atelier",
        details: {
          title: name,
          studio: selectedVendorObj?.name || "BAKU ATELIER",
          era: "EDITION 2026",
          specs: ["ATELIER REINFORCED STITCH", "PRE-SHRUNK"],
          lining: "ORGANIC COTTON",
          pocket: "INTEGRATED",
          composition: description || "450 GSM Heavyweight French Terry",
        },
        mainImage: image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
        images: [image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"],
        sizes: sizeList.length > 0 ? sizeList : ["S", "M", "L", "XL"],
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-950 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Məhsullara qayıt
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
            Yeni Məhsul Əlavə Et
          </h1>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Məhsul uğurla əlavə edildi! Məhsullar səhifəsinə yönləndirilirsiniz...
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          
          {/* PRODUCT NAME AND PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Məhsulun Adı *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="məs. AZERBAIJAN FLEECE HOODIE"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Qiymət (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="məs. 119"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* VENDOR SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-neutral-600 font-semibold flex items-center gap-1.5">
              <span>Satıcı Mağaza (Vendor) *</span>
            </label>
            <div className="relative">
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors cursor-pointer appearance-none font-sans font-medium"
              >
                {vendorsList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 font-mono text-xs">
                ▼
              </div>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              Bu məhsul hansı mağazanın/atelyenin kataloqunda və vitrinində yerləşdirilsin.
            </span>
          </div>

          {/* SAYTDA GÖRÜNƏCƏYİ ƏSAS BÖLMƏ: (ÇOXLU SEÇİM - MULTI SELECT) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-mono uppercase text-neutral-900 font-bold tracking-wider block">
                  Saytda Görünəcəyi Əsas Bölmə: (Seçimlər) *
                </label>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  İstədiyiniz bölmələrin üzərinə klikləyərək bir neçəsini birdən seçə bilərsiniz.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={selectAllCategories}
                  className="text-xs font-mono text-neutral-600 hover:text-neutral-950 underline underline-offset-4 cursor-pointer"
                >
                  {selectedCategories.length === SECTIONS.length ? "Yalnız birini seç" : "Hamısını seç"}
                </button>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold">
                  {selectedCategories.length} bölmə seçilib
                </span>
              </div>
            </div>

            {/* MULTI-SELECT INTERACTIVE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isChecked = selectedCategories.includes(sec.id);

                return (
                  <div
                    key={sec.id}
                    onClick={() => toggleCategory(sec.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none ${
                      isChecked
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.01]"
                        : "bg-neutral-50/80 hover:bg-neutral-100 text-neutral-900 border-neutral-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isChecked ? "bg-white/15 text-white" : "bg-white border border-neutral-200 text-neutral-800"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider">
                              {sec.title}
                            </h4>
                          </div>
                          <p className={`text-[11px] font-mono mt-0.5 ${isChecked ? "text-white/70" : "text-neutral-500"}`}>
                            {sec.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          isChecked 
                            ? "bg-white/10 text-white border-white/20" 
                            : sec.badgeColor
                        }`}>
                          {sec.badge}
                        </span>

                        {isChecked ? (
                          <div className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border border-neutral-300 bg-white" />
                        )}
                      </div>
                    </div>

                    <div className={`pt-2 border-t text-[10px] font-mono flex items-center justify-between ${
                      isChecked ? "border-white/10 text-white/60" : "border-neutral-200 text-neutral-500"
                    }`}>
                      <span className="truncate">{sec.details}</span>
                      <span className={`font-semibold ml-1 ${isChecked ? "text-emerald-400" : "text-neutral-400"}`}>
                        {isChecked ? "Aktivdir" : "Seçilməyib"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIZES */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
              Mövcud Ölçülər (vergüllə ayırın)
            </label>
            <input
              type="text"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
            />
          </div>

          {/* IMAGE UPLOAD (GALLERY / URL) */}
          <ImageUploadField
            value={image}
            onChange={setImage}
            label="Məhsul Şəkli (Qalereyadan Yüklə və ya URL Daxil Et)"
          />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
              Parça Tərkibi və Məhsul Detalları
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="məs: 450 GSM Heavyweight French Terry, Oversized Boxy Fit, Bakı atelye tikişi..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors resize-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl text-xs font-mono uppercase text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            Ləğv et
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || selectedCategories.length === 0}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Yadda saxlanılır..." : `Yadda Saxla (${selectedCategories.length} Bölmədə Dərc Et)`}
          </button>
        </div>
      </form>
    </div>
  );
}
