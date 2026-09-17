"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getStoreSettings, 
  updateStoreSettings, 
  StoreSettings, 
  getShippingRates, 
  updateShippingRatesAction,
  getAzShippingMethods,
  updateAzShippingMethodsAction,
  AzShippingMethod 
} from "@/app/actions";
import { 
  Save, 
  Check, 
  Megaphone, 
  Truck, 
  Phone, 
  Globe, 
  Search, 
  RefreshCw, 
  Train, 
  MapPin, 
  Building, 
  Plus, 
  Trash2, 
  Sliders, 
  Coins, 
  Mail, 
  Share2, 
  Send,
  Eye,
  EyeOff,
  Store
} from "lucide-react";
import { COUNTRIES } from "@/data/countries";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    siteName: "TERZME",
    siteTagline: "Avant-Garde Streetwear & Atelier",
    siteDescription: "Futuristic Glassmorphic Fashion Experience by TERZME ATELIER BAKU",
    announcementText: "Dünyanın 196 ölkəsinə çatdırılma xidməti aktivdir",
    announcementEnabled: true,
    announcementLink: "/collection",
    freeShippingThreshold: 150,
    shippingCoverage: "Dünyanın 196 ölkəsi",
    shippingNote: "Bütün 196 ölkə üzrə qlobal çatdırılma xidməti aktivdir.",
    contactPhone: "+994 50 222 33 44",
    contactEmail: "contact@terzme.com",
    contactAddress: "Nizami küçəsi 42, Bakı, Azərbaycan",
    instagramHandle: "@terzme.az",
    telegramHandle: "terzme_baku",
    currency: "AZN",
  });

  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [azMethods, setAzMethods] = useState<AzShippingMethod[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([getStoreSettings(), getShippingRates(), getAzShippingMethods()]).then(
      ([storeData, ratesData, azData]) => {
        setSettings((prev) => ({
          ...prev,
          ...storeData,
        }));
        setShippingRates(ratesData);
        setAzMethods(azData);
        setLoading(false);
      }
    );
  }, []);

  const handleRateChange = (country: string, val: number) => {
    setShippingRates((prev) => ({
      ...prev,
      [country]: val >= 0 ? val : 0,
    }));
  };

  const handleAzMethodFieldChange = (id: string, field: "name" | "description" | "price", val: any) => {
    setAzMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: field === "price" ? (val >= 0 ? val : 0) : val } : m))
    );
  };

  const handleAzMethodToggle = (id: string) => {
    setAzMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleAddAzMethod = () => {
    const newId = `custom_${Date.now()}`;
    const newMethod: AzShippingMethod = {
      id: newId,
      name: "Yeni Çatdırılma Xidməti",
      description: "Çatdırılma haqqında qısa açıqlama...",
      price: 5,
      enabled: true,
    };
    setAzMethods((prev) => [...prev, newMethod]);
  };

  const handleDeleteAzMethod = (id: string) => {
    if (confirm("Bu çatdırılma metodunu silmək istədiyinizdən əminsiniz?")) {
      setAzMethods((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleBulkSet = (amount: number) => {
    setShippingRates((prev) => {
      const next = { ...prev };
      for (const country of COUNTRIES) {
        if (country !== "Azərbaycan") {
          next[country] = amount;
        }
      }
      return next;
    });
  };

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countrySearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await Promise.all([
      updateStoreSettings(settings),
      updateShippingRatesAction(shippingRates),
      updateAzShippingMethodsAction(azMethods),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-mono text-neutral-400 text-xs">
        Tənzimləmələr yüklənir...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5 text-neutral-700" />
            <span>Sistem Konfiqurasiyası</span>
            <span>•</span>
            <span>Genel Sayt Ayarları</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
            Genel Sayt Tənzimləmələri
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-sans">
            Saytın ümumi brend parametrləri, elan paneli, əlaqə vasitələri və qlobal çatdırılma tarifləri.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4" />
          {saving ? "Yadda saxlanılır..." : "Dəyişiklikləri Saxla"}
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          Bütün sayt tənzimləmələri uğurla yadda saxlanıldı və canlı tətbiq edildi!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ================= 1. ÜMUMİ SAYT VƏ BREND MƏLUMATLARI ================= */}
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <Store className="w-4 h-4 text-neutral-600" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono">
                1. Ümumi Sayt və Brend Məlumatları
              </h2>
              <p className="text-[11px] text-neutral-500 font-sans">
                Saytın adı, başlığı, təsviri və əsas fəaliyyət məlumatları.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Saytın / Brendin Adı
              </label>
              <input
                type="text"
                value={settings.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="TERZME"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Şüar / Tagline
              </label>
              <input
                type="text"
                value={settings.siteTagline || ""}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                placeholder="Avant-Garde Streetwear & Atelier"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Sayt Təsviri (Meta Description / Açıqlama)
              </label>
              <textarea
                rows={2}
                value={settings.siteDescription || ""}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Futuristic Glassmorphic Fashion Experience by TERZME ATELIER BAKU"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* ================= 2. ELAN LENTİ (ANNOUNCEMENT BAR) ================= */}
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4 text-amber-500" />
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono">
                  2. Saytın Üst Elan Lenti (Top Announcement Bar)
                </h2>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Saytın ən yuxarı zolağında yerləşən xüsusi bildiriş və kampaniya zolağı.
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, announcementEnabled: !settings.announcementEnabled })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                  settings.announcementEnabled !== false
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-neutral-100 text-neutral-500 border-neutral-300"
                }`}
              >
                {settings.announcementEnabled !== false ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lent Aktivdir</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Lent Gizlədilib</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Elan Mətni (Müştərilərə görünən əsas mətn)
              </label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                placeholder="Dünyanın 196 ölkəsinə çatdırılma xidməti aktivdir..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Elana Klikləndikdə Keçid Linki (İstəyə görə)
              </label>
              <input
                type="text"
                value={settings.announcementLink || ""}
                onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                placeholder="/collection və ya https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ================= 3. VALYUTA VƏ TİCARƏT PARAMETRLƏRİ ================= */}
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <Coins className="w-4 h-4 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono">
                3. Valyuta və Ödəniş Parametrləri
              </h2>
              <p className="text-[11px] text-neutral-500 font-sans">
                Platformanın baza valyutası və pulsuz çatdırılma hədləri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Baza Valyutası
              </label>
              <select
                value={settings.currency || "AZN"}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-medium focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="AZN">AZN (₼) - Azərbaycan Manatı (Baza)</option>
                <option value="USD">USD ($) - ABŞ Dolları</option>
                <option value="EUR">EUR (€) - Avro</option>
                <option value="TRY">TRY (₺) - Türk Lirəsi</option>
              </select>
              <p className="text-[10px] text-neutral-500 font-mono">
                Sayt ziyarətçilərə onların ölkəsinə görə avtomatik məzənnə konversiyası təqdim edir.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Pulsuz Çatdırılma Limiti ({settings.currency || "AZN"})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={settings.freeShippingThreshold ?? 150}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-mono font-bold focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                />
                <span className="text-xs font-mono font-bold text-neutral-600">{settings.currency || "AZN"}</span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">
                Bu məbləğdən yuxarı səbətlərdə çatdırılma ödənişsiz elan olunur (0 = qeyri-aktiv).
              </p>
            </div>
          </div>
        </div>

        {/* ================= 4. ƏLAQƏ VƏ SOSİAL ŞƏBƏKƏLƏR ================= */}
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
            <Phone className="w-4 h-4 text-neutral-600" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono">
                4. Əlaqə Məlumatları və Sosial Şəbəkələr
              </h2>
              <p className="text-[11px] text-neutral-500 font-sans">
                Saytın Footer, Əlaqə və Konsiyerj bölmələrində görünən rəsmi rekvizitlər.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Rəsmi Telefon / WhatsApp</span>
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+994 50 222 33 44"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>Rəsmi Əlaqə E-poçtu</span>
              </label>
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="contact@terzme.com"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Instagram İstifadəçi Adı / Link</span>
              </label>
              <input
                type="text"
                value={settings.instagramHandle}
                onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                placeholder="@terzme.az"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-neutral-500" />
                <span>Telegram Kanalı və ya Bot</span>
              </label>
              <input
                type="text"
                value={settings.telegramHandle}
                onChange={(e) => setSettings({ ...settings, telegramHandle: e.target.value })}
                placeholder="terzme_baku"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>Flaqman Atelye / Mərkəzi Ünvan</span>
              </label>
              <input
                type="text"
                value={settings.contactAddress || ""}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                placeholder="Nizami küçəsi 42, Bakı, Azərbaycan"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* ================= 5. AZƏRBAYCAN DAXİLİ ÇATDIRILMA METODLARI ================= */}
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold font-mono text-xs">
                AZ
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
                  <span>5. Azərbaycan Daxili Çatdırılma Metodları və Qiymətləri</span>
                </h2>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Müştəri kassa səhifəsində Azərbaycanı seçdikdə bu variantlar (Metrolara, Ünvana və s.) çıxır.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
              ● Tənzimlənə Bilən
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Mövcud Metodlar ({azMethods.length})</span>
              <button
                type="button"
                onClick={handleAddAzMethod}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-black text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Yeni Çatdırılma Metodu Əlavə Et
              </button>
            </div>

            {azMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  method.enabled
                    ? "bg-white border-neutral-200 shadow-2xs"
                    : "bg-neutral-50/70 border-neutral-200/60 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAzMethodToggle(method.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                        method.enabled
                          ? "bg-neutral-950 border-neutral-950 text-white"
                          : "bg-white border-neutral-300"
                      }`}
                      title={method.enabled ? "Deaktiv et" : "Aktiv et"}
                    >
                      {method.enabled && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[11px] font-mono uppercase font-bold text-neutral-500 tracking-wider">
                      {method.enabled ? "Aktivdir" : "Deaktivdir"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAzMethod(method.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Bu metodu sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-6 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                      Metodun Adı (Başlıq)
                    </label>
                    <input
                      type="text"
                      value={method.name}
                      onChange={(e) => handleAzMethodFieldChange(method.id, "name", e.target.value)}
                      placeholder="Məs. Metrolara Çatdırılma..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 font-sans font-bold text-xs focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                      Açıqlama Mətni
                    </label>
                    <input
                      type="text"
                      value={method.description}
                      onChange={(e) => handleAzMethodFieldChange(method.id, "description", e.target.value)}
                      placeholder="Qısa məlumat..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                      Qiymət (AZN)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={method.price}
                        onChange={(e) => handleAzMethodFieldChange(method.id, "price", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 font-mono text-xs font-bold text-right focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                      />
                      <span className="text-xs font-mono text-neutral-600 font-bold">AZN</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 6. 196 ÖLKƏ ÜZRƏ QLOBAL ÇATDIRILMA ================= */}
        <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-950 font-bold">
              <Globe className="w-4 h-4 text-neutral-950" />
              <span>6. 196 Ölkə Üçün Qlobal Çatdırılma Qiymətləri (AZN)</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              196 Ölkə Aktivdir
            </span>
          </div>

          <div className="space-y-4">
            {/* Quick Presets / Actions */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-mono text-[11px]">Sürətli Təyin:</span>
                <button
                  type="button"
                  onClick={() => handleBulkSet(20)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 transition-colors font-mono text-[11px] cursor-pointer"
                >
                  Hamısı 20 AZN
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSet(25)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 transition-colors font-mono text-[11px] cursor-pointer"
                >
                  Hamısı 25 AZN
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSet(0)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 transition-colors font-mono text-[11px] cursor-pointer"
                >
                  Hamısı Pulsuz (0 AZN)
                </button>
              </div>

              {/* Search Country */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Ölkə axtar (məs. Rusiya)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 text-xs focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            {/* 196 Countries Grid */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
                  {/* Left Column */}
                  <div className="divide-y divide-neutral-100">
                    {filteredCountries.slice(0, Math.ceil(filteredCountries.length / 2)).map((c) => {
                      const currentVal = shippingRates[c] !== undefined ? shippingRates[c] : (c === "Azərbaycan" ? 0 : 25);
                      return (
                        <div key={c} className="p-2.5 px-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-medium text-neutral-900 truncate">{c}</span>
                            {c === "Rusiya" && (
                              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                20 AZN
                              </span>
                            )}
                            {c === "Azərbaycan" && (
                              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Daxili
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={currentVal}
                              onChange={(e) => handleRateChange(c, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-950 font-mono text-xs font-bold text-right focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                            />
                            <span className="text-xs font-mono text-neutral-500 font-semibold">AZN</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="divide-y divide-neutral-100">
                    {filteredCountries.slice(Math.ceil(filteredCountries.length / 2)).map((c) => {
                      const currentVal = shippingRates[c] !== undefined ? shippingRates[c] : (c === "Azərbaycan" ? 0 : 25);
                      return (
                        <div key={c} className="p-2.5 px-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-medium text-neutral-900 truncate">{c}</span>
                            {c === "Rusiya" && (
                              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                20 AZN
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={currentVal}
                              onChange={(e) => handleRateChange(c, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-950 font-mono text-xs font-bold text-right focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                            />
                            <span className="text-xs font-mono text-neutral-500 font-semibold">AZN</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-2.5 px-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Göstərilir: {filteredCountries.length} / 196 ölkə</span>
                <span>Hər ölkə üçün ayrı qiymət təyin olunur və kassada avtomatik hesablanır</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                Çatdırılma Xidməti Qeydi
              </label>
              <input
                type="text"
                value={settings.shippingCoverage || "Dünyanın 196 ölkəsi üzrə qlobal çatdırılma"}
                onChange={(e) => setSettings({ ...settings, shippingCoverage: e.target.value })}
                placeholder="Dünyanın 196 ölkəsi üzrə qlobal çatdırılma"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save bar */}
        <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-2xl border border-neutral-200">
          <span className="text-xs font-mono text-neutral-600">
            Dəyişikliklər edildikdən sonra yadda saxlamağı unutmayın.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-neutral-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? "Yadda saxlanılır..." : "Tənzimləmələri Yadda Saxla"}
          </button>
        </div>
      </form>
    </div>
  );
}
