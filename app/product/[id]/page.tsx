"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Sparkles,
  ChevronRight,
  Maximize2,
  Store,
  Star,
  Heart
} from "lucide-react";

// Helper to get friendly Azerbaijani / English luxury color names
function getColorName(hexOrName: string): string {
  const map: Record<string, string> = {
    "#b5b9be": "Titanium Boz",
    "#1a1c23": "Gecə Qara",
    "#3d4841": "Hərbi Yaşıl",
    "#d8cbbf": "Yulaf Bej",
    "#202022": "Qrafit Qara",
    "#84827d": "Təbii Boz",
    "#111111": "Dərin Qara",
    "#faf8f5": "İpək Ağ",
    "#3a3835": "Tünd Şokolad",
    "#f2efe9": "Krem Ağ",
    "#18181b": "Mat Qara",
    "#78716c": "Kül Boz",
    "#242426": "Antrasit",
    "#8a857e": "Qumlu Boz",
    "#ded9d2": "Açıq Bej",
    "#0f0f10": "Onyx Qara",
    "#f4f1ea": "Sümük Ağ",
    "#1c1b1f": "Karbon Qara",
    "#545350": "Tüstü Boz",
    "#161618": "Qara",
    "#7e8387": "Polad Boz",
    "#f7f4ed": "Off-White Ağ",
    "#1e1e1e": "Kömür Qara",
    "#141416": "Zümrüd Qara",
    "#c4b5a5": "Qızılı Bej",
    "#19191a": "Qara Yun",
    "#d9d2c9": "İsti Boz",
    "#4a4744": "Yuyulmuş Boz",
    "#8c8780": "Daş Boz",
    "#2b1d14": "Konyak Qəhvəyi",
    "#ffffff": "Ağ",
    "#000000": "Qara",
  };
  return map[hexOrName.toLowerCase()] || "Xüsusi Rəng";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const initialProd = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const [product, setProduct] = useState<Product>(initialProd);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p: any) => p.id === productId);
          if (found) {
            setProduct(found);
            setActiveImage(found.mainImage || found.image);
            if (found.sizes && found.sizes.length > 0) {
              setSelectedSize(found.sizes[0]);
            }
            if (found.colors && found.colors.length > 0) {
              const firstColor = typeof found.colors[0] === "string" ? found.colors[0] : found.colors[0].hex || "#000000";
              setSelectedColor(firstColor);
            }
          }
        }
      })
      .catch(() => {});
  }, [productId]);

  const getInitialColor = (prod: any) => {
    if (!prod?.colors || prod.colors.length === 0) return "#b5b9be";
    const first = prod.colors[0];
    if (typeof first === "string") return first;
    return first.hex || first.name || "#b5b9be";
  };

  const [activeImage, setActiveImage] = useState<string>(initialProd.mainImage);
  const [selectedSize, setSelectedSize] = useState<string>(
    initialProd.sizes && initialProd.sizes.length > 0 ? initialProd.sizes[0] : "M"
  );
  const [selectedColor, setSelectedColor] = useState<string>(getInitialColor(initialProd));
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping">("details");

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Related products from same collection
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-neutral-950 bg-white selection:bg-neutral-900 selection:text-white">
      {/* Clean Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#FAFAF8]" />

      {/* Header / Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Product Container */}
      <section className="relative z-10 flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-20">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button 
            onClick={() => router.back()} 
            style={{ borderRadius: "1px" }}
            className="flex items-center gap-2.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 shadow-2xs transition-all cursor-pointer text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Geri Qayıt</span>
          </button>

          <div 
            style={{ borderRadius: "1px" }}
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-600 bg-white px-4 py-2 border border-neutral-200 shadow-2xs"
          >
            <Link href="/" className="hover:text-black font-medium">Ana Səhifə</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <Link href="/collection" className="hover:text-black font-medium">Kolleksiya</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="text-neutral-950 font-bold uppercase">{product.name}</span>
          </div>
        </div>

        {/* Product Detailed Hero Panel */}
        <div 
          style={{ borderRadius: "1px" }}
          className="p-6 sm:p-10 md:p-12 border border-neutral-200/90 shadow-2xs relative overflow-hidden text-neutral-950 bg-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Col: High-Res Image Showcase with Clean Bright Frame */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div 
                style={{ borderRadius: "1px" }}
                className="w-full h-[420px] sm:h-[500px] p-8 relative overflow-hidden flex items-center justify-center bg-[#F7F7F7] border border-neutral-200/80 group"
              >
                {/* Product Image Preview */}
                <img 
                  src={activeImage} 
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-105"
                />
              </div>

              {/* Angle View Selector (Main / Side) */}
              {product.sideImage && (
                <div className="mt-5 flex items-center gap-3 w-full justify-start">
                  <button
                    onClick={() => setActiveImage(product.mainImage)}
                    className={`group relative w-20 h-20 rounded-2xl p-1.5 overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      activeImage === product.mainImage
                        ? "bg-emerald-500/30 border-2 border-emerald-400 shadow-md scale-105"
                        : "bg-white/10 border border-white/20 hover:bg-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={product.mainImage} alt="Əsas Görünüş" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/75 text-white backdrop-blur-xs">
                      ƏSAS
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveImage(product.sideImage)}
                    className={`group relative w-20 h-20 rounded-2xl p-1.5 overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      activeImage === product.sideImage
                        ? "bg-emerald-500/30 border-2 border-emerald-400 shadow-md scale-105"
                        : "bg-white/10 border border-white/20 hover:bg-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={product.sideImage} alt="Yan Görünüş" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/75 text-white backdrop-blur-xs">
                      DETAL
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Col: High-Fashion Info, Specs, Sizes & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Link
                    href={`/stores/${product.vendorId || "terzme-atelier"}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-emerald-300 text-[11px] font-mono font-bold transition-colors cursor-pointer border border-emerald-500/20"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mağaza: {product.vendorName || "TERZME Main Atelier"}</span>
                  </Link>
                  <span 
                    style={{ borderRadius: "1px" }}
                    className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5"
                  >
                    MÖVCUDDUR
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-grotesk tracking-tight text-neutral-950 leading-[1.08]">
                  {product.name}
                </h1>

                {/* Product Description Under Title & Above Price */}
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                  {(product as any).description || `${product.name} — TERZME Atelier tərəfindən premium standartlarla hazırlanmış unikal kəsim və dizayna malik geyim parçasıdır.`}
                </p>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-950">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-neutral-100 w-full" />

              {/* Pure Visual Color Swatches (No hex codes, no color text) */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600">
                      Rəng:
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((colorItem: any, idx: number) => {
                      const colorHex = typeof colorItem === "string" 
                        ? colorItem 
                        : colorItem?.hex || "#222222";
                      const colorKey = typeof colorItem === "string"
                        ? colorItem
                        : colorItem?.name || colorHex || `color-${idx}`;
                      const isHex = typeof colorHex === "string" && colorHex.startsWith("#");
                      const isSelected = selectedColor === colorHex || selectedColor === colorKey;

                      return (
                        <button
                          key={colorKey}
                          onClick={() => setSelectedColor(colorHex)}
                          className={`relative p-1 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "ring-2 ring-neutral-950 scale-110 shadow-md"
                              : "hover:scale-105 ring-1 ring-black/10 hover:ring-black/30"
                          }`}
                        >
                          <span 
                            className="w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center transition-transform"
                            style={{ backgroundColor: isHex ? colorHex : "#222" }}
                          >
                            {isSelected && (
                              <Check className={`w-4 h-4 ${
                                ["#ffffff", "#faf8f5", "#f2efe9", "#ded9d2", "#f4f1ea", "#f7f4ed", "#d8cbbf"].includes(colorHex.toLowerCase())
                                  ? "text-neutral-950"
                                  : "text-white"
                              }`} />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modern Size Selector */}
              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                      Ölçü Seçimi: <span className="text-neutral-950 font-black">{selectedSize}</span>
                    </label>
                    <button className="text-[11px] font-mono text-neutral-500 hover:text-black font-semibold underline cursor-pointer">
                      Ölçü Cədvəli
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          style={{ borderRadius: "1px" }}
                          className={`flex-1 h-11 flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                              : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200 shadow-2xs"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interactive Modern Purchase & Wishlist Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  style={{ borderRadius: "1px" }}
                  className={`flex-1 h-14 font-black font-grotesk text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xs cursor-pointer ${
                    isAdded 
                      ? "bg-emerald-600 text-white" 
                      : "bg-neutral-950 hover:bg-black text-white hover:shadow-md active:scale-95"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 text-white animate-bounce" />
                      <span>Səbətə Əlavə Edildi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Səbətə Əlavə Et • {formatPrice(product.price)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  style={{ borderRadius: "1px" }}
                  className={`h-14 w-14 flex items-center justify-center border transition-all cursor-pointer shadow-xs ${
                    isInWishlist(product.id)
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200"
                  }`}
                  title={isInWishlist(product.id) ? "Bəyəndiklərimdən çıxar" : "Bəyən"}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-red-600 stroke-red-600" : "stroke-[1.8]"}`} />
                </button>
              </div>

              {/* Modern Minimal Specification Badges */}
              {Array.isArray(product.details?.specs) && product.details.specs.length > 0 && (
                <div className="pt-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Texniki Xüsusiyyətlər & Standart
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.details.specs.map((spec, i) => (
                      <div 
                        key={i} 
                        style={{ borderRadius: "1px" }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail Tabs (Details / Specs / Shipping) */}
              <div className="pt-2 border-t border-neutral-100">
                <div className="flex gap-4 border-b border-neutral-100 pb-2 text-xs font-mono font-bold">
                  <button 
                    onClick={() => setActiveTab("details")}
                    className={`pb-1 cursor-pointer transition-colors ${
                      activeTab === "details" ? "border-b-2 border-neutral-950 text-neutral-950" : "text-neutral-500 hover:text-black"
                    }`}
                  >
                    Təsvir
                  </button>
                  <button 
                    onClick={() => setActiveTab("specs")}
                    className={`pb-1 cursor-pointer transition-colors ${
                      activeTab === "specs" ? "border-b-2 border-neutral-950 text-neutral-950" : "text-neutral-500 hover:text-black"
                    }`}
                  >
                    Material & Tərkib
                  </button>
                  <button 
                    onClick={() => setActiveTab("shipping")}
                    className={`pb-1 cursor-pointer transition-colors ${
                      activeTab === "shipping" ? "border-b-2 border-neutral-950 text-neutral-950" : "text-neutral-500 hover:text-black"
                    }`}
                  >
                    Çatdırılma
                  </button>
                </div>

                <div className="pt-3 text-xs font-mono text-neutral-700 leading-relaxed">
                  {activeTab === "details" && (
                    <div className="space-y-2">
                      <p className="font-sans text-sm text-neutral-800 leading-relaxed">
                        {product.name} — TERZME Atelier tərəfindən premium standartlarla hazırlanmış unikal kəsim və dizayna malik geyim parçasıdır.
                      </p>
                    </div>
                  )}

                  {activeTab === "specs" && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between py-1 border-b border-black/[0.04]">
                        <span className="text-neutral-500">Qumaş Tərkibi:</span>
                        <span className="font-bold text-neutral-950">{product.details?.composition || "100% Premium Cotton"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-black/[0.04]">
                        <span className="text-neutral-500">Daxili Astar:</span>
                        <span className="font-bold text-neutral-950">{product.details?.lining || "Nəfəsalan Astar"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500">Cib Quruluşu:</span>
                        <span className="font-bold text-neutral-950">{product.details?.pocket || "Standart Atelye Cibi"}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "shipping" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-neutral-950" />
                        <span>Bakı daxili 24 saat ərzində sürətli kuryer çatdırılması pulsuzdur.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-neutral-950" />
                        <span>14 gün ərzində asan dəyişdirilmə və geri qaytarılma imkanı.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-neutral-950" />
                        <span>100% Orijinal TERZME Atelier keyfiyyət zəmanəti.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* You may also like / Related products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black font-grotesk tracking-tight text-neutral-950">
              Digər Seçilmiş Modellər
            </h2>
            <Link 
              href="/collection" 
              className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 hover:text-black underline"
            >
              Bütün Kolleksiya →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.isArray(relatedProducts) && relatedProducts.map((rel) => (
              <div
                key={rel.id}
                style={{ borderRadius: "1px" }}
                className="bg-white rounded-[1px] border border-neutral-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300 group"
              >
                <div 
                  style={{ borderRadius: "1px" }}
                  className="relative w-full aspect-square bg-[#F7F7F7] flex items-center justify-center p-4 overflow-hidden rounded-[1px]"
                >
                  <Link href={`/product/${rel.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                    <img 
                      src={rel.mainImage} 
                      alt={rel.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>
                </div>

                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${rel.id}`} className="hover:underline">
                      <h3 className="text-xs sm:text-sm font-bold font-sans text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-black cursor-pointer">
                        {rel.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-neutral-800">4.9</span>
                      <span className="text-[10px]">(24)</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                    <span className="text-sm sm:text-base font-black font-mono text-neutral-950">
                      {formatPrice(rel.price)}
                    </span>

                    <Link
                      href={`/product/${rel.id}`}
                      style={{ borderRadius: "1px" }}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-950 text-white hover:bg-black transition-colors"
                    >
                      Baxış
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
