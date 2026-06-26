import Link from "next/link";
import { HiOutlineHome, HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] flex flex-col items-center justify-center px-4 gap-8">
      {/* 404 display */}
      <div className="text-center">
        <p className="text-8xl sm:text-9xl font-black text-[#1B3B5A] dark:text-white opacity-10 leading-none select-none">
          404
        </p>
        <div className="-mt-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#E8834D]/10 border border-[#E8834D]/20 flex items-center justify-center mx-auto mb-4">
            <HiOutlineBuildingOffice2 size={32} className="text-[#E8834D]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3B5A] dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-sm font-semibold transition-colors"
        >
          <HiOutlineHome size={16} />
          Back to Home
        </Link>
        <Link
          href="/properties"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <HiOutlineBuildingOffice2 size={16} />
          Browse Properties
        </Link>
      </div>
    </div>
  );
}
