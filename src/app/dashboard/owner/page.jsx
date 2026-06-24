"use client";

import { useSession } from "@/lib/auth-client";
import {
  HiOutlineBanknotes,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList,
  HiOutlinePlusCircle,
} from "react-icons/hi2";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Placeholder monthly data — replace with real API data later
const MONTHLY_DATA = [
  { month: "Jul", earnings: 0 },
  { month: "Aug", earnings: 0 },
  { month: "Sep", earnings: 0 },
  { month: "Oct", earnings: 0 },
  { month: "Nov", earnings: 0 },
  { month: "Dec", earnings: 0 },
  { month: "Jan", earnings: 0 },
  { month: "Feb", earnings: 0 },
  { month: "Mar", earnings: 0 },
  { month: "Apr", earnings: 0 },
  { month: "May", earnings: 0 },
  { month: "Jun", earnings: 0 },
];

const SUMMARY_CARDS = [
  {
    label: "Total Earnings",
    value: "৳0",
    icon: HiOutlineBanknotes,
    bg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-500",
    desc: "From successful bookings",
  },
  {
    label: "Total Properties",
    value: "0",
    icon: HiOutlineBuildingOffice2,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
    desc: "Properties you have listed",
  },
  {
    label: "Total Bookings",
    value: "0",
    icon: HiOutlineClipboardDocumentList,
    bg: "bg-[#E8834D]/10 dark:bg-[#E8834D]/10",
    iconColor: "text-[#E8834D]",
    desc: "Confirmed across all properties",
  },
];

export default function OwnerDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "O";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B3B5A] to-[#1e4a6e] rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
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
            <p className="text-white/70 text-sm">Owner Dashboard</p>
            <h1 className="text-2xl font-bold">{user?.name ?? "Owner"}</h1>
            <p className="text-white/60 text-xs mt-0.5">{user?.email}</p>
          </div>
        </div>
        <Link
          href="/dashboard/owner/add-property"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-sm font-semibold transition-colors"
        >
          <HiOutlinePlusCircle size={18} />
          Add Property
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUMMARY_CARDS.map(
          ({ label, value, icon: Icon, bg, iconColor, desc }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                  <p className="text-3xl font-bold text-[#1B3B5A] dark:text-white mt-1">
                    {value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{desc}</p>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={22} className={iconColor} />
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1B3B5A] dark:text-white">
              Monthly Earnings
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Last 12 months overview
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#1B3B5A]/10 dark:bg-white/10 text-[#1B3B5A] dark:text-white">
            BDT ৳
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={MONTHLY_DATA}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B3B5A",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "13px",
              }}
              formatter={(value) => [`৳${value}`, "Earnings"]}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#E8834D"
              strokeWidth={2.5}
              dot={{ fill: "#E8834D", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "My Properties",
            href: "/dashboard/owner/my-properties",
            desc: "Manage your listings",
          },
          {
            label: "Booking Requests",
            href: "/dashboard/owner/booking-requests",
            desc: "Approve or reject bookings",
          },
          {
            label: "Add Property",
            href: "/dashboard/owner/add-property",
            desc: "List a new property",
          },
        ].map(({ label, href, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#E8834D] hover:shadow-md transition-all"
          >
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
  );
}
