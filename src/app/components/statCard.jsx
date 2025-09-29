"use client";

export default function StatCard({ icon, title, value, change, children }) {
  return (
    <div className="flex w-full flex-col items-start rounded-xl border border-panel-border bg-panel px-6 py-5">
      <div className="flex w-full items-center">
        <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-panel/60">
          {icon ? icon : <div className="h-4 w-4 rounded-full bg-white/20" />}
        </div>
      </div>

      <div className="mt-3 w-full flex-1">
        <p className="font-poppins text-base font-medium leading-tight tracking-wide text-white">{title}</p>
        <div className="mt-4 space-y-2">
          <p className="font-poppins text-2xl font-medium leading-none tracking-wide text-white">{value}</p>
          <div className="inline-flex items-center gap-1.5 font-poppins text-sm font-medium leading-none text-positive">
            <span className="flex h-4 w-4 items-center justify-center">
              <svg
                className="h-2 w-2"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M0.509607 0.0431321C3.18548 0.0185781 5.64719 0.0321949 8 0C7.97291 2.67407 7.98959 5.14066 7.95685 7.49039C7.34486 7.49885 6.87859 7.50071 6.29382 7.50856C6.3016 5.90439 6.3085 4.24551 6.31557 2.854L1.28554 7.88402C1.1316 8.03795 0.852252 8.0387 0.699142 7.88609L0.114328 7.30127C-0.0387716 7.14816 -0.0380135 6.8688 0.115981 6.71487L5.146 1.68485C3.59603 1.69848 2.04594 1.69001 0.496004 1.71115C0.49621 1.14672 0.508208 0.53756 0.509675 0.043548L0.509607 0.0431321Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>{change}</span>
          </div>
        </div>
      </div>

      {children && <div className="mt-4 w-full text-sm text-white/60">{children}</div>}
    </div>
  );
}
