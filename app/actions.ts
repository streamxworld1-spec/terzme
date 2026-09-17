"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { PRODUCTS, Product } from "@/data/products";

import { COUNTRIES } from "@/data/countries";

const dataDirectory = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const ordersFilePath = path.join(dataDirectory, "orders.json");
const productsFilePath = path.join(dataDirectory, "custom_products.json");
const settingsFilePath = path.join(dataDirectory, "settings.json");
const shippingRatesFilePath = path.join(dataDirectory, "shipping_rates.json");
const azShippingMethodsFilePath = path.join(dataDirectory, "az_shipping_methods.json");
const vendorsFilePath = path.join(dataDirectory, "vendors.json");
const usersFilePath = path.join(dataDirectory, "users.json");

export type UserRole = "customer" | "vendor" | "admin";

export type UserAccount = {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  status: "active" | "suspended";
  createdAt: string;
  ownedStoreSlug?: string;
  ownedStoreName?: string;
};

export type Vendor = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  address?: string;
  logo: string;
  coverImage: string;
  verified: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  established?: string;
  status: "active" | "pending" | "suspended" | "rejected";
  categories?: string[];
  rejectionReason?: string;
  ownerEmail?: string;
  ownerId?: string;
  shippingRates?: {
    standardPrice?: number;
    expressPrice?: number;
    freeShippingThreshold?: number;
    deliveryTimeText?: string;
  };
};

export type AzShippingMethod = {
  id: string;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
};

export type OrderStatus = "Qəbul edildi" | "Hazırlanır" | "Çatdırılmada" | "Təhvil verildi" | "Ləğv edildi";

export type OrderItem = {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
  storeId?: string;
  storeName?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  date?: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    country?: string;
  };
  userId?: string;
  username?: string;
  userEmail?: string;
  // Storefront / legacy compatibility fields
  customerName?: string;
  totalAmount: number;
  shippingFee?: number;
  total?: string;
  paymentMethod?: string;
  payment?: string;
  status: OrderStatus;
  fulfillment?: OrderStatus;
  trackingCode: string;
  items: OrderItem[];
  products?: {
    name: string;
    qty: number;
    price: string;
    image: string;
    size?: string;
    color?: string;
  }[];
  timeline?: { time: string; title: string; desc: string; icon?: string }[];
};

export type StoreSettings = {
  siteName?: string;
  siteTagline?: string;
  siteDescription?: string;
  announcementText: string;
  announcementEnabled?: boolean;
  announcementLink?: string;
  freeShippingThreshold?: number;
  shippingCoverage?: string;
  shippingNote?: string;
  contactPhone: string;
  contactEmail?: string;
  contactAddress?: string;
  instagramHandle: string;
  telegramHandle: string;
  currency?: string;
};

const defaultSettings: StoreSettings = {
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
};

// ==================== ORDERS API ====================

