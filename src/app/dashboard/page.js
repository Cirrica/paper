'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

function StatCard({ icon, title, value, change, children }) {
  return (
    <div className='flex w-full flex-col items-start rounded-xl border border-panel-border bg-panel px-6 py-5'>
      <div className='flex w-full items-center'>
        <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-panel/60'>
          {icon ? icon : <div className='h-4 w-4 rounded-full bg-white/20' />}
        </div>
      </div>

      <div className='mt-3 w-full flex-1'>
        <p className='font-poppins text-base font-medium leading-tight tracking-wide text-white'>
          {title}
        </p>
        <div className='mt-4 space-y-2'>
          <p className='font-poppins text-2xl font-medium leading-none tracking-wide text-white'>
            {value}
          </p>
          <div className='inline-flex items-center gap-1.5 font-poppins text-sm font-medium leading-none text-positive'>
            <span className='flex h-4 w-4 items-center justify-center'>
              <svg
                className='h-2 w-2'
                viewBox='0 0 8 8'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  d='M0.509607 0.0431321C3.18548 0.0185781 5.64719 0.0321949 8 0C7.97291 2.67407 7.98959 5.14066 7.95685 7.49039C7.34486 7.49885 6.87859 7.50071 6.29382 7.50856C6.3016 5.90439 6.3085 4.24551 6.31557 2.854L1.28554 7.88402C1.1316 8.03795 0.852252 8.0387 0.699142 7.88609L0.114328 7.30127C-0.0387716 7.14816 -0.0380135 6.8688 0.115981 6.71487L5.146 1.68485C3.59603 1.69848 2.04594 1.69001 0.496004 1.71115C0.49621 1.14672 0.508208 0.53756 0.509675 0.043548L0.509607 0.0431321Z'
                  fill='currentColor'
                />
              </svg>
            </span>
            <span>{change}</span>
          </div>
        </div>
      </div>

      {children ? (
        <div className='mt-4 w-full text-sm text-white/60'>{children}</div>
      ) : null}
    </div>
  );
}

function Panel({ title, children, icon }) {
  const isPrimaryPanel =
    title === 'Active tournaments' || title === 'Top Performing Stocks';
  const titleClasses = isPrimaryPanel
    ? 'font-poppins text-xl font-semibold leading-none tracking-wide text-white'
    : 'font-poppins text-base font-medium leading-none tracking-wide text-white';

  return (
    <div className='w-full rounded-xl border border-panel-border bg-panel p-6'>
      <h3 className='flex items-center gap-3'>
        {icon ? (
          <span className='flex h-8 w-8 items-center justify-center rounded-md bg-panel/60'>
            {icon}
          </span>
        ) : null}
        <span className={titleClasses}>{title}</span>
      </h3>
      <div className='mt-4 text-sm text-white/60'>{children}</div>
    </div>
  );
}

