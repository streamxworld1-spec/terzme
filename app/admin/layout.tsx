"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight, 
  Menu, 
  X, 
  Store,
  ArrowLeft
} from "lucide-react";
import { Vendor } from "@/app/actions";
import { useAuth } from "@/context/AuthContext";
import { VendorAdminAuthGuard } from "@/components/VendorAdminAuthGuard";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    fetch("/api/vendors")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVendors(data);
      })
      .catch(() => {});
  }, []);

  // Check if current route is a specific store's personal panel: /admin/stores/[slug]
  const storeAdminMatch = pathname.match(/^\/admin\/stores\/([a-zA-Z0-9_-]+)/);
  const storeSlug = storeAdminMatch ? storeAdminMatch[1] : null;
  const currentVendor = storeSlug ? vendors.find((v) => v.slug === storeSlug || v.id === storeSlug) : null;

  // STRICT MUTUAL ISOLATION:
  // 1. Is user logged in?
  // 2. Master admin ONLY has access to Global Admin (/admin, /admin/products, /admin/stores, etc.)
  //    Master admin CANNOT access personal vendor store panels (/admin/stores/[slug])
  // 3. Each Vendor ONLY has access to their OWN store panel (/admin/stores/[slug])
  //    Vendors CANNOT access Global Admin and CANNOT access other vendors' store panels
  const userEmail = (user?.email || "").toLowerCase().trim();
  const isMasterAdmin = 
    user?.role === "admin" ||
    userEmail === "admin@platform.local" ||
    userEmail === "admin@terzme.com" ||
    userEmail === "yusifligazanfar@gmail.com" ||
    userEmail.includes("gazanfar") ||
    user?.username === "admin" ||
    user?.username === "gazanfar";

  let isAuthorized = false;
  if (user) {
    if (currentVendor) {
      // PERSONAL VENDOR STORE PANEL (/admin/stores/[slug]):
      // Allowed for:
      // 1. Master Admin (can oversee and configure any store)
      // 2. The specific vendor owner (matching email, ownerEmail, ownedStoreSlug, or store username)
      if (isMasterAdmin) {
        isAuthorized = true;
      } else {
        const vEmail = (currentVendor.email || "").toLowerCase().trim();
        const vOwnerEmail = (currentVendor.ownerEmail || "").toLowerCase().trim();
        const vSlug = currentVendor.slug.toLowerCase().trim();
        const uName = (user.username || "").toLowerCase().trim();
        const uStoreSlug = (user.ownedStoreSlug || "").toLowerCase().trim();

        if (
          (vEmail && userEmail === vEmail) ||
          (vOwnerEmail && userEmail === vOwnerEmail) ||
          (uStoreSlug && uStoreSlug === vSlug) ||
          uName === vSlug ||
          userEmail.split("@")[0] === vSlug ||
          (vEmail && vEmail.split("@")[0] === uName)
        ) {
          isAuthorized = true;
        }
      }
    } else {
      // GLOBAL ADMIN PANEL (/admin, /admin/products, /admin/orders, etc.):
      // STRICT RULE: ONLY Master Admin has access. Vendors have NO access to global admin.
      if (isMasterAdmin) {
        isAuthorized = true;
      }
    }
  }

  const pendingVendorCount = vendors.filter((v) => v.status === "pending").length;

  // Global Admin Nav Items
  const GLOBAL_NAV_ITEMS = [
    { name: "İdarə Paneli", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "İstifadəçilər (Users)", href: "/admin/users", icon: Users },
    { 
      name: "Mağazalar (Vendorlar)", 
      href: "/admin/stores", 
      icon: Store,
      badge: pendingVendorCount > 0 ? `${pendingVendorCount} yeni` : undefined,
      badgeColor: "bg-amber-400 text-neutral-950 font-bold"
    },
    { name: "Məhsullar", href: "/admin/products", icon: ShoppingBag },
    { name: "Tənzimləmələr", href: "/admin/settings", icon: Settings },
  ];

  // Store-Specific Admin Nav Items (when inside /admin/stores/[slug])
  const STORE_NAV_ITEMS = storeSlug ? [
    { name: "İdarə Paneli", href: `/admin/stores/${storeSlug}?tab=dashboard`, icon: LayoutDashboard, tab: "dashboard" },
    { name: "Məhsullar", href: `/admin/stores/${storeSlug}?tab=products`, icon: ShoppingBag, tab: "products" },
    { name: "Sifarişlər", href: `/admin/stores/${storeSlug}?tab=orders`, icon: ShoppingCart, tab: "orders" },
    { name: "Müştərilər", href: `/admin/stores/${storeSlug}?tab=customers`, icon: Users, tab: "customers" },
    { name: "Analitika", href: `/admin/stores/${storeSlug}?tab=analytics`, icon: BarChart3, tab: "analytics" },
    { name: "Tənzimləmələr", href: `/admin/stores/${storeSlug}?tab=settings`, icon: Settings, tab: "settings" },
  ] : [];

  const navItems = storeSlug ? STORE_NAV_ITEMS : GLOBAL_NAV_ITEMS;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col md:flex-row antialiased font-sans selection:bg-neutral-900 selection:text-white">
      {/* Mobile Topbar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href={storeSlug ? `/admin/stores/${storeSlug}` : "/admin"} className="flex items-center gap-2.5">
          {currentVendor ? (
            <>
              <div className="w-8 h-8 rounded-xl bg-[#07241A] text-white font-black flex items-center justify-center text-xs tracking-tighter shadow-sm overflow-hidden shrink-0">
                {currentVendor?.logo ? (
                  <img src={currentVendor.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  "TZ"
                )}
              </div>
              <div className="leading-none">
                <span className="font-bold text-xs tracking-wider text-neutral-950 uppercase block">
                  {currentVendor.name}
                </span>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-mono block">
                  Mağaza Paneli
                </span>
              </div>
            </>
          ) : (
            <div className="py-1">
              <img
                src="/trz-logo-dark.png"
                alt="TERZME"
                className="h-7 w-auto object-contain"
              />
            </div>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:scale-95 transition-all"
            aria-label="Menyunu Aç/Bağla"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Backdrop & Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Brand */}
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#07241A] text-white font-black flex items-center justify-center text-sm shadow-sm overflow-hidden">
                    {currentVendor?.logo ? (
                      <img src={currentVendor.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      "TZ"
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-wider text-neutral-950 uppercase block line-clamp-1">
                      {currentVendor ? currentVendor.name : "TERZME"}
                    </span>
                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-mono block">
                      {currentVendor ? "Mağaza Paneli" : "Admin Ekosistem"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="p-4 space-y-1.5">
                <p className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-semibold">
                  Menyu
                </p>
                {navItems.map((item: any) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-neutral-500" />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${item.badgeColor || 'bg-amber-100 text-amber-900 font-bold'}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-100 space-y-2.5">
              <Link
                href={currentVendor ? `/stores/${currentVendor.slug}` : "/"}
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  {currentVendor ? "Mağazanın Vitrininə Bax" : "Mağazaya Bax"}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {currentVendor ? `/stores/${currentVendor.slug}` : "/"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200/80 flex-col justify-between shrink-0 shadow-sm min-h-screen sticky top-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <Link 
              href={storeSlug ? `/admin/stores/${storeSlug}` : "/admin"} 
              className="group flex items-center gap-3 w-full"
            >
              {currentVendor ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-[#07241A] text-white font-black flex items-center justify-center text-sm tracking-tighter shadow-md shadow-neutral-950/10 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                    {currentVendor.logo ? (
                      <img src={currentVendor.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      "TZ"
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm tracking-wider text-neutral-950 uppercase block leading-tight truncate">
                      {currentVendor.name}
                    </span>
                    <span className="text-[10px] tracking-widest text-emerald-800 uppercase font-mono block font-bold">
                      Mağaza Paneli
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-2 flex items-center">
                  <img
                    src="/trz-logo-dark.png"
                    alt="TERZME"
                    className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-85 transition-opacity"
                  />
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Links - IDENTICAL MENU FOR EACH STORE OR GLOBAL ADMIN */}
          <nav className="p-4 space-y-1">
            <p className="px-3 py-2 text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-semibold">
              Menyu
            </p>
            {navItems.map((item: any) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name + item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900" />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${item.badgeColor || 'bg-amber-100 text-amber-900 font-bold'}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-100 space-y-2.5">
          <Link
            href={currentVendor ? `/stores/${currentVendor.slug}` : "/"}
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80 transition-colors border border-neutral-200/60"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              {currentVendor ? "Mağazanın Vitrininə Bax" : "Mağazaya Bax"}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {currentVendor ? `/${currentVendor.slug}` : "/store"}
            </span>
          </Link>

          <div className="px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-7 h-7 rounded-full border border-emerald-500 shrink-0 object-cover" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              )}
              <div className="text-[11px] leading-snug min-w-0">
                <p className="font-semibold text-neutral-900 truncate">
                  {user?.name || (currentVendor ? currentVendor.name : "Baş İnzibatçı")}
                </p>
                <p className="text-neutral-500 text-[10px] font-mono truncate">
                  {user?.email || currentVendor?.email || "admin@terzme.az"}
                </p>
              </div>
            </div>

            {user && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg bg-neutral-200/70 hover:bg-red-50 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                title="Hesabdan çıxış et"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto max-h-screen p-4 sm:p-6 md:p-10 relative">
        {/* If not authorized with valid Gmail, show Guard Modal */}
        {!isAuthorized && (
          <VendorAdminAuthGuard vendor={currentVendor || null} />
        )}
        {children}
      </main>
    </div>
  );
}
