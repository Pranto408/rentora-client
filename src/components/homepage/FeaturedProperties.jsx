"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineBuildingOffice2,
  HiOutlineArrowRight,
} from "react-icons/hi2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property, isLoggedIn, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-[#E8834D]/40 dark:hover:border-[#E8834D]/40 transition-all duration-300 group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiOutlineBuildingOffice2
              size={40}
              className="text-slate-300 dark:text-slate-600"
            />
          </div>
        )}

        {/* Badges */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1B3B5A]/90 text-white text-xs font-semibold backdrop-blur-sm">
          {property.type}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#E8834D]/90 text-white text-xs font-semibold backdrop-blur-sm">
          {property.rentType}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[#1B3B5A] dark:text-white text-base leading-snug mb-1.5 line-clamp-1 group-hover:text-[#E8834D] transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
          <HiOutlineMapPin size={13} />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-5">
          <span className="flex items-center gap-1">
            <HiOutlineHome size={13} /> {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineSquares2X2 size={13} /> {property.bathrooms} ba
          </span>
          {property.size && <span>📐 {property.size}</span>}
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
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="h-52 bg-slate-100 dark:bg-slate-800 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-1/2" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-24" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FeaturedProperties() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`${API_URL}/api/properties/featured`);
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (!loading && properties.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-[#F8F6F2] dark:bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8834D]/10 text-[#E8834D] text-xs font-semibold uppercase tracking-widest mb-4">
            Featured Listings
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3B5A] dark:text-white mb-4">
            Featured Properties
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
            Handpicked properties across Bangladesh's most sought-after
            locations.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : properties.map((property, i) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isLoggedIn={isLoggedIn}
                  index={i}
                />
              ))}
        </div>

        {/* View all button */}
        {!loading && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1B3B5A] dark:border-white/20 text-[#1B3B5A] dark:text-white font-semibold text-sm hover:bg-[#1B3B5A] hover:text-white dark:hover:bg-white/10 transition-all"
            >
              View All Properties
              <HiOutlineArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
