"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { saveProductAction, deleteProductAction, Vendor } from "@/app/actions";
import { 
  Plus, 
  Tag, 
  Layers, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Check, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Store,
  DollarSign,
  Package
} from "lucide-react";
import { ImageUploadField } from "@/components/ImageUploadField";

const CATEGORY_MAP: Record<string, string> = {
  "hoodies": "Hudilər (Hoodies)",
  "t-shirts": "Qrafik Köynəklər (T-Shirts)",
  "new-arrivals": "Yeni Gələnlər (New Arrivals)",
  "bestsellers": "Ən Çox Satılanlar (Bestsellers)",
};

export default function ProductListClient({ 
  initialProducts, 
  initialVendors = [] 
}: { 
  initialProducts: Product[]; 
  initialVendors?: Vendor[]; 
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [vendors] = useState<Vendor[]>(initialVendors);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState<any>("hoodies");
  const [editCategories, setEditCategories] = useState<string[]>(["hoodies"]);
  const [editSizes, setEditSizes] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editComposition, setEditComposition] = useState("");

  const toggleEditCategory = (catId: string) => {
    setEditCategories((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditPrice(String(prod.price));
    setEditCategory(prod.category || "hoodies");
    const existingCats = Array.isArray(prod.categories) && prod.categories.length > 0
      ? prod.categories
      : [prod.category || "hoodies"];
    setEditCategories(existingCats);
    setEditSizes(prod.sizes ? prod.sizes.join(", ") : "S, M, L, XL");
    setEditImage(prod.mainImage || (prod as any).image || "");
    setEditComposition(prod.details?.composition || (prod as any).description || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    const parsedPrice = parseFloat(editPrice) || editingProduct.price;
    const sizeList = editSizes
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const primaryCat = editCategories[0] || editCategory || "hoodies";
    const updatedProduct: Product = {
      ...editingProduct,
      name: editName.trim(),
      price: parsedPrice,
      category: primaryCat as any,
      categories: editCategories,
      sizes: sizeList.length > 0 ? sizeList : editingProduct.sizes,
      mainImage: editImage.trim() || editingProduct.mainImage,
      details: {
        ...editingProduct.details,
        composition: editComposition.trim() || editingProduct.details?.composition || "100% Cotton",
      },
    };

    const res = await saveProductAction(updatedProduct);
    setIsSaving(false);

    if (res.success) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
      setEditingProduct(null);
      setMessage({ text: `"${updatedProduct.name}" uğurla yeniləndi!`, type: "success" });
      setTimeout(() => setMessage(null), 3500);
      router.refresh();
    } else {
      setMessage({ text: "Xəta baş verdi, yenilənmədi.", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    const res = await deleteProductAction(deletingProduct.id);
    setIsDeleting(false);

    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      const deletedName = deletingProduct.name;
      setDeletingProduct(null);
      setMessage({ text: `"${deletedName}" kataloqdan silindi!`, type: "success" });
      setTimeout(() => setMessage(null), 3500);
      router.refresh();
    } else {
      setMessage({ text: "Məhsulu silmək mümkün olmadı.", type: "error" });
    }
  };

  const totalCount = products.length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;
  const overallTotalPrice = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  const avgPrice = totalCount > 0 
    ? (overallTotalPrice / totalCount).toFixed(2)
    : "0.00";

  // Per-Store Real Analytics Breakdown
  const storeAnalytics = React.useMemo(() => {
    // Collect all stores: default terzme-store + vendors
    const storeMap = new Map<string, { id: string; name: string; slug: string; count: number; total: number }>();

    // Seed official known stores
    storeMap.set("terzme-store", {
      id: "terzme-store",
      name: "TERZME STORE",
      slug: "terzme-store",
      count: 0,
      total: 0,
    });

    vendors.forEach((v) => {
      const key = v.slug || v.id;
      if (!storeMap.has(key)) {
        storeMap.set(key, {
          id: v.id,
          name: v.name,
          slug: v.slug || v.id,
          count: 0,
          total: 0,
        });
      }
    });

    // Calculate real counts and totals from actual products list
    products.forEach((p) => {
      const vId = (p.vendorId || "").toLowerCase().trim();
      const matchedKey = Array.from(storeMap.keys()).find((k) => {
        const item = storeMap.get(k)!;
        return k === vId || item.id === p.vendorId || item.slug === vId || (vId === "stx" && (k === "stx" || item.slug === "stx"));
      }) || (vId ? vId : "terzme-store");

      if (!storeMap.has(matchedKey)) {
        storeMap.set(matchedKey, {
          id: p.vendorId || matchedKey,
          name: p.vendorName || matchedKey.toUpperCase(),
          slug: matchedKey,
          count: 0,
          total: 0,
        });
      }

      const current = storeMap.get(matchedKey)!;
      current.count += 1;
      current.total += Number(p.price) || 0;
    });

    return Array.from(storeMap.values());
  }, [products, vendors]);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <span>Kataloq & Mağaza İdarəetməsi</span>
            <span>•</span>
            <span>{totalCount} Aktiv Model / Toplam ${overallTotalPrice.toLocaleString()}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 font-display uppercase">
            Məhsullar və Mağaza Statistikası
          </h1>
        </div>
      </div>

      {/* Alert message notification */}
      {message && (
        <div 
          style={{ borderRadius: "1px" }}
          className={`p-4 text-xs font-mono flex items-center justify-between transition-all ${
          message.type === "success" 
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-neutral-500 hover:text-neutral-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: PER-STORE REAL STATS (Only store name, product count, and total USD value) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-neutral-950" />
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-neutral-900">
              Mağazalar üzrə Məhsul Sayı və Toplam Dəyər
            </h2>
          </div>
          <div className="text-xs font-mono text-neutral-600">
            Platforma Cəmi: <strong className="text-neutral-950 font-bold">{totalCount} məhsul</strong> — <strong className="text-emerald-700 font-bold">${overallTotalPrice.toLocaleString()} USD</strong>
          </div>
        </div>

        {/* Real Summary Table: Store | Products Count | Total Value */}
        <div 
          style={{ borderRadius: "1px" }}
          className="border border-neutral-200/90 bg-white shadow-2xs overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Mağaza Adı</th>
                  <th className="py-4 px-6 text-center">Neçə Məhsul Var</th>
                  <th className="py-4 px-6 text-right">Toplam Məhsul Qiyməti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {storeAnalytics.map((st) => {
                  return (
                    <tr key={st.slug} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#07241A]/5 border border-[#07241A]/10 text-[#07241A] flex items-center justify-center font-bold">
                            <Store className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold font-display uppercase text-sm text-neutral-950 block">
                              {st.name}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              @{st.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold font-mono">
                          <Package className="w-3.5 h-3.5 text-neutral-500" />
                          {st.count} məhsul
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <span className="text-base font-black font-mono text-emerald-700">
                          ${st.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-neutral-950 text-white font-bold text-xs">
                <tr>
                  <td className="py-4 px-6 uppercase tracking-wider font-display">
                    CƏMİ (BÜTÜN MAĞAZALAR)
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-sm">
                    {totalCount} məhsul
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-base text-emerald-400">
                    ${overallTotalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Store Breakdown Cards for Quick View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {storeAnalytics.map((st) => (
            <div 
              key={st.slug}
              style={{ borderRadius: "1px" }}
              className="p-5 bg-white border border-neutral-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  MAĞAZA
                </span>
                <Store className="w-4 h-4 text-neutral-400" />
              </div>
              <h3 className="font-black font-display uppercase text-sm text-neutral-950">
                {st.name}
              </h3>
              <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-2xl font-black text-neutral-950">{st.count}</span>
                  <span className="text-xs text-neutral-500 ml-1">məhsul</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-700">
                    ${st.total.toLocaleString()} USD
                  </div>
                  <div className="text-[9px] text-neutral-400 uppercase">toplam qiymət</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-neutral-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-950">Məhsula Düzəliş Et</h3>
                  <p className="text-xs text-neutral-500 font-mono">ID: {editingProduct.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                  Məhsulun Adı
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                    Qiymət ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* SAYTDA GÖRÜNƏCƏYİ ƏSAS BÖLMƏ: SEÇİMLƏR (BİR NEÇƏSİNİ BİRDƏN SEÇMƏK MÜMKÜNDÜR) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-neutral-900 font-bold tracking-wider block">
                    Saytda Görünəcəyi Əsas Bölmə: (Seçimlər) *
                  </label>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                    {editCategories.length} bölmə seçilib
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: "new-arrivals",
                      title: "YENİ BURAXILIŞLAR",
                      subtitle: "Mövsümün ən son unikal küçə tərzi",
                      badge: "YENİ",
                      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
                    },
                    {
                      id: "bestsellers",
                      title: "ƏN ÇOX SATILANLAR",
                      subtitle: "İkonik və ən çox seçilən parçalar",
                      badge: "HOT",
                      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
                    },
                    {
                      id: "t-shirts",
                      title: "QRAFİK KÖYNƏKLƏR",
                      subtitle: "280 GSM premium qalın pambıq",
                      badge: "280 GSM",
                      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    },
                    {
                      id: "hoodies",
                      title: "HUDİLƏR VƏ SVİTERLƏR",
                      subtitle: "Azərbaycan tərzi 450 GSM fleece",
                      badge: "BALAM",
                      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
                    },
                  ].map((sec) => {
                    const isChecked = editCategories.includes(sec.id);
                    return (
                      <div
                        key={sec.id}
                        onClick={() => toggleEditCategory(sec.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                          isChecked
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                            : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-neutral-200"
                        }`}
                      >
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs uppercase tracking-wider truncate">
                            {sec.title}
                          </h5>
                          <p className={`text-[10px] font-mono truncate ${isChecked ? "text-white/70" : "text-neutral-500"}`}>
                            {sec.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                            isChecked ? "bg-white/10 text-white border-white/20" : sec.badgeColor
                          }`}>
                            {sec.badge}
                          </span>
                          {isChecked ? (
                            <div className="w-4 h-4 rounded bg-white text-black flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded border border-neutral-300 bg-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                  Ölçülər (vergüllə ayırın)
                </label>
                <input
                  type="text"
                  value={editSizes}
                  onChange={(e) => setEditSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white font-mono"
                />
              </div>

              <ImageUploadField
                value={editImage}
                onChange={setEditImage}
                label="Məhsul Şəkli (Qalereyadan Yüklə və ya URL Daxil Et)"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                  Parça Tərkibi / Kompozisiya
                </label>
                <input
                  type="text"
                  value={editComposition}
                  onChange={(e) => setEditComposition(e.target.value)}
                  placeholder="məs: 450 GSM Heavyweight French Terry"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase text-neutral-600 hover:text-neutral-950 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Yadda saxlanılır..." : "Yadda Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-neutral-950">Məhsulu Silmək İstəyirsiniz?</h3>
              <p className="text-xs text-neutral-600 mt-2">
                <span className="font-bold text-neutral-950">&quot;{deletingProduct.name}&quot;</span> adlı məhsul kataloqdan və mağaza vitrinindən həmişəlik silinəcək.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase text-neutral-600 hover:text-neutral-950 transition-colors border border-neutral-200"
              >
                İmtina Et
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs tracking-wider uppercase hover:bg-red-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Silinir..." : "Bəli, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
