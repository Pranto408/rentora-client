"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
  HiOutlineHome,
} from "react-icons/hi2";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] flex flex-col items-center justify-center px-4 gap-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 flex items-center justify-center">
        <HiOutlineExclamationTriangle size={40} className="text-red-500" />
      </div>

      {/* Text */}
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-[#1B3B5A] dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          An unexpected error occurred. This has been logged and we're working
          on a fix.
        </p>
        {error?.message && (
          <p className="mt-3 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-500 text-xs font-mono">
            {error.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8834D] hover:bg-[#d4733e] text-white text-sm font-semibold transition-colors"
        >
          <HiOutlineArrowPath size={16} />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <HiOutlineHome size={16} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
