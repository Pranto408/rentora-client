"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

// ─── Status badge ─────────────────────────────────────────────────────────────
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

// ─── Rejection Feedback Modal ─────────────────────────────────────────────────
function RejectionModal({ property, onClose }) {
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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
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
            <p className="text-xs text-slate-400">
              This action cannot be undone.
            </p>
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
export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [rejectionModal, setRejectionModal] = useState(null); // property object
  const [deleteModal, setDeleteModal] = useState(null); // property object
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── fetch properties ───────────────────────────────────────────────────────
  async function fetchProperties() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/properties/owner/my");
      if (data?.error) {
        setError(data.error);
        return;
      }
      setProperties(data ?? []);
    } catch {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

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

  // ── loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
            My Properties
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"}{" "}
            listed
          </p>
        </div>
        <Link
          href="/dashboard/owner/add-property"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-sm font-semibold transition-colors"
        >
          <HiOutlinePlusCircle size={17} />
          Add Property
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} />
          {error}
        </div>
      )}

      {/* Empty state */}
      {properties.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineBuildingOffice2 size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No properties listed yet.
          </p>
          <Link
            href="/dashboard/owner/add-property"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3B5A] text-white text-sm font-semibold hover:bg-[#162f48] transition-colors"
          >
            <HiOutlinePlusCircle size={16} />
            Add Your First Property
          </Link>
        </div>
      )}

      {/* Table */}
      {properties.length > 0 && (
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {properties.map((property) => (
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
                          <p className="text-xs text-slate-400">
                            {property.bedrooms}bd · {property.bathrooms}ba ·{" "}
                            {property.size}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                        {property.location}
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
                        {/* Eye icon for rejection feedback */}
                        {property.status === "rejected" && (
                          <button
                            onClick={() => setRejectionModal(property)}
                            title="View rejection feedback"
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <HiOutlineEye size={15} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/owner/my-properties/${property._id}/edit`}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1B3B5A] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(property)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {properties.map((property) => (
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
                    <p className="text-xs text-slate-400 mt-0.5">
                      {property.location}
                    </p>
                    <p className="text-sm font-bold text-[#E8834D] mt-1">
                      ৳{property.rent?.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-400">
                        / {property.rentType}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={property.status} />
                    {property.status === "rejected" && (
                      <button
                        onClick={() => setRejectionModal(property)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <HiOutlineEye size={15} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/owner/my-properties/${property._id}/edit`}
                      className="p-2 rounded-lg text-slate-400 hover:text-[#1B3B5A] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <HiOutlinePencilSquare size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleteModal(property)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal && (
        <RejectionModal
          property={rejectionModal}
          onClose={() => setRejectionModal(null)}
        />
      )}

      {/* Delete Modal */}
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
