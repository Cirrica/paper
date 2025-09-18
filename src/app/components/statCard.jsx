"use client";

export default function StatCard({ icon, title, value, change, children }) {
  return (
    <div className="bg-[#1B1B1B] border border-[#323232] rounded-[10px] px-6 py-5 h-[193px] w-[270px] flex flex-col items-start">
      <div className="w-full flex items-center justify-start">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/60 mr-3">
          {icon ? icon : <div className="w-4 h-4 rounded-full bg-white/20" />}
        </div>
      </div>

      <div className="mt-3 w-full">
        <p className="font-['Poppins'] font-medium text-[15px] leading-[100%] tracking-[0.06em] text-white">{title}</p>
        <p className="font-['Poppins'] font-medium text-[25px] leading-[100%] tracking-[0.06em] text-white mt-[36px]">{value}</p>
        <div className="mt-[38px] inline-flex items-center gap-1.5 font-['Poppins'] font-medium text-[13px] leading-[100%] tracking-[0.06em] text-[#0FEDBE]">
          <svg
            className="h-3.5 w-3.5"
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
              d="M5 12h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{change}</span>
        </div>
      </div>

      {children && <div className="mt-3 text-sm text-white/60 w-full">{children}</div>}
    </div>
  );
}
