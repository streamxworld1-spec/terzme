import React from "react";
import Link from "next/link";
import { getOrders, getAllProducts, getStoreSettings, getVendors, getUserAccounts } from "@/app/actions";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ChevronRight,
  Settings,
  ExternalLink,
  Store,
  ShieldCheck
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products, settings, vendors, users] = await Promise.all([
    getOrders(),
    getAllProducts(),
    getStoreSettings(),
    getVendors(),
    getUserAccounts(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const uniqueCustomers = users.filter((u) => u.role === "customer").length;
  const activeStores = vendors.filter((v) => v.status === "active").length;
  const pendingStoreList = vendors.filter((v) => v.status === "pending");
  const pendingStores = pendingStoreList.length;
  const pendingOrders = orders.filter((o) => o.status !== "Təhvil verildi");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm border border-neutral-200/80 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 mb-3">
              BAKU ATELIER BACKOFFICE • 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-grotesk text-neutral-950 uppercase tracking-tight">
              TERZME İDARƏETMƏ PANELİ
            </h1>
            <p className="text-xs sm:text-sm font-sans text-neutral-600 mt-1.5 max-w-2xl leading-relaxed">
              Məhsul kataloqu, real-vaxt sifariş statusları, müştəri bazası və maliyyə analitikasını vahid məkandan idarə edin.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Comprehensive Super Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              ÜMUMİ GƏLİR
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-neutral-950">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5 block">
              ↑ Canlı sifarişlər
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              SİFARİŞLƏR
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-neutral-950">
              {orders.length}
            </h3>
            <span className="text-[10px] font-mono text-neutral-500 font-bold mt-0.5 block">
              {pendingOrders.length} aktiv icrada
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              MƏHSULLAR
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-neutral-950">
              {products.length}
            </h3>
            <span className="text-[10px] font-mono text-neutral-500 font-bold mt-0.5 block">
              Bütün mağazalar
            </span>
          </div>
        </div>

        {/* Total Stores */}
        <div className="rounded-2xl p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              MAĞAZALAR
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-neutral-950">
              {vendors.length}
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5 block">
              {activeStores} aktiv / {pendingStores} gözləyən
            </span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="rounded-2xl p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              İSTİFADƏÇİLƏR
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-neutral-950">
              {users.length}
            </h3>
            <span className="text-[10px] font-mono text-purple-600 font-bold mt-0.5 block">
              RBAC qeydiyyatı
            </span>
          </div>
        </div>

        {/* Platform Status */}
        <div className="rounded-2xl p-5 bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              SİSTEM QORUMASI
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-emerald-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              100%
            </h3>
            <span className="text-[10px] font-mono text-neutral-500 font-bold mt-0.5 block">
              İzolyasiya aktivdir
            </span>
          </div>
        </div>
      </div>

      {/* NEW: PENDING STORE APPLICATIONS (TƏZƏ MÜRACİƏTLƏR) */}
      {pendingStores > 0 && (
        <div className="rounded-2xl p-6 sm:p-8 bg-amber-50/60 border border-amber-300 shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black font-grotesk text-neutral-950 uppercase tracking-tight">
                    Yeni Mağaza Müraciətləri
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-mono font-bold">
                    {pendingStores} Gözləmədə
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-sans mt-0.5">
                  Təsdiq gözləyən yeni tərəfdaş mağaza müraciətləri. Təsdiqlədikdə canlı vitrinə buraxılır və mağaza sahibinə təsdiq emaili göndərilir.
                </p>
              </div>
            </div>

            <Link
              href="/admin/stores?status=pending"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#07241A] hover:bg-[#051A13] text-white text-xs font-mono font-bold uppercase rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              <span>Müraciətləri İncələ ({pendingStores})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingStoreList.slice(0, 3).map((v) => (
              <div 
                key={v.id}
                className="p-4 bg-white border border-amber-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-neutral-900 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-neutral-100">
                    <img src={v.logo} alt={v.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h4 className="text-sm font-black font-display text-neutral-950 uppercase truncate">
                      {v.name}
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-500 block truncate">
                      {v.ownerEmail || v.email}
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 font-bold block mt-0.5">
                      📍 {v.city || "Bakı"} • {v.category}
                    </span>
                  </div>
                </div>

                <Link
                  href="/admin/stores?status=pending"
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-mono font-bold shrink-0 transition-colors shadow-2xs"
                >
                  Təsdiq Et
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column: Recent Orders & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders List */}
        <div className="lg:col-span-8 rounded-2xl p-6 sm:p-8 bg-white border border-neutral-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-black font-grotesk text-neutral-950 uppercase">
                Son Sifarişlər
              </h2>
              <span className="text-xs font-mono text-neutral-500">
                Canlı bazadan dərhal sinxronizasiya
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200">
              {orders.length} Sifariş
            </span>
          </div>

          <div className="divide-y divide-neutral-100 mt-2">
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400 font-mono">
                Hələ ki heç bir sifariş yoxdur.
              </div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-mono font-bold text-xs shrink-0 border border-neutral-200">
                      <Package className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-950 font-grotesk">
                          {order.customer.fullName}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 font-semibold">
                          #{order.id}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 block mt-0.5">
                        {order.items.map((it) => it.name).join(", ")} • {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-mono font-black text-sm text-neutral-950">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      order.status === "Təhvil verildi"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : order.status === "Çatdırılmada"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : order.status === "Hazırlanır"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {order.status}
                    </span>
                    <Link
                      href={`/admin/orders`}
                      className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Management Cards */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Menu Card */}
          <div className="rounded-2xl p-6 bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-black font-grotesk uppercase text-neutral-950 mb-3 tracking-wider">
              Sürətli Keçidlər
            </h3>

            <Link
              href="/admin/products"
              className="p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/70 flex items-center justify-between text-xs font-mono font-bold text-neutral-900 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-neutral-600" />
                <span>Məhsul Kataloqu</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>



            <Link
              href="/admin/settings"
              className="p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/70 flex items-center justify-between text-xs font-mono font-bold text-neutral-900 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-neutral-600" />
                <span>Mağaza Tənzimləmələri</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>

          {/* Settings Snippet */}
          <div className="rounded-2xl p-6 bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
              Elan Paneli Statusu
            </span>
            <p className="text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/70 font-mono">
              {settings.announcementText ? `"${settings.announcementText}"` : "Elan lenti deaktivdir (gizlədilib)"}
            </p>
            <div className="flex justify-between items-center text-xs font-mono pt-2">
              <span className="text-neutral-500">Çatdırılma Xidməti:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">196 Ölkə Aktivdir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
