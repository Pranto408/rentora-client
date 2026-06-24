"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlinePlusCircle,
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const ROLE_LINKS = {
  tenant: {
    label: "Tenant",
    chipBg:
      "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50",
    accentBg: "bg-[#1B3B5A]",
    links: [
      {
        label: "Overview",
        href: "/dashboard/tenant",
        icon: HiOutlineSquares2X2,
        exact: true,
      },
      {
        label: "My Bookings",
        href: "/dashboard/tenant/bookings",
        icon: HiOutlineClipboardDocumentList,
      },
      {
        label: "Favorites",
        href: "/dashboard/tenant/favorites",
        icon: HiOutlineHeart,
      },
      {
        label: "Profile",
        href: "/dashboard/tenant/profile",
        icon: HiOutlineUser,
      },
    ],
  },
  owner: {
    label: "Owner",
    chipBg:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50",
    accentBg: "bg-[#1B3B5A]",
    links: [
      {
        label: "Dashboard",
        href: "/dashboard/owner",
        icon: HiOutlineSquares2X2,
        exact: true,
      },
      {
        label: "Add Property",
        href: "/dashboard/owner/add-property",
        icon: HiOutlinePlusCircle,
      },
      {
        label: "My Properties",
        href: "/dashboard/owner/my-properties",
        icon: HiOutlineBuildingOffice2,
      },
      {
        label: "Booking Requests",
        href: "/dashboard/owner/booking-requests",
        icon: HiOutlineClipboardDocumentList,
      },
      {
        label: "Profile",
        href: "/dashboard/owner/profile",
        icon: HiOutlineUser,
      },
    ],
  },
  admin: {
    label: "Admin",
    chipBg:
      "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50",
    accentBg: "bg-[#E8834D]",
    links: [
      {
        label: "All Users",
        href: "/dashboard/admin/users",
        icon: HiOutlineUsers,
      },
      {
        label: "All Properties",
        href: "/dashboard/admin/properties",
        icon: HiOutlineBuildingOffice2,
      },
      {
        label: "All Bookings",
        href: "/dashboard/admin/bookings",
        icon: HiOutlineClipboardDocumentList,
      },
      {
        label: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: HiOutlineCreditCard,
      },
      {
        label: "Profile",
        href: "/dashboard/admin/profile",
        icon: HiOutlineUser,
      },
    ],
  },
};

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user ?? null;
  const role = user?.role ?? "tenant";
  const config = ROLE_LINKS[role] ?? ROLE_LINKS["tenant"];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname === href;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#1B3B5A] to-[#1e4570] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
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
          <span className="font-bold text-[18px] text-[#1B3B5A] dark:text-blue-300 tracking-tight">
            Rentor<span className="text-[#E8834D]">a</span>
          </span>
        </Link>

        {/* User info */}
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user?.name}
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border-2 border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1B3B5A] to-[#E8834D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) ?? "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1A202C] dark:text-slate-100 truncate">
              {user?.name ?? "User"}
            </p>
            <span
              className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full ${config.chipBg}`}
            >
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {config.links.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? `${config.accentBg} text-white shadow-sm`
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1B3B5A] dark:hover:text-white",
              ].join(" ")}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1B3B5A] dark:hover:text-white transition-all"
        >
          <HiOutlineHome size={17} />
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all w-full text-left"
        >
          <HiOutlineArrowRightOnRectangle size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
