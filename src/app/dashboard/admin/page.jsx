"use client";

import { useSession } from "@/lib/auth-client";
import {
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import Link from "next/link";

const SUMMARY_CARDS = [
  {
    label: "Total Users",
    value: "0",
    icon: HiOutlineUsers,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
    href: "/dashboard/admin/users",
  },
  {
    label: "Total Properties",
    value: "0",
    icon: HiOutlineBuildingOffice2,
    bg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-500",
    href: "/dashboard/admin/properties",
  },
  {
    label: "Total Bookings",
    value: "0",
    icon: HiOutlineClipboardDocumentList,
    bg: "bg-[#E8834D]/10 dark:bg-[#E8834D]/10",
    iconColor: "text-[#E8834D]",
    href: "/dashboard/admin/bookings",
  },
  {
    label: "Transactions",
    value: "0",
    icon: HiOutlineCreditCard,
    bg: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-500",
    href: "/dashboard/admin/transactions",
  },
];

const MANAGE_LINKS = [
  {
    label: "Manage Users",
    href: "/dashboard/admin/users",
    icon: HiOutlineUsers,
    desc: "Change roles, view all registered users",
  },
  {
    label: "Manage Properties",
    href: "/dashboard/admin/properties",
    icon: HiOutlineBuildingOffice2,
    desc: "Approve, reject, or delete listings",
  },
  {
    label: "Monitor Bookings",
    href: "/dashboard/admin/bookings",
    icon: HiOutlineClipboardDocumentList,
    desc: "View all booking activity",
  },
  {
    label: "View Transactions",
    href: "/dashboard/admin/transactions",
    icon: HiOutlineCreditCard,
    desc: "Track all payments and transactions",
  },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "A";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B3B5A] to-[#E8834D] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white/20 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <HiOutlineShieldCheck size={16} className="text-white/70" />
              <p className="text-white/70 text-sm">Admin Panel</p>
            </div>
            <h1 className="text-2xl font-bold">{user?.name ?? "Admin"}</h1>
            <p className="text-white/60 text-xs mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map(
          ({ label, value, icon: Icon, bg, iconColor, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-[#E8834D] hover:shadow-md transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}
              >
                <Icon size={20} className={iconColor} />
              </div>
              <p className="text-2xl font-bold text-[#1B3B5A] dark:text-white">
                {value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {label}
              </p>
            </Link>
          ),
        )}
      </div>

      {/* Management Links */}
      <div>
        <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white mb-3">
          Manage Platform
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MANAGE_LINKS.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#E8834D] hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1B3B5A]/10 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8834D] transition-colors">
                <Icon
                  size={20}
                  className="text-[#1B3B5A] dark:text-white group-hover:text-white"
                />
              </div>
              <div>
                <p className="font-semibold text-[#1B3B5A] dark:text-white text-sm">
                  {label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
