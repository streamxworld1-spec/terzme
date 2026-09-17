"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  ArrowLeft, 
  Plus, 
  ShoppingBag, 
  Settings, 
  Save, 
  Check, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Layers, 
  Phone, 
  Mail, 
  MapPin, 
  Tag, 
  DollarSign, 
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Package,
  Users,
  LayoutDashboard,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  BarChart3,
  ShoppingCart,
  ChevronRight
} from "lucide-react";
import { 
  Vendor, 
  getVendors, 
  saveVendorAction, 
  getAllProducts, 
  saveProductAction, 
  deleteProductAction, 
  getOrders, 
  Order,
  updateOrderStatusAction
} from "@/app/actions";
import { Product } from "@/data/products";
import { ImageUploadField } from "@/components/ImageUploadField";
import { CATEGORIES_DATA } from "@/data/mockupData";
import { useAuth } from "@/context/AuthContext";

export default function VendorStoreAdminPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab mapping for standard admin menu
  // "dashboard" | "products" | "stores" | "orders" | "customers" | "analytics" | "settings"
  const tabParam = searchParams?.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Filter and search inside store products
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // Selected 7 Standard Major Categories
  const [selectedMajorCategories, setSelectedMajorCategories] = useState<string[]>(["geyim"]);

  const toggleMajorCategory = (catSlug: string) => {
    setSelectedMajorCategories((prev) => {
      if (prev.includes(catSlug)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s !== catSlug);
      } else {
        return [...prev, catSlug];
      }
    });
  };

  // Store Settings Form
  const [storeForm, setStoreForm] = useState({
    name: "",
    category: "",
    description: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    email: "",
    logo: "",
    coverImage: "",
    categoriesText: "",
    standardShippingPrice: 5,
    expressShippingPrice: 10,
    freeShippingThreshold: 100,
    deliveryTimeText: "24-48 saat ərzində",
  });
  const [isSavingStore, setIsSavingStore] = useState(false);
  const [storeSuccess, setStoreSuccess] = useState(false);

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "Hoodies",
    sizes: "S, M, L, XL",
    image: "",
    description: "",
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [vendorsData, prodsData, ordersData] = await Promise.all([
        getVendors(),
        getAllProducts(),
        getOrders(),
      ]);

      const foundVendor = vendorsData.find((v) => v.slug === slug || v.id === slug);
      if (foundVendor) {
        setVendor(foundVendor);
        setStoreForm({
          name: foundVendor.name,
          category: foundVendor.category || "Streetwear & Fashion",
          description: foundVendor.description || "",
          city: foundVendor.city || "Bakı, Azərbaycan",
          address: foundVendor.address || "",
          phone: foundVendor.phone || "",
          whatsapp: foundVendor.whatsapp || "",
          instagram: foundVendor.instagram || "",
          email: foundVendor.email || "",
          logo: foundVendor.logo || "",
          coverImage: foundVendor.coverImage || "",
          categoriesText: (foundVendor.categories && foundVendor.categories.length > 0)
            ? foundVendor.categories.join(", ")
            : "Hoodies, T-Shirts, Pants, Jackets, Accessories",
          standardShippingPrice: foundVendor.shippingRates?.standardPrice ?? 5,
          expressShippingPrice: foundVendor.shippingRates?.expressPrice ?? 10,
          freeShippingThreshold: foundVendor.shippingRates?.freeShippingThreshold ?? 100,
          deliveryTimeText: foundVendor.shippingRates?.deliveryTimeText || "24-48 saat ərzində",
        });

        const majorSlugs = CATEGORIES_DATA.map((c) => c.slug);
        const existingMajor = (foundVendor.categories || []).filter((c) => majorSlugs.includes(c.toLowerCase()));
        if (existingMajor.length > 0) {
          setSelectedMajorCategories(existingMajor.map((c) => c.toLowerCase()));
        } else {
          // Default based on category
          const vCatLower = (foundVendor.category || "").toLowerCase();
          const match = majorSlugs.find((s) => vCatLower.includes(s));
          setSelectedMajorCategories([match || "geyim"]);
        }
      }

      setAllProducts(prodsData);
      setAllOrders(ordersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-mono text-sm text-neutral-600">
        <div className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mr-3" />
        Mağaza idarəetmə paneli yüklənir...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Store className="w-16 h-16 text-neutral-300 mx-auto" />
        <h2 className="text-2xl font-bold text-neutral-950 font-grotesk">Mağaza Tapılmadı</h2>
        <p className="text-xs text-neutral-500 font-mono max-w-sm">
          "{slug}" adlı mağaza mövcud deyil və ya sistemdən silinib.
        </p>
        <Link
          href="/admin/stores"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#07241A] text-white text-xs font-mono font-bold uppercase"
          style={{ borderRadius: "1px" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bütün Mağazalara Qayıt</span>
        </Link>
      </div>
    );
  }

  const isSuperAdmin = user?.role === "admin" || 
    (user?.email && ["admin@platform.local", "admin@terzme.com", "yusifligazanfar@gmail.com"].includes(user.email.toLowerCase())) ||
    user?.username === "admin";

  if (vendor.status === "pending" && !isSuperAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto" style={{ borderRadius: "1px" }}>
          <Clock className="w-8 h-8 stroke-[1.7]" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold px-3 py-1 bg-amber-50 border border-amber-200 inline-block">
            MÜRACİƏT GÖZLƏMƏDƏDİR (PENDING)
          </span>
          <h2 className="text-2xl font-black font-display uppercase tracking-tight text-neutral-950">
            {vendor.name} Hələ Təsdiqlənməyib
          </h2>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Mağazanız hazırda TERZME Baş İnzibatçısının moderasiya yoxlanışındadır. Təsdiqləndikdən sonra elektron poçt ünvanınıza bildiriş məktubu göndəriləcək və bu panel dərhal istifadənizə açılacaq.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            style={{ borderRadius: "1px" }}
            className="inline-block px-6 py-3 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest transition-all"
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>
    );
  }

  if (vendor.status === "suspended" && !isSuperAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 border border-red-300 text-red-700 flex items-center justify-center mx-auto" style={{ borderRadius: "1px" }}>
          <AlertCircle className="w-8 h-8 stroke-[1.7]" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-red-800 font-bold px-3 py-1 bg-red-50 border border-red-200 inline-block">
            MAĞAZA DAYANDIRILIB (SUSPENDED)
          </span>
          <h2 className="text-2xl font-black font-display uppercase tracking-tight text-neutral-950">
            {vendor.name} Fəaliyyəti Dondurulub
          </h2>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Bu mağazanın fəaliyyəti admin heyəti tərəfindən müvəqqəti olaraq dayandırılmışdır. Məhsullar canlı vitrindən gizlədilib. Ətraflı məlumat üçün TERZME admin heyəti ilə əlaqə saxlayın.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            style={{ borderRadius: "1px" }}
            className="inline-block px-6 py-3 bg-[#07241A] hover:bg-[#051A13] text-white font-black font-display text-xs uppercase tracking-widest transition-all"
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>
    );
  }

  // 1. ISOLATED STORE PRODUCTS
  const storeProducts = allProducts.filter((p) => {
    if (vendor.id === "terzme-store") {
      return p.vendorId === "terzme-store" || (!p.vendorId && (p.category === "hoodies" || p.name.includes("TERZME") || p.name.includes("HOODIE")));
    }
    return p.vendorId === vendor.id;
  });

  // 2. ISOLATED STORE ORDERS (Only items & orders belonging to this store)
  const storeProductNames = new Set(storeProducts.map((p) => p.name.toLowerCase().trim()));
  const storeOrders = allOrders.filter((order) => {
    const hasMatchingItem = (order.items || []).some((item) => {
      const matchStore = item.storeId === vendor.id || item.storeId === vendor.slug;
      const matchName = storeProductNames.has(item.name.toLowerCase().trim());
      return matchStore || matchName;
    });
    const hasLegacyProd = (order.products || []).some((prod: any) => 
      storeProductNames.has(prod.name?.toLowerCase().trim())
    );
    return hasMatchingItem || hasLegacyProd;
  });

  // 3. ISOLATED CUSTOMERS
  const customerMap = new Map<string, { fullName: string; phone: string; email?: string; ordersCount: number; totalSpent: number; city: string }>();
  storeOrders.forEach((o) => {
    const phone = o.customer.phone || o.customer.fullName;
    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        fullName: o.customer.fullName,
        phone: o.customer.phone,
        email: o.customer.email,
        ordersCount: 1,
        totalSpent: o.totalAmount || 0,
        city: o.customer.city || "Bakı",
      });
    } else {
      const existing = customerMap.get(phone)!;
      existing.ordersCount += 1;
      existing.totalSpent += (o.totalAmount || 0);
    }
  });
  const storeCustomers = Array.from(customerMap.values());

  // Store Analytics
  const totalRevenue = storeOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalItemsSold = storeOrders.reduce((sum, o) => {
    const count = (o.items || []).reduce((c, i) => c + (i.quantity || 1), 0);
    return sum + count;
  }, 0);

  // Filtered Products List
  const filteredProducts = storeProducts.filter((p) => {
    const matchesSearch = productSearch.trim() === "" ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.code?.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCat = productCategoryFilter === "all" ||
      p.category?.toLowerCase() === productCategoryFilter.toLowerCase() ||
      (p.categories && p.categories.some((c) => c.toLowerCase() === productCategoryFilter.toLowerCase()));

    return matchesSearch && matchesCat;
  });

  // Store categories defined for this vendor
  const storeCategories = storeForm.categoriesText
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  // Handle saving store settings & custom filters
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStore(true);
    setStoreSuccess(false);

    // Combine selected major category slugs with custom text categories
    const customCats = storeForm.categoriesText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const combinedCategories = Array.from(new Set([...selectedMajorCategories, ...customCats]));

    const res = await saveVendorAction({
      id: vendor.id,
      ...storeForm,
      categories: combinedCategories,
      shippingRates: {
        standardPrice: Number(storeForm.standardShippingPrice) || 5,
        expressPrice: Number(storeForm.expressShippingPrice) || 10,
        freeShippingThreshold: Number(storeForm.freeShippingThreshold) || 100,
        deliveryTimeText: storeForm.deliveryTimeText || "24-48 saat ərzində",
      },
    });

    setIsSavingStore(false);
    if (res.success) {
      setStoreSuccess(true);
      setTimeout(() => setStoreSuccess(false), 3500);
      loadData();
    } else {
      alert(res.error || "Xəta baş verdi");
    }
  };

  // Open Add Product modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      category: selectedMajorCategories[0] || "geyim",
      sizes: "S, M, L, XL",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      description: "",
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: String(prod.price),
      category: prod.category || selectedMajorCategories[0] || "geyim",
      sizes: prod.sizes ? prod.sizes.join(", ") : "S, M, L, XL",
      image: prod.mainImage || "",
      description: prod.description || prod.details?.composition || "",
    });
    setIsProductModalOpen(true);
  };

  // Save Product (strictly bound to this vendor)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    setIsSavingProduct(true);
    const parsedPrice = parseFloat(productForm.price) || 0;
    const sizesArray = productForm.sizes.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);

    const chosenCatSlug = productForm.category.toLowerCase().replace(/[^a-z0-9-]/g, "");

    const productPayload: Partial<Product> = {
      ...(editingProduct || {}),
      id: editingProduct?.id,
      name: productForm.name.trim(),
      price: parsedPrice,
      category: chosenCatSlug as any,
      mainCategory: chosenCatSlug,
      categories: [chosenCatSlug, productForm.category.trim()],
      sizes: sizesArray.length > 0 ? sizesArray : ["S", "M", "L", "XL"],
      mainImage: productForm.image,
      images: [productForm.image],
      description: productForm.description,
      vendorId: vendor.id,
      vendorName: vendor.name,
      designer: vendor.name,
    };

    const res = await saveProductAction(productPayload);
    setIsSavingProduct(false);

    if (res.success) {
      setIsProductModalOpen(false);
      setProductMessage(`"${productPayload.name}" mağazanıza əlavə edildi!`);
      setTimeout(() => setProductMessage(null), 3000);
      loadData();
    } else {
      alert("Məhsulu saxlamaq olmadı");
    }
  };

  // Delete product
  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    if (!confirm(`"${prodName}" məhsulunu mağazanızın kataloqundan silmək istəyirsiniz?`)) return;
    const res = await deleteProductAction(prodId);
    if (res.success) {
      loadData();
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: any) => {
    const res = await updateOrderStatusAction(orderId, status);
    if (res.success) {
      loadData();
    }
  };

  // The requested menu items for this store's personal admin (without global stores list)
  const STORE_MENU_ITEMS = [
    { id: "dashboard", label: "İdarə Paneli", icon: LayoutDashboard, count: null },
    { id: "products", label: "Məhsullar", icon: ShoppingBag, count: storeProducts.length },
    { id: "orders", label: "Sifarişlər", icon: ShoppingCart, count: storeOrders.length },
    { id: "customers", label: "Müştərilər", icon: Users, count: storeCustomers.length },
    { id: "analytics", label: "Analitika", icon: BarChart3, count: null },
    { id: "settings", label: "Tənzimləmələr", icon: Settings, count: null },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-24">
      {/* Top Header Card - Distinct Vendor Identity */}
      <div 
        style={{ borderRadius: "1px" }}
        className="bg-white border border-neutral-200 shadow-2xs overflow-hidden"
      >
        {/* Banner with Logo */}
        <div className="relative h-44 sm:h-52 w-full bg-neutral-900 overflow-hidden">
          <img
            src={vendor.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"}
            alt={vendor.name}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Top Bar inside banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Link
              href="/admin/stores"
              style={{ borderRadius: "1px" }}
              className="px-3 py-1.5 bg-black/60 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bütün Mağazalar</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/90 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-xs" style={{ borderRadius: "1px" }}>
                MAĞAZA ŞƏXSİ PORTALI
              </span>
              <Link
                href={`/stores/${vendor.slug}`}
                target="_blank"
                style={{ borderRadius: "1px" }}
                className="px-3 py-1.5 bg-white text-neutral-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm hover:bg-neutral-100 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Canlı Vitrin</span>
              </Link>
            </div>
          </div>

          {/* Identity block */}
          <div className="absolute bottom-4 left-6 sm:left-8 flex items-end gap-4 text-white">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-white bg-white shadow-xl shrink-0">
              <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-0.5 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-black font-grotesk uppercase tracking-tight leading-none drop-shadow-md">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
                )}
              </div>
              <p className="text-xs font-mono text-neutral-200">
                {vendor.category} • {vendor.city} • ID: <span className="font-bold">{vendor.slug}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= EXACT REQUESTED 7-ITEM MENU ================= */}
        <div className="px-4 sm:px-8 py-3 bg-neutral-50/70 border-t border-neutral-200 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            {STORE_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    router.push(`/admin/stores/${slug}?tab=${item.id}`, { scroll: false });
                  }}
                  style={{ borderRadius: "1px" }}
                  className={`px-3.5 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#07241A] text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                  {item.count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleOpenAddProduct}
            style={{ borderRadius: "1px" }}
            className="px-4 py-2 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Məhsul Əlavə Et</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {productMessage && (
        <div 
          style={{ borderRadius: "1px" }}
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2 shadow-2xs"
        >
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{productMessage}</span>
        </div>
      )}

      {/* ================= 1. İDARƏ PANELİ (DASHBOARD) ================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              style={{ borderRadius: "1px" }}
              className="bg-white border border-neutral-200 p-5 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-mono uppercase font-bold">Aktiv Məhsul</span>
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-grotesk text-neutral-950">
                {storeProducts.length}
              </div>
              <p className="text-[11px] font-mono text-neutral-500">
                Yalnız {vendor.name} məhsulları
              </p>
            </div>

            <div 
              style={{ borderRadius: "1px" }}
              className="bg-white border border-neutral-200 p-5 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-mono uppercase font-bold">Mağazanın Sifarişləri</span>
                <Package className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-grotesk text-neutral-950">
                {storeOrders.length}
              </div>
              <p className="text-[11px] font-mono text-neutral-500">
                Bu mağazadan qəbul edilən sifarişlər
              </p>
            </div>

            <div 
              style={{ borderRadius: "1px" }}
              className="bg-white border border-neutral-200 p-5 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-mono uppercase font-bold">Müştəri Bazası</span>
                <Users className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-grotesk text-neutral-950">
                {storeCustomers.length}
              </div>
              <p className="text-[11px] font-mono text-neutral-500">
                Bu mağazadan alış-veriş edən alıcılar
              </p>
            </div>

            <div 
              style={{ borderRadius: "1px" }}
              className="bg-white border border-neutral-200 p-5 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-mono uppercase font-bold">Mağaza Gəliri</span>
                <DollarSign className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-grotesk text-emerald-900">
                {totalRevenue.toFixed(2)} ₼
              </div>
              <p className="text-[11px] font-mono text-neutral-500">
                Yalnız bu mağazanın satış dövriyyəsi
              </p>
            </div>
          </div>

          {/* Quick Shortcuts & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div 
              style={{ borderRadius: "1px" }}
              className="bg-white border border-neutral-200 p-6 space-y-4 shadow-2xs"
            >
              <h3 className="text-base font-black font-grotesk uppercase tracking-tight text-neutral-950">
                Sürətli İdarəetmə
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                {vendor.name} üçün əsas əməliyyatlar
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleOpenAddProduct}
                  style={{ borderRadius: "1px" }}
                  className="w-full p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-700" />
                    Yeni Məhsul Əlavə Et
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  style={{ borderRadius: "1px" }}
                  className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-neutral-600" />
                    Bütün Məhsulları İdarə Et ({storeProducts.length})
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  style={{ borderRadius: "1px" }}
                  className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-neutral-600" />
                    Sifarişləri İzlə ({storeOrders.length})
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  style={{ borderRadius: "1px" }}
                  className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-neutral-600" />
                    Xüsusi Filtrləri Tənzimlə ({storeCategories.length})
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Recent Store Orders */}
            <div 
              style={{ borderRadius: "1px" }}
              className="lg:col-span-2 bg-white border border-neutral-200 p-6 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black font-grotesk uppercase tracking-tight text-neutral-950">
                    Son Sifarişlər ({storeOrders.length})
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Yalnız bu mağazaya daxil olan sifarişlər
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-mono text-emerald-800 hover:underline font-bold cursor-pointer"
                >
                  Hamısına Bax →
                </button>
              </div>

              {storeOrders.length === 0 ? (
                <div 
                  style={{ borderRadius: "1px" }}
                  className="p-10 text-center bg-neutral-50 border border-neutral-200 space-y-2"
                >
                  <Clock className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="font-bold text-xs text-neutral-800 font-mono">Hələ ki, yeni sifariş daxil olmayıb</p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Müştərilər sizin vitrininizdən sifariş verdikdə burada əks olunacaq.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {storeOrders.slice(0, 4).map((o) => (
                    <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-neutral-900">{o.id}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">
                          Müştəri: {o.customer.fullName} • {o.date || o.createdAt?.split("T")[0]}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-neutral-950">{o.totalAmount} ₼</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. MƏHSULLAR (PRODUCTS) ================= */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div 
            style={{ borderRadius: "1px" }}
            className="bg-white border border-neutral-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Məhsul adı və ya kodu ilə axtar..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ borderRadius: "1px" }}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setProductCategoryFilter("all")}
                style={{ borderRadius: "1px" }}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                  productCategoryFilter === "all"
                    ? "bg-[#07241A] text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Hamısı ({storeProducts.length})
              </button>

              {storeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProductCategoryFilter(cat)}
                  style={{ borderRadius: "1px" }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                    productCategoryFilter.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#07241A] text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Button */}
            <button
              onClick={handleOpenAddProduct}
              style={{ borderRadius: "1px" }}
              className="px-4 py-2 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Məhsul</span>
            </button>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div 
              style={{ borderRadius: "1px" }}
              className="p-16 text-center bg-white border border-neutral-200 space-y-4 shadow-2xs"
            >
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-sm font-grotesk text-neutral-900">
                Axtarışa uyğun heç bir məhsul tapılmadı
              </h3>
              <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
                Yeni məhsul əlavə edə bilər və ya axtarış parametrlərini sıfırlaya bilərsiniz.
              </p>
              <button
                onClick={handleOpenAddProduct}
                style={{ borderRadius: "1px" }}
                className="px-5 py-2.5 bg-[#07241A] text-white text-xs font-mono font-bold uppercase cursor-pointer"
              >
                İlk Məhsulu Əlavə Et
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{ borderRadius: "1px" }}
                  className="bg-white border border-neutral-200 overflow-hidden flex flex-col justify-between shadow-2xs group hover:border-neutral-300 transition-all"
                >
                  <div className="relative aspect-square bg-neutral-50 flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="absolute top-2 left-2 px-2 py-0.5 bg-[#07241A] text-white text-[10px] font-mono font-bold uppercase"
                    >
                      {prod.category}
                    </span>
                    <span 
                      style={{ borderRadius: "1px" }}
                      className="absolute top-2 right-2 px-2 py-0.5 bg-neutral-900/80 text-white text-[10px] font-mono"
                    >
                      {prod.code || "TZ"}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm font-grotesk text-neutral-950 uppercase line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-mono text-emerald-800 font-bold mt-1">
                        {prod.price} ₼
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {prod.sizes ? prod.sizes.join(", ") : "Standart"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/product/${prod.id}`}
                          target="_blank"
                          style={{ borderRadius: "1px" }}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          title="Saytda bax"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          style={{ borderRadius: "1px" }}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                          title="Redaktə et"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          style={{ borderRadius: "1px" }}
                          className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. SİFARİŞLƏR (ORDERS) ================= */}
      {activeTab === "orders" && (
        <div 
          style={{ borderRadius: "1px" }}
          className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black font-grotesk uppercase tracking-tight text-neutral-950">
                Mağazanın Sifarişləri ({storeOrders.length})
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Yalnız {vendor.name} məhsullarına aid daxil olan sifarişlər
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-neutral-500 block">Dövriyyə</span>
              <span className="text-lg font-mono font-black text-emerald-900">{totalRevenue.toFixed(2)} ₼</span>
            </div>
          </div>

          {storeOrders.length === 0 ? (
            <div 
              style={{ borderRadius: "1px" }}
              className="p-16 text-center bg-neutral-50 border border-neutral-200 space-y-3"
            >
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-sm text-neutral-900 font-grotesk">
                Bu mağazaya aid sifariş hələ yoxdur
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Alıcılar bu mağazanın vitrinindən sifariş verdikdə siyahı dərhal yenilənəcək.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 border border-neutral-200 overflow-hidden" style={{ borderRadius: "1px" }}>
              {storeOrders.map((order) => {
                const storeItems = (order.items || []).filter((it) => storeProductNames.has(it.name.toLowerCase().trim()));

                return (
                  <div key={order.id} className="p-5 space-y-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-sm font-black text-neutral-950">{order.id}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            {order.status}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            {order.date || order.createdAt?.split("T")[0]}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-neutral-600 mt-1">
                          Müştəri: <span className="font-bold">{order.customer.fullName}</span> • Tel: {order.customer.phone} • Ünvan: {order.customer.city}, {order.customer.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          style={{ borderRadius: "1px" }}
                          className="px-3 py-1.5 bg-white border border-neutral-300 text-xs font-mono text-neutral-900 focus:outline-none"
                        >
                          <option value="Qəbul edildi">Qəbul edildi</option>
                          <option value="Hazırlanır">Hazırlanır</option>
                          <option value="Çatdırılmada">Çatdırılmada</option>
                          <option value="Təhvil verildi">Təhvil verildi</option>
                          <option value="Ləğv edildi">Ləğv edildi</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                        Mağazanın Sifariş Edilən Məhsulları:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {storeItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 border border-neutral-100" style={{ borderRadius: "1px" }}>
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-white border border-neutral-200" />
                            )}
                            <div className="text-xs font-mono leading-tight">
                              <p className="font-bold text-neutral-900">{item.name}</p>
                              <p className="text-neutral-500">
                                {item.quantity} ədəd × {item.price} ₼ {item.size ? `(Ölçü: ${item.size})` : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. MÜŞTƏRİLƏR (CUSTOMERS) ================= */}
      {activeTab === "customers" && (
        <div 
          style={{ borderRadius: "1px" }}
          className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black font-grotesk uppercase tracking-tight text-neutral-950">
                Mağazanın Müştəriləri ({storeCustomers.length})
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Yalnız {vendor.name} mağazasından alış-veriş etmiş müştərilər
              </p>
            </div>
          </div>

          {storeCustomers.length === 0 ? (
            <div 
              style={{ borderRadius: "1px" }}
              className="p-16 text-center bg-neutral-50 border border-neutral-200 space-y-3"
            >
              <Users className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-sm text-neutral-900 font-grotesk">
                Hələ heç bir müştəri qeydə alınmayıb
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Alıcılar bu mağazadan ilk sifarişlərini verdikdə burada müştəri bazası formalaşacaq.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 border border-neutral-200 overflow-hidden" style={{ borderRadius: "1px" }}>
              {storeCustomers.map((cust, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold font-grotesk text-emerald-900">
                      {cust.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm font-grotesk text-neutral-950">{cust.fullName}</p>
                      <p className="text-xs font-mono text-neutral-500">
                        {cust.phone} {cust.email ? `• ${cust.email}` : ""} • {cust.city}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-neutral-900">
                      {cust.ordersCount} Sifariş
                    </p>
                    <p className="text-xs font-mono text-emerald-800 font-bold">
                      Cəmi: {cust.totalSpent.toFixed(2)} ₼
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. ANALİTİKA (ANALYTICS) ================= */}
      {activeTab === "analytics" && (
        <div 
          style={{ borderRadius: "1px" }}
          className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-2xs"
        >
          <div>
            <h2 className="text-lg font-black font-grotesk uppercase tracking-tight text-neutral-950">
              Mağazanın Satış və Analitika Hesabatı
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {vendor.name} mağazasının fəaliyyət göstəriciləri
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-neutral-50 border border-neutral-200" style={{ borderRadius: "1px" }}>
              <span className="text-xs font-mono uppercase text-neutral-500 block">Cəmi Satış Dövriyyəsi</span>
              <span className="text-2xl font-black font-grotesk text-emerald-900 block mt-1">{totalRevenue.toFixed(2)} ₼</span>
            </div>
            <div className="p-5 bg-neutral-50 border border-neutral-200" style={{ borderRadius: "1px" }}>
              <span className="text-xs font-mono uppercase text-neutral-500 block">Ümumi Sifariş Sayı</span>
              <span className="text-2xl font-black font-grotesk text-neutral-950 block mt-1">{storeOrders.length}</span>
            </div>
            <div className="p-5 bg-neutral-50 border border-neutral-200" style={{ borderRadius: "1px" }}>
              <span className="text-xs font-mono uppercase text-neutral-500 block">Orta Sifariş Dəyəri</span>
              <span className="text-2xl font-black font-grotesk text-neutral-950 block mt-1">
                {storeOrders.length > 0 ? (totalRevenue / storeOrders.length).toFixed(2) : "0.00"} ₼
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. TƏNZİMLƏMƏLƏR (SETTINGS & CUSTOM FILTERS) ================= */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveStore} className="space-y-6">
          <div 
            style={{ borderRadius: "1px" }}
            className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-2xs"
          >
            <div>
              <h2 className="text-lg font-black font-grotesk uppercase tracking-tight text-neutral-950">
                Mağaza Tənzimləmələri və Xüsusi Filtrlər
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Vitrində və axtarış sistemində alıcılara nümayiş etdirilən mağaza detalları
              </p>
            </div>

            {storeSuccess && (
              <div 
                style={{ borderRadius: "1px" }}
                className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Mağaza məlumatları və xüsusi filtrlər uğurla yadda saxlanıldı!</span>
              </div>
            )}

            {/* 7 MAJOR CATEGORIES SELECTION (MULTI-CHOICE) */}
            <div 
              style={{ borderRadius: "1px" }}
              className="p-5 bg-neutral-50 border border-neutral-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-950 font-bold font-grotesk text-sm">
                  <Tag className="w-4 h-4 text-emerald-800" />
                  <span>ƏSAS KATEQORİYALAR (BİRGƏ VƏ ÇOXLU SEÇİM)</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">
                  {selectedMajorCategories.length} kateqoriya seçilib
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Mağazanızın hansı əsas kateqoriyalarda satış edəcəyini seçin. Birdən çox kateqoriya seçə bilərsiniz. Seçdiyiniz hər bir kateqoriyanın ictimai səhifəsində (məsələn, <em>/collection?cat=geyim</em> və ya <em>/collection?cat=ayaqqabi</em>) mağazanızın uyğun məhsulları digər mağazalarla birlikdə nümayiş etdiriləcəkdir.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
                {CATEGORIES_DATA.map((cat) => {
                  const isSelected = selectedMajorCategories.includes(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => toggleMajorCategory(cat.slug)}
                      style={{ borderRadius: "1px" }}
                      className={`px-3 py-2.5 text-xs font-mono font-bold flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#07241A] text-white border-[#07241A] shadow-xs"
                          : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] font-normal opacity-80">
                        {isSelected ? "Aktivdir" : "Seç"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Filters Setting */}
            <div 
              style={{ borderRadius: "1px" }}
              className="p-5 bg-emerald-50/50 border border-emerald-200/70 space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-900 font-bold font-grotesk text-sm">
                <Tag className="w-4 h-4 text-emerald-700" />
                <span>MAĞAZANIN XÜSUSİ MƏHSUL FİLTRLƏRİ</span>
              </div>
              <p className="text-xs text-emerald-950/80 font-sans leading-relaxed">
                Vitrininizdə alıcıların məhsullarınızı asanlıqla kateqoriyalara görə tapması üçün filter düymələrini buradan təyin edin. Vergüllə ayıraraq istədiyiniz qədər filter əlavə edə bilərsiniz.
              </p>
              <input
                type="text"
                placeholder="Pants, T-Shirts, Hoodies, Shoes, Caps, Accessories"
                value={storeForm.categoriesText}
                onChange={(e) => setStoreForm({ ...storeForm, categoriesText: e.target.value })}
                style={{ borderRadius: "1px" }}
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 text-xs font-mono text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-mono text-emerald-900 font-bold">Aktiv düymələr:</span>
                {storeCategories.map((c) => (
                  <span
                    key={c}
                    style={{ borderRadius: "1px" }}
                    className="px-2 py-0.5 bg-[#07241A] text-white text-[10px] font-mono font-bold uppercase"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Mağaza Adı *</label>
                <input
                  type="text"
                  required
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Fəaliyyət Sahəsi / İxtisaslaşma *</label>
                <input
                  type="text"
                  required
                  value={storeForm.category}
                  onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Mağaza Haqqında (Təsvir)</label>
              <textarea
                rows={3}
                value={storeForm.description}
                onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                style={{ borderRadius: "1px" }}
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-sans text-neutral-900 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Şəhər / Region</label>
                <input
                  type="text"
                  value={storeForm.city}
                  onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Ünvan</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Əlaqə Telefonu</label>
                <input
                  type="text"
                  placeholder="+994 50 123 45 67"
                  value={storeForm.phone}
                  onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">WhatsApp Nömrəsi</label>
                <input
                  type="text"
                  placeholder="+994 50 123 45 67"
                  value={storeForm.whatsapp}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Instagram İstifadəçi Adı / Link</label>
                <input
                  type="text"
                  placeholder="@magaza və ya instagram.com/magaza"
                  value={storeForm.instagram}
                  onChange={(e) => setStoreForm({ ...storeForm, instagram: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">E-poçt / Gmail Ünvanı</label>
                <input
                  type="email"
                  value={storeForm.email}
                  onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            {/* SEPARATE VENDOR SHIPPING SETTINGS SECTION */}
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-sm uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                  <span>📦 MAĞAZANIN KARQO VƏ ÇATDIRILMA QİYMƏTLƏRİ</span>
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  Bu mağazanın məhsulları üçün tətbiq olunan xüsusi çatdırılma tarifləri
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Standart Çatdırılma (₼)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={storeForm.standardShippingPrice}
                    onChange={(e) => setStoreForm({ ...storeForm, standardShippingPrice: Number(e.target.value) })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Ekspress Çatdırılma (₼)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={storeForm.expressShippingPrice}
                    onChange={(e) => setStoreForm({ ...storeForm, expressShippingPrice: Number(e.target.value) })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Pulsuz Çatdırılma Limiti (₼)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Məs: 100"
                    value={storeForm.freeShippingThreshold}
                    onChange={(e) => setStoreForm({ ...storeForm, freeShippingThreshold: Number(e.target.value) })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Təxmini Çatdırılma Müddəti</label>
                <input
                  type="text"
                  placeholder="Məs: Bakı daxili 24 saat, rayonlara 2-3 gün"
                  value={storeForm.deliveryTimeText}
                  onChange={(e) => setStoreForm({ ...storeForm, deliveryTimeText: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
              <ImageUploadField
                label="Mağaza Loqosu (Kvadrat)"
                value={storeForm.logo}
                onChange={(url) => setStoreForm({ ...storeForm, logo: url })}
              />

              <ImageUploadField
                label="Üz Qabığı / Banner Şəkli"
                value={storeForm.coverImage}
                onChange={(url) => setStoreForm({ ...storeForm, coverImage: url })}
              />
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <button
                type="submit"
                disabled={isSavingStore}
                style={{ borderRadius: "1px" }}
                className="px-6 py-2.5 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingStore ? "Saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            style={{ borderRadius: "1px" }}
            className="bg-white border border-neutral-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black font-grotesk uppercase tracking-tight text-base text-neutral-950">
                {editingProduct ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Məhsulun Adı *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Qiymət (₼) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Kateqoriya / Qrup *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ borderRadius: "1px" }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                  >
                    <optgroup label="Əsas Kateqoriyalar">
                      {CATEGORIES_DATA.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name} {selectedMajorCategories.includes(c.slug) ? "★" : ""}
                        </option>
                      ))}
                    </optgroup>
                    {storeCategories.length > 0 && (
                      <optgroup label="Mağazanın Xüsusi Filtrləri">
                        {storeCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Ölçülər (Vergüllə: S, M, L, XL)</label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <ImageUploadField
                label="Məhsulun Şəkli"
                value={productForm.image}
                onChange={(url) => setProductForm({ ...productForm, image: url })}
              />

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase">Təsvir / Parça tərkibi</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ borderRadius: "1px" }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-xs font-sans text-neutral-900 focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{ borderRadius: "1px" }}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-mono cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  style={{ borderRadius: "1px" }}
                  className="px-5 py-2 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  {isSavingProduct ? "Saxlanılır..." : "Yadda Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
