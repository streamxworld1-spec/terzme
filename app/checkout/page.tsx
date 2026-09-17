"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { createOrderAction, getShippingRates, getAzShippingMethods, AzShippingMethod } from "@/app/actions";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Truck, Lock, User, Mail, Phone, MapPin, Building, Package, Globe, Banknote, Train, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { COUNTRIES } from "@/data/countries";
import { METRO_STATIONS } from "@/data/metro_stations";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { currency, formatPrice, convertPrice, setCurrencyByCode } = useCurrency();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [azMethods, setAzMethods] = useState<AzShippingMethod[]>([]);
  const [selectedAzMethodId, setSelectedAzMethodId] = useState<string>("metro");
  const [selectedMetroStation, setSelectedMetroStation] = useState<string>("28 May");

  useEffect(() => {
    Promise.all([getShippingRates(), getAzShippingMethods()]).then(([rates, methods]) => {
      if (rates) setShippingRates(rates);
      if (methods && methods.length > 0) {
        setAzMethods(methods);
        const firstEnabled = methods.find((m) => m.enabled);
        if (firstEnabled) setSelectedAzMethodId(firstEnabled.id);
      }
    });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+994 ",
    address: "",
    city: "Bakı",
    country: "Azərbaycan",
    zipCode: "AZ1000",
    cardNumber: "•••• •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "888",
  });

  // Autofill or load saved shipping details for the current user
  useEffect(() => {
    if (user) {
      const parts = (user.name || "").trim().split(" ");
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";

      let savedShipping: any = {};
      try {
        const saved = localStorage.getItem(`terzme_checkout_${user.id || user.username}`);
        if (saved) savedShipping = JSON.parse(saved);
      } catch (e) {}

      setFormData((prev) => ({
        ...prev,
        firstName: savedShipping.firstName || first || prev.firstName,
        lastName: savedShipping.lastName || last || prev.lastName,
        email: savedShipping.email || user.email || prev.email,
        phone: savedShipping.phone || prev.phone || "+994 ",
        address: savedShipping.address || prev.address,
        city: savedShipping.city || prev.city,
        country: savedShipping.country || prev.country,
        zipCode: savedShipping.zipCode || prev.zipCode,
      }));
    }
  }, [user]);

  const isAzerbaijan = formData.country === "Azərbaycan";
  const activeAzMethod = azMethods.find((m) => m.id === selectedAzMethodId);

  // Calculate dynamic shipping fee based on selected country or Azerbaijan specific option (base in AZN)
  const selectedShippingRateAZN = isAzerbaijan
    ? (activeAzMethod ? activeAzMethod.price : 5)
    : (shippingRates[formData.country] !== undefined ? shippingRates[formData.country] : 25);

  // Final total in AZN
  const finalTotalAZN = totalPrice + selectedShippingRateAZN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const items = cart.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
      size: i.selectedSize,
      color: i.selectedColor,
      image: i.product.mainImage,
      storeId: i.product.vendorId || "terzme-store",
      storeName: i.product.vendorName || (i.product.vendorId === "stx" ? "stx" : "TERZME STORE"),
    }));

    const fullAddress = isAzerbaijan && selectedAzMethodId === "metro"
      ? `Metro: ${selectedMetroStation} stansiyası. Əlavə qeyd: ${formData.address || "Təhvil çıxışda"}`
      : formData.address;

    const res = await createOrderAction({
      customer: {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        email: formData.email,
        address: fullAddress,
        city: formData.city,
        country: formData.country,
      },
      userId: user?.id,
      username: user?.username,
      userEmail: user?.email || formData.email,
      items,
      totalAmount: finalTotalAZN,
      shippingFee: selectedShippingRateAZN,
      paymentMethod: `Qapıda Ödəniş (${isAzerbaijan ? activeAzMethod?.name || "Kuryer" : "Beynəlxalq"}) [${currency.code}]`,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      setPlacedOrder(res.order);
      setOrderDone(true);

      // Save shipping address for next time for this specific user account
      if (user) {
        try {
          localStorage.setItem(`terzme_checkout_${user.id || user.username}`, JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            zipCode: formData.zipCode,
          }));

          // Save to user's personal order history
          const userOrdersKey = `terzme_orders_${user.id || user.username}`;
          const existing = JSON.parse(localStorage.getItem(userOrdersKey) || "[]");
          localStorage.setItem(userOrdersKey, JSON.stringify([res.order, ...existing]));
        } catch (e) {
          console.error(e);
        }
      }

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
      clearCart();
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full pt-16 pb-20 px-4 sm:px-8 relative z-10">
        {orderDone && placedOrder ? (
          <div 
            style={{ borderRadius: "1px" }}
            className="max-w-2xl mx-auto p-8 sm:p-12 border border-neutral-200/90 shadow-2xs text-center space-y-6 bg-white text-neutral-950"
          >
            <div 
              style={{ borderRadius: "1px" }}
              className="w-16 h-16 bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200"
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                Sifarişiniz Təsdiqləndi!
              </span>
              <h1 className="text-3xl font-black font-grotesk text-neutral-950 uppercase mt-1">
                Təşəkkür Edirik!
              </h1>
              <p className="text-sm text-neutral-600 mt-2">
                Sifarişiniz uğurla qeydə alındı və dərhal Bakı atelyesində hazırlanmağa başlandı.
              </p>
            </div>

            <div 
              style={{ borderRadius: "1px" }}
              className="p-6 bg-[#FAFAF8] border border-neutral-200 text-left space-y-3 font-mono text-xs"
            >
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Sifariş ID:</span>
                <span className="font-bold text-neutral-950">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Canlı İzləmə Kodu:</span>
                <span className="font-bold text-emerald-700 text-sm">{placedOrder.trackingCode}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Müştəri:</span>
                <span className="font-bold text-neutral-950">{placedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Toplam Ödəniş:</span>
                <span className="font-black text-neutral-950 text-base">
                  {formatPrice(placedOrder.totalAmount, { showCode: true })}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href={`/track?code=${placedOrder.trackingCode}`}
                style={{ borderRadius: "1px" }}
                className="px-6 py-3.5 bg-neutral-950 text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Package className="w-4 h-4" />
                Sifarişi Canlı İzlə
              </Link>
              <Link
                href="/admin/orders"
                style={{ borderRadius: "1px" }}
                className="px-6 py-3.5 bg-neutral-100 border border-neutral-200 text-neutral-900 font-mono font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
              >
                Admin Paneldə Bax
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
              <div>
                <Link
                  href="/collection"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-950 mb-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Alış-verişə davam et
                </Link>
                <h1 className="text-3xl sm:text-4xl font-black font-grotesk uppercase tracking-tight text-neutral-950">
                  Sifarişi Rəsmiləşdir
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                {/* Account Status Banner */}
                {user ? (
                  <div 
                    style={{ borderRadius: "1px" }}
                    className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-950"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-6 h-6 rounded-full border border-emerald-600 object-cover" 
                      />
                      <span>Aktiv Hesab: <strong className="font-bold text-neutral-950">{user.name}</strong> ({user.email})</span>
                    </div>
                    <span className="hidden sm:inline text-[10px] text-emerald-800 uppercase font-bold tracking-wider">
                      Hesabınıza Bağlanacaq
                    </span>
                  </div>
                ) : (
                  <div 
                    style={{ borderRadius: "1px" }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-neutral-900 shrink-0" />
                      <span>Sifariş tarixçənizi və ünvanınızı yadda saxlamaq üçün hesabınıza daxil olun.</span>
                    </div>
                    <button
                      type="button"
                      onClick={openAuthModal}
                      className="font-bold text-[#07241A] hover:underline uppercase text-[11px] cursor-pointer whitespace-nowrap"
                    >
                      Daxil Ol / Qeydiyyat →
                    </button>
                  </div>
                )}

                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-7 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-5 bg-white text-neutral-950"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    Çatdırılma və Müştəri Məlumatları
                  </h2>

                  {/* 1. NAME & SURNAME */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-neutral-600 font-bold">Ad *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-neutral-600 font-bold">Soyad *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 2. PHONE & EMAIL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-neutral-600 font-bold">Telefon *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm font-mono text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-neutral-600 font-bold">E-poçt</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm font-mono text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 3. ÖLKƏ / REGION */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-600 font-bold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ölkə / Region *</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.country}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, country: val });
                          const europeanCountries = [
                            "Almaniya", "Fransa", "İtaliya", "İspaniya", "Avstriya", "Belçika",
                            "Niderland", "Portuqaliya", "Yunanıstan", "Finlandiya", "İrlandiya",
                            "Polşa", "Çexiya", "Macarıstan", "Rumıniya", "Bolqarıstan", "Xorvatiya",
                            "Slovakiya", "Sloveniya", "Estoniya", "Latviya", "Litva", "Kipr", "Malta", "Lüksemburq"
                          ];

                          if (val === "Azərbaycan") {
                            setCurrencyByCode("AZN");
                          } else if (europeanCountries.includes(val)) {
                            setCurrencyByCode("EUR");
                          } else if (val === "Amerika Birləşmiş Ştatları") {
                            setCurrencyByCode("USD");
                          } else if (val === "Türkiyə") {
                            setCurrencyByCode("TRY");
                          } else if (val === "Rusiya") {
                            setCurrencyByCode("RUB");
                          } else if (val === "Birləşmiş Krallıq (Böyük Britaniya)") {
                            setCurrencyByCode("GBP");
                          } else {
                            setCurrencyByCode("USD");
                          }
                        }}
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm font-sans font-bold text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all appearance-none cursor-pointer shadow-2xs"
                      >
                        <optgroup label="Populyar / Əsas Regionlar">
                          {["Azərbaycan", "Türkiyə", "Gürcüstan", "Amerika Birləşmiş Ştatları", "Almaniya", "Birləşmiş Krallıq (Böyük Britaniya)", "Birləşmiş Ərəb Əmirlikləri", "Rusiya"].map((c) => (
                            <option key={`pop-${c}`} value={c} className="bg-white text-neutral-900">
                              {c}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Bütün Ölkələr (A-Z)">
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c} className="bg-white text-neutral-900">
                              {c}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 font-mono text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* 3.1 AZƏRBAYCAN ÜÇÜN ÇATDIRILMA SEÇİMİ */}
                  {isAzerbaijan && (
                    <div 
                      style={{ borderRadius: "1px" }}
                      className="p-5 bg-[#FAFAF8] border border-neutral-200 shadow-2xs space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase text-neutral-900 font-bold flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Azərbaycan Daxili Çatdırılma Növü *</span>
                        </label>
                        <span 
                          style={{ borderRadius: "1px" }}
                          className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5"
                        >
                          Seçim Aktivdir
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {azMethods.filter((m) => m.enabled).map((m) => {
                          const isSelected = selectedAzMethodId === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setSelectedAzMethodId(m.id)}
                              style={{ borderRadius: "1px" }}
                              className={`p-3 border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                isSelected
                                  ? "bg-neutral-950 text-white border-neutral-950 shadow-xs font-bold"
                                  : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 shadow-2xs"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs font-sans">{m.name}</span>
                                <span className={`font-mono text-xs font-bold px-2 py-0.5 ${
                                  isSelected ? "bg-white text-neutral-950" : "bg-neutral-100 text-neutral-800"
                                }`}>
                                  {m.price === 0 ? "PULSUZ" : (currency.code === "AZN" ? `${m.price} AZN` : `${m.price} AZN (${formatPrice(m.price)})`)}
                                </span>
                              </div>
                              <p className={`text-[11px] ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                                {m.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Metro Seçimi */}
                      {selectedAzMethodId === "metro" && (
                        <div className="pt-2 border-t border-neutral-200 space-y-1.5 animate-fadeIn">
                          <label className="text-xs font-mono uppercase text-neutral-800 font-bold flex items-center gap-1.5">
                            <Train className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Təhvil Alacağınız Metro Stansiyası *</span>
                          </label>
                          <div className="relative">
                            <select
                              value={selectedMetroStation}
                              onChange={(e) => setSelectedMetroStation(e.target.value)}
                              style={{ borderRadius: "1px" }}
                              className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm font-sans font-bold text-neutral-950 focus:outline-none focus:border-neutral-950 shadow-2xs transition-all appearance-none cursor-pointer"
                            >
                              {METRO_STATIONS.map((st) => (
                                <option key={st} value={st} className="bg-white text-neutral-900">
                                  Metro: {st} stansiyası
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 font-mono text-xs">
                              ▼
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-sans">
                            Kuryerimiz sifarişi seçdiyiniz metro stansiyasının çıxışında sizə təhvil verəcək.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!isAzerbaijan && (
                    <div className="flex items-center justify-between text-[11px] font-mono px-1 text-neutral-600">
                      <span>Seçilmiş ölkəyə çatdırılma:</span>
                      <span className="font-bold text-neutral-950">
                        {selectedShippingRateAZN === 0 ? "PULSUZ" : `${formatPrice(selectedShippingRateAZN)} (${selectedShippingRateAZN} AZN)`}
                      </span>
                    </div>
                  )}

                  {/* 4. ADDRESS & CITY */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-600 font-bold">Ünvan *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Küçə, bina, mənzil..."
                      style={{ borderRadius: "1px" }}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-neutral-600 font-bold">Şəhər *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-neutral-600 font-bold">Poçt İndeksi</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="Məs. AZ1000"
                        style={{ borderRadius: "1px" }}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm font-mono text-neutral-950 focus:outline-none focus:border-neutral-950 transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-7 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-4 bg-white text-neutral-950"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Ödəniş Metodu</span>
                  </h2>

                  {/* 1. QAPIDA ÖDƏNİŞ */}
                  <div 
                    style={{ borderRadius: "1px" }}
                    className="p-4 bg-[#FAFAF8] border border-neutral-300 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        style={{ borderRadius: "1px" }}
                        className="w-10 h-10 bg-neutral-950 text-white flex items-center justify-center shadow-xs"
                      >
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-neutral-950">Qapıda Ödəniş (Nağd və ya Kart)</p>
                      </div>
                    </div>
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 whitespace-nowrap"
                    >
                      ● Aktivdir
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  style={{ borderRadius: "1px" }}
                  className="w-full py-4.5 bg-neutral-950 hover:bg-black text-white font-grotesk font-black text-xs uppercase tracking-widest transition-all shadow-xs hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? "Sifariş İcra Edilir..." : `Sifarişi Təsdiqlə və Tamamla (${formatPrice(finalTotalAZN, { showCode: true })})`}</span>
                </button>
              </form>

              {/* Order Summary */}
              <div 
                style={{ borderRadius: "1px" }}
                className="lg:col-span-5 p-7 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-5 bg-[#FAFAF8] text-neutral-950"
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono">
                  Səbətin İcmalı ({cart.reduce((a, b) => a + b.quantity, 0)} ədəd)
                </h2>

                <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-neutral-900">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          Ölçü: {item.selectedSize} • Say: {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-neutral-950">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-600">
                    <span>Məhsullar:</span>
                    <span className="font-bold text-neutral-950">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      Çatdırılma ({isAzerbaijan ? activeAzMethod?.name || "Azərbaycan" : formData.country}):
                    </span>
                    <span className={selectedShippingRateAZN === 0 ? "text-emerald-700 font-bold" : "text-neutral-950 font-bold"}>
                      {selectedShippingRateAZN === 0 ? "PULSUZ" : `${formatPrice(selectedShippingRateAZN)} (${selectedShippingRateAZN} AZN)`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-base font-black text-neutral-950 pt-3 border-t border-neutral-200">
                    <span>Yekun:</span>
                    <span className="font-mono text-xl font-black">{formatPrice(finalTotalAZN, { showCode: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
