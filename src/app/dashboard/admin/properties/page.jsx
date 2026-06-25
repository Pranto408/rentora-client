"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineExclamationCircle,
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineMapPin,
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

// ─── Rejection Modal ──────────────────────────────────────────────────────────
function RejectionModal({ property, onClose, onConfirm, loading }) {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
    if (!feedback.trim()) {
      setError("Rejection feedback is required.");
      return;
    }
    onConfirm(feedback);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-6 w-full max-w-md z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
            <HiOutlineXCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B3B5A] dark:text-white">
              Reject Property
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[240px]">
              {property.title}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Rejection Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setError("");
            }}
            rows={4}
            placeholder="Explain why this property is being rejected (owner will see this)..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-red-400 transition-colors resize-none"
          />
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <HiOutlineExclamationCircle size={13} /> {error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiOutlineXCircle size={15} />
            )}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Feedback Modal ──────────────────────────────────────────────────────
function FeedbackModal({ property, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-6 w-full max-w-md z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <HiOutlineExclamationCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B3B5A] dark:text-white">
              Rejection Feedback
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[220px]">
              {property.title}
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
          {property.rejectionFeedback ?? "No feedback provided."}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ property, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-6 w-full max-w-md z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <HiOutlineTrash size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B3B5A] dark:text-white">
              Delete Property
            </h3>
            <p className="text-xs text-slate-400">This cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#1B3B5A] dark:text-white">
            "{property.title}"
          </span>
          ?
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
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiOutlineTrash size={15} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  // Modals
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // property id being approved

  // ── fetch ──────────────────────────────────────────────────────────────────
  async function fetchProperties() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/properties/admin/all");
      if (data?.error) {
        setError(data.error);
        return;
      }
      setProperties(data ?? []);
      setFiltered(data ?? []);
    } catch {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  // ── client-side search + status filter ────────────────────────────────────
  useEffect(() => {
    let result = [...properties];
    if (search) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.location?.toLowerCase().includes(search.toLowerCase()) ||
          p.owner?.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, properties]);

  // ── approve ────────────────────────────────────────────────────────────────
  async function handleApprove(property) {
    setActionLoading(property._id);
    try {
      const result = await apiFetch(`/api/properties/${property._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setProperties((p) =>
        p.map((x) =>
          x._id === property._id
            ? { ...x, status: "approved", rejectionFeedback: null }
            : x,
        ),
      );
    } catch {
      setError("Failed to approve property.");
    } finally {
      setActionLoading(null);
    }
  }

  // ── reject ─────────────────────────────────────────────────────────────────
  async function handleReject(feedback) {
    if (!rejectModal) return;
    setRejectLoading(true);
    try {
      const result = await apiFetch(
        `/api/properties/${rejectModal._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "rejected",
            rejectionFeedback: feedback,
          }),
        },
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      setProperties((p) =>
        p.map((x) =>
          x._id === rejectModal._id
            ? { ...x, status: "rejected", rejectionFeedback: feedback }
            : x,
        ),
      );
      setRejectModal(null);
    } catch {
      setError("Failed to reject property.");
    } finally {
      setRejectLoading(false);
    }
  }

  // ── delete ─────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      const result = await apiFetch(`/api/properties/${deleteModal._id}`, {
        method: "DELETE",
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setProperties((p) => p.filter((x) => x._id !== deleteModal._id));
      setDeleteModal(null);
    } catch {
      setError("Failed to delete property.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── summary counts ─────────────────────────────────────────────────────────
  const counts = {
    all: properties.length,
    pending: properties.filter((p) => p.status === "pending").length,
    approved: properties.filter((p) => p.status === "approved").length,
    rejected: properties.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          All Properties
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Review, approve, reject and manage all property listings.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          {
            key: "all",
            label: "All",
            count: counts.all,
            color:
              "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
          },
          {
            key: "pending",
            label: "Pending",
            count: counts.pending,
            color:
              "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40",
          },
          {
            key: "approved",
            label: "Approved",
            count: counts.approved,
            color:
              "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/40",
          },
          {
            key: "rejected",
            label: "Rejected",
            count: counts.rejected,
            color:
              "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40",
          },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={[
              "px-4 py-1.5 rounded-xl text-sm font-medium transition-all",
              color,
              statusFilter === key ? "ring-2 ring-[#E8834D] ring-offset-1" : "",
            ].join(" ")}
          >
            {label} ({count})
          </button>
        ))}
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
          placeholder="Search title, location, owner..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <HiOutlineXMark size={16} />
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
              className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineBuildingOffice2 size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No properties found.
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
                    "Property",
                    "Owner",
                    "Rent",
                    "Type",
                    "Status",
                    "Actions",
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
                {filtered.map((property) => (
                  <tr
                    key={property._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {property.images?.[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <HiOutlineBuildingOffice2
                              size={18}
                              className="text-slate-400"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate max-w-[180px]">
                            {property.title}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <HiOutlineMapPin size={11} /> {property.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {property.owner?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[140px]">
                        {property.owner?.email}
                      </p>
                    </td>

                    {/* Rent */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white">
                        ৳{property.rent?.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {property.rentType}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {property.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={property.status} />
                        {property.status === "rejected" &&
                          property.rejectionFeedback && (
                            <button
                              onClick={() => setFeedbackModal(property)}
                              title="View rejection feedback"
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            >
                              <HiOutlineEye size={14} />
                            </button>
                          )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {/* Approve */}
                        {property.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(property)}
                            disabled={actionLoading === property._id}
                            title="Approve"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === property._id ? (
                              <span className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                            ) : (
                              <HiOutlineCheckCircle size={14} />
                            )}
                            Approve
                          </button>
                        )}

                        {/* Reject */}
                        {property.status !== "rejected" && (
                          <button
                            onClick={() => setRejectModal(property)}
                            title="Reject"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                          >
                            <HiOutlineXCircle size={14} />
                            Reject
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteModal(property)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <HiOutlineTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((property) => (
              <div key={property._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
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
                      {property.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {property.location}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      by {property.owner?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={property.status} />
                    {property.status === "rejected" &&
                      property.rejectionFeedback && (
                        <button
                          onClick={() => setFeedbackModal(property)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <HiOutlineEye size={14} />
                        </button>
                      )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {property.status !== "approved" && (
                      <button
                        onClick={() => handleApprove(property)}
                        disabled={actionLoading === property._id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        <HiOutlineCheckCircle size={13} /> Approve
                      </button>
                    )}
                    {property.status !== "rejected" && (
                      <button
                        onClick={() => setRejectModal(property)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
                      >
                        <HiOutlineXCircle size={13} /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteModal(property)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <HiOutlineTrash size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {rejectModal && (
        <RejectionModal
          property={rejectModal}
          onClose={() => setRejectModal(null)}
          onConfirm={handleReject}
          loading={rejectLoading}
        />
      )}

      {feedbackModal && (
        <FeedbackModal
          property={feedbackModal}
          onClose={() => setFeedbackModal(null)}
        />
      )}

      {deleteModal && (
        <DeleteModal
          property={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