function OverviewPanels({ onViewAllTournaments }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Stats row (spans full width on small, left on large) */}
      <div className="col-span-1 grid grid-cols-2 gap-6 md:grid-cols-4 lg:col-span-3">
        <StatCard
          icon={
            <svg
              className="h-9 w-9 text-white"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M17 0.25C26.2388 0.25 33.75 7.76123 33.75 17C33.75 26.2388 26.2388 33.75 17 33.75C7.76123 33.75 0.25 26.2388 0.25 17C0.25 7.76123 7.76123 0.25 17 0.25ZM17 3.11426C9.34614 3.11426 3.11426 9.34614 3.11426 17C3.11426 24.6539 9.34614 30.8857 17 30.8857C24.6539 30.8857 30.8857 24.6539 30.8857 17C30.8857 9.34614 24.6539 3.11426 17 3.11426Z"
                fill="currentColor"
              />
              <path
                d="M15.8899 24.7128L15.6575 24.6962C13.8334 24.5657 12.3891 23.2054 12.1174 21.4394L12.095 21.2675L12.093 21.2538L12.095 21.2343C12.0983 21.2251 12.1055 21.2131 12.1204 21.1991C12.1518 21.1695 12.1992 21.1513 12.2405 21.1513H14.2083C14.2472 21.1513 14.272 21.1625 14.2864 21.1738C14.2998 21.1843 14.3147 21.2023 14.3215 21.2363L14.3235 21.245C14.4913 21.9573 15.122 22.5107 15.8909 22.5107H17.6086C18.7241 22.5106 19.7742 21.6769 19.8967 20.5341L19.8977 20.5312C20.0185 19.2428 19.012 18.1104 17.7161 18.1103H16.4631C14.217 18.1102 12.2433 16.5433 11.9075 14.3603L11.8801 14.1474C11.6435 11.7076 13.3708 9.64351 15.6731 9.33879L15.8899 9.30949V7.12199C15.8899 7.06462 15.9277 7.01263 15.9788 6.99016L16.0334 6.97844H17.9661C18.0427 6.97844 18.1095 7.04538 18.1096 7.12199V9.28801L18.342 9.30363C20.217 9.43756 21.6899 10.8712 21.9016 12.7089C21.8995 12.784 21.8354 12.8486 21.76 12.8486H19.7913C19.7524 12.8485 19.7275 12.8374 19.7131 12.8261C19.7065 12.8208 19.6996 12.8136 19.6936 12.8036L19.679 12.7636L19.677 12.7558L19.6399 12.6239C19.4297 11.976 18.8306 11.4892 18.1096 11.4892H16.3918C15.2764 11.4892 14.2254 12.323 14.1028 13.4657V13.4697C13.9822 14.7579 14.9885 15.8896 16.2844 15.8896H17.7512C20.325 15.8896 22.3902 18.1261 22.1194 20.7323V20.7333C21.9171 22.7542 20.2975 24.2855 18.3176 24.6269L18.1096 24.663V26.8779C18.1096 26.9545 18.0427 27.0214 17.9661 27.0214H16.0334C15.9569 27.0212 15.8899 26.9544 15.8899 26.8779V24.7128Z"
                fill="currentColor"
              />
            </svg>
          }
          title="Portfolio Value"
          value="$125,432"
          change="+12.5%"
        />
        <StatCard
          icon={
            <svg
              className="h-9 w-9 text-white"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6.625 7.59961C6.625 8.50466 6.9798 9.37366 7.6123 10.0146C8.24498 10.6558 9.10382 11.0166 10 11.0166C10.8962 11.0166 11.755 10.6558 12.3877 10.0146C13.0202 9.37366 13.375 8.50466 13.375 7.59961V2.2832H6.625V7.59961ZM2.25 6.33301C2.25 6.73419 2.40755 7.11962 2.68848 7.4043C2.96952 7.68909 3.3511 7.84961 3.75 7.84961H4.625V4.18359H2.25V6.33301ZM15.375 7.84961H16.25C16.6489 7.84961 17.0305 7.68909 17.3115 7.4043C17.5925 7.11962 17.75 6.73419 17.75 6.33301V4.18359H15.375V7.84961ZM9 12.9561L8.80664 12.9111C8.03153 12.7311 7.30554 12.3781 6.68066 11.8789C6.0558 11.3797 5.54752 10.7462 5.19336 10.0234L5.125 9.88379H3.75C2.82283 9.88379 1.933 9.5101 1.27637 8.84473C0.619617 8.17922 0.25 7.27559 0.25 6.33301V3.16699C0.25 2.8963 0.356035 2.6367 0.543945 2.44629C0.731735 2.25605 0.985907 2.15039 1.25 2.15039H4.625V0.25H15.375V2.15039H18.75C19.0141 2.15039 19.2683 2.25605 19.4561 2.44629C19.644 2.6367 19.75 2.89629 19.75 3.16699V6.33301C19.75 7.27559 19.3804 8.17922 18.7236 8.84473C18.067 9.5101 17.1772 9.88379 16.25 9.88379H14.875L14.8066 10.0234C14.4525 10.7462 13.9442 11.3797 13.3193 11.8789C12.6945 12.3781 11.9685 12.7311 11.1934 12.9111L11 12.9561V16.7168H15.375V18.75H4.625V16.7168H9V12.9561Z"
                fill="currentColor"
              />
            </svg>
          }
          title="Active Tournaments"
          value="10"
          change="+1 this week"
        />
        <StatCard
          icon={
            <svg
              className="h-7 w-11 text-white"
              viewBox="0 0 22 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.95406 7.2534C10.8166 6.49593 11.3666 5.37563 11.3666 4.12505C11.3666 1.85071 9.55715 0 7.33325 0C5.10935 0 3.29991 1.85059 3.29991 4.12505C3.29991 5.37565 3.84897 6.49689 4.71245 7.2534C1.96153 8.33526 0 11.0595 0 14.2498C0 14.6641 0.328149 14.9998 0.733314 14.9998C1.13848 14.9998 1.46663 14.6641 1.46663 14.2498C1.46663 10.9414 4.09834 8.24987 7.33314 8.24987C10.5679 8.24987 13.1996 10.9414 13.1996 14.2498C13.1996 14.6641 13.5278 14.9998 13.933 14.9998C14.3381 14.9998 14.6663 14.6641 14.6663 14.2498C14.6663 11.0595 12.7058 8.33603 9.95406 7.2534ZM4.76689 4.12505C4.76689 2.67759 5.91818 1.49998 7.33361 1.49998C8.74903 1.49998 9.90032 2.67744 9.90032 4.12505C9.90032 5.57266 8.74903 6.75013 7.33361 6.75013C5.91818 6.75013 4.76689 5.57266 4.76689 4.12505ZM21.9999 14.25C21.9999 14.6644 21.6717 15 21.2666 15C20.8614 15 20.5333 14.6644 20.5333 14.25C20.5333 10.9417 17.9015 8.25011 14.6667 8.25011C14.2616 8.25011 13.9334 7.9145 13.9334 7.50012C13.9334 7.08574 14.2616 6.75013 14.6667 6.75013C16.082 6.75013 17.2335 5.57266 17.2335 4.12505C17.2335 2.67744 16.0822 1.49998 14.6667 1.49998C14.2643 1.49998 13.8793 1.59185 13.5237 1.77372C13.1607 1.9584 12.7216 1.80934 12.5401 1.43811C12.3586 1.06779 12.5062 0.616862 12.8683 0.432185C13.4293 0.145318 14.0343 0 14.6667 0C16.8905 0 18.7001 1.85059 18.7001 4.12505C18.7001 5.37565 18.151 6.49689 17.2875 7.2534C20.0385 8.33526 22 11.0595 22 14.2498L21.9999 14.25Z"
                fill="currentColor"
              />
            </svg>
          }
          title="Friends"
          value="24"
          change="+5 new"
        />
        <StatCard
          icon={
            <svg
              className="h-9 w-7 text-white/80"
              viewBox="0 0 17 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.54044 7.83972H4.52944V6.00923C4.52944 5.51708 4.13084 5.11848 3.63869 5.11848C3.14654 5.11848 2.74794 5.51708 2.74794 6.00923V7.83972H1.73583C0.779381 7.83972 0 8.61802 0 9.57555V15.6169C0 16.5745 0.77941 17.3528 1.73583 17.3528H2.74794V19.1844C2.74794 19.6765 3.14654 20.0751 3.63869 20.0751C4.13084 20.0751 4.52944 19.6765 4.52944 19.1844V17.3528H5.54044C6.498 17.3528 7.27627 16.5745 7.27627 15.6169V9.57555C7.27627 8.61799 6.49797 7.83972 5.54044 7.83972ZM5.49479 15.5725L1.78159 15.6171L1.73594 9.62128L5.49503 9.57563L5.49479 15.5725Z" fill="currentColor" />
              <path d="M15.2642 2.72235H14.2521V0.890746C14.2521 0.398598 13.8535 0 13.3613 0C12.8692 0 12.4706 0.398598 12.4706 0.890746V2.72235H11.4585C10.5009 2.72235 9.72266 3.50065 9.72266 4.45818V10.4996C9.72266 11.4571 10.5021 12.2354 11.4585 12.2354H12.4706V14.0659C12.4706 14.558 12.8692 14.9566 13.3613 14.9566C13.8535 14.9566 14.2521 14.558 14.2521 14.0659V12.2354H15.2642C16.2218 12.2354 17 11.4571 17 10.4996V4.45818C17 3.50062 16.2206 2.72235 15.2642 2.72235ZM15.2186 10.4552L11.5042 10.4997L11.4586 4.50391L15.2185 4.45826L15.2186 10.4552Z" fill="currentColor" />
            </svg>
          }
          title="Win Rate"
          value="68%"
          change="+5.5%"
        />
      </div>

      {/* Two main panels below (side-by-side on large screens) */}
      <div className="col-span-1 grid grid-cols-1 gap-5 lg:col-span-3 lg:grid-cols-2">
        <Panel
          title="Active tournaments"
          icon={
            <svg
              className="h-6 w-6 text-amber-400"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.625 7.59961C6.625 8.50466 6.9798 9.37366 7.6123 10.0146C8.24498 10.6558 9.10382 11.0166 10 11.0166C10.8962 11.0166 11.755 10.6558 12.3877 10.0146C13.0202 9.37366 13.375 8.50466 13.375 7.59961V2.2832H6.625V7.59961ZM2.25 6.33301C2.25 6.73419 2.40755 7.11962 2.68848 7.4043C2.96952 7.68909 3.3511 7.84961 3.75 7.84961H4.625V4.18359H2.25V6.33301ZM15.375 7.84961H16.25C16.6489 7.84961 17.0305 7.68909 17.3115 7.4043C17.5925 7.11962 17.75 6.73419 17.75 6.33301V4.18359H15.375V7.84961ZM9 12.9561L8.80664 12.9111C8.03153 12.7311 7.30554 12.3781 6.68066 11.8789C6.0558 11.3797 5.54752 10.7462 5.19336 10.0234L5.125 9.88379H3.75C2.82283 9.88379 1.933 9.5101 1.27637 8.84473C0.619617 8.17922 0.25 7.27559 0.25 6.33301V3.16699C0.25 2.8963 0.356035 2.6367 0.543945 2.44629C0.731735 2.25605 0.985907 2.15039 1.25 2.15039H4.625V0.25H15.375V2.15039H18.75C19.0141 2.15039 19.2683 2.25605 19.4561 2.44629C19.644 2.6367 19.75 2.89629 19.75 3.16699V6.33301C19.75 7.27559 19.3804 8.17922 18.7236 8.84473C18.067 9.5101 17.1772 9.88379 16.25 9.88379H14.875L14.8066 10.0234C14.4525 10.7462 13.9442 11.3797 13.3193 11.8789C12.6945 12.3781 11.9685 12.7311 11.1934 12.9111L11 12.9561V16.7168H15.375V18.75H4.625V16.7168H9V12.9561Z"
                fill="currentColor"
                stroke="currentColor"
              />
            </svg>
          }
        >
          <ul className="space-y-4">
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  Tech Titans Weekly
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  1245 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">
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
                <span className="font-poppins text-xs font-medium leading-none text-right text-white">2d 14h</span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  Crypto Crusher
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  867 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">
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
                <span className="font-poppins text-xs font-medium leading-none text-right text-white">5d 8h</span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  Blue Chip Champions
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  2134 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-danger-badge px-3 py-1 font-poppins text-sm font-medium text-white">
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
                  350X
                </span>
                <span className="font-poppins text-xs font-medium leading-none text-right text-white">1d 2h</span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  Tech Titans Weekly
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  1245 participants
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">
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
                <span className="font-poppins text-xs font-medium leading-none text-right text-white">2d 14h</span>
              </div>
            </li>
          </ul>
          <div className="mt-5">
            <button
              className="w-full rounded-lg bg-gradient-to-r from-gold to-gold-soft py-2 font-poppins font-medium text-black"
              onClick={onViewAllTournaments}
            >
              View all Tournament
            </button>
          </div>
        </Panel>

        <Panel
          title="Top Performing Stocks"
          icon={
            <svg
              className="h-7 w-6 text-teal-400"
              viewBox="0 0 17 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.54044 7.83972H4.52944V6.00923C4.52944 5.51708 4.13084 5.11848 3.63869 5.11848C3.14654 5.11848 2.74794 5.51708 2.74794 6.00923V7.83972H1.73583C0.779381 7.83972 0 8.61802 0 9.57555V15.6169C0 16.5745 0.77941 17.3528 1.73583 17.3528H2.74794V19.1844C2.74794 19.6765 3.14654 20.0751 3.63869 20.0751C4.13084 20.0751 4.52944 19.6765 4.52944 19.1844V17.3528H5.54044C6.498 17.3528 7.27627 16.5745 7.27627 15.6169V9.57555C7.27627 8.61799 6.49797 7.83972 5.54044 7.83972ZM5.49479 15.5725L1.78159 15.6171L1.73594 9.62128L5.49503 9.57563L5.49479 15.5725Z" fill="currentColor" />
              <path d="M15.2642 2.72235H14.2521V0.890746C14.2521 0.398598 13.8535 0 13.3613 0C12.8692 0 12.4706 0.398598 12.4706 0.890746V2.72235H11.4585C10.5009 2.72235 9.72266 3.50065 9.72266 4.45818V10.4996C9.72266 11.4571 10.5021 12.2354 11.4585 12.2354H12.4706V14.0659C12.4706 14.558 12.8692 14.9566 13.3613 14.9566C13.8535 14.9566 14.2521 14.558 14.2521 14.0659V12.2354H15.2642C16.2218 12.2354 17 11.4571 17 10.4996V4.45818C17 3.50062 16.2206 2.72235 15.2642 2.72235ZM15.2186 10.4552L11.5042 10.4997L11.4586 4.50391L15.2185 4.45826L15.2186 10.4552Z" fill="currentColor" />
            </svg>
          }
        >
          <ul className="space-y-4">
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  AAPL
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  Apple Inc.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center justify-center rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">$185.25</span>
                <span className="inline-flex items-center gap-1 font-poppins text-sm font-medium leading-none text-positive">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <svg
                      className="h-2 w-2"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                    <path d="M0.509607 0.0431321C3.18548 0.0185781 5.64719 0.0321949 8 0C7.97291 2.67407 7.98959 5.14066 7.95685 7.49039C7.34486 7.49885 6.87859 7.50071 6.29382 7.50856C6.3016 5.90439 6.3085 4.24551 6.31557 2.854L1.28554 7.88402C1.1316 8.03795 0.852252 8.0387 0.699142 7.88609L0.114328 7.30127C-0.0387716 7.14816 -0.0380135 6.8688 0.115981 6.71487L5.146 1.68485C3.59603 1.69848 2.04594 1.69001 0.496004 1.71115C0.49621 1.14672 0.508208 0.53756 0.509675 0.043548L0.509607 0.0431321Z" fill="currentColor" />
                    </svg>
                  </span>
                  +2.45%
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  TSLA
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  Tesla Inc.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center justify-center rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">$242.11</span>
                <span className="inline-flex items-center gap-1 font-poppins text-sm font-medium leading-none text-danger-badge">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <svg
                      className="h-2 w-2"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                    <path d="M0.509607 7.95687C3.18548 7.98142 5.64719 7.96781 8 8C7.97291 5.32593 7.98959 2.85934 7.95685 0.509614C7.34486 0.501147 6.87859 0.499286 6.29382 0.491439C6.3016 2.09561 6.3085 3.75449 6.31557 5.146L1.28554 0.115981C1.1316 -0.0379515 0.852252 -0.0386972 0.699142 0.113914L0.114328 0.69873C-0.0387716 0.851836 -0.0380135 1.1312 0.115981 1.28513L5.146 6.31515C3.59603 6.30152 2.04594 6.30999 0.496004 6.28885C0.49621 6.85328 0.508208 7.46244 0.509675 7.95645L0.509607 7.95687Z" fill="currentColor" />
                    </svg>
                  </span>
                  -2.45%
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  NVDA
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  NVIDIA Corp.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center justify-center rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">$456.89</span>
                <span className="inline-flex items-center gap-1 font-poppins text-sm font-medium leading-none text-positive">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <svg
                      className="h-2 w-2"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                    <path d="M0.509607 0.0431321C3.18548 0.0185781 5.64719 0.0321949 8 0C7.97291 2.67407 7.98959 5.14066 7.95685 7.49039C7.34486 7.49885 6.87859 7.50071 6.29382 7.50856C6.3016 5.90439 6.3085 4.24551 6.31557 2.854L1.28554 7.88402C1.1316 8.03795 0.852252 8.0387 0.699142 7.88609L0.114328 7.30127C-0.0387716 7.14816 -0.0380135 6.8688 0.115981 6.71487L5.146 1.68485C3.59603 1.69848 2.04594 1.69001 0.496004 1.71115C0.49621 1.14672 0.508208 0.53756 0.509675 0.043548L0.509607 0.0431321Z" fill="currentColor" />
                    </svg>
                  </span>
                  +2.45%
                </span>
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-surface p-3">
              <div>
                <p className="font-poppins text-base font-medium leading-none tracking-wide text-white">
                  MSFT
                </p>
                <p className="font-poppins mt-1 text-sm font-medium leading-none tracking-wide text-white/60">
                  Microsoft Corp.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center justify-center rounded-full bg-panel px-3 py-1 font-poppins text-sm font-medium text-white">$378.45</span>
                <span className="inline-flex items-center gap-1 font-poppins text-sm font-medium leading-none text-positive">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <svg
                      className="h-2 w-2"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                    <path d="M0.509607 0.0431321C3.18548 0.0185781 5.64719 0.0321949 8 0C7.97291 2.67407 7.98959 5.14066 7.95685 7.49039C7.34486 7.49885 6.87859 7.50071 6.29382 7.50856C6.3016 5.90439 6.3085 4.24551 6.31557 2.854L1.28554 7.88402C1.1316 8.03795 0.852252 8.0387 0.699142 7.88609L0.114328 7.30127C-0.0387716 7.14816 -0.0380135 6.8688 0.115981 6.71487L5.146 1.68485C3.59603 1.69848 2.04594 1.69001 0.496004 1.71115C0.49621 1.14672 0.508208 0.53756 0.509675 0.043548L0.509607 0.0431321Z" fill="currentColor" />
                    </svg>
                  </span>
                  +2.45%
                </span>
              </div>
            </li>
          </ul>
          <div className="mt-5">
            <button className="w-full rounded-lg bg-gradient-to-r from-gold to-gold-soft py-2 font-poppins font-medium text-black">
              Explore all Stocks
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for the cirricaToken in localStorage
    const storedToken = localStorage.getItem('cirricaToken');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      // Redirect to login if no token found
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cirricaToken');
    setToken(null);
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
    router.push('/');
  };

  const handleCreateTournament = () => {
    router.push('/createTournament');
  };

  const handleViewAllTournaments = () => {
    router.push('/tournament');
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen overflow-hidden bg-black text-white'>
      <div className='flex h-full flex-col lg:flex-row'>
        {/* Sidebar (flush left, full height) */}
        <aside className="sticky top-0 hidden h-screen border-r border-white/10 bg-surface px-5 py-6 lg:flex lg:w-56 lg:flex-col lg:shrink-0">
          {/* use your Sidebar and pass logout */}
          <Sidebar onLogout={handleLogout} activeItem='dashboard' />
        </aside>

        {/* Main content (centered container lives inside main) */}
        <main className='flex-1 overflow-y-auto'>
          <div className='sticky top-0 z-30 flex items-center justify-between gap-3 bg-black px-5 py-4 lg:hidden'>
            <button
              type='button'
              onClick={openSidebar}
              className='inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10'
              aria-label='Open navigation'
            >
              <svg
                width='20'
                height='14'
                viewBox='0 0 20 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  d='M1 1H19'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M1 7H19'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
                <path
                  d='M1 13H19'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
              <span className='font-poppins text-xs font-semibold uppercase tracking-wider text-current'>
                Menu
              </span>
            </button>
            <div className='flex-1 text-right'>
              <p className='font-poppins text-xs font-medium uppercase tracking-widest text-white/60'>
                Dashboard
              </p>
            </div>
          </div>
          <div className='mx-auto max-w-7xl px-5 py-6 lg:px-8'>
            {/* Header */}
            <div className='flex items-center justify-between gap-3'>
              <div>
                <h1 className='font-poppins text-xl font-semibold leading-none tracking-wide text-white'>
                  Dashboard
                </h1>
                <p className='mt-2 font-poppins text-sm font-medium leading-none tracking-wide text-white'>
                  Welcome back to Cirrica
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  className='inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-gold to-gold-soft px-4 py-2 font-poppins text-sm font-medium text-surface shadow-md cursor-pointer'
                  onClick={handleCreateTournament}
                >
                  <svg
                    className='h-4 w-4'
                    viewBox='0 0 16 12'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                  >
                    <path
                      d='M15.5514 2.92291C15.2701 2.6829 14.8884 2.62209 14.5534 2.76357L11.0447 4.25116L9.31437 0.585112C9.14534 0.226767 8.79977 0 8.42178 0C8.0438 0 7.69823 0.226107 7.52919 0.584452L5.79951 4.25118L2.29082 2.76359C1.95523 2.62144 1.57349 2.68226 1.29218 2.92292C1.01149 3.16359 0.874881 3.54705 0.936008 3.92457L2.13425 11.3399C2.20473 11.7697 2.58835 12.0593 2.99441 11.9892L3.54831 11.892C6.77501 11.3247 10.0685 11.3247 13.2952 11.892L13.8491 11.9892C14.2551 12.0606 14.6394 11.771 14.7086 11.3406L15.9075 3.92455C15.968 3.54703 15.8321 3.16423 15.5514 2.92291ZM13.7674 10.9029L13.4587 10.8487H13.458C10.1234 10.2623 6.72026 10.2623 3.38561 10.8487L3.07685 10.9029L1.91978 3.74599L5.42911 5.23358C5.91065 5.43391 6.45707 5.21375 6.69223 4.7245L8.42191 1.05777L10.1516 4.7245C10.3868 5.21375 10.9332 5.43391 11.4147 5.23358L14.924 3.74533L13.7674 10.9029Z'
                      fill='currentColor'
                    />
                  </svg>
                  <span className='font-poppins text-xs font-medium leading-4 text-current'>
                    Create Tournament
                  </span>
                </button>
                <button className='inline-flex items-center gap-2 rounded-md border border-white px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-white/10'>
                  <svg
                    className='h-4 w-4'
                    viewBox='0 0 17 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                  >
                    <path
                      d='M5.54044 7.83972H4.52944V6.00923C4.52944 5.51708 4.13084 5.11848 3.63869 5.11848C3.14654 5.11848 2.74794 5.51708 2.74794 6.00923V7.83972H1.73583C0.779381 7.83972 0 8.61802 0 9.57555V15.6169C0 16.5745 0.77941 17.3528 1.73583 17.3528H2.74794V19.1844C2.74794 19.6765 3.14654 20.0751 3.63869 20.0751C4.13084 20.0751 4.52944 19.6765 4.52944 19.1844V17.3528H5.54044C6.498 17.3528 7.27627 16.5745 7.27627 15.6169V9.57555C7.27627 8.61799 6.49797 7.83972 5.54044 7.83972ZM5.49479 15.5725L1.78159 15.6171L1.73594 9.62128L5.49503 9.57563L5.49479 15.5725Z'
                      fill='currentColor'
                    />
                    <path
                      d='M15.2642 2.72235H14.2521V0.890746C14.2521 0.398598 13.8535 0 13.3613 0C12.8692 0 12.4706 0.398598 12.4706 0.890746V2.72235H11.4585C10.5009 2.72235 9.72266 3.50065 9.72266 4.45818V10.4996C9.72266 11.4571 10.5021 12.2354 11.4585 12.2354H12.4706V14.0659C12.4706 14.558 12.8692 14.9566 13.3613 14.9566C13.8535 14.9566 14.2521 14.558 14.2521 14.0659V12.2354H15.2642C16.2218 12.2354 17 11.4571 17 10.4996V4.45818C17 3.50062 16.2206 2.72235 15.2642 2.72235ZM15.2186 10.4552L11.5042 10.4997L11.4586 4.50391L15.2185 4.45826L15.2186 10.4552Z'
                      fill='currentColor'
                    />
                  </svg>
                  <span className='font-poppins text-xs font-medium leading-4 text-white'>
                    Pick Stocks
                  </span>
                </button>
              </div>
            </div>

            <hr className='mt-5 border-t border-white/20' />

            {/* Stats and overview panels */}
            <div>
              <OverviewPanels onViewAllTournaments={handleViewAllTournaments} />
            </div>
          </div>
        </main>
      </div>
      {isSidebarOpen ? (
        <div className='fixed inset-0 z-40 flex lg:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/70'
            aria-label='Close navigation overlay'
            onClick={closeSidebar}
          />
          <div className='relative z-10 h-full w-64 max-w-[80vw] p-4 pt-6 shadow-2xl'>
            <Sidebar
              onLogout={handleLogout}
              activeItem='dashboard'
              onNavigate={closeSidebar}
              onClose={closeSidebar}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
