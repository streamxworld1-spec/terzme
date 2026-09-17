"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Vendor, 
  getVendors, 
  saveVendorAction, 
  deleteVendorAction, 
  updateVendorStatusAction 
} from "@/app/actions";
import { 
  Store, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  X, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Upload, 
  Check, 
  Building2, 
  Tag, 
  FileText,
  Clock,
  XCircle,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Image as ImageIcon
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AdminStoresPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "suspended" | "rejected">("all");
  const [activeTab, setActiveTab] = useState<"stores" | "new">("stores");
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Streetwear",
    description: "",
    city: "Bakı, Azərbaycan",
    address: "",
    phone: "",
    email: "",
    logo: "",
    coverImage: "",
    verified: true,
    featured: false,
    rating: 5.0,
    reviewCount: 10,
    established: new Date().getFullYear().toString(),
    status: "active" as "active" | "pending" | "suspended" | "rejected",
    categoriesText: "Hoodies, T-Shirts, Pants, Jackets, Accessories",
  });

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      if (status && ["all", "pending", "active", "suspended", "rejected"].includes(status)) {
        setStatusFilter(status as any);
        setActiveTab("stores");
      }
    }
  }, []);

  const resetForm = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      slug: "",
      category: "Streetwear & Avant-Garde",
      description: "",
      city: "Bakı, Azərbaycan",
      address: "",
      phone: "+994 50 ",
      email: "",
      logo: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400&auto=format&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
      verified: true,
      featured: false,
      rating: 5.0,
      reviewCount: 1,
      established: new Date().getFullYear().toString(),
      status: "active",
      categoriesText: "Hoodies, T-Shirts, Pants, Jackets, Accessories",
    });
  };

  // Gallery File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "coverImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddTab = () => {
    resetForm();
    setActiveTab("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setFormData({
      name: v.name,
      slug: v.slug,
      category: v.category,
      description: v.description,
      city: v.city,
      address: v.address || "",
      phone: v.phone || "",
      email: v.email || "",
      logo: v.logo,
      coverImage: v.coverImage,
      verified: v.verified,
      featured: !!v.featured,
      rating: v.rating || 5.0,
      reviewCount: v.reviewCount || 1,
      established: v.established || "2026",
      status: v.status || "active",
      categoriesText: (v.categories && v.categories.length > 0)
        ? v.categories.join(", ")
        : "Hoodies, T-Shirts, Pants, Jackets, Accessories",
    });
    setActiveTab("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ADMIN ACTION: Qəbul et / Təsdiqlə (Approve)
  const handleApprove = async (vendor: Vendor) => {
    setActionLoading(vendor.id);
    const res = await updateVendorStatusAction(vendor.id, "active", true);
    setActionLoading(null);
    if (res.success) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
      setSuccessMessage(`"${vendor.name}" mağazası təsdiqləndi və canlı vitrinə buraxıldı!`);
      await loadVendors();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      alert(res.error || "Xəta baş verdi");
    }
  };

  // ADMIN ACTION: Rədd et (Reject)
  const handleReject = async (vendor: Vendor) => {
    const reason = prompt(`"${vendor.name}" mağazasını rədd etmə səbəbini daxil edin (istəyə görə):`, "Brend standartlarına uyğun deyil");
    if (reason === null) return; // User cancelled

    setActionLoading(vendor.id);
    const res = await updateVendorStatusAction(vendor.id, "rejected", false, reason);
    setActionLoading(null);
    if (res.success) {
      setSuccessMessage(`"${vendor.name}" mağazası müraciəti rədd edildi.`);
      await loadVendors();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      alert(res.error || "Xəta baş verdi");
    }
  };

  // ADMIN ACTION: Mağazanı Dayandır / Bərpa Et (Suspend / Activate)
  const handleToggleSuspend = async (vendor: Vendor) => {
    const isCurrentlySuspended = vendor.status === "suspended";
    const newStatus = isCurrentlySuspended ? "active" : "suspended";
    const promptText = isCurrentlySuspended 
      ? `"${vendor.name}" mağazasını yenidən aktivləşdirib fəaliyyətini bərpa etmək istəyirsiniz?`
      : `"${vendor.name}" mağazasının fəaliyyətini dayandırmaq (dondurmaq) istəyirsiniz?`;
    
    if (!confirm(promptText)) return;

    setActionLoading(vendor.id);
    const res = await updateVendorStatusAction(vendor.id, newStatus, isCurrentlySuspended ? true : false);
    setActionLoading(null);
    if (res.success) {
      setSuccessMessage(
        isCurrentlySuspended 
          ? `"${vendor.name}" mağazası yenidən aktivləşdirildi!` 
          : `"${vendor.name}" mağazasının fəaliyyəti dayandırıldı.`
      );
      await loadVendors();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      alert(res.error || "Xəta baş verdi");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const categoriesArray = formData.categoriesText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const { categoriesText, ...restData } = formData;

    const res = await saveVendorAction({
      id: editingVendor?.id,
      ...restData,
      categories: categoriesArray,
    });

    setIsSubmitting(false);

    if (res.success && res.vendor) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setSuccessMessage(
        editingVendor 
          ? `"${res.vendor.name}" mağazası uğurla yeniləndi!` 
          : `Təbriklər! "${res.vendor.name}" mağazası uğurla yaradıldı!`
      );
      await loadVendors();
      setTimeout(() => {
        setSuccessMessage("");
        setActiveTab("stores");
      }, 2000);
    } else {
      alert(res.error || "Xəta baş verdi");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" mağazasını silmək istədiyinizə əminsiniz?`)) return;
    const res = await deleteVendorAction(id);
    if (res.success) {
      await loadVendors();
    }
  };

  const pendingCount = vendors.filter((v) => v.status === "pending").length;

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && v.status === "pending") ||
      (statusFilter === "active" && v.status === "active") ||
      (statusFilter === "suspended" && v.status === "suspended") ||
      (statusFilter === "rejected" && v.status === "rejected");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      
      {/* Top Header Card */}
      <div 
        style={{ borderRadius: "1px" }}
        className="p-6 sm:p-10 bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div 
            style={{ borderRadius: "1px" }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono font-bold uppercase tracking-widest shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>MULTİ-VENDOR MODERASİYA VƏ İDARƏETMƏ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-neutral-950 uppercase tracking-tight leading-tight">
            {activeTab === "new" 
              ? (editingVendor ? "MAĞAZANI REDAKTƏ ET" : "YENİ MAĞAZA FORMU")
              : "TƏRƏFDAŞ MAĞAZALAR VƏ MÜRACİƏTLƏR"}
          </h1>

          <p className="text-xs sm:text-sm font-sans text-neutral-600 max-w-2xl leading-relaxed">
            Platformada açılan yeni mağaza müraciətlərini incələyin, təsdiqləyib canlı vitrinə buraxın və ya rədd edin.
          </p>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div
            style={{ borderRadius: "1px" }}
            className="px-5 py-2.5 font-display font-black text-xs uppercase tracking-wider border bg-[#07241A] text-white border-[#07241A] shadow-xs"
          >
            <span>Bütün Mağazalar ({vendors.length})</span>
            {pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-400 text-neutral-950 rounded-full">
                {pendingCount} Gözləyən
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div 
          style={{ borderRadius: "1px" }}
          className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in shadow-2xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: FORM (DEDICATED FORM VIEW) */}
      {activeTab === "new" && (
        <div 
          style={{ borderRadius: "1px" }}
          className="bg-white border border-neutral-200/90 p-6 sm:p-12 shadow-2xs space-y-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#07241A]" />
                <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-neutral-950">
                  {editingVendor ? `REDAKTƏ: ${editingVendor.name}` : "MAĞAZA YARATMA FORMU"}
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-500 mt-1">
                Aşağıdakı məlumatları daxil edərək mağazanı birbaşa yaradın və ya redaktə edin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => { setActiveTab("stores"); resetForm(); }}
              style={{ borderRadius: "1px" }}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-xs font-bold transition-colors self-start cursor-pointer"
            >
              ← Siyahıya Qayıt
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-xs font-mono">
            {/* Section 1: Əsas Məlumatlar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-2">
                <Store className="w-4 h-4 text-emerald-800" />
                <span className="font-display font-black text-sm uppercase tracking-wider">
                  1. ƏSAS MAĞAZA MƏLUMATLARI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Mağaza / Brend Adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: TERZME ATELIER və ya SABAH STORE"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    URL Slug (İstəyə görə boş saxlayın)
                  </label>
                  <input
                    type="text"
                    placeholder="Məs: terzme-atelier (avtomatik yaranır)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Əsas Kateqoriya *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Streetwear, Minimalist Moda, Ayaqqabı"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Təsis İli
                  </label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold uppercase block">
                  Mağaza Haqqında Qısa Təsvir (Manifest) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mağazanın stili, fəlsəfəsi və təqdim etdiyi parçalar haqqında ətraflı məlumat..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors font-sans text-xs shadow-2xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold uppercase block flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-800" />
                  Məhsul Filtrləri (Vergüllə ayırın)
                </label>
                <input
                  type="text"
                  placeholder="Hoodies, T-Shirts, Pants, Jackets, Accessories, Shoes"
                  value={formData.categoriesText}
                  onChange={(e) => setFormData({ ...formData, categoriesText: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* Section 2: Əlaqə və Ünvan */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-2">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span className="font-display font-black text-sm uppercase tracking-wider">
                  2. ƏLAQƏ VƏ ÜNVAN DETALLARI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Şəhər / Region *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bakı, Azərbaycan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Dəqiq Ünvan / Emalatxana
                  </label>
                  <input
                    type="text"
                    placeholder="Məs: Nizami küçəsi 42, Bakı"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Əlaqə Telefonu / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+994 50 222 33 44"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold uppercase block">
                    Rəsmi E-Poçt Ünvanı *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="store@terzme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Şəkillər və Vizuallar (Qalereya & URL) */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-2">
                <Upload className="w-4 h-4 text-emerald-800" />
                <span className="font-display font-black text-sm uppercase tracking-wider">
                  3. VİZUAL MATERİALLAR (QALEREYA VƏ YA URL)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Logo with gallery button */}
                <div className="space-y-2 p-3.5 bg-[#FAFAF8] border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <label className="text-neutral-700 font-bold uppercase block">
                      Loqo (Kvadrat)
                    </label>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="text-[11px] font-mono text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Qalereyadan seç
                    </button>
                  </div>

                  <input 
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo")}
                    className="hidden"
                  />

                  <input
                    type="text"
                    placeholder="və ya Loqo URL daxil edin..."
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors text-[11px]"
                  />

                  {formData.logo && (
                    <div className="flex items-center gap-3 p-2 bg-white border border-neutral-200">
                      <img src={formData.logo} alt="Önizləmə" className="w-12 h-12 object-cover border border-neutral-200" />
                      <span className="text-[10px] text-neutral-500">Loqo təyin edildi</span>
                    </div>
                  )}
                </div>

                {/* Banner with gallery button */}
                <div className="space-y-2 p-3.5 bg-[#FAFAF8] border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <label className="text-neutral-700 font-bold uppercase block">
                      Üz Qabığı (Cover Banner)
                    </label>
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="text-[11px] font-mono text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Qalereyadan seç
                    </button>
                  </div>

                  <input 
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "coverImage")}
                    className="hidden"
                  />

                  <input
                    type="text"
                    placeholder="və ya Banner URL daxil edin..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors text-[11px]"
                  />

                  {formData.coverImage && (
                    <div className="p-1 bg-white border border-neutral-200">
                      <img src={formData.coverImage} alt="Önizləmə" className="w-full h-12 object-cover border border-neutral-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Status və İcazələr */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span className="font-display font-black text-sm uppercase tracking-wider">
                  4. STATUS VƏ TƏSDİQLƏNMƏ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-[#FAFAF8] p-5 border border-neutral-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 rounded-none text-emerald-800 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-neutral-900">Təsdiqlənmiş (Verified)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded-none text-emerald-800 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-neutral-900">Seçilmiş Brend (Featured)</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-700">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ borderRadius: "1px" }}
                    className="px-3 py-1.5 border border-neutral-300 bg-white font-mono text-xs focus:outline-none"
                  >
                    <option value="active">Aktiv (Təsdiqlənmiş)</option>
                    <option value="pending">Gözləmədə (Pending)</option>
                    <option value="rejected">Rədd Edilmiş (Rejected)</option>
                    <option value="suspended">Dayandırılıb (Suspended)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Submit & Cancel Actions */}
            <div className="pt-6 border-t border-neutral-200 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => { setActiveTab("stores"); resetForm(); }}
                style={{ borderRadius: "1px" }}
                className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-display font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Ləğv Et
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ borderRadius: "1px" }}
                className="px-8 py-3.5 bg-[#07241A] hover:bg-[#051A13] text-white font-display font-black text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>YADDA SAXLANILIR...</span>
                ) : (
                  <>
                    <span>{editingVendor ? "YADDA SAXLA VƏ YENİLƏ" : "MAĞAZANI YARAT"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MÖVCUD MAĞAZALARIN SİYAHISI (STORES LIST WITH APPROVE / REJECT ACTIONS) */}
      {activeTab === "stores" && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div 
            style={{ borderRadius: "1px" }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-neutral-200/90 shadow-2xs"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Mağaza adı, kateqoriya və ya şəhər axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: "1px" }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] border border-neutral-200 text-xs font-mono focus:outline-none focus:bg-white focus:border-neutral-900 shadow-2xs"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 border transition-all ${
                  statusFilter === "all"
                    ? "bg-neutral-950 text-white border-neutral-950 font-bold"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Hamısı ({vendors.length})
              </button>

              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  statusFilter === "pending"
                    ? "bg-amber-500 text-white border-amber-500 font-bold"
                    : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Gözləyənlər ({vendors.filter((v) => v.status === "pending").length})</span>
              </button>

              <button
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  statusFilter === "active"
                    ? "bg-emerald-700 text-white border-emerald-700 font-bold"
                    : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktiv ({vendors.filter((v) => v.status === "active").length})</span>
              </button>

              <button
                onClick={() => setStatusFilter("suspended")}
                className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  statusFilter === "suspended"
                    ? "bg-amber-700 text-white border-amber-700 font-bold"
                    : "bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
                }`}
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Dayandırılmış ({vendors.filter((v) => v.status === "suspended").length})</span>
              </button>

              <button
                onClick={() => setStatusFilter("rejected")}
                className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  statusFilter === "rejected"
                    ? "bg-red-700 text-white border-red-700 font-bold"
                    : "bg-white text-red-800 border-red-200 hover:bg-red-50"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Rədd Edilmiş ({vendors.filter((v) => v.status === "rejected").length})</span>
              </button>
            </div>
          </div>

          {/* Stores List */}
          <div 
            style={{ borderRadius: "1px" }}
            className="bg-white border border-neutral-200/90 shadow-2xs overflow-hidden"
          >
            {loading ? (
              <div className="p-16 text-center text-neutral-400 font-mono text-xs">Yüklənir...</div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <Store className="w-12 h-12 text-neutral-300 mx-auto" />
                <p className="font-bold text-base font-display uppercase tracking-tight text-neutral-900">
                  Bu filter üzrə mağaza tapılmadı
                </p>
                <button
                  onClick={handleOpenAddTab}
                  style={{ borderRadius: "1px" }}
                  className="px-5 py-2.5 bg-[#07241A] text-white text-xs font-display font-black uppercase tracking-wider"
                >
                  Yeni Mağaza Əlavə Et
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filtered.map((vendor) => {
                  const isPending = vendor.status === "pending";
                  const isRejected = vendor.status === "rejected";
                  const isActive = vendor.status === "active";

                  return (
                    <div 
                      key={vendor.id} 
                      className={`p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors ${
                        isPending ? "bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500" : "hover:bg-[#FAFAF8]"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div 
                          style={{ borderRadius: "1px" }}
                          className="w-16 h-16 overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0"
                        >
                          <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-black font-display uppercase tracking-tight text-neutral-950">
                              {vendor.name}
                            </h3>

                            {/* Status Badges */}
                            {isPending && (
                              <span 
                                style={{ borderRadius: "1px" }}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold animate-pulse"
                              >
                                <Clock className="w-3 h-3" />
                                TƏSDİQ GÖZLƏYİR
                              </span>
                            )}

                            {isActive && (
                              <span 
                                style={{ borderRadius: "1px" }}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                AKTİV (CANLI)
                              </span>
                            )}

                            {vendor.status === "suspended" && (
                              <span 
                                style={{ borderRadius: "1px" }}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 font-bold"
                              >
                                <PauseCircle className="w-3 h-3 text-amber-600" />
                                DAYANDIRILIB
                              </span>
                            )}

                            {isRejected && (
                              <span 
                                style={{ borderRadius: "1px" }}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 bg-red-50 text-red-800 border border-red-200 font-bold"
                              >
                                <XCircle className="w-3 h-3" />
                                RƏDD EDİLDİ
                              </span>
                            )}

                            {vendor.verified && (
                              <span 
                                style={{ borderRadius: "1px" }}
                                className="text-[9px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3 h-3" /> TƏSDİQLƏNİB
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-neutral-600 font-sans line-clamp-2 max-w-2xl leading-relaxed">
                            {vendor.description}
                          </p>

                          {vendor.rejectionReason && (
                            <p className="text-[11px] font-mono text-red-700 bg-red-50 p-1.5 border border-red-200 max-w-xl">
                              Səbəb: {vendor.rejectionReason}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 pt-0.5">
                            <span>🏷️ {vendor.category}</span>
                            <span>📍 {vendor.city}</span>
                            {vendor.phone && <span>📞 {vendor.phone}</span>}
                            {vendor.email && <span>✉️ {vendor.email}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Moderation and Management Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-200">
                        
                        {/* APPROVE BUTTON (For Pending or Rejected) */}
                        {(!isActive || isPending) && (
                          <button
                            onClick={() => handleApprove(vendor)}
                            disabled={actionLoading === vendor.id}
                            style={{ borderRadius: "1px" }}
                            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                            title="Müraciəti Təsdiq Et və Canlı Vitrinə Burax"
                          >
                            <Check className="w-4 h-4" />
                            <span>Təsdiqlə</span>
                          </button>
                        )}

                        {/* REJECT BUTTON (For Pending or Active) */}
                        {!isRejected && (
                          <button
                            onClick={() => handleReject(vendor)}
                            disabled={actionLoading === vendor.id}
                            style={{ borderRadius: "1px" }}
                            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                            title="Müraciəti Rədd Et"
                          >
                            <XCircle className="w-3.5 h-3.5 text-amber-800" />
                            <span>Rədd Et</span>
                          </button>
                        )}

                        {/* SUSPEND / RESUME BUTTON */}
                        <button
                          onClick={() => handleToggleSuspend(vendor)}
                          disabled={actionLoading === vendor.id}
                          style={{ borderRadius: "1px" }}
                          className={`px-3 py-2 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 border ${
                            vendor.status === "suspended"
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300"
                              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300"
                          }`}
                          title={vendor.status === "suspended" ? "Fəaliyyətini bərpa et" : "Fəaliyyətini dayandır"}
                        >
                          {vendor.status === "suspended" ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Bərpa Et</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5 text-neutral-600" />
                              <span>Dayandır</span>
                            </>
                          )}
                        </button>

                        {/* LIVE STOREFRONT */}
                        <Link
                          href={`/stores/${vendor.slug}`}
                          target="_blank"
                          style={{ borderRadius: "1px" }}
                          className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors border border-neutral-200"
                          title="Canlı Vitrini Göstər"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>



                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(vendor.id, vendor.name)}
                          style={{ borderRadius: "1px" }}
                          className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-all cursor-pointer border border-red-200"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