export async function getOrders(): Promise<Order[]> {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const fileContents = fs.readFileSync(ordersFilePath, "utf8");
    const rawList = JSON.parse(fileContents);
    
    // Normalize data so all fields work smoothly everywhere
    return rawList.map((raw: any) => {
      const fullName = raw.customer?.fullName || raw.customer || raw.customerInfo?.fullName || "Müştəri";
      const phone = raw.customer?.phone || raw.phone || raw.customerInfo?.phone || "";
      const email = raw.customer?.email || raw.email || raw.customerInfo?.email || "";
      const address = raw.customer?.address || raw.address || raw.customerInfo?.address || "Bakı";
      const city = raw.customer?.city || raw.city || raw.customerInfo?.city || "Bakı";
      
      const parsedTotal = typeof raw.totalAmount === "number" 
        ? raw.totalAmount 
        : parseFloat(String(raw.total || "").replace(/[^0-9.]/g, "")) || 0;

      const itemsList: OrderItem[] = Array.isArray(raw.items) && raw.items.length > 0 && typeof raw.items[0] === "object"
        ? raw.items.map((it: any) => ({
            productId: it.productId,
            name: it.name,
            quantity: it.quantity || 1,
            price: typeof it.price === "number" ? it.price : parseFloat(String(it.price).replace(/[^0-9.]/g, "")) || 0,
            size: it.size,
            color: it.color,
            image: it.image,
            storeId: it.storeId,
            storeName: it.storeName,
          }))
        : Array.isArray(raw.products)
        ? raw.products.map((p: any) => ({
            productId: p.productId || p.id,
            name: p.name,
            quantity: p.qty || 1,
            price: parseFloat(String(p.price).replace(/[^0-9.]/g, "")) || 0,
            size: p.size,
            color: p.color,
            image: p.image,
            storeId: p.storeId,
            storeName: p.storeName,
          }))
        : [];

      const status: OrderStatus = raw.status || raw.fulfillment || "Qəbul edildi";
      const trackingCode = raw.trackingCode || `TRZ-${raw.id?.replace(/[^0-9]/g, "") || Math.floor(100000 + Math.random() * 900000)}`;

      return {
        id: raw.id,
        createdAt: raw.createdAt || raw.date || new Date().toISOString(),
        date: raw.date || raw.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        customer: {
          fullName,
          phone,
          email,
          address,
          city,
        },
        customerName: fullName,
        totalAmount: parsedTotal,
        total: `$${parsedTotal.toFixed(2)}`,
        payment: raw.payment || raw.paymentMethod || "Kartla Ödənilib (Onlayn)",
        status,
        fulfillment: status,
        trackingCode,
        items: itemsList,
        products: itemsList.map((it) => ({
          name: it.name,
          qty: it.quantity,
          price: `$${it.price}`,
          image: it.image || "/hoodie/hoodie-main.png",
          size: it.size,
        })),
        timeline: raw.timeline || [
          {
            time: "10:30",
            title: "Sifariş Qəbul Edildi",
            desc: "Sistemə daxil edildi və təsdiqləndi",
            icon: "check"
          }
        ],
      };
    });
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export async function createOrderAction(orderData: {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    country?: string;
  };
  userId?: string;
  username?: string;
  userEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee?: number;
  paymentMethod?: string;
  trackingCode?: string;
}) {
  try {
    const orders = await getOrders();
    const id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = orderData.trackingCode || `TRZ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      customer: orderData.customer,
      customerName: orderData.customer.fullName,
      userId: orderData.userId,
      username: orderData.username,
      userEmail: orderData.userEmail || orderData.customer.email,
      totalAmount: orderData.totalAmount,
      shippingFee: orderData.shippingFee ?? 0,
      total: `$${orderData.totalAmount.toFixed(2)}`,
      payment: orderData.paymentMethod || "Kartla Ödənilib (Onlayn)",
      status: "Qəbul edildi",
      fulfillment: "Qəbul edildi",
      trackingCode,
      items: orderData.items,
      products: orderData.items.map((it) => ({
        name: it.name,
        qty: it.quantity,
        price: `$${it.price}`,
        image: it.image || "/hoodie/hoodie-main.png",
        size: it.size,
      })),
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          title: "Sifariş Qəbul Edildi",
          desc: "Sifariş sistemə daxil edildi və təsdiqləndi",
          icon: "check"
        }
      ]
    };

    orders.unshift(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    revalidatePath("/");
    revalidatePath("/orders");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");
    revalidatePath("/admin/analytics");
    return { success: true, order: newOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Sifarişi saxlamaq mümkün olmadı" };
  }
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  try {
    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return { success: false, error: "Sifariş tapılmadı" };

    orders[idx].status = status;
    orders[idx].fulfillment = status;
    if (!orders[idx].timeline) orders[idx].timeline = [];
    orders[idx].timeline!.push({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title: `Status: ${status}`,
      desc: `Admin tərəfindən status yeniləndi: ${status}`,
      icon: status === "Təhvil verildi" ? "check-circle" : "truck"
    });

    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/analytics");
    revalidatePath("/orders");
    revalidatePath(`/track`);
    return { success: true, order: orders[idx] };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Status yenilənmədi" };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    const orders = await getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    fs.writeFileSync(ordersFilePath, JSON.stringify(updated, null, 2), "utf8");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/analytics");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Sifariş silinmədi" };
  }
}

export async function clearAllOrdersAction() {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2), "utf8");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/analytics");
    return { success: true };
  } catch (error) {
    console.error("Error clearing orders:", error);
    return { success: false, error: "Sifarişlər silinmədi" };
  }
}

export async function getOrderByTrackingCode(code: string): Promise<Order | null> {
  const orders = await getOrders();
  const cleaned = code.trim().toUpperCase();
  const found = orders.find(
    (o) => o.trackingCode?.toUpperCase() === cleaned || o.id.toUpperCase() === cleaned
  );
  return found || null;
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const orders = await getOrders();
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (!cleaned) return [];
  return orders.filter((o) => o.customer.phone.replace(/[^0-9]/g, "").includes(cleaned));
}

// ==================== PRODUCTS API (CRUD) ====================

export async function getAllProducts(): Promise<Product[]> {
  try {
    if (!fs.existsSync(productsFilePath)) {
      fs.writeFileSync(productsFilePath, JSON.stringify(PRODUCTS, null, 2));
      return PRODUCTS;
    }
    const fileContents = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading products:", error);
    return PRODUCTS;
  }
}

export async function saveProductAction(product: Partial<Product>) {
  try {
    const products = await getAllProducts();
    const primaryCat = (product.category || (product as any).categories?.[0] || "hoodies").toString().toLowerCase().trim();
    const rawCategories: string[] = (product as any).categories || [primaryCat];
    const normalizedCategories = Array.from(new Set(rawCategories.map((c) => c.toLowerCase().trim())));

    const id = product.id || `custom-${Date.now()}`;
    const fullProduct: Product = {
      id,
      code: (product as any).code || `TZ-${String(products.length + 1).padStart(2, "0")}`,
      categoryNumber: (product as any).categoryNumber || String(products.length + 1).padStart(2, "0"),
      name: product.name || "Yeni Məhsul",
      subtitle: product.subtitle || "ATELIER EDITION",
      price: typeof product.price === "number" ? product.price : parseFloat(String(product.price || "0")) || 0,
      currency: product.currency || "$",
      designer: product.designer || "BAKU STREETWEAR",
      season: product.season || "EDITION 2026",
      category: (primaryCat as any),
      categories: normalizedCategories,
      mainImage: product.mainImage || (product as any).image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      images: product.images || [(product as any).image || product.mainImage || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"],
      sideImage: (product as any).sideImage || product.mainImage || (product as any).image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      sideTitle: (product as any).sideTitle || "TERZME",
      sideSubtitle: (product as any).sideSubtitle || "ATELIER ARCHIVE",
      hotspots: (product as any).hotspots || [],
      sizes: product.sizes || ["S", "M", "L", "XL"],
      colors: product.colors || ["#000000", "#d8cbbf"],
      features: (product as any).features || ["Premium Baku Atelier Edition", "Heavyweight organic cotton"],
      featured: product.featured ?? false,
      badge: (product as any).badge || "YENİ",
      description: (product as any).description || "Bakı atelyesində hazırlanmış xüsusi buraxılış.",
      story: (product as any).story || "Şəhər ritmi və müasir dəb fəlsəfəsinin harmoniyası.",
      details: product.details || {
        title: product.name || "Yeni Məhsul",
        studio: "BAKU ATELIER",
        era: "EDITION 2026",
        specs: ["ATELIER REINFORCED STITCH", "PRE-SHRUNK"],
        lining: "ORGANIC COTTON",
        pocket: "INTEGRATED",
        composition: "450 GSM Heavyweight French Terry",
      },
      specifications: (product as any).specifications || {
        stitch: "Double-needle reinforced",
        ribbing: "1x1 heavy spandex rib",
        hardware: "Custom matte hardware",
        preShrunk: true,
      },
      measurements: (product as any).measurements || {
        chest: "68cm",
        length: "74cm",
        sleeve: "62cm",
        shoulder: "60cm",
      },
      careInstructions: (product as any).careInstructions || [
        "30°C-də tərs üzünə yuyun",
        "Ağardıcıdan istifadə etməyin",
      ],
      reviews: (product as any).reviews || [],
      vendorId: product.vendorId || (product as any).vendorId,
      vendorName: product.vendorName || (product as any).vendorName,
    };

    const existingIndex = products.findIndex((p) => p.id === id);
    if (existingIndex >= 0) {
      products[existingIndex] = fullProduct;
    } else {
      products.unshift(fullProduct);
    }

    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    revalidatePath("/");
    revalidatePath("/collection");
    revalidatePath("/collection/new-arrivals");
    revalidatePath("/collection/bestsellers");
    revalidatePath("/collection/t-shirts");
    revalidatePath("/collection/hoodies");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return { success: true, product: fullProduct };
  } catch (error) {
    console.error("Error saving product:", error);
    return { success: false, error: "Məhsulu yadda saxlamaq olmadı" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const products = await getAllProducts();
    const filtered = products.filter((p) => p.id !== productId);
    fs.writeFileSync(productsFilePath, JSON.stringify(filtered, null, 2));
    revalidatePath("/");
    revalidatePath("/collection");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Məhsulu silmək olmadı" };
  }
}

// ==================== SETTINGS API ====================

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const content = fs.readFileSync(settingsFilePath, "utf8");
    const parsed = JSON.parse(content);
    return {
      ...defaultSettings,
      ...parsed,
      announcementText: parsed.announcementText || parsed.announcement || defaultSettings.announcementText,
    };
  } catch (e) {
    return defaultSettings;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>) {
  try {
    const current = await getStoreSettings();
    const updated = { 
      ...current, 
      ...settings,
      announcementText: settings.announcementText || current.announcementText
    };
    fs.writeFileSync(settingsFilePath, JSON.stringify(updated, null, 2));
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    return { success: true, settings: updated };
  } catch (e) {
    return { success: false, error: "Parametrləri yeniləmək olmadı" };
  }
}

// ==================== 196 COUNTRIES SHIPPING RATES API ====================

export async function getShippingRates(): Promise<Record<string, number>> {
  try {
    if (!fs.existsSync(shippingRatesFilePath)) {
      const defaultRates: Record<string, number> = {};
      for (const country of COUNTRIES) {
        if (country === "Azərbaycan") defaultRates[country] = 0;
        else if (country === "Rusiya") defaultRates[country] = 20;
        else if (country === "Türkiyə" || country === "Gürcüstan") defaultRates[country] = 15;
        else defaultRates[country] = 25;
      }
      fs.writeFileSync(shippingRatesFilePath, JSON.stringify(defaultRates, null, 2), "utf8");
      return defaultRates;
    }
    const content = fs.readFileSync(shippingRatesFilePath, "utf8");
    const parsed = JSON.parse(content);
    return parsed;
  } catch (e) {
    return {};
  }
}

export async function updateShippingRatesAction(rates: Record<string, number>) {
  try {
    const current = await getShippingRates();
    const merged = { ...current, ...rates };
    fs.writeFileSync(shippingRatesFilePath, JSON.stringify(merged, null, 2), "utf8");
    revalidatePath("/checkout");
    revalidatePath("/admin/settings");
    return { success: true, rates: merged };
  } catch (e) {
    console.error("Error updating shipping rates:", e);
    return { success: false, error: "Çatdırılma qiymətlərini yadda saxlamaq olmadı" };
  }
}

// ==================== AZERBAIJAN DOMESTIC SHIPPING METHODS ====================

const defaultAzMethods: AzShippingMethod[] = [
  {
    id: "metro",
    name: "Metrolara Çatdırılma",
    description: "Bakı metrosunun istənilən stansiyasının çıxışına",
    price: 5,
    enabled: true
  },
  {
    id: "address",
    name: "Ünvana Kuryerlə Çatdırılma (Bakı daxili)",
    description: "Qapıya birbaşa kuryer vasitəsilə sürətli çatdırılma",
    price: 8,
    enabled: true
  },
  {
    id: "regions",
    name: "Azərpoçt ilə Rayonlara Çatdırılma",
    description: "Azərbaycanın bütün bölgə və kəndlərinə poçt şöbəsi vasitəsilə",
    price: 6,
    enabled: true
  },
  {
    id: "pickup",
    name: "Atelyedən Təhvil Alma (Nizami küç.)",
    description: "Bakı atelyemizə yaxınlaşaraq ödənişsiz təhvil alın",
    price: 0,
    enabled: true
  }
];

export async function getAzShippingMethods(): Promise<AzShippingMethod[]> {
  try {
    if (!fs.existsSync(azShippingMethodsFilePath)) {
      fs.writeFileSync(azShippingMethodsFilePath, JSON.stringify(defaultAzMethods, null, 2), "utf8");
      return defaultAzMethods;
    }
    const content = fs.readFileSync(azShippingMethodsFilePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    return defaultAzMethods;
  }
}

export async function updateAzShippingMethodsAction(methods: AzShippingMethod[]) {
  try {
    fs.writeFileSync(azShippingMethodsFilePath, JSON.stringify(methods, null, 2), "utf8");
    revalidatePath("/checkout");
    revalidatePath("/admin/settings");
    return { success: true, methods };
  } catch (e) {
    console.error("Error updating AZ shipping methods:", e);
    return { success: false, error: "Azərbaycan çatdırılma metodlarını yadda saxlamaq olmadı" };
  }
}

// ================= VENDOR / MULTI-VENDOR ACTIONS ================= //

export async function getVendors(): Promise<Vendor[]> {
  try {
    if (!fs.existsSync(vendorsFilePath)) {
      return [];
    }
    const content = fs.readFileSync(vendorsFilePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    console.error("Error loading vendors:", e);
    return [];
  }
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const vendors = await getVendors();
  return vendors.find((v) => v.slug === slug || v.id === slug) || null;
}

export async function saveVendorAction(vendorData: Partial<Vendor> & { name: string }) {
  try {
    const vendors = await getVendors();
    const id = vendorData.id || `vendor-${Date.now()}`;
    const slug = vendorData.slug || vendorData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const newVendor: Vendor = {
      id,
      name: vendorData.name,
      slug,
      description: vendorData.description || "",
      category: vendorData.category || "Streetwear",
      city: vendorData.city || "Bakı, Azərbaycan",
      address: vendorData.address || "",
      logo: vendorData.logo || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400&auto=format&fit=crop",
      coverImage: vendorData.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
      verified: vendorData.verified ?? true,
      featured: vendorData.featured ?? false,
      rating: vendorData.rating || 5.0,
      reviewCount: vendorData.reviewCount || 1,
      phone: vendorData.phone || "",
      whatsapp: vendorData.whatsapp || "",
      instagram: vendorData.instagram || "",
      email: vendorData.email || "",
      established: vendorData.established || new Date().getFullYear().toString(),
      status: vendorData.status || "active",
      categories: Array.isArray(vendorData.categories) ? vendorData.categories : [],
      ownerEmail: vendorData.ownerEmail || vendorData.email || "",
      ownerId: vendorData.ownerId || "",
      shippingRates: vendorData.shippingRates || {
        standardPrice: 5,
        expressPrice: 10,
        freeShippingThreshold: 100,
        deliveryTimeText: "24-48 saat ərzində",
      },
    };

    const existingIndex = vendors.findIndex((v) => v.id === id);
    if (existingIndex >= 0) {
      vendors[existingIndex] = { ...vendors[existingIndex], ...newVendor };
    } else {
      vendors.unshift(newVendor);
    }

    fs.writeFileSync(vendorsFilePath, JSON.stringify(vendors, null, 2), "utf8");
    revalidatePath("/stores");
    revalidatePath("/admin/stores");
    return { success: true, vendor: newVendor };
  } catch (e) {
    console.error("Error saving vendor:", e);
    return { success: false, error: "Mağaza məlumatlarını yadda saxlamaq olmadı" };
  }
}

export async function deleteVendorAction(id: string) {
  try {
    const vendors = await getVendors();
    const updated = vendors.filter((v) => v.id !== id);
    fs.writeFileSync(vendorsFilePath, JSON.stringify(updated, null, 2), "utf8");
    revalidatePath("/stores");
    revalidatePath("/admin/stores");
    return { success: true };
  } catch (e) {
    console.error("Error deleting vendor:", e);
    return { success: false, error: "Mağaza silinə bilmədi" };
  }
}

export async function registerVendorApplicationAction(vendorData: {
  name: string;
  category: string;
  description: string;
  city: string;
  address?: string;
  phone: string;
  email: string;
  categoriesText?: string;
  categories?: string[];
  logo?: string;
  coverImage?: string;
  ownerEmail?: string;
  ownerId?: string;
}) {
  try {
    const vendors = await getVendors();
    const id = `vendor-${Date.now()}`;
    const slug = vendorData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const textCategories = (vendorData.categoriesText || "")
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const categoriesArray = Array.from(
      new Set([
        ...(Array.isArray(vendorData.categories) ? vendorData.categories : []),
        ...textCategories
      ])
    );

    const newVendor: Vendor = {
      id,
      name: vendorData.name.trim(),
      slug,
      description: vendorData.description.trim(),
      category: vendorData.category.trim() || "Streetwear",
      city: vendorData.city.trim() || "Bakı, Azərbaycan",
      address: vendorData.address?.trim() || "",
      phone: vendorData.phone.trim(),
      email: vendorData.email.trim(),
      ownerEmail: (vendorData.ownerEmail || vendorData.email).trim().toLowerCase(),
      ownerId: vendorData.ownerId?.trim() || "",
      logo: vendorData.logo?.trim() || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400&auto=format&fit=crop",
      coverImage: vendorData.coverImage?.trim() || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
      verified: false,
      featured: false,
      rating: 5.0,
      reviewCount: 0,
      established: new Date().getFullYear().toString(),
      status: "pending", // Waiting for admin approval! Only active stores appear on public showcase
      categories: categoriesArray,
    };

    vendors.unshift(newVendor);
    fs.writeFileSync(vendorsFilePath, JSON.stringify(vendors, null, 2), "utf8");
    revalidatePath("/stores");
    revalidatePath("/admin/stores");
    return { success: true, vendor: newVendor };
  } catch (e) {
    console.error("Error submitting vendor application:", e);
    return { success: false, error: "Müraciət qeydə alınmadı" };
  }
}

export async function updateVendorStatusAction(
  id: string, 
  status: "active" | "pending" | "suspended" | "rejected", 
  verified?: boolean,
  reason?: string
) {
  try {
    const vendors = await getVendors();
    const vendorIndex = vendors.findIndex((v) => v.id === id);
    if (vendorIndex === -1) {
      return { success: false, error: "Mağaza tapılmadı" };
    }

    const currentVendor = vendors[vendorIndex];
    currentVendor.status = status;
    if (verified !== undefined) {
      currentVendor.verified = verified;
    }
    if (reason !== undefined) {
      currentVendor.rejectionReason = reason;
    }

    fs.writeFileSync(vendorsFilePath, JSON.stringify(vendors, null, 2), "utf8");

    // When store is approved (status becomes 'active'):
    // 1. Create or activate the vendor account in users.json
    // 2. Dispatch / log email notification to the store owner
    if (status === "active") {
      const targetEmail = (currentVendor.ownerEmail || currentVendor.email || "").trim().toLowerCase();
      if (targetEmail) {
        try {
          const users = await getUserAccounts();
          const existingUserIdx = users.findIndex(
            (u) => u.email.toLowerCase() === targetEmail || 
                   (currentVendor.slug && u.ownedStoreSlug === currentVendor.slug)
          );

          if (existingUserIdx >= 0) {
            // Upgrade existing user to vendor role
            users[existingUserIdx].role = "vendor";
            users[existingUserIdx].status = "active";
            users[existingUserIdx].ownedStoreSlug = currentVendor.slug;
            users[existingUserIdx].ownedStoreName = currentVendor.name;
          } else {
            // Provision new vendor user account so they can log in immediately
            const username = (currentVendor.slug || targetEmail.split("@")[0]).replace(/[^a-z0-9_]/g, "_");
            const newVendorUser: UserAccount = {
              id: `usr_vendor_${currentVendor.slug || Date.now()}`,
              name: currentVendor.name,
              username,
              email: targetEmail,
              password: "password123", // Default password provided in welcome email
              avatar: currentVendor.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentVendor.name)}&backgroundColor=07241a`,
              role: "vendor",
              status: "active",
              createdAt: new Date().toISOString(),
              ownedStoreSlug: currentVendor.slug,
              ownedStoreName: currentVendor.name,
            };
            users.push(newVendorUser);
          }

          fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
          revalidatePath("/admin/users");
        } catch (uErr) {
          console.error("Error creating/activating vendor user account:", uErr);
        }

        // SIMULATED EMAIL DISPATCH: Send confirmation email to vendor owner
        console.log(`
============================================================
📧 [EMAIL DISPATCH - TERZME ADMIN NOTIFICATION]
Kimə: ${targetEmail}
Mövzu: Təbriklər! "${currentVendor.name}" Mağazanız Təsdiqləndi!
Məzmun:
Salam, ${currentVendor.name}!
Müraciətiniz TERZME Baş İnzibatçısı tərəfindən uğurla təsdiqləndi.
Artıq mağazanız canlı vitrində aktivdir və şəxsi idarəetmə panelinizə daxil ola bilərsiniz:
Keçid linki: http://localhost:3005/admin/stores/${currentVendor.slug}
İstifadəçi adı / Email: ${targetEmail}
Şifrə: password123 (və ya Google ilə daxil olun)
============================================================
        `);
      }
    }

    revalidatePath("/stores");
    revalidatePath("/admin/stores");
    return { success: true, vendor: currentVendor };
  } catch (e) {
    console.error("Error updating vendor status:", e);
    return { success: false, error: "Status yenilənə bilmədi" };
  }
}

