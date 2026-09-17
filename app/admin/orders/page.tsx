"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders, updateOrderStatusAction, deleteOrderAction, clearAllOrdersAction, Order } from "@/app/actions";
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  MapPin, 
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
  Store,
  Trash2
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [storeFilter, setStoreFilter] = useState<string>("all");

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingId(orderId);
    await updateOrderStatusAction(orderId, newStatus);
    await fetchOrders();
    setUpdatingId(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Bu sifarişi silmək istədiyinizdən əminsiniz?")) return;
    setUpdatingId(orderId);
    await deleteOrderAction(orderId);
    await fetchOrders();
    setUpdatingId(null);
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm("BÜTÜN sifarişləri bazadan həmişəlik silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarılmır!")) return;
    setLoading(true);
    await clearAllOrdersAction();
    await fetchOrders();
    setLoading(false);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Qəbul edildi":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Clock,
        };
      case "Hazırlanır":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: RefreshCw,
        };
      case "Çatdırılmada":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: Truck,
        };
      case "Təhvil verildi":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };
      default:
        return {
          bg: "bg-neutral-100 text-neutral-600 border-neutral-200",
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <span>Sifarişlərin İdarə Edilməsi</span>
            <span>•</span>
            <span>{orders.length} Sifariş</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
            Müştəri Sifarişləri
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {orders.length > 0 && (
            <button
              onClick={handleClearAllOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-mono text-xs hover:bg-red-100 transition-all shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bütün Sifarişləri Sil ({orders.length})
            </button>
          )}

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-mono text-xs hover:bg-neutral-50 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-neutral-950" : ""}`} />
            Yenilə
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sifariş ID, izləmə kodu və ya müştəri axtar..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono focus:outline-none focus:border-neutral-900 transition-all"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-neutral-400 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
          >
            <option value="all">Bütün Statuslar</option>
            <option value="Qəbul edildi">Qəbul edildi</option>
            <option value="Hazırlanır">Hazırlanır</option>
            <option value="Çatdırılmada">Çatdırılmada</option>
            <option value="Təhvil verildi">Təhvil verildi</option>
          </select>

          <span className="text-[11px] font-mono text-neutral-400 uppercase">Mağaza:</span>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
          >
            <option value="all">Bütün Mağazalar</option>
            <option value="terzme-store">TERZME STORE</option>
            <option value="stx">stx</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders
          .filter((order) => {
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = 
              !q ||
              order.id.toLowerCase().includes(q) ||
              order.trackingCode.toLowerCase().includes(q) ||
              order.customer.fullName.toLowerCase().includes(q) ||
              order.customer.phone.includes(q);

            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            const matchesStore = storeFilter === "all" || (order.items || []).some(
              (it) => it.storeId === storeFilter || (!it.storeId && storeFilter === "terzme-store")
            );

            return matchesSearch && matchesStatus && matchesStore;
          })
          .length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white text-neutral-400">
            <ShoppingCart className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="font-mono text-sm">Axtarışa uyğun sifariş tapılmadı.</p>
          </div>
        ) : (
          orders
            .filter((order) => {
              const q = searchQuery.toLowerCase().trim();
              const matchesSearch = 
                !q ||
                order.id.toLowerCase().includes(q) ||
                order.trackingCode.toLowerCase().includes(q) ||
                order.customer.fullName.toLowerCase().includes(q) ||
                order.customer.phone.includes(q);

              const matchesStatus = statusFilter === "all" || order.status === statusFilter;
              const matchesStore = storeFilter === "all" || (order.items || []).some(
                (it) => it.storeId === storeFilter || (!it.storeId && storeFilter === "terzme-store")
              );

              return matchesSearch && matchesStatus && matchesStore;
            })
            .map((order) => {
            const statusConfig = getStatusBadge(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="p-6 rounded-2xl border border-neutral-200/80 bg-white shadow-sm hover:border-neutral-300 transition-all space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-base text-neutral-950">
                      #{order.id}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-600 px-2.5 py-0.5 rounded-lg bg-neutral-100 border border-neutral-200">
                      İzləmə: {order.trackingCode}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {new Date(order.createdAt).toLocaleString("az-AZ")}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${statusConfig.bg}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${order.status === "Hazırlanır" ? "animate-spin" : ""}`} />
                        {order.status}
                      </span>
                    </div>

                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900 cursor-pointer"
                    >
                      <option value="Qəbul edildi">Qəbul edildi</option>
                      <option value="Hazırlanır">Hazırlanır</option>
                      <option value="Çatdırılmada">Çatdırılmada</option>
                      <option value="Təhvil verildi">Təhvil verildi</option>
                    </select>

                    <Link
                      href={`/track?code=${order.trackingCode}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-950 transition-colors"
                      title="Müştəri izləmə səhifəsinə bax"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={updatingId === order.id}
                      className="p-2 rounded-xl bg-neutral-50 hover:bg-red-50 border border-neutral-200 hover:border-red-200 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Sifarişi sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                      Müştəri Məlumatları
                    </p>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-neutral-900 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        {order.customer.fullName}
                      </p>
                      <p className="text-neutral-600 font-mono flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {order.customer.phone}
                      </p>
                      <p className="text-neutral-600 flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{order.customer.address}, {order.customer.city}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 md:col-span-2">
                    <p className="text-[10px] font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                      Sifariş Edilən Məhsullar
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-neutral-900">{item.name}</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-200/80 text-neutral-700">
                              <Store className="w-2.5 h-2.5" />
                              {item.storeName || (item.storeId === "stx" ? "stx" : "TERZME STORE")}
                            </span>
                            {item.size && (
                              <span className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-neutral-600 border border-neutral-200">
                                {item.size}
                              </span>
                            )}
                            <span className="text-neutral-400 font-mono">× {item.quantity}</span>
                          </div>
                          <span className="font-mono font-bold text-neutral-950">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-2 text-xs border-t border-neutral-100 font-mono">
                        <span className="text-neutral-500">Yekun Məbləğ:</span>
                        <span className="text-base font-black text-neutral-950">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
