"use client";

import { motion } from "framer-motion";
import { HiOutlineMapPin } from "react-icons/hi2";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

// Each card has a gradient pair and a listing count
const LOCATIONS = [
  {
    city: "Dhaka",
    area: "Gulshan & Banani",
    listings: 340,
    gradient: "from-[#1B3B5A] to-[#2a5580]",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    city: "Chittagong",
    area: "Agrabad & Nasirabad",
    listings: 215,
    gradient: "from-[#E8834D] to-[#c96b30]",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
  {
    city: "Sylhet",
    area: "Zindabazar & Upashahar",
    listings: 148,
    gradient: "from-[#2d6a4f] to-[#1b4332]",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    city: "Rajshahi",
    area: "Shaheb Bazar & Boalia",
    listings: 97,
    gradient: "from-[#6b3fa0] to-[#4a2878]",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  },
  {
    city: "Khulna",
    area: "Sonadanga & Khalishpur",
    listings: 84,
    gradient: "from-[#0f4c75] to-[#1b6ca8]",
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80",
  },
  {
    city: "Cumilla",
    area: "Kandirpar & Tomsom Bridge",
    listings: 63,
    gradient: "from-[#b5451b] to-[#e07b39]",
    img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80",
  },
];

export default function TopLocations() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a1628] transition-colors duration-300 overflow-hidden">
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
            Explore Cities
            <span className="w-5 h-px bg-[#E8834D]" />
          </motion.p>

          <motion.h2
            variants={fadeUp(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-[#1B3B5A] dark:text-slate-100 leading-tight tracking-tight mb-4 transition-colors duration-300"
          >
            Top <span className="text-[#E8834D]">Locations</span> to Rent
          </motion.h2>

          <motion.p
            variants={fadeUp(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl transition-colors duration-300"
          >
            Discover rental properties in Bangladesh&apos;s most sought-after cities
            — from Dhaka&apos;s business hubs to Sylhet&apos;s scenic neighbourhoods.
          </motion.p>
        </div>

        {/* ── Bento-style grid ── */}
        {/* Row 1: large + two stacked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Large card — Dhaka */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
            className="md:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group h-64 md:h-80"
          >
            <img
              src={LOCATIONS[0].img}
              alt={LOCATIONS[0].city}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${LOCATIONS[0].gradient} opacity-70`}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                <HiOutlineMapPin size={12} />
                {LOCATIONS[0].area}
              </div>
              <h3 className="text-white font-display font-bold text-2xl leading-tight">
                {LOCATIONS[0].city}
              </h3>
              <span className="mt-2 inline-flex items-center text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                {LOCATIONS[0].listings} listings
              </span>
            </div>
          </motion.div>

          {/* Two stacked — Chittagong + Sylhet */}
          <div className="flex flex-col gap-5">
            {LOCATIONS.slice(1, 3).map((loc, i) => (
              <motion.div
                key={loc.city}
                variants={fadeUp(0.1 + i * 0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group flex-1 h-36 md:h-auto"
              >
                <img
                  src={loc.img}
                  alt={loc.city}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${loc.gradient} opacity-70`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="flex items-center gap-1 text-white/80 text-[11px] mb-0.5">
                    <HiOutlineMapPin size={11} />
                    {loc.area}
                  </div>
                  <h3 className="text-white font-display font-bold text-lg leading-tight">
                    {loc.city}
                  </h3>
                  <span className="mt-1.5 inline-flex items-center text-[11px] font-semibold text-white/90 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 w-fit">
                    {loc.listings} listings
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Row 2: three equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {LOCATIONS.slice(3).map((loc, i) => (
            <motion.div
              key={loc.city}
              variants={fadeUp(0.15 + i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group h-52"
            >
              <img
                src={loc.img}
                alt={loc.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${loc.gradient} opacity-70`}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="flex items-center gap-1 text-white/80 text-[11px] mb-0.5">
                  <HiOutlineMapPin size={11} />
                  {loc.area}
                </div>
                <h3 className="text-white font-display font-bold text-lg leading-tight">
                  {loc.city}
                </h3>
                <span className="mt-1.5 inline-flex items-center text-[11px] font-semibold text-white/90 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 w-fit">
                  {loc.listings} listings
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
