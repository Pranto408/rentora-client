"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    approved: {
      label: "Approved",
      class:
        "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50",
      icon: <HiOutlineCheckCircle size={13} />,
    },
    pending: {
      label: "Pending",
      class:
        "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50",
      icon: <HiOutlineClock size={13} />,
    },
    rejected: {
      label: "Rejected",
      class:
        "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
      icon: <HiOutlineXCircle size={13} />,
    },
  };
  const c = config[status] ?? config.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.class}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmClass,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-6 w-full max-w-sm z-10">
        <h3 className="font-bold text-[#1B3B5A] dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${confirmClass}`}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { booking, action }
  const [successMsg, setSuccessMsg] = useState("");

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      try {
        const data = await apiFetch("/api/bookings/owner");
        if (data?.error) {
          setError(data.error);
          return;
        }
        setBookings(data ?? []);
      } catch {
        setError("Failed to load booking requests.");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  // ── approve / reject ───────────────────────────────────────────────────────
  async function handleAction(booking, status) {
    setActionLoading(booking._id);
    try {
      const result = await apiFetch(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setBookings((p) =>
        p.map((b) =>
          b._id === booking._id ? { ...b, bookingStatus: status } : b,
        ),
      );
      setSuccessMsg(`Booking ${status} successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setConfirmModal(null);
    } catch {
      setError("Failed to update booking.");
    } finally {
      setActionLoading(null);
    }
  }

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
          Booking Requests
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Review and manage booking requests for your properties.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {[
          {
            key: "all",
            label: "All",
            color:
              "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
          },
          {
            key: "pending",
            label: "Pending",
            color:
              "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 border border-yellow-200 dark:border-yellow-900/40",
          },
          {
            key: "approved",
            label: "Approved",
            color:
              "bg-green-50 dark:bg-green-950/30 text-green-600 border border-green-200 dark:border-green-900/40",
          },
          {
            key: "rejected",
            label: "Rejected",
            color:
              "bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-900/40",
          },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${color} ${filter === key ? "ring-2 ring-[#E8834D] ring-offset-1" : ""}`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Success */}
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

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineClipboardDocumentList
              size={32}
              className="text-slate-400"
            />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No booking requests found.
          </p>
        </div>
      )}

      {/* Booking cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Property info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {booking.propertyImage ? (
                    <img
                      src={booking.propertyImage}
                      alt={booking.propertyTitle}
                      className="w-16 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineMapPin size={20} className="text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1B3B5A] dark:text-white truncate">
                      {booking.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <HiOutlineMapPin size={11} /> {booking.propertyLocation}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={booking.bookingStatus} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {booking.bookingStatus === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        setConfirmModal({ booking, action: "approved" })
                      }
                      disabled={actionLoading === booking._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <HiOutlineCheckCircle size={15} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({ booking, action: "rejected" })
                      }
                      disabled={actionLoading === booking._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <HiOutlineXCircle size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

              {/* Tenant info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlineUser size={14} className="flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Tenant
                    </p>
                    <p className="text-xs font-medium text-[#1B3B5A] dark:text-white">
                      {booking.tenant?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlinePhone size={14} className="flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Contact
                    </p>
                    <p className="text-xs font-medium text-[#1B3B5A] dark:text-white">
                      {booking.contactNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlineCalendar size={14} className="flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Move-in
                    </p>
                    <p className="text-xs font-medium text-[#1B3B5A] dark:text-white">
                      {new Date(booking.moveInDate).toLocaleDateString(
                        "en-BD",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlineCurrencyDollar
                    size={14}
                    className="flex-shrink-0"
                  />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Amount
                    </p>
                    <p className="text-xs font-medium text-[#1B3B5A] dark:text-white">
                      {booking.amountPaid > 0
                        ? `৳${booking.amountPaid?.toLocaleString()}`
                        : "Pending payment"}
                    </p>
                  </div>
                </div>
              </div>

              {booking.additionalNotes && (
                <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Note:{" "}
                  </span>
                  {booking.additionalNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          title={
            confirmModal.action === "approved"
              ? "Approve Booking?"
              : "Reject Booking?"
          }
          message={
            confirmModal.action === "approved"
              ? `Approve booking request from ${confirmModal.booking.tenant?.name}?`
              : `Reject booking request from ${confirmModal.booking.tenant?.name}?`
          }
          confirmLabel={
            confirmModal.action === "approved" ? "Approve" : "Reject"
          }
          confirmClass={
            confirmModal.action === "approved"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }
          onClose={() => setConfirmModal(null)}
          onConfirm={() =>
            handleAction(confirmModal.booking, confirmModal.action)
          }
          loading={actionLoading === confirmModal.booking._id}
        />
      )}
    </div>
  );
}