// ================= USER MANAGEMENT ACTIONS (SUPER ADMIN) ================= //

const ADMIN_DEFAULT_EMAIL = process.env.ADMIN_EMAIL || "admin@platform.local";
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "terzme1234";

const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: "usr_super_admin",
    name: "Super Admin",
    username: "admin",
    email: ADMIN_DEFAULT_EMAIL,
    password: ADMIN_DEFAULT_PASSWORD,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=07241a",
    role: "admin",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr_vendor_stx",
    name: "STX Studio",
    username: "stx",
    email: "iamgazanfar@gmail.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=STX&backgroundColor=07241a",
    role: "vendor",
    status: "active",
    createdAt: "2026-01-15T00:00:00.000Z",
    ownedStoreSlug: "stx",
    ownedStoreName: "stx",
  },
  {
    id: "usr_vendor_terzme",
    name: "TERZME Store",
    username: "terzme_store",
    email: "store@terzme.az",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TERZME&backgroundColor=07241a",
    role: "vendor",
    status: "active",
    createdAt: "2026-01-10T00:00:00.000Z",
    ownedStoreSlug: "terzme-store",
    ownedStoreName: "TERZME STORE",
  },
  {
    id: "usr_vendor_aggara",
    name: "AG'GARA Studio",
    username: "aggara",
    email: "info@aggara.az",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AGGARA&backgroundColor=07241a",
    role: "vendor",
    status: "active",
    createdAt: "2026-01-20T00:00:00.000Z",
    ownedStoreSlug: "ag-gara",
    ownedStoreName: "AG'GARA",
  },
  {
    id: "usr_customer_gazanfar",
    name: "Qəzənfər Yusifli",
    username: "gazanfar",
    email: "gazanfar@terzme.com",
    password: "gazanfar123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Gazanfar&backgroundColor=07241a",
    role: "customer",
    status: "active",
    createdAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "usr_customer_aydan",
    name: "Aydan Əliyeva",
    username: "aydan",
    email: "aydan@gmail.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Aydan&backgroundColor=07241a",
    role: "customer",
    status: "active",
    createdAt: "2026-02-14T10:30:00.000Z",
  }
];

