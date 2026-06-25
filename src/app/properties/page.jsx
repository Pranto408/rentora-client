"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import {
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineSquares2X2,
  HiOutlineHeart,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "House",
  "Villa",
  "Studio",
  "Duplex",
  "Penthouse",
  "Room",
  "Office Space",
];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property, isLoggedIn }) {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-[#E8834D]/30 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiOutlineBuildingOffice2
              size={40}
              className="text-slate-300 dark:text-slate-600"
            />
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1B3B5A]/90 text-white text-xs font-semibold backdrop-blur-sm">
          {property.type}
        </span>

        {/* Rent type badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#E8834D]/90 text-white text-xs font-semibold backdrop-blur-sm">
          {property.rentType}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#1B3B5A] dark:text-white text-base leading-snug mb-1 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
          <HiOutlineMapPin size={13} />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <HiOutlineHome size={13} />
            {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineSquares2X2 size={13} />
            {property.bathrooms} ba
          </span>
          {property.size && (
            <span className="flex items-center gap-1">📐 {property.size}</span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[#1B3B5A] dark:text-white">
              ৳{property.rent?.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">
              per {property.rentType?.toLowerCase()}
            </p>
          </div>

          {isLoggedIn ? (
            <Link
              href={`/properties/${property._id}`}
              className="px-4 py-2 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-xs font-semibold transition-colors"
            >
              View Details
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-[#1B3B5A] hover:bg-[#162f48] text-white text-xs font-semibold transition-colors"
            >
              Login to View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="h-52 bg-slate-100 dark:bg-slate-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-1/2" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-24" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AllPropertiesPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const LIMIT = 9;

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.set("location", location);
      if (type && type !== "All") params.set("type", type);
      if (sort) params.set("sort", sort);
      params.set("page", page);
      params.set("limit", LIMIT);

      const data = await apiFetch(`/api/properties?${params.toString()}`);
      setProperties(data?.properties ?? []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 1);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [location, type, sort, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ── search submit ──────────────────────────────────────────────────────────
  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  }

  function clearFilters() {
    setLocation("");
    setType("");
    setSort("");
    setPage(1);
  }

  const hasFilters = location || (type && type !== "All") || sort;

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a]">
      {/* ── Hero / Search bar ─────────────────────────────────────────────── */}
      <div className="bg-[#1B3B5A] dark:bg-[#0F172A] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Find Your Perfect Home
          </h1>
          <p className="text-white/60 text-sm mb-8">
            Browse {total > 0 ? `${total} approved` : ""} properties across
            Bangladesh
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-xl"
          >
            {/* Location search */}
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location... e.g. Gulshan, Dhaka"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-sm text-[#1B3B5A] dark:text-white placeholder-slate-400 outline-none focus:border-[#E8834D] transition-colors"
              />
            </div>

            {/* Type filter */}
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-sm text-[#1B3B5A] dark:text-white outline-none focus:border-[#E8834D] transition-colors"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t === "All" ? "" : t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white font-semibold text-sm transition-colors flex items-center gap-2 justify-center"
            >
              <HiOutlineMagnifyingGlass size={16} />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <HiOutlineFunnel size={15} />
          <span>
            {loading
              ? "Loading..."
              : `${total} propert${total === 1 ? "y" : "ies"} found`}
          </span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 ml-2 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 text-xs hover:bg-red-100 transition-colors"
            >
              <HiOutlineXMark size={13} />
              Clear filters
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-sm text-[#1B3B5A] dark:text-white outline-none focus:border-[#E8834D] transition-colors"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Property Grid ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <HiOutlineBuildingOffice2
                size={40}
                className="text-slate-300 dark:text-slate-600"
              />
            </div>
            <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">
              No properties found
            </p>
            <p className="text-sm text-slate-400">
              Try adjusting your search or filters.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-[#E8834D] text-white text-sm font-medium hover:bg-[#d4733e] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              // Show first, last, current, and neighbors
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
                  <span key={p} className="text-slate-400 px-1">
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
      </div>
    </div>
  );
}
