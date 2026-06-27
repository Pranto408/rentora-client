"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineBanknotes,
} from "react-icons/hi2";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const LIMIT = 5;

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        const data = await apiFetch(
          `/api/transactions/admin?${params.toString()}`,
        );
        if (data?.error) {
          setError(data.error);
          return;
        }
        setTransactions(data?.transactions ?? []);
        setTotal(data?.total ?? 0);
        setTotalPages(data?.totalPages ?? 1);
        // calc total earnings from all transactions
        const sum = (data?.transactions ?? []).reduce(
          (s, t) => s + (t.amount ?? 0),
          0,
        );
        setTotalEarnings(sum);
      } catch {
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [page]);

  // ── client-side search ─────────────────────────────────────────────────────
  const filtered = transactions.filter((t) => {
    if (!search) return true;
    return (
      t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      t.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
      t.tenant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.owner?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          Transactions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View all payment transactions across the platform.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
            <HiOutlineCreditCard size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-[#1B3B5A] dark:text-white">
            {loading ? "..." : total}
          </p>
          <p className="text-sm text-slate-400 mt-1">Total Transactions</p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-3">
            <HiOutlineBanknotes size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-[#1B3B5A] dark:text-white">
            {loading ? "..." : `৳${totalEarnings.toLocaleString()}`}
          </p>
          <p className="text-sm text-slate-400 mt-1">Total Platform Revenue</p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-3">
            <HiOutlineCheckCircle size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-[#1B3B5A] dark:text-white">
            {loading
              ? "..."
              : transactions.filter((t) => t.status === "successful").length}
          </p>
          <p className="text-sm text-slate-400 mt-1">Successful Payments</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <HiOutlineMagnifyingGlass
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transaction ID, property, tenant..."
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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineCreditCard size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No transactions found.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {[
                    "Transaction ID",
                    "Property",
                    "Tenant",
                    "Owner",
                    "Amount",
                    "Date",
                    "Status",
                  ].map((h) => (
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
                {filtered.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="px-5 py-4">
                      <p
                        className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[120px]"
                        title={tx.transactionId}
                      >
                        {tx.transactionId?.startsWith("pending_payment") ? (
                          <span className="text-yellow-500 font-sans font-medium">
                            Pending
                          </span>
                        ) : (
                          tx.transactionId?.slice(0, 16) + "..."
                        )}
                      </p>
                    </td>

                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineBuildingOffice2
                          size={14}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <p className="text-sm font-medium text-[#1B3B5A] dark:text-white truncate max-w-[140px]">
                          {tx.propertyTitle}
                        </p>
                      </div>
                    </td>

                    {/* Tenant */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineUser
                          size={14}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm text-[#1B3B5A] dark:text-white truncate max-w-[110px]">
                            {tx.tenant?.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[110px]">
                            {tx.tenant?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-4">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[110px]">
                          {tx.owner?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[110px]">
                          {tx.owner?.email}
                        </p>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#1B3B5A] dark:text-white">
                        {tx.amount > 0
                          ? `৳${tx.amount?.toLocaleString()}`
                          : "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {tx.currency ?? "BDT"}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <HiOutlineCalendar size={13} />
                        {new Date(tx.createdAt).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                          tx.status === "successful"
                            ? "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50"
                            : "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50",
                        ].join(" ")}
                      >
                        {tx.status === "successful" ? (
                          <>
                            <HiOutlineCheckCircle size={12} /> Successful
                          </>
                        ) : (
                          <>
                            <HiOutlineExclamationCircle size={12} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((tx) => (
              <div key={tx._id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate">
                      {tx.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tx.tenant?.name} → {tx.owner?.name}
                    </p>
                    <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
                      {tx.transactionId?.startsWith("pending_payment")
                        ? "Payment Pending"
                        : tx.transactionId?.slice(0, 20) + "..."}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold text-[#1B3B5A] dark:text-white">
                      {tx.amount > 0 ? `৳${tx.amount?.toLocaleString()}` : "—"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={[
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                    tx.status === "successful"
                      ? "bg-green-50 dark:bg-green-950/40 text-green-600 border-green-200"
                      : "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 border-yellow-200",
                  ].join(" ")}
                >
                  {tx.status === "successful" ? (
                    <>
                      <HiOutlineCheckCircle size={12} /> Successful
                    </>
                  ) : (
                    <>
                      <HiOutlineExclamationCircle size={12} /> Pending
                    </>
                  )}
                </span>
              </div>
            ))}
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
            if (p === page - 2 || p === page + 2)
              return (
                <span key={p} className="text-slate-400">
                  …
                </span>
              );
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
    </div>
  );
}
