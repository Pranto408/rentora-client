"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  HiOutlineHeart,
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlineExclamationCircle,
  HiOutlineBuildingOffice2,
  HiOutlineEye,
} from "react-icons/hi2";

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ item, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-6 w-full max-w-sm z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <HiOutlineHeart size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B3B5A] dark:text-white">
              Remove Favorite
            </h3>
            <p className="text-xs text-slate-400">
              This will remove it from your saved list.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Remove{" "}
          <span className="font-semibold text-[#1B3B5A] dark:text-white">
            "{item.propertyTitle}"
          </span>{" "}
          from favorites?
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
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <HiOutlineTrash size={15} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      try {
        const data = await apiFetch("/api/favorites/my");
        if (data?.error) {
          setError(data.error);
          return;
        }
        setFavorites(data ?? []);
      } catch {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  // ── remove ─────────────────────────────────────────────────────────────────
  async function handleRemove() {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      const result = await apiFetch(`/api/favorites/${deleteModal._id}`, {
        method: "DELETE",
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setFavorites((p) => p.filter((f) => f._id !== deleteModal._id));
      setDeleteModal(null);
    } catch {
      setError("Failed to remove favorite.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
          My Favorites
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {favorites.length} saved propert{favorites.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <HiOutlineHeart size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No favorites saved yet.
          </p>
          <Link
            href="/properties"
            className="px-4 py-2.5 rounded-xl bg-[#E8834D] text-white text-sm font-semibold hover:bg-[#d4733e] transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* Grid */}
      {!loading && favorites.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["Property", "Location", "Rent", "Actions"].map((h) => (
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
                {favorites.map((fav) => (
                  <tr
                    key={fav._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {fav.propertyImage ? (
                          <img
                            src={fav.propertyImage}
                            alt={fav.propertyTitle}
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
                        <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white truncate max-w-[180px]">
                          {fav.propertyTitle}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <HiOutlineMapPin size={13} /> {fav.propertyLocation}
                      </p>
                    </td>

                    {/* Rent */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#1B3B5A] dark:text-white">
                        ৳{fav.propertyRent?.toLocaleString()}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/properties/${fav.propertyId}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1B3B5A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Property"
                        >
                          <HiOutlineEye size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(fav)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          title="Remove Favorite"
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
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((fav) => (
              <div
                key={fav._id}
                className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="h-40 bg-slate-100 dark:bg-slate-800">
                  {fav.propertyImage ? (
                    <img
                      src={fav.propertyImage}
                      alt={fav.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiOutlineBuildingOffice2
                        size={32}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#1B3B5A] dark:text-white text-sm truncate">
                    {fav.propertyTitle}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <HiOutlineMapPin size={11} /> {fav.propertyLocation}
                  </p>
                  <p className="text-base font-bold text-[#E8834D] mt-2">
                    ৳{fav.propertyRent?.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/properties/${fav.propertyId}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1B3B5A] text-white text-xs font-semibold hover:bg-[#162f48] transition-colors"
                    >
                      <HiOutlineEye size={14} /> View
                    </Link>
                    <button
                      onClick={() => setDeleteModal(fav)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      <HiOutlineTrash size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          item={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleRemove}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
