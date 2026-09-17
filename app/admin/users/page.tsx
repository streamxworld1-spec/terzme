"use client";

import React, { useState, useEffect } from "react";
import { 
  UserAccount, 
  getUserAccounts, 
  updateUserRoleAndStatusAction, 
  deleteUserAccountAction, 
  UserRole 
} from "@/app/actions";
import { 
  Users, 
  ShieldCheck, 
  Store, 
  User, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  UserCheck, 
  UserX, 
  RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUserAccounts();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusToggle = async (user: UserAccount) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setActionLoading(user.id);
    const res = await updateUserRoleAndStatusAction(user.id, { status: newStatus });
    setActionLoading(null);
    if (res.success && res.user) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.user! : u)));
      showNotification(`"${user.name}" statusu "${newStatus === 'active' ? 'Aktiv' : 'Deaktiv (Dayandırılmış)'}" olaraq dəyişdirildi.`);
    } else {
      showNotification("Statusu dəyişmək mümkün olmadı", "error");
    }
  };

  const handleRoleChange = async (user: UserAccount, newRole: UserRole) => {
    if (user.email === "admin@platform.local" && newRole !== "admin") {
      showNotification("Əsas Super Admin hesabının rolu dəyişdirilə bilməz!", "error");
      return;
    }
    setActionLoading(user.id);
    const res = await updateUserRoleAndStatusAction(user.id, { role: newRole });
    setActionLoading(null);
    if (res.success && res.user) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.user! : u)));
      showNotification(`"${user.name}" üçün rol "${newRole.toUpperCase()}" olaraq təyin edildi.`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      showNotification("Rolu dəyişmək mümkün olmadı", "error");
    }
  };

  const handleDelete = async (user: UserAccount) => {
    if (user.email === "admin@platform.local") {
      showNotification("Əsas Super Admin hesabı silinə bilməz!", "error");
      return;
    }
    if (!confirm(`"${user.name}" (${user.email}) istifadəçisini sistemdən silmək istədiyinizdən əminsiniz?`)) return;

    setActionLoading(user.id);
    const res = await deleteUserAccountAction(user.id);
    setActionLoading(null);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showNotification(`"${user.name}" sistemdən silindi.`);
    } else {
      showNotification("İstifadəçini silmək mümkün olmadı", "error");
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const customersCount = users.filter((u) => u.role === "customer").length;
  const vendorsCount = users.filter((u) => u.role === "vendor").length;
  const adminsCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <span>Sistem Təhlükəsizliyi & RBAC</span>
            <span>•</span>
            <span>{totalUsers} Qeydiyyatlı İstifadəçi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 font-grotesk">
            İstifadəçi İdarəetməsi (Users Management)
          </h1>
        </div>

        <button
          onClick={loadUsers}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-mono text-xs hover:bg-neutral-50 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-neutral-950" : ""}`} />
          Yenilə
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
          notification.type === "success" 
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <span>{notification.text}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <p className="text-[11px] font-mono text-neutral-400 uppercase">Bütün İstifadəçilər</p>
          <p className="text-3xl font-bold font-mono text-neutral-950 mt-1">{totalUsers}</p>
          <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Platforma hesabı</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-neutral-400 uppercase">Mağaza Sahibləri</p>
            <Store className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-600 mt-1">{vendorsCount}</p>
          <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Vendor role</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-neutral-400 uppercase">Super Adminlər</p>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-bold font-mono text-purple-600 mt-1">{adminsCount}</p>
          <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Qlobal səlahiyyət</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ad, istifadəçi adı və ya email axtar..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono focus:outline-none focus:border-neutral-900 transition-all"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Rol:
          </span>
          {(["all", "vendor", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {r === "all" ? "Hamısı" : r}
            </button>
          ))}

          <div className="w-[1px] h-6 bg-neutral-200 mx-2" />

          {/* Status Filters */}
          <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1">Status:</span>
          {(["all", "active", "suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s === "all" ? "Hamısı" : s === "active" ? "Aktiv" : "Dayandırılmış"}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">İstifadəçi</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Rol (RBAC)</th>
                <th className="py-3.5 px-4">Mənsub Mağaza</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Qeydiyyat Tarixi</th>
                <th className="py-3.5 px-5 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    Axtarışa uyğun istifadəçi tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isPrimaryAdmin = user.email === "admin@platform.local";
                  const roleBadge = 
                    user.role === "admin"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : user.role === "vendor"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-blue-700 border-blue-200";

                  // Check if user has an assigned store or match from stores list
                  const storeName = user.ownedStoreName || (user.role === "vendor" ? user.name : null);
                  const storeSlug = user.ownedStoreSlug;

                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <div className="font-bold font-sans text-neutral-900 text-sm flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.role === "admin" && (
                                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-neutral-600 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Rol (RBAC) */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${roleBadge}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Mənsub Mağaza (Store Ownership) */}
                      <td className="py-4 px-4">
                        {user.role === "vendor" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#07241A]/5 border border-[#07241A]/20 text-[#07241A]">
                            <Store className="w-3.5 h-3.5 text-[#07241A] shrink-0" />
                            <span className="font-bold font-display uppercase tracking-wider text-[11px]">
                              {storeName || "Mağaza təyin edilməyib"}
                            </span>
                            {storeSlug && (
                              <a
                                href={`/stores/${storeSlug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Mağazaya bax"
                                className="text-[10px] text-neutral-400 hover:text-neutral-900 underline ml-0.5 font-mono"
                              >
                                ↗
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-[11px] font-mono italic">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          user.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                          {user.status === "active" ? "Aktiv" : "Dayandırılmış"}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-[11px] text-neutral-400">
                        {new Date(user.createdAt).toLocaleDateString("az-AZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPrimaryAdmin && (
                            <button
                              onClick={() => handleStatusToggle(user)}
                              disabled={actionLoading === user.id}
                              title={user.status === "active" ? "Hesabı Dayandır" : "Hesabı Aktivləşdir"}
                              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                user.status === "active"
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {user.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {!isPrimaryAdmin && (
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={actionLoading === user.id}
                              title="Hesabı Sil"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
