"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { registerVendorApplicationAction } from "@/app/actions";
import { 
  Store, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Upload, 
  Tag, 
  Clock,
  Image as ImageIcon,
  X
} from "lucide-react";
import confetti from "canvas-confetti";
import { CATEGORIES_DATA } from "@/data/mockupData";
import { useAuth } from "@/context/AuthContext";

export default function OpenStorePage() {
  const { user, setOwnedStore } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["geyim"]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Geyim",
    description: "",
    city: "Bakı, Azərbaycan",
    address: "",
    phone: "+994 ",
    email: "",
    categoriesText: "Hoodies, T-Shirts, Pants, Jackets, Accessories",
    logo: "",
    coverImage: "",
  });

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  // Handle local gallery file upload via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "coverImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Zəhmət olmasa yalnız şəkil faylı seçin!");
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          [field]: data.url,
        }));
      } else {
        // Fallback to FileReader if API fails
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
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Zəhmət olmasa vacib sahələri doldurun!");
      return;
    }

    setIsSubmitting(true);
    const res = await registerVendorApplicationAction({
      ...formData,
      categories: selectedCategories,
      ownerEmail: user?.email || formData.email,
      ownerId: user?.id || "",
    });
    setIsSubmitting(false);

    if (res.success && res.vendor) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      router.push(`/admin/stores/${res.vendor.slug}`);
    } else {
      alert(res.error || "Müraciət göndərilərkən xəta baş verdi");
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <div className="relative z-40">
        <Navbar />
      </div>

      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-14 z-30 flex-1">
        <div 
          style={{ borderRadius: "1px" }}
          className="relative p-6 sm:p-12 md:p-16 border border-neutral-200/90 shadow-2xs bg-white text-neutral-950 space-y-12"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
            <div className="space-y-3">
              <div 
                style={{ borderRadius: "1px" }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono uppercase tracking-widest font-bold shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span>VENDOR & ATELYE PARTNYORLUĞU</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase leading-[1.05]">
                TERZME-DƏ MAĞAZANI AÇ
              </h1>
            </div>

            <div className="text-left md:text-right max-w-sm">
              <span 
                style={{ borderRadius: "1px" }}
                className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200 mb-1"
              >
                MODERASİYA VƏ TƏSDİQLƏNMƏ
              </span>
              <p className="text-xs font-mono text-neutral-500">
                Formu doldurun. Müraciətiniz TERZME administratorları tərəfindən incələnib təsdiqləndikdən sonra mağazanız canlı vitrinə buraxılacaq.
              </p>
            </div>
          </div>

          {/* Store Application Form */}
          <form onSubmit={handleSubmit} className="space-y-10 text-xs font-mono">
            
              {/* Step 1: Store Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-200 pb-3">
                  <Store className="w-4 h-4 text-emerald-800" />
                  <span className="font-display font-black text-sm sm:text-base uppercase tracking-wider">
                    1. BREND VƏ MAĞAZA MƏLUMATLARI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                      Mağaza / Brend Adı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Məs: ZERO ATELIER, ARCHIVE STREETWEAR"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                      Mağaza Növü / Təsviri
                    </label>
                    <input
                      type="text"
                      placeholder="Məs: Premium Streetwear & Lifestyle"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                    />
                  </div>
                </div>

                {/* MULTI-CATEGORY SELECTOR: 7 STANDARD CATEGORIES */}
                <div className="space-y-2.5 p-4 bg-[#FAFAF8] border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <label className="text-neutral-900 font-display font-black text-xs uppercase tracking-wider block flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-800" />
                      Satış Edəcəyiniz Əsas Kateqoriyalar (Bir neçə seçim edə bilərsiniz) *
                    </label>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold">
                      {selectedCategories.length} kateqoriya seçilib
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES_DATA.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.slug);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.slug)}
                          style={{ borderRadius: "1px" }}
                          className={`p-2.5 flex items-center gap-2 border text-xs font-mono font-bold transition-all cursor-pointer text-left ${
                            isSelected
                              ? "bg-[#07241A] text-white border-[#07241A] shadow-xs"
                              : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-emerald-400 border-emerald-400 text-black" : "border-neutral-300 bg-white"
                          }`}>
                            {isSelected && <span className="text-[10px] font-black leading-none">✓</span>}
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] font-sans text-neutral-500">
                    Məsələn: Həm <strong>Geyim</strong>, həm <strong>Ayaqqabı</strong>, həm də <strong>Aksesuar</strong> üzrə satış edirsinizsə, hamısını qeyd edin. Məhsullarınız həmin səhifələrdə görünəcək.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                    Brend Haqqında Təsvir / Fəlsəfə *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Brendinizin yaranma tarixi, istifadə etdiyiniz parçalar və təqdim etdiyiniz üslub haqqında yazın..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-sans text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-800 font-display font-black uppercase tracking-wider block flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-800" />
                    Xüsusi Alt Məhsul Növləri (İstəyə görə vergüllə ayırın)
                  </label>
                  <input
                    type="text"
                    placeholder="Hoodies, T-Shirts, Pants, Sneakers, Çantalar"
                    value={formData.categoriesText}
                    onChange={(e) => setFormData({ ...formData, categoriesText: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                  />
                  <p className="text-[11px] font-sans text-neutral-500">
                    Bu teqlər vitrininizdə filtr olaraq alıcılara göstəriləcək.
                  </p>
                </div>
              </div>

              {/* Step 2: Contact Details */}
              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-200 pb-3">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span className="font-display font-black text-sm sm:text-base uppercase tracking-wider">
                    2. ƏLAQƏ VƏ EMALATXANA ÜNVANI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                      Şəhər / Ölkə *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bakı, Azərbaycan"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                      Dəqiq Ünvan / Atelye
                    </label>
                    <input
                      type="text"
                      placeholder="Məs: Nizami küçəsi 42, Bakı"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                      Əlaqə Nömrəsi / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+994 50 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                      Rəsmi E-Poçt Ünvanı *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@brandname.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-neutral-200 focus:outline-none focus:border-neutral-950 focus:bg-white transition-all shadow-2xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Images & Branding with Local Gallery & URL Support */}
              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-200 pb-3">
                  <Upload className="w-4 h-4 text-emerald-800" />
                  <span className="font-display font-black text-sm sm:text-base uppercase tracking-wider">
                    3. BREND LOQO VƏ BANNER ŞƏKİLLƏRİ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* LOGO UPLOAD & URL */}
                  <div className="p-4 bg-[#FAFAF8] border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                        Loqo (Kvadrat Şəkil)
                      </label>
                      <span className="text-[10px] text-neutral-400 font-mono">1:1 Ölçü</span>
                    </div>

                    {/* Hidden Native File Input */}
                    <input 
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      className="hidden"
                    />

                    {/* Gallery Upload Button */}
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      style={{ borderRadius: "1px" }}
                      className="w-full py-3 bg-white border border-dashed border-neutral-300 hover:border-neutral-900 text-neutral-800 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-800" />
                      <span>Qalereyadan Loqo Yüklə</span>
                    </button>

                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-neutral-200"></div>
                      <span className="flex-shrink mx-2 text-[10px] font-mono text-neutral-400 uppercase">və ya URL link</span>
                      <div className="flex-grow border-t border-neutral-200"></div>
                    </div>

                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-3 py-2.5 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-all text-[11px]"
                    />

                    {formData.logo ? (
                      <div className="flex items-center gap-3 p-2 bg-white border border-neutral-200">
                        <img src={formData.logo} alt="Loqo Önizləmə" className="w-12 h-12 object-cover border border-neutral-200" />
                        <div className="flex-1 text-[11px] font-mono text-neutral-600 truncate">
                          Loqo təyin edildi
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: "" })}
                          className="p-1 hover:bg-neutral-100 text-neutral-500 hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] font-sans text-neutral-500">
                        Boş buraxıldıqda avtomatik TERZME minimalist loqosu təyin olunacaq.
                      </p>
                    )}
                  </div>

                  {/* COVER BANNER UPLOAD & URL */}
                  <div className="p-4 bg-[#FAFAF8] border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-neutral-800 font-display font-black uppercase tracking-wider block">
                        Üz Qabığı (Cover Banner)
                      </label>
                      <span className="text-[10px] text-neutral-400 font-mono">16:9 Geniş</span>
                    </div>

                    {/* Hidden Native File Input */}
                    <input 
                      type="file"
                      ref={coverInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "coverImage")}
                      className="hidden"
                    />

                    {/* Gallery Upload Button */}
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      style={{ borderRadius: "1px" }}
                      className="w-full py-3 bg-white border border-dashed border-neutral-300 hover:border-neutral-900 text-neutral-800 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-800" />
                      <span>Qalereyadan Banner Yüklə</span>
                    </button>

                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-neutral-200"></div>
                      <span className="flex-shrink mx-2 text-[10px] font-mono text-neutral-400 uppercase">və ya URL link</span>
                      <div className="flex-grow border-t border-neutral-200"></div>
                    </div>

                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      style={{ borderRadius: "1px" }}
                      className="w-full px-3 py-2.5 bg-white border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-all text-[11px]"
                    />

                    {formData.coverImage ? (
                      <div className="p-2 bg-white border border-neutral-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-500">Banner Önizləmə:</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, coverImage: "" })}
                            className="text-[10px] font-mono text-red-600 hover:underline flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Sil
                          </button>
                        </div>
                        <img src={formData.coverImage} alt="Banner Önizləmə" className="w-full h-16 object-cover border border-neutral-200" />
                      </div>
                    ) : (
                      <p className="text-[10px] font-sans text-neutral-500">
                        Mağazanın vitrin səhifəsində ən üstdə görünəcək geniş örtük şəkli.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submission Notice Box */}
              <div 
                style={{ borderRadius: "1px" }}
                className="p-4 bg-neutral-100 border border-neutral-200 flex items-start gap-3"
              >
                <Clock className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                  <strong>Qeyd:</strong> Müraciətiniz göndərildikdən sonra status <strong>&ldquo;Gözləmədə (Pending)&rdquo;</strong> olaraq qeyd edilir. TERZME Admin heyəti tərəfindən təsdiqləndikdən sonra mağazanız aktivləşdiriləcək.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ borderRadius: "1px" }}
                  className="w-full sm:w-auto px-10 py-4 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>MÜRACİƏT GÖNDƏRİLİR...</span>
                  ) : (
                    <>
                      <span>MÜRACİƏTİ GÖNDƏR (MAĞAZA AÇ)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

        </div>
      </section>

      <Footer />
    </main>
  );
}
