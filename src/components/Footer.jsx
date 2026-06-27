"use client";

import Link from "next/link";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from "react-icons/hi2";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-white/10 transition-colors duration-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1B3B5A] to-[#1e4570] flex items-center justify-center relative overflow-hidden">
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Find your dream rental home, apartment, or commercial property
              with ease. We connect trusted owners with premium tenants
              seamlessly.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[
                { icon: <FaFacebookF size={14} />, href: "#" },
                { icon: <FaTwitter size={14} />, href: "#" },
                { icon: <FaInstagram size={14} />, href: "#" },
                { icon: <FaLinkedinIn size={14} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-[#E8834D] dark:hover:bg-[#E8834D] hover:text-white dark:hover:text-white transition-all duration-150"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#1B3B5A] dark:text-slate-200 font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Properties", href: "/properties" },
                { label: "About Rentora", href: "#" },
                { label: "Pricing Plans", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-500 dark:text-slate-400 hover:text-[#E8834D] dark:hover:text-[#E8834D] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h3 className="text-[#1B3B5A] dark:text-slate-200 font-semibold text-sm tracking-wider uppercase mb-4">
              Support & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "FAQs", href: "#" },
                { label: "Contact Us", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-500 dark:text-slate-400 hover:text-[#E8834D] dark:hover:text-[#E8834D] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-[#1B3B5A] dark:text-slate-200 font-semibold text-sm tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <HiOutlineMapPin
                  size={18}
                  className="text-[#E8834D] flex-shrink-0 mt-0.5"
                />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <HiOutlinePhone
                  size={16}
                  className="text-[#E8834D] flex-shrink-0"
                />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <HiOutlineEnvelope
                  size={16}
                  className="text-[#E8834D] flex-shrink-0"
                />
                <span className="truncate">support@rentora.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {currentYear} Rentora. All rights reserved.</p>
          <p>
            Developed with ❤️ by{" "}
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Pranto Dutta
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
