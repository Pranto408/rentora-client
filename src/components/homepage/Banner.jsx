"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiHome, FiDollarSign } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Studio",
  "Villa",
  "Office",
  "Condo",
  "Townhouse",
];

const INPUT_CLS =
  "bg-white/10 dark:bg-white/5 text-white dark:text-slate-200 placeholder-white/35 dark:placeholder-slate-500 text-sm rounded-xl px-4 py-3 border border-white/10 dark:border-white/8 focus:outline-none focus:ring-2 focus:ring-[#E8834D]/60 transition-all duration-200 text-center w-full";
const LABEL_CLS =
  "flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#E8834D]/90 dark:text-[#f0976a]/80 transition-colors duration-300";

export default function Banner() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set("location", filters.location);
    if (filters.type) params.set("type", filters.type);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner.avif')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0d1f2d]/75 dark:bg-[#020810]/85 transition-colors duration-300" />

      {/* Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#E8834D]/10 dark:bg-[#E8834D]/6 blur-3xl pointer-events-none transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-10 py-24 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 text-[#E8834D] dark:text-[#f0976a] font-semibold text-sm tracking-widest uppercase mb-5 transition-colors duration-300"
        >
          <HiOutlineSparkles className="text-base" />
          Trusted Rental Marketplace
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={fadeUp(0.1)}
          initial="hidden"
          animate="visible"
          className="font-display text-[clamp(2.4rem,5vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-white dark:text-slate-100 mb-6 transition-colors duration-300"
        >
          Find a Place
          <br />
          <span className="text-[#E8834D] dark:text-[#f0976a] transition-colors duration-300">
            You&apos;ll Love
          </span>{" "}
          to Live
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="text-white/70 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl transition-colors duration-300"
        >
          Browse thousands of verified rental listings — apartments, houses,
          studios, and more. Book securely and move in with confidence.
        </motion.p>

        {/* Search Card */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
          className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 dark:border-white/8 rounded-2xl p-5 shadow-2xl transition-colors duration-300"
        >
          <p className="text-xs text-white/40 dark:text-slate-500 font-medium uppercase tracking-widest mb-4 text-center transition-colors duration-300">
            Search Properties
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLS}>
                <FiMapPin className="text-xs" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="City or area…"
                className={INPUT_CLS}
              />
            </div>

            {/* Property Type */}
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLS}>
                <FiHome className="text-xs" /> Property Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleChange}
                className={INPUT_CLS + " appearance-none cursor-pointer"}
              >
                <option value="" className="bg-[#1B3B5A] dark:bg-[#0f1f30]">
                  All Types
                </option>
                {PROPERTY_TYPES.map((t) => (
                  <option
                    key={t}
                    value={t}
                    className="bg-[#1B3B5A] dark:bg-[#0f1f30]"
                  >
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLS}>
                <FiDollarSign className="text-xs" /> Min Price /mo
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="0"
                min={0}
                className={INPUT_CLS}
              />
            </div>

            {/* Max Price */}
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLS}>
                <FiDollarSign className="text-xs" /> Max Price /mo
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="No limit"
                min={0}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-[#E8834D] hover:bg-[#d4723e] dark:hover:bg-[#c9622f] active:scale-[.98] text-white font-semibold text-sm tracking-wide rounded-xl py-3.5 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#E8834D]/25"
          >
            <FiSearch className="text-base" />
            Search Properties
          </button>
        </motion.div>
      </div>
    </section>
  );
}
