"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineBuildingOffice2,
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
export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      try {
        const data = await apiFetch("/api/bookings/my");
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

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.bookingStatus === "pending").length,
    approved: bookings.filter((b) => b.bookingStatus === "approved").length,
    rejected: bookings.filter((b) => b.bookingStatus === "rejected").length,
  };

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.bookingStatus === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          My Bookings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Track all your property booking requests and their status.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: counts.all,
            color: "bg-slate-50 dark:bg-slate-800",
            iconColor: "text-slate-500",
            icon: HiOutlineClipboardDocumentList,
          },
          {
            label: "Pending",
            value: counts.pending,
            color: "bg-yellow-50 dark:bg-yellow-950/30",
            iconColor: "text-yellow-500",
            icon: HiOutlineClock,
          },
          {
            label: "Approved",
            value: counts.approved,
            color: "bg-green-50 dark:bg-green-950/30",
            iconColor: "text-green-500",
            icon: HiOutlineCheckCircle,
          },
          {
            label: "Rejected",
            value: counts.rejected,
            color: "bg-red-50 dark:bg-red-950/30",
            iconColor: "text-red-500",
            icon: HiOutlineXCircle,
          },
        ].map(({ label, value, color, iconColor, icon: Icon }) => (
          <div
            key={label}
            className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 border border-slate-200 dark:border-slate-800"
          >
            <div
              className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-2`}
            >
              <Icon size={17} className={iconColor} />
            </div>
            <p className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
              {loading ? "..." : value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={[
              "px-4 py-1.5 rounded-xl text-sm font-medium transition-all border",
              filter === key
                ? "bg-[#1B3B5A] text-white border-[#1B3B5A]"
                : "bg-white dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#1B3B5A]",
            ].join(" ")}
          >
            {label} ({counts[key] ?? bookings.length})
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineClipboardDocumentList
              size={32}
              className="text-slate-400"
            />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No bookings found.
          </p>
          <Link
            href="/properties"
            className="px-4 py-2.5 rounded-xl bg-[#E8834D] text-white text-sm font-semibold hover:bg-[#d4733e] transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* Table — desktop */}
      {!loading && filtered.length > 0 && (
        <>
          <div className="hidden md:block bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {[
                    "Property",
                    "Move-in Date",
                    "Amount Paid",
                    "Booking Status",
                    "Payment Status",
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
                {filtered.map((booking) => (
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
                            className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <HiOutlineBuildingOffice2
                              size={18}
                              className="text-slate-400"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate max-w-[160px]">
                            {booking.propertyTitle}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <HiOutlineMapPin size={11} />{" "}
                            {booking.propertyLocation}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Move-in date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <HiOutlineCalendar
                          size={14}
                          className="text-slate-400"
                        />
                        {new Date(booking.moveInDate).toLocaleDateString(
                          "en-BD",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1B3B5A] dark:text-white">
                        <HiOutlineCurrencyDollar
                          size={14}
                          className="text-slate-400"
                        />
                        {booking.amountPaid > 0
                          ? `৳${booking.amountPaid.toLocaleString()}`
                          : "—"}
                      </div>
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
          <div className="md:hidden space-y-4">
            {filtered.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  {booking.propertyImage ? (
                    <img
                      src={booking.propertyImage}
                      alt={booking.propertyTitle}
                      className="w-16 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBuildingOffice2
                        size={22}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate">
                      {booking.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {booking.propertyLocation}
                    </p>
                    <p className="text-sm font-bold text-[#E8834D] mt-1">
                      {booking.amountPaid > 0
                        ? `৳${booking.amountPaid.toLocaleString()}`
                        : "Payment pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <StatusBadge
                    label={booking.bookingStatus}
                    status={booking.bookingStatus}
                  />
                  <p className="text-xs text-slate-400">
                    Move-in:{" "}
                    {new Date(booking.moveInDate).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
