"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineSquares2X2,
  HiOutlineHeart,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlinePlusCircle,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";
import { RiMoonLine, RiSunLine } from "react-icons/ri";

// ─── Demo user — swap with your real AuthContext ───────────────────────────
const DEMO_USER = {
  name: "Pranto Ahmed",
  email: "pranto@rentora.com",
  role: "tenant", // "tenant" | "owner" | "admin"
  photoURL: null,
};
// const DEMO_USER = null;
// ──────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "/", icon: <HiOutlineHome size={15} /> },
  {
    label: "All Properties",
    href: "/properties",
    icon: <HiOutlineBuildingOffice2 size={15} />,
  },
];

const DASHBOARD_ROUTES = {
  tenant: "/dashboard/tenant",
  owner: "/dashboard/owner",
  admin: "/dashboard/admin",
};

const ROLE_CONFIG = {
  tenant: {
    label: "Tenant",
    chipBg:
      "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50",
    menuItems: [
      {
        label: "My Bookings",
        href: "/dashboard/tenant/bookings",
        icon: <HiOutlineClipboardDocumentList size={15} />,
      },
      {
        label: "Favorites",
        href: "/dashboard/tenant/favorites",
        icon: <HiOutlineHeart size={15} />,
      },
      {
        label: "Profile",
        href: "/dashboard/tenant/profile",
        icon: <HiOutlineUser size={15} />,
      },
    ],
  },
  owner: {
    label: "Owner",
    chipBg:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50",
    menuItems: [
      {
        label: "Dashboard",
        href: "/dashboard/owner",
        icon: <HiOutlineSquares2X2 size={15} />,
      },
      {
        label: "Add Property",
        href: "/dashboard/owner/add",
        icon: <HiOutlinePlusCircle size={15} />,
      },
      {
        label: "Profile",
        href: "/dashboard/owner/profile",
        icon: <HiOutlineUser size={15} />,
      },
    ],
  },
  admin: {
    label: "Admin",
    chipBg:
      "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50",
    menuItems: [
      {
        label: "Dashboard",
        href: "/dashboard/admin",
        icon: <HiOutlineShieldCheck size={15} />,
      },
      {
        label: "Profile",
        href: "/dashboard/admin/profile",
        icon: <HiOutlineUser size={15} />,
      },
    ],
  },
};

export default function Navbar() {
  const user = DEMO_USER;
  const handleLogout = () => console.log("logout triggered");

  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roleConfig = user ? ROLE_CONFIG[user.role] : null;
  const dashboardHref = user ? DASHBOARD_ROUTES[user.role] : "/login";

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("rentora-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("rentora-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href) =>
    [
      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 outline-none",
      isActive(href)
        ? "bg-blue-50 dark:bg-slate-800 text-[#1B3B5A] dark:text-blue-300 font-semibold"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1B3B5A] dark:hover:text-blue-300",
    ].join(" ");

  const mobileLinkClass = (href) =>
    [
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] font-medium transition-all",
      isActive(href)
        ? "bg-blue-50 dark:bg-slate-800 text-[#1B3B5A] dark:text-blue-300 font-semibold"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
    ].join(" ");

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          "bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md",
          scrolled
            ? "border-b border-slate-200 dark:border-white/10 shadow-[0_2px_16px_rgba(27,59,90,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]"
            : "border-b border-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* ── BRAND ──────────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1B3B5A] to-[#1e4570] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <rect
                    x="7.5"
                    y="11"
                    width="5"
                    height="7"
                    rx="0.5"
                    fill="#E8834D"
                  />
                </svg>
              </div>
              <span className="font-bold text-[20px] text-[#1B3B5A] dark:text-blue-300 tracking-tight leading-none">
                Rentor<span className="text-[#E8834D]">a</span>
              </span>
            </Link>

            {/* ── CENTER NAV LINKS ──────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* 🟢 মাঝখানের অপ্রয়োজনীয় ডুপ্লিকেট লগইন/রেজিস্টার লিংক দুটি রিমুভ করা হয়েছে */}
              {user && (
                <Link href={dashboardHref} className={linkClass("/dashboard")}>
                  <HiOutlineSquares2X2 size={15} />
                  Dashboard
                </Link>
              )}
            </div>

            {/* ── RIGHT ACTIONS ───────────────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-150"
              >
                {isDark ? <RiSunLine size={17} /> : <RiMoonLine size={16} />}
              </button>

              {/* LOGGED OUT BUTTONS (ডানপাশের সুন্দর বাটনগুলো ঠিক রাখা হয়েছে) */}
              {!user && (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center h-9 px-4 text-sm font-medium border border-slate-200 dark:border-slate-600 text-[#1B3B5A] dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center h-9 px-5 text-sm font-semibold bg-[#E8834D] hover:bg-[#d96f38] text-white rounded-lg shadow-[0_2px_8px_rgba(232,131,77,0.35)] transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* CUSTOM TAILWIND DROPDOWN */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1B3B5A]"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center rounded-md flex-shrink-0 text-[11px] font-bold text-white uppercase">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-[#1A202C] dark:text-slate-200 max-w-[80px] truncate hidden sm:block">
                      {user.name.split(" ")[0]}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={`text-slate-400 hidden sm:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown Menu Panel */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Header */}
                      <div className="flex items-center gap-3 p-2.5 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                        <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center rounded-md text-sm font-bold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1A202C] dark:text-slate-100 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate mb-1">
                            {user.email}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${roleConfig?.chipBg}`}
                          >
                            {roleConfig?.label}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-0.5 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                        {roleConfig?.menuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2.5 w-full px-2.5 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                          >
                            <span className="text-slate-400">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                      >
                        <HiOutlineArrowRightOnRectangle size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                {mobileOpen ? (
                  <HiOutlineXMark size={18} />
                ) : (
                  <HiOutlineBars3 size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />
        <div
          className={`absolute top-[68px] left-0 right-0 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-1 transition-transform duration-200 ${mobileOpen ? "translate-y-0" : "-translate-y-4"}`}
        >
          {user && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
              <div className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center rounded-md text-sm font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1A202C] dark:text-slate-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full mt-1 ${roleConfig?.chipBg}`}
                >
                  {roleConfig?.label}
                </span>
              </div>
            </div>
          )}

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={mobileLinkClass(link.href)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {user && (
            <Link
              href={dashboardHref}
              className={mobileLinkClass("/dashboard")}
            >
              <HiOutlineSquares2X2 size={18} />
              Dashboard
            </Link>
          )}

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

          {!user && (
            <>
              <Link href="/login" className={mobileLinkClass("/login")}>
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#E8834D] text-white font-semibold shadow-[0_2px_8px_rgba(232,131,77,0.3)]"
              >
                Register
              </Link>
            </>
          )}

          {user &&
            roleConfig?.menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[15px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/40 mt-1 transition-all"
            >
              <HiOutlineArrowRightOnRectangle size={18} />
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="h-[68px]" />
    </>
  );
}
