"use client";

import StatCard from '@/app/components/statCard';

function Panel({ title, children, icon }) {
  const isPrimaryPanel =
    title === "Active tournaments" || title === "Top Performing Stocks";
  const titleClasses = isPrimaryPanel
    ? "font-['Poppins'] font-semibold text-[20.45px] leading-[100%] tracking-[0.06em] text-white"
    : "font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white";

  return (
    <div className="w-full rounded-[10px] border border-[#323232] bg-[#1B1B1B] p-6">
      <h3 className="flex items-center gap-3">
        {icon && (
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-black/60">
            {icon}
          </span>
        )}
        <span className={titleClasses}>{title}</span>
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
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  Tech Titans Weekly
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  1245 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex h-[27px] w-[79px] items-center justify-center gap-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  1000X
                </span>
                <span className="font-['Poppins'] font-medium text-[12px] leading-[100%] text-right text-white">2d 14h</span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  Crypto Crusher
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  867 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex h-[27px] w-[79px] items-center justify-center gap-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  500X
                </span>
                <span className="font-['Poppins'] font-medium text-[12px] leading-[100%] text-right text-white">5d 8h</span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  Blue Chip Champions
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  2134 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex h-[27px] w-[79px] items-center justify-center gap-1 rounded-full bg-[#FF5757] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4l7 8-7 8-7-8 7-8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  350X
                </span>
                <span className="font-['Poppins'] font-medium text-[12px] leading-[100%] text-right text-white">1d 2h</span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  Tech Titans Weekly
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  1245 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex h-[27px] w-[79px] items-center justify-center gap-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  1000X
                </span>
                <span className="font-['Poppins'] font-medium text-[12px] leading-[100%] text-right text-white">2d 14h</span>
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
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  AAPL
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  Apple Inc.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">$185.25</span>
                <span className="inline-flex items-center gap-1 font-['Poppins'] font-medium text-[13px] leading-[100%] text-[#0FEDBE]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 9l4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  +2.45%
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  TSLA
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  Tesla Inc.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">$242.11</span>
                <span className="inline-flex items-center gap-1 font-['Poppins'] font-medium text-[13px] leading-[100%] text-[#FF5757]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 15l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  -2.45%
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  NVDA
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  NVIDIA Corp.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">$456.89</span>
                <span className="inline-flex items-center gap-1 font-['Poppins'] font-medium text-[13px] leading-[100%] text-[#0FEDBE]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 9l4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  +2.45%
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-[#050505] p-3">
              <div>
                <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">
                  MSFT
                </p>
                <p className="font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-white/60 mt-1">
                  Microsoft Corp.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1B1B1B] font-['Poppins'] font-medium text-[13px] leading-[100%] text-white">$378.45</span>
                <span className="inline-flex items-center gap-1 font-['Poppins'] font-medium text-[13px] leading-[100%] text-[#0FEDBE]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 9l4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  +2.45%
                </span>
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
