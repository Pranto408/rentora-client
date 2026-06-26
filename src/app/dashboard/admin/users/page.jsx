"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineExclamationCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const config = {
    admin: {
      label: "Admin",
      class:
        "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
      icon: <HiOutlineShieldCheck size={11} />,
    },
    owner: {
      label: "Owner",
      class:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
      icon: <HiOutlineBuildingOffice2 size={11} />,
    },
    tenant: {
      label: "Tenant",
      class:
        "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50",
      icon: <HiOutlineHome size={11} />,
    },
  };
  const c = config[role] ?? config.tenant;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.class}`}
    >
      {c.icon} {c.label}
    </span>
  );
}

// ─── Change Role Modal ────────────────────────────────────────────────────────
function ChangeRoleModal({ user, onClose, onConfirm, loading }) {
  const [selectedRole, setSelectedRole] = useState(user.role ?? "tenant");

  const ROLES = [
    {
      value: "tenant",
      label: "Tenant",
      desc: "Can browse and book properties",
      icon: HiOutlineHome,
      color: "text-green-500",
    },
    {
      value: "owner",
      label: "Owner",
      desc: "Can list and manage properties",
      icon: HiOutlineBuildingOffice2,
      color: "text-blue-500",
    },
    {
      value: "admin",
      label: "Admin",
      desc: "Full platform access",
      icon: HiOutlineShieldCheck,
      color: "text-red-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-6 w-full max-w-md z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#1B3B5A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h3 className="font-bold text-[#1B3B5A] dark:text-white">
              Change Role
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[240px]">
              {user.name} · {user.email}
            </p>
          </div>
        </div>

        {/* Role options */}
        <div className="space-y-2 mb-5">
          {ROLES.map(({ value, label, desc, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => setSelectedRole(value)}
              className={[
                "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                selectedRole === value
                  ? "border-[#E8834D] bg-[#E8834D]/5 dark:bg-[#E8834D]/10"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
              ].join(" ")}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedRole === value
                    ? "bg-[#E8834D]/10"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Icon
                  size={18}
                  className={selectedRole === value ? "text-[#E8834D]" : color}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white">
                  {label}
                </p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              {selectedRole === value && (
                <HiOutlineCheckCircle
                  size={18}
                  className="text-[#E8834D] flex-shrink-0"
                />
              )}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedRole)}
            disabled={loading || selectedRole === user.role}
            className="flex-1 py-2.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {selectedRole === user.role ? "No Change" : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals
  const [roleModal, setRoleModal] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const LIMIT = 10;

  // ── fetch users ────────────────────────────────────────────────────────────
  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      const data = await apiFetch(`/api/users?${params.toString()}`);
      if (data?.error) {
        setError(data.error);
        return;
      }
      setUsers(data?.users ?? []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 1);
    } catch {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ── change role ────────────────────────────────────────────────────────────
  async function handleRoleChange(newRole) {
    if (!roleModal) return;
    setRoleLoading(true);
    try {
      const result = await apiFetch(`/api/users/${roleModal._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      if (result?.error) {
        setError(result.error);
        return;
      }

      // Update locally
      setUsers((prev) =>
        prev.map((u) =>
          u._id === roleModal._id ? { ...u, role: newRole } : u,
        ),
      );
      setSuccessMsg(`${roleModal.name}'s role updated to ${newRole}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setRoleModal(null);
    } catch {
      setError("Failed to update role.");
    } finally {
      setRoleLoading(false);
    }
  }

  // ── client-side filter ─────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── summary counts ─────────────────────────────────────────────────────────
  const counts = {
    all: users.length,
    tenant: users.filter((u) => u.role === "tenant").length,
    owner: users.filter((u) => u.role === "owner").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          All Users
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage user roles and monitor all registered users.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: total,
            icon: HiOutlineUsers,
            bg: "bg-slate-50 dark:bg-slate-800",
            color: "text-slate-500",
          },
          {
            label: "Tenants",
            value: counts.tenant,
            icon: HiOutlineHome,
            bg: "bg-green-50 dark:bg-green-950/30",
            color: "text-green-500",
          },
          {
            label: "Owners",
            value: counts.owner,
            icon: HiOutlineBuildingOffice2,
            bg: "bg-blue-50 dark:bg-blue-950/30",
            color: "text-blue-500",
          },
          {
            label: "Admins",
            value: counts.admin,
            icon: HiOutlineShieldCheck,
            bg: "bg-red-50 dark:bg-red-950/30",
            color: "text-red-500",
          },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 border border-slate-200 dark:border-slate-800"
          >
            <div
              className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}
            >
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
              {loading ? "..." : value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
          <HiOutlineCheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} /> {error}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <HiOutlineMagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <HiOutlineXMark size={15} />
            </button>
          )}
        </div>

        {/* Role filter chips */}
        <div className="flex items-center gap-2">
          {["all", "tenant", "owner", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={[
                "px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all border",
                roleFilter === r
                  ? "bg-[#1B3B5A] text-white border-[#1B3B5A]"
                  : "bg-white dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#1B3B5A]",
              ].join(" ")}
            >
              {r} {r !== "all" && `(${counts[r]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineUsers size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No users found.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["User", "Email", "Role", "Joined", "Action"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((u) => {
                  const isCurrentUser = u.email === currentUser?.email;
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {u.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {isCurrentUser && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#E8834D]/10 text-[#E8834D] font-medium">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {u.email}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role ?? "tenant"} />
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString(
                                "en-BD",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "—"}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setRoleModal(u)}
                          disabled={isCurrentUser}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-[#E8834D] hover:text-[#E8834D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Change Role
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((u) => {
              const isCurrentUser = u.email === currentUser?.email;
              return (
                <div
                  key={u._id}
                  className="p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {u.image ? (
                      <img
                        src={u.image}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate">
                        {u.name}{" "}
                        {isCurrentUser && (
                          <span className="text-[#E8834D] text-xs">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {u.email}
                      </p>
                      <div className="mt-1">
                        <RoleBadge role={u.role ?? "tenant"} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setRoleModal(u)}
                    disabled={isCurrentUser}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-[#E8834D] hover:text-[#E8834D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Change Role
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiOutlineChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            if (
              p === 1 ||
              p === totalPages ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={[
                    "w-9 h-9 rounded-xl text-sm font-medium transition-colors",
                    p === page
                      ? "bg-[#1B3B5A] text-white"
                      : "border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  {p}
                </button>
              );
            }
            if (p === page - 2 || p === page + 2) {
              return (
                <span key={p} className="text-slate-400">
                  …
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiOutlineChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Change Role Modal */}
      {roleModal && (
        <ChangeRoleModal
          user={roleModal}
          onClose={() => setRoleModal(null)}
          onConfirm={handleRoleChange}
          loading={roleLoading}
        />
      )}
    </div>
  );
}
