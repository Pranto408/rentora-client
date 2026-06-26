export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0d1b2a] flex flex-col items-center justify-center gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#1B3B5A] to-[#1e4570] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
              stroke="white"
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill="none"
            />
            <rect x="7.5" y="11" width="5" height="7" rx="0.5" fill="#E8834D" />
          </svg>
        </div>
        <span className="font-bold text-[22px] text-[#1B3B5A] dark:text-white tracking-tight">
          Rentor<span className="text-[#E8834D]">a</span>
        </span>
      </div>

      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#1B3B5A]/10 dark:border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E8834D] animate-spin" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-[#1B3B5A] dark:text-white font-semibold">Loading…</p>
        <p className="text-slate-400 text-sm mt-1">Please wait a moment</p>
      </div>
    </div>
  );
}
