import { getOrders, getAllProducts } from "@/app/actions";
import { BarChart3, TrendingUp, DollarSign, Package, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [orders, products] = await Promise.all([getOrders(), getAllProducts()]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Category sales breakdown
  const categoryCounts: Record<string, number> = {};
  orders.forEach((o) => {
    o.items?.forEach((it) => {
      const prod = products.find((p) => p.name === it.name);
      const cat = prod?.category || "Digər";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + it.quantity;
    });
  });

  // Status breakdown
  const statusCounts: Record<string, number> = {
    "Qəbul edildi": 0,
    "Hazırlanır": 0,
    "Çatdırılmada": 0,
    "Təhvil verildi": 0,
  };
  orders.forEach((o) => {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status] += 1;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
          <span>Maliyyə və Satış İcmalı</span>
          <span>•</span>
          <span>Performans Göstəriciləri</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
          Biznes Analitikası
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Ümumi Dövriyyə</p>
          <p className="text-3xl font-bold text-neutral-950 mt-1">${totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] font-mono text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +100% Canlı data
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Orta Sifariş Dəyəri (AOV)</p>
          <p className="text-3xl font-bold text-neutral-950 mt-1">${avgOrderValue.toFixed(2)}</p>
          <p className="text-[11px] font-mono text-neutral-400 mt-2">Hər səbət üzrə</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Tamamlanmış Sifarişlər</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {statusCounts["Təhvil verildi"] || 0}
          </p>
          <p className="text-[11px] font-mono text-neutral-400 mt-2">
            {orders.length > 0 ? (((statusCounts["Təhvil verildi"] || 0) / orders.length) * 100).toFixed(0) : 0}% Uğur dərəcəsi
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Aktiv Məhsul Çeşidi</p>
          <p className="text-3xl font-bold text-neutral-950 mt-1">{products.length}</p>
          <p className="text-[11px] font-mono text-neutral-400 mt-2">Kataloqda satışda</p>
        </div>
      </div>

      {/* Grid: Categories and Order Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
            <Package className="w-4 h-4 text-neutral-500" />
            Kateqoriyalar üzrə Satış Həcmi
          </h2>

          <div className="space-y-4">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono">Hələ heç bir məhsul satışı olmayıb.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, qty]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-800 font-medium">{cat}</span>
                    <span className="text-neutral-500">{qty} ədəd</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-neutral-950 rounded-full"
                      style={{ width: `${Math.min(100, (qty / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order status distribution */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 font-mono flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neutral-500" />
            Sifarişlərin Status Bölgüsü
          </h2>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-100"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span className="text-xs text-neutral-900 font-medium">{status}</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-950">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
