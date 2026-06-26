"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiStar, HiOutlineStar } from "react-icons/hi2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Star display ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <HiStar key={s} size={16} className="text-yellow-400" />
        ) : (
          <HiOutlineStar
            key={s}
            size={16}
            className="text-slate-300 dark:text-slate-600"
          />
        ),
      )}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, index }) {
  const initials =
    review.tenant?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "T";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 hover:shadow-lg hover:border-[#E8834D]/30 transition-all duration-300"
    >
      {/* Stars + date */}
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <p className="text-xs text-slate-400">
          {new Date(review.createdAt).toLocaleDateString("en-BD", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Comment */}
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4">
        "{review.comment}"
      </p>

      {/* Reviewer */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1B3B5A] dark:text-white">
            {review.tenant?.name}
          </p>
          <p className="text-xs text-slate-400">{review.tenant?.email}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonReview() {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-24" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-5/6" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-28" />
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-36" />
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Fetch top 4 reviews by rating
        const res = await fetch(`${API_URL}/api/reviews?limit=4`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (!loading && reviews.length === 0) return null;

  // Average rating for display
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="py-20 px-4 bg-white dark:bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3B5A] dark:text-white mb-4">
            What Our Tenants Say
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
            Real experiences from real people who found their perfect home
            through Rentora.
          </p>

          {/* Average rating display */}
          {avgRating && !loading && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar
                    key={s}
                    size={20}
                    className={
                      parseFloat(avgRating) >= s
                        ? "text-yellow-400"
                        : "text-slate-300 dark:text-slate-600"
                    }
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-[#1B3B5A] dark:text-white">
                {avgRating}
              </span>
              <span className="text-sm text-slate-400">
                ({reviews.length} reviews)
              </span>
            </div>
          )}
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonReview key={i} />
              ))
            : reviews.map((review, i) => (
                <ReviewCard key={review._id} review={review} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
