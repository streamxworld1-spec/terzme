import { getOrders } from "@/app/actions";
import { Users, Phone, MapPin, DollarSign, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const orders = await getOrders();

  // Aggregate customers by phone or email
  const customerMap = new Map<string, {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    totalSpent: number;
    ordersCount: number;
    lastOrderDate: string;
  }>();

  orders.forEach((order) => {
    const key = order.customer.phone || order.customer.email || order.customer.fullName;
    if (!key) return;

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        email: order.customer.email || "—",
        address: order.customer.address,
        city: order.customer.city,
        totalSpent: order.totalAmount,
        ordersCount: 1,
        lastOrderDate: order.createdAt,
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.totalSpent += order.totalAmount;
      existing.ordersCount += 1;
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
      }
    }
  });

  const customers = Array.from(customerMap.values());

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <span>CRM & Müştəri Portalı</span>
            <span>•</span>
            <span>{customers.length} Qeydiyyatlı Müştəri</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
            Müştəri Bazası
          </h1>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Unikal Müştəri Sayı</p>
          <p className="text-3xl font-bold text-neutral-950 mt-1">{customers.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Müştəri Başına Orta Xərc</p>
          <p className="text-3xl font-bold text-neutral-950 mt-1">
            ${customers.length > 0 ? (customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length).toFixed(1) : 0}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Ümumi Sifarişlərin Sayı</p>
          <p className="text-3xl font-bold text-neutral-950 mt-1">{orders.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Müştəri</th>
                <th className="py-3.5 px-4">Əlaqə</th>
                <th className="py-3.5 px-4">Ünvan</th>
                <th className="py-3.5 px-4">Sifariş Sayı</th>
                <th className="py-3.5 px-4">Ümumi Xərc</th>
                <th className="py-3.5 px-5">Son Sifariş</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 font-mono">
                    Hələ heç bir müştəri qeydə alınmayıb.
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr key={i} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-5 font-semibold text-neutral-900">
                      {c.fullName}
                    </td>
                    <td className="py-4 px-4 font-mono text-neutral-700">
                      <div>{c.phone}</div>
                      {c.email !== "—" && <div className="text-[10px] text-neutral-400">{c.email}</div>}
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {c.address}, {c.city}
                    </td>
                    <td className="py-4 px-4 font-mono text-neutral-950 font-bold">
                      {c.ordersCount}
                    </td>
                    <td className="py-4 px-4 font-mono text-emerald-600 font-bold">
                      ${c.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 font-mono text-neutral-400 text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString("az-AZ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
