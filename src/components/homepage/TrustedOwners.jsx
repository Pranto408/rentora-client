"use client";

import { motion } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineHome,
} from "react-icons/hi2";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const slideIn = (delay = 0) => ({
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const OWNERS = [
  {
    name: "Arif Rahman",
    location: "Gulshan, Dhaka",
    properties: 12,
    rating: 4.9,
    reviews: 87,
    since: "2021",
    specialty: "Apartments",
    initials: "AR",
    gradient: "from-[#1B3B5A] to-[#2a5580]",
  },
  {
    name: "Nadia Islam",
    location: "Agrabad, Chittagong",
    properties: 8,
    rating: 4.8,
    reviews: 54,
    since: "2022",
    specialty: "Villas",
    initials: "NI",
    gradient: "from-[#E8834D] to-[#c96b30]",
  },
  {
    name: "Karim Hossain",
    location: "Zindabazar, Sylhet",
    properties: 15,
    rating: 5.0,
    reviews: 112,
    since: "2020",
    specialty: "Studios & Condos",
    initials: "KH",
    gradient: "from-[#2d6a4f] to-[#1b4332]",
  },
  {
    name: "Sumaiya Begum",
    location: "Boalia, Rajshahi",
    properties: 6,
    rating: 4.7,
    reviews: 39,
    since: "2023",
    specialty: "Houses",
    initials: "SB",
    gradient: "from-[#6b3fa0] to-[#4a2878]",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <HiOutlineStar
          key={s}
          size={12}
          className={
            s <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-300 dark:text-slate-600"
          }
          style={s <= Math.round(rating) ? { fill: "currentColor" } : {}}
        />
      ))}
    </div>
  );
}

export default function TrustedOwners() {
  return (
    <section className="py-24 bg-[#F8F6F2] dark:bg-[#0c1420] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-14">
          <motion.p
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[#E8834D] font-semibold text-xs tracking-widest uppercase mb-4"
          >
            <span className="w-5 h-px bg-[#E8834D]" />
            Meet the Hosts
            <span className="w-5 h-px bg-[#E8834D]" />
          </motion.p>

          <motion.h2
            variants={fadeUp(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-[#1B3B5A] dark:text-slate-100 leading-tight tracking-tight mb-4 transition-colors duration-300"
          >
            Our <span className="text-[#E8834D]">Trusted</span> Property Owners
          </motion.h2>

          <motion.p
            variants={fadeUp(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl transition-colors duration-300"
          >
            Every owner on Rentora is verified and reviewed by real tenants.
            These are the hosts consistently delivering 5-star experiences.
          </motion.p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OWNERS.map((owner, i) => (
            <motion.div
              key={owner.name}
              variants={slideIn(i * 0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="group bg-white dark:bg-[#111c2d] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60 transition-all duration-300"
            >
              {/* Color banner */}
              <div
                className={`h-20 bg-gradient-to-r ${owner.gradient} relative`}
              >
                {/* Verified badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <HiOutlineShieldCheck size={11} />
                  Verified
                </div>
              </div>

              {/* Avatar — overlaps banner */}
              <div className="px-5 pb-5">
                <div className="relative -mt-8 mb-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${owner.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white dark:border-[#111c2d] transition-colors duration-300`}
                  >
                    {owner.initials}
                  </div>
                </div>

                <h3 className="font-display font-bold text-[#1B3B5A] dark:text-slate-100 text-base mb-0.5 transition-colors duration-300">
                  {owner.name}
                </h3>

                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1 transition-colors duration-300">
                  <HiOutlineHome size={11} />
                  {owner.location}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={owner.rating} />
                  <span className="text-xs font-semibold text-amber-500">
                    {owner.rating}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">
                    ({owner.reviews})
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F8F6F2] dark:bg-slate-800/60 rounded-xl px-3 py-2 text-center transition-colors duration-300">
                    <p className="text-[#1B3B5A] dark:text-slate-100 font-bold text-sm transition-colors duration-300">
                      {owner.properties}
                    </p>
                    <p className="text-slate-400 text-[10px] transition-colors duration-300">
                      Properties
                    </p>
                  </div>
                  <div className="bg-[#F8F6F2] dark:bg-slate-800/60 rounded-xl px-3 py-2 text-center transition-colors duration-300">
                    <p className="text-[#1B3B5A] dark:text-slate-100 font-bold text-sm transition-colors duration-300">
                      {owner.since}
                    </p>
                    <p className="text-slate-400 text-[10px] transition-colors duration-300">
                      Member Since
                    </p>
                  </div>
                </div>

                {/* Specialty tag */}
                <div className="mt-3">
                  <span className="inline-flex items-center text-[11px] font-medium text-[#E8834D] bg-[#E8834D]/10 dark:bg-[#E8834D]/15 px-3 py-1 rounded-full transition-colors duration-300">
                    {owner.specialty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA strip ── */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#1B3B5A] to-[#2a5580] rounded-2xl px-8 py-7"
        >
          <div>
            <h3 className="font-display font-bold text-white text-xl mb-1">
              Own a property? List it on Rentora.
            </h3>
            <p className="text-blue-200 text-sm">
              Join 200+ verified owners earning monthly from their properties.
            </p>
          </div>
          <a
            href="mailto:rentora@gmail.com?subject=Become%20an%20Owner&body=Hello%20Rentora%20Team,%0A%0AI%20would%20like%20to%20become%20an%20owner."
            className="flex-shrink-0 bg-[#E8834D] hover:bg-[#d4723e] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#E8834D]/30 whitespace-nowrap"
          >
            Become an Owner →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