export async function getUserAccounts(): Promise<UserAccount[]> {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify(INITIAL_USER_ACCOUNTS, null, 2), "utf8");
      return INITIAL_USER_ACCOUNTS;
    }
    const content = fs.readFileSync(usersFilePath, "utf8");
    const parsed: UserAccount[] = JSON.parse(content);
    // Ensure Super Admin exists from ENV
    const adminExists = parsed.some((u) => u.email.toLowerCase() === ADMIN_DEFAULT_EMAIL.toLowerCase());
    if (!adminExists) {
      parsed.unshift(INITIAL_USER_ACCOUNTS[0]);
      fs.writeFileSync(usersFilePath, JSON.stringify(parsed, null, 2), "utf8");
    }
    return parsed;
  } catch (e) {
    console.error("Error reading users:", e);
    return INITIAL_USER_ACCOUNTS;
  }
}

export async function saveUserAccountAction(user: Partial<UserAccount> & { email: string }) {
  try {
    const users = await getUserAccounts();
    const email = user.email.trim().toLowerCase();
    const id = user.id || `usr_${Date.now()}`;
    const username = (user.username || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "_");

    const fullUser: UserAccount = {
      id,
      name: user.name?.trim() || username,
      username,
      email,
      password: user.password || "password123",
      avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || username)}&backgroundColor=07241a`,
      role: user.role || "customer",
      status: user.status || "active",
      createdAt: user.createdAt || new Date().toISOString(),
      ownedStoreSlug: user.ownedStoreSlug,
      ownedStoreName: user.ownedStoreName,
    };

    const idx = users.findIndex((u) => u.id === id || u.email.toLowerCase() === email);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...fullUser };
    } else {
      users.push(fullUser);
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
    revalidatePath("/admin/users");
    revalidatePath("/admin/customers");
    return { success: true, user: fullUser };
  } catch (e) {
    console.error("Error saving user account:", e);
    return { success: false, error: "İstifadəçi məlumatlarını yadda saxlamaq olmadı" };
  }
}

export async function updateUserRoleAndStatusAction(
  userId: string, 
  data: { role?: UserRole; status?: "active" | "suspended"; ownedStoreSlug?: string; ownedStoreName?: string }
) {
  try {
    const users = await getUserAccounts();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return { success: false, error: "İstifadəçi tapılmadı" };
    }

    if (data.role) users[idx].role = data.role;
    if (data.status) {
      users[idx].status = data.status;
      
      // If this user is a vendor or owns a store, synchronize the store's status as well!
      // When suspended, the store must not show up on the public site!
      const storeSlug = users[idx].ownedStoreSlug;
      const userEmail = users[idx].email.toLowerCase().trim();
      try {
        const vendors = await getVendors();
        let vendorUpdated = false;
        const newVendorStatus = data.status === "active" ? "active" : "suspended";

        for (const v of vendors) {
          const vSlug = (v.slug || "").toLowerCase().trim();
          const vEmail = (v.email || "").toLowerCase().trim();
          const vOwner = (v.ownerEmail || "").toLowerCase().trim();

          if (
            (storeSlug && vSlug === storeSlug.toLowerCase().trim()) ||
            vEmail === userEmail ||
            vOwner === userEmail
          ) {
            v.status = newVendorStatus;
            vendorUpdated = true;
          }
        }

        if (vendorUpdated) {
          fs.writeFileSync(vendorsFilePath, JSON.stringify(vendors, null, 2), "utf8");
          revalidatePath("/stores");
          revalidatePath("/admin/stores");
          revalidatePath("/");
        }
      } catch (err) {
        console.error("Error synchronizing vendor store status:", err);
      }
    }
    if (data.ownedStoreSlug !== undefined) users[idx].ownedStoreSlug = data.ownedStoreSlug;
    if (data.ownedStoreName !== undefined) users[idx].ownedStoreName = data.ownedStoreName;

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
    revalidatePath("/admin/users");
    revalidatePath("/admin/customers");
    revalidatePath("/stores");
    revalidatePath("/");
    return { success: true, user: users[idx] };
  } catch (e) {
    console.error("Error updating user status:", e);
    return { success: false, error: "İstifadəçi yenilənmədi" };
  }
}

export async function deleteUserAccountAction(userId: string) {
  try {
    const users = await getUserAccounts();
    const updated = users.filter((u) => u.id !== userId);
    fs.writeFileSync(usersFilePath, JSON.stringify(updated, null, 2), "utf8");
    revalidatePath("/admin/users");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (e) {
    console.error("Error deleting user:", e);
    return { success: false, error: "İstifadəçi silinmədi" };
  }
}


