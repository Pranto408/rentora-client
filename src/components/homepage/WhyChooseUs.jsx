"use client";

import { motion } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineHome,
  HiOutlineChatBubbleLeftRight,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.93 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const BENEFITS = [
  {
    icon: HiOutlineShieldCheck,
    title: "Verified Listings",
    desc: "Every property is reviewed and verified by our team before going live. No scams, no surprises — just genuine homes.",
    accent: "#1B3B5A",
  },
  {
    icon: HiOutlineCreditCard,
    title: "Secure Payments",
    desc: "Stripe-powered checkout keeps your money safe. Pay reservation fees online with full encryption and instant confirmation.",
    accent: "#E8834D",
  },
  {
    icon: HiOutlineMagnifyingGlass,
    title: "Smart Search & Filters",
    desc: "Find exactly what you need — filter by location, type, price range, and more to reach your perfect match in seconds.",
    accent: "#1B3B5A",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Real Tenant Reviews",
    desc: "Read honest feedback from tenants who've lived there. Ratings and comments help you choose with confidence.",
    accent: "#E8834D",
  },
  {
    icon: HiOutlineHome,
    title: "Wide Property Range",
    desc: "From cozy studios to spacious villas — apartments, offices, condos, and townhouses across top locations.",
    accent: "#1B3B5A",
  },
  {
    icon: HiOutlineClipboardDocumentCheck,
    title: "Hassle-Free Booking",
    desc: "Book in minutes. Pick a move-in date, confirm your details, pay online, and you're all set — no paperwork.",
    accent: "#E8834D",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#F8F6F2] dark:bg-[#0c1420] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.p
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[#E8834D] font-semibold text-xs tracking-widest uppercase mb-4"
          >
            <span className="w-5 h-px bg-[#E8834D]" />
            Why Rentora
            <span className="w-5 h-px bg-[#E8834D]" />
          </motion.p>

          <motion.h2
            variants={fadeUp(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-[#1B3B5A] dark:text-slate-100 leading-tight tracking-tight mb-4 transition-colors duration-300"
          >
            The Smarter Way to
            <span className="text-[#E8834D]"> Rent</span>
          </motion.h2>

          <motion.p
            variants={fadeUp(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl transition-colors duration-300"
          >
            We built Rentora to remove the friction from finding and booking a
            rental — so you can focus on finding a place you love.
          </motion.p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map(({ icon: Icon, title, desc, accent }, i) => (
            <motion.div
              key={title}
              variants={scaleIn(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative bg-white dark:bg-[#111c2d] border border-slate-100 dark:border-slate-800 rounded-2xl p-7 shadow-sm hover:shadow-lg dark:hover:shadow-slate-900/60 transition-all duration-300"
            >
              {/* Accent bar top */}
              <div
                className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: accent }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ background: `${accent}15` }}
              >
                <Icon
                  size={22}
                  style={{ color: accent }}
                  className="transition-colors duration-300"
                />
              </div>

              <h3 className="font-display font-semibold text-[#1B3B5A] dark:text-slate-100 text-[1.05rem] mb-2 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom stat strip ── */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "2,400+", label: "Active Listings" },
            { value: "98%", label: "Verified Owners" },
            { value: "14k+", label: "Happy Tenants" },
            { value: "4.9★", label: "Average Rating" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center py-6 px-4 bg-white dark:bg-[#111c2d] border border-slate-100 dark:border-slate-800 rounded-2xl transition-colors duration-300"
            >
              <span className="text-2xl font-bold text-[#1B3B5A] dark:text-slate-100 font-display transition-colors duration-300">
                {value}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 tracking-wide transition-colors duration-300">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
