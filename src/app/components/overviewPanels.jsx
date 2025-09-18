"use client";

import StatCard from '@/app/components/statCard';

function Panel({ title, children, icon }) {
  return (
    <div className="bg-[#0b0b0b] border border-white/6 rounded-2xl p-6 w-full">
      <h3 className="flex items-center gap-3 font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
        {icon && (
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-black/60">
            {icon}
          </span>
        )}
        <span>{title}</span>
      </h3>
      <div className="mt-4 text-sm text-white/60">{children}</div>
    </div>
  );
}

export default function OverviewPanels() {
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats row (spans full width on small, left on large) */}
      <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
  <StatCard
    icon={
      <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1v22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
    title="Portfolio Value"
    value="$125,432"
    change="+12.5%"
  />
  <StatCard
    icon={
      <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14s1.5-2 4-2 4 2 4 2v4H8v-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2l1.5 4H10.5L12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
    title="Active Tournaments"
    value="10"
    change="+1 this week"
  />
  <StatCard
    icon={
      <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
    title="Friends"
    value="24"
    change="+5 new"
  />
  <StatCard
    icon={
      <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 14l4-4 4 6 4-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
    title="Win Rate"
    value="68%"
    change="+5.5%"
  />
      </div>

      {/* Two main panels below (side-by-side on large screens) */}
      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel
          title="Active tournaments"
          icon={
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91l-5-3.64 5.91-.99L12 2z" stroke="currentColor" strokeWidth="0" fill="currentColor" />
            </svg>
          }
        >
          <ul className="space-y-4">
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">Tech Titans Weekly</p>
                <p className="text-xs text-white/50 mt-1">1245 participants</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-xs">⚡1000x</span>
                <span className="text-xs text-white/60">2d 14h</span>
              </div>
            </li>
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">Crypto Crusher</p>
                <p className="text-xs text-white/50 mt-1">867 participants</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-xs">⚡500x</span>
                <span className="text-xs text-white/60">5d 8h</span>
              </div>
            </li>
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">Blue Chip Champions</p>
                <p className="text-xs text-white/50 mt-1">2134 participants</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-600 text-xs">💎350x</span>
                <span className="text-xs text-white/60">1d 2h</span>
              </div>
            </li>
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">Tech Titans Weekly</p>
                <p className="text-xs text-white/50 mt-1">1245 participants</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-xs">⚡1000x</span>
                <span className="text-xs text-white/60">2d 14h</span>
              </div>
            </li>
          </ul>
          <div className="mt-5">
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-[#DAA56A] to-[#FADABD] text-black font-medium">View all Tournament</button>
          </div>
        </Panel>

        <Panel
          title="Top Performing Stocks"
          icon={
            <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 14l4-4 4 6 4-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <ul className="space-y-4">
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">AAPL</p>
                <p className="text-xs text-white/50 mt-1">Apple Inc.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-sm font-medium">$185.25</span>
                <span className="text-xs text-emerald-400">+2.45%</span>
              </div>
            </li>
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">TSLA</p>
                <p className="text-xs text-white/50 mt-1">Tesla Inc.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-sm font-medium">$242.11</span>
                <span className="text-xs text-rose-400">-2.45%</span>
              </div>
            </li>
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">NVDA</p>
                <p className="text-xs text-white/50 mt-1">NVIDIA Corp.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-sm font-medium">$456.89</span>
                <span className="text-xs text-emerald-400">+2.45%</span>
              </div>
            </li>
            <li className="flex items-center justify-between bg-black/60 rounded-lg p-3">
              <div>
                <p className="font-medium">MSFT</p>
                <p className="text-xs text-white/50 mt-1">Microsoft Corp.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0f0f0f] text-sm font-medium">$378.45</span>
                <span className="text-xs text-emerald-400">+2.45%</span>
              </div>
            </li>
          </ul>
          <div className="mt-5">
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-[#DAA56A] to-[#FADABD] text-black font-medium">Explore all Stocks</button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
