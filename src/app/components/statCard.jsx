"use client";

export default function StatCard({ icon, title, value, change, children }) {
  return (
    <div className="bg-[#0b0b0b] border border-white/6 rounded-2xl px-6 py-5 min-h-[110px] w-full flex flex-col items-start">
      <div className="w-full flex items-center justify-start">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/60 mr-3">
          {icon ? icon : <div className="w-4 h-4 rounded-full bg-white/20" />}
        </div>
      </div>

      <div className="mt-3 w-full">
        <p className="text-xs text-white/60">{title}</p>
        <p className="text-2xl md:text-3xl font-extrabold mt-1">{value}</p>
        <p className={`text-xs mt-1 ${change && change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{change}</p>
      </div>

      {children && <div className="mt-3 text-sm text-white/60 w-full">{children}</div>}
    </div>
  );
}
