"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ label, status }) {
  const config = {
    approved:
      "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50",
    pending:
      "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50",
    rejected:
      "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
    paid: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  };
  const icon = {
    approved: <HiOutlineCheckCircle size={12} />,
    pending: <HiOutlineClock size={12} />,
    rejected: <HiOutlineXCircle size={12} />,
    paid: <HiOutlineCheckCircle size={12} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config[status] ?? config.pending}`}
    >
      {icon[status]} {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/api/bookings/admin");
        if (data?.error) {
          setError(data.error);
          return;
        }
        setBookings(data ?? []);
      } catch {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  // ── client-side filter + search ────────────────────────────────────────────
  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.tenant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.tenant?.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.owner?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || b.bookingStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.bookingStatus === "pending").length,
    approved: bookings.filter((b) => b.bookingStatus === "approved").length,
    rejected: bookings.filter((b) => b.bookingStatus === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          All Bookings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor all booking activity across the platform.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: counts.all,
            icon: HiOutlineClipboardDocumentList,
            bg: "bg-slate-50 dark:bg-slate-800",
            color: "text-slate-500",
          },
          {
            label: "Pending",
            value: counts.pending,
            icon: HiOutlineClock,
            bg: "bg-yellow-50 dark:bg-yellow-950/30",
            color: "text-yellow-500",
          },
          {
            label: "Approved",
            value: counts.approved,
            icon: HiOutlineCheckCircle,
            bg: "bg-green-50 dark:bg-green-950/30",
            color: "text-green-500",
          },
          {
            label: "Rejected",
            value: counts.rejected,
            icon: HiOutlineXCircle,
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
              <Icon size={17} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
              {loading ? "..." : value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search property, tenant, owner..."
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

        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={[
                "px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all border",
                statusFilter === s
                  ? "bg-[#1B3B5A] text-white border-[#1B3B5A]"
                  : "bg-white dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#1B3B5A]",
              ].join(" ")}
            >
              {s} ({counts[s] ?? bookings.length})
            </button>
          ))}
        </div>
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
              className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineClipboardDocumentList
              size={32}
              className="text-slate-400"
            />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No bookings found.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && paginated.length > 0 && (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {[
                    "Property",
                    "Tenant",
                    "Owner",
                    "Move-in",
                    "Amount",
                    "Status",
                    "Payment",
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
                {paginated.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {booking.propertyImage ? (
                          <img
                            src={booking.propertyImage}
                            alt={booking.propertyTitle}
                            className="w-10 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <HiOutlineBuildingOffice2
                              size={16}
                              className="text-slate-400"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate max-w-[140px]">
                            {booking.propertyTitle}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[140px]">
                            <HiOutlineMapPin size={10} />{" "}
                            {booking.propertyLocation}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Tenant */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#1B3B5A] dark:text-white">
                        {booking.tenant?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[130px]">
                        {booking.tenant?.email}
                      </p>
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {booking.owner?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[130px]">
                        {booking.owner?.email}
                      </p>
                    </td>

                    {/* Move-in */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <HiOutlineCalendar size={13} />
                        {new Date(booking.moveInDate).toLocaleDateString(
                          "en-BD",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white">
                        {booking.amountPaid > 0
                          ? `৳${booking.amountPaid?.toLocaleString()}`
                          : "—"}
                      </p>
                    </td>

                    {/* Booking status */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={booking.bookingStatus}
                        status={booking.bookingStatus}
                      />
                    </td>

                    {/* Payment status */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={
                          booking.paymentStatus === "paid" ? "Paid" : "Pending"
                        }
                        status={
                          booking.paymentStatus === "paid" ? "paid" : "pending"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {paginated.map((booking) => (
              <div key={booking._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {booking.propertyImage ? (
                    <img
                      src={booking.propertyImage}
                      alt={booking.propertyTitle}
                      className="w-14 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBuildingOffice2
                        size={20}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate">
                      {booking.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <HiOutlineUser size={10} /> {booking.tenant?.name} →{" "}
                      {booking.owner?.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(booking.moveInDate).toLocaleDateString(
                        "en-BD",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge
                    label={booking.bookingStatus}
                    status={booking.bookingStatus}
                  />
                  <StatusBadge
                    label={
                      booking.paymentStatus === "paid"
                        ? "Paid"
                        : "Payment Pending"
                    }
                    status={
                      booking.paymentStatus === "paid" ? "paid" : "pending"
                    }
                  />
                </div>
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
