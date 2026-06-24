"use client";

import { useSession } from "@/lib/auth-client";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import Link from "next/link";

const STAT_CARDS = [
  {
    label: "Total Bookings",
    value: "0",
    icon: HiOutlineClipboardDocumentList,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
  },
  {
    label: "Pending",
    value: "0",
    icon: HiOutlineClock,
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    iconColor: "text-yellow-500",
  },
  {
    label: "Approved",
    value: "0",
    icon: HiOutlineCheckCircle,
    bg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-500",
  },
  {
    label: "Favorites",
    value: "0",
    icon: HiOutlineHeart,
    bg: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-500",
  },
];

const QUICK_LINKS = [
  {
    label: "My Bookings",
    href: "/dashboard/tenant/bookings",
    icon: HiOutlineClipboardDocumentList,
    desc: "Track all your property bookings",
  },
  {
    label: "My Favorites",
    href: "/dashboard/tenant/favorites",
    icon: HiOutlineHeart,
    desc: "Properties you have saved",
  },
  {
    label: "Browse Properties",
    href: "/properties",
    icon: HiOutlineCheckCircle,
    desc: "Find your next home",
  },
];

export default function TenantDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B3B5A] to-[#1e4a6e] rounded-2xl p-6 text-white">
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
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold">{user?.name ?? "Tenant"}</h1>
            <p className="text-white/60 text-xs mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, bg, iconColor }) => (
          <div
            key={label}
            className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 border border-slate-200 dark:border-slate-800"
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
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_LINKS.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#E8834D] hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1B3B5A]/10 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#E8834D] transition-colors">
                <Icon
                  size={18}
                  className="text-[#1B3B5A] dark:text-white group-hover:text-white"
                />
              </div>
              <p className="font-semibold text-[#1B3B5A] dark:text-white text-sm">
                {label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
