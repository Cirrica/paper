'use client';
// CHECK!
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChartPlaceHolder from '@/app/components/chartPlaceHolder';
import Sidebar from '@/app/components/Sidebar';
import { TIMEFRAME_OPTIONS, generateMockStockData } from '@/app/components/chartPlaceHolderData';

const chartTabs = ['Chart', 'Options', 'News', 'Financials', 'Analysts', 'Risk Analysis', 'Releases', 'Notes', 'Profile'];
const quickQuantities = [10, 50, 100, 500];
const orderTypes = ['Market Price', 'Limit Order', 'Stop Order', 'Trailing Stop'];
const timeInForceOptions = ['Day', 'GTC', 'IOC', 'FOK'];
const timeSalesRows = [
  { time: '16:59:32', price: '420.56', size: 25 },
  { time: '16:59:31', price: '420.40', size: 25 },
  { time: '16:59:30', price: '420.52', size: 25 },
  { time: '16:59:29', price: '420.36', size: 18 },
  { time: '16:59:28', price: '420.60', size: 32 },
  { time: '16:59:27', price: '420.45', size: 21 },
  { time: '16:59:26', price: '420.32', size: 25 },
  { time: '16:59:25', price: '420.40', size: 25 },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
}

function formatSigned(value, fractionDigits = 2) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(fractionDigits)}`;
}

export default function StockDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Chart');
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const [selectedTimeframe, setSelectedTimeframe] = useState('2h');
  const [tradeSide, setTradeSide] = useState('buy');
  const [orderType, setOrderType] = useState(orderTypes[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [timeInForce, setTimeInForce] = useState(timeInForceOptions[0]);
  const [stopPrice, setStopPrice] = useState(400.00);
  const [isStopEnabled, setIsStopEnabled] = useState(true);
  const router = useRouter();

  const { candles, overlays, indicator } = useMemo(() => generateMockStockData(), []);
  const latestCandle = candles[candles.length - 1];
  const previousCandle = candles[candles.length - 2];
  const dailyChange = latestCandle.close - previousCandle.close;
  const dailyChangePct = (dailyChange / previousCandle.close) * 100;
  const fiftyTwoWeekHigh = candles.reduce((maxValue, candle) => (candle.high > maxValue ? candle.high : maxValue), candles[0].high);
  const fiftyTwoWeekLow = candles.reduce((minValue, candle) => (candle.low < minValue ? candle.low : minValue), candles[0].low);

  const updateIndicator = useCallback(() => {
    const container = tabsContainerRef.current;
    const activeButton = tabRefs.current[activeTab];

    if (!container || !activeButton) {
      return;
    }

    const width = Math.max(activeButton.offsetWidth, 0);
    const left = activeButton.offsetLeft;

    setIndicatorStyle({ width, left });
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);

    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  useEffect(() => {
    const storedToken = localStorage.getItem('cirricaToken');

    if (storedToken || process.env.NODE_ENV === 'development') {
      setIsAuthenticated(true);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cirricaToken');
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
    router.push('/');
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full">
        <aside className="sticky top-0 hidden h-full bg-surface px-5 py-6 lg:flex lg:w-56 lg:flex-col lg:shrink-0">
          <Sidebar onLogout={handleLogout} activeItem="dashboard" />
        </aside>

        <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto border-l border-white/10">
          <div className="sticky top-0 z-30 flex w-full items-center justify-between gap-3 border-b border-white/10 bg-black px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={openSidebar}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              aria-label="Open navigation"
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M1 1H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 7H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 13H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-poppins text-xs font-semibold uppercase tracking-wider text-current">Menu</span>
            </button>
            <div className="flex-1 text-right">
              <p className="font-poppins text-xs font-medium uppercase tracking-widest text-white/60">Stock Dashboard</p>
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col items-center gap-3 pb-10">
            <header className="flex w-full max-w-full lg:max-w-[78.125rem] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 px-4 py-3 shadow-lg lg:shadow-[0_0.5rem_1.75rem_rgba(0,0,0,0.4)]">
              <div className="flex w-full flex-1 min-w-0 items-center gap-6">
                <div className="flex items-center gap-2 bg-black/70 py-2">
                  <svg
                    width="12"
                    height="6"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M4.39844 4.14319L0.832031 0.576782H7.96484L4.39844 4.14319Z" fill="#FFFFFF" />
                  </svg>
                  <div className="flex h-5 lg:h-[1.3374rem] w-5 lg:w-[1.3374rem] items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
                    <span className="font-poppins text-[0.625rem] sm:text-[0.6875rem] lg:text-[0.5625rem] text-white">JR</span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-poppins text-[0.75rem] sm:text-[0.8125rem] lg:text-[0.78rem] font-normal leading-4 sm:leading-[1.0625rem] lg:leading-[1.00313rem] text-white whitespace-nowrap overflow-hidden text-ellipsis">James Raymond</span>
                    <span className="mt-1 font-poppins text-[0.6875rem] sm:text-[0.75rem] lg:text-[0.66875rem] font-normal leading-4 sm:leading-[1.0625rem] lg:leading-[1.00313rem] text-[#999999] whitespace-nowrap overflow-hidden text-ellipsis">Account: 4453728992</span>
                  </div>
                  <span className="mx-1 h-4 w-px border lg:border-[0.05563rem] border-[#595959]" aria-hidden="true" />
                  <button type="button" aria-label="Notifications" className="flex h-6 w-6 items-center justify-center text-[#999999] transition hover:text-white">
                    <svg
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="text-current"
                    >
                      <path
                        d="M4.53443 10.9282H8.0509C7.98064 11.3437 7.76551 11.7209 7.44366 11.9929C7.12182 12.2648 6.71405 12.4141 6.29267 12.4141C5.87128 12.4141 5.46351 12.2648 5.14167 11.9929C4.81982 11.7209 4.60469 11.3437 4.53443 10.9282ZM6.29267 0.823395C7.475 0.823395 8.60891 1.29308 9.44495 2.12911C10.281 2.96515 10.7507 4.09907 10.7507 5.2814V7.65901L11.5935 9.53731C11.6319 9.62322 11.6481 9.71734 11.6408 9.81112C11.6335 9.90491 11.6029 9.99538 11.5518 10.0743C11.5006 10.1533 11.4306 10.2182 11.348 10.2632C11.2654 10.3082 11.1728 10.3319 11.0788 10.332H1.50893C1.41473 10.332 1.32204 10.3084 1.23929 10.2634C1.15653 10.2184 1.08635 10.1535 1.03513 10.0744C0.983905 9.99537 0.953271 9.90476 0.946014 9.81085C0.938758 9.71694 0.955109 9.6227 0.99358 9.53672L1.83466 7.65841V5.27368L1.83763 5.12507C1.87829 3.97066 2.36546 2.8771 3.19649 2.07478C4.02752 1.27247 5.13754 0.823449 6.29267 0.823395Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
                <div className="grid h-10 lg:h-[2.4375rem] w-full max-w-full lg:max-w-[12.4707rem] grid-cols-2 gap-7 lg:gap-[1.78313rem]">
                  <div className="flex flex-col">
                    <span className="font-['Golos Text'] text-[0.6875rem] sm:text-[0.75rem] lg:text-[0.66875rem] font-normal leading-tight sm:leading-[1.375rem] lg:leading-[1.3375rem] text-[#999999]">Portfolio Balance</span>
                    <span className="font-poppins text-[0.6875rem] sm:text-[0.75rem] lg:text-[0.78rem] font-normal leading-4 sm:leading-[1.0625rem] lg:leading-[1.00313rem] text-white">{formatCurrency(623098.17)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Golos Text'] text-[0.6875rem] sm:text-[0.75rem] lg:text-[0.66875rem] font-normal leading-tight sm:leading-[1.375rem] lg:leading-[1.3375rem] text-[#999999]">Available Funds</span>
                    <span className="font-poppins text-[0.6875rem] sm:text-[0.75rem] lg:text-[0.78rem] font-normal leading-4 sm:leading-[1.0625rem] lg:leading-[1.00313rem] text-white">{formatCurrency(122912.5)}</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-full lg:max-w-[12.53815rem] rounded-md lg:rounded-[0.33437rem] bg-gradient-to-b from-white/50 to-black/50 p-px lg:p-[0.02813rem]">
                <div className="flex h-7 lg:h-[1.7832rem] w-full items-center rounded-md lg:rounded-[0.33437rem] bg-[#191919] px-3 lg:px-[0.66875rem]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M11.2598 11.2598L15.75 15.75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="7.5" cy="7.5" r="5.75" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search"
                    className="ml-3 w-full bg-transparent font-poppins text-xs lg:text-[0.78rem] font-normal leading-4 lg:leading-[1.00313rem] text-[#999999] placeholder:text-white/40 focus:outline-none"
                  />
                </div>
              </div>
            </header>

            <div className="flex w-full max-w-full lg:max-w-[76.9375rem] flex-1 min-w-0 flex-col gap-4 lg:gap-[0.89438rem] px-2 lg:flex-row lg:items-stretch">
              <section className="flex w-full flex-1 min-w-0 flex-col overflow-hidden bg-[#0A0A0A]">
                <div className="w-full">
                  <div
                    ref={tabsContainerRef}
                    className="relative flex h-12 lg:h-[3.18723rem] w-full max-w-full lg:max-w-[56.02571rem] min-w-0 items-center justify-between overflow-x-auto border-b lg:border-b-[0.05563rem] border-[#1F1F1F] bg-[#1F1F1F] pr-5 lg:pr-[1.34187rem] pl-5 lg:pl-[1.34187rem]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-0 h-px lg:h-[0.05563rem] rounded-full"
                      style={{
                        width: `${indicatorStyle.width}px`,
                        left: `${indicatorStyle.left}px`,
                        opacity: indicatorStyle.width > 0 ? 1 : 0,
                        transition: 'left 150ms ease, width 150ms ease, opacity 150ms ease',
                        backgroundImage:
                          'radial-gradient(42.4% 100% at 50% 101.79%, #DAA56A 34.47%, rgba(5, 5, 5, 0) 100%)',
                      }}
                    />
                    {chartTabs.map((tab) => (
                      <button
                        key={tab}
                        ref={(element) => {
                          if (element) {
                            tabRefs.current[tab] = element;
                          } else {
                            delete tabRefs.current[tab];
                          }
                        }}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`relative rounded-full px-4 py-2 text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] font-normal text-center transition
                          ${activeTab === tab
                            ? 'text-[#DAA56A] border border-[#DAA56A40] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(218,165,106,0.1)_0%,rgba(218,165,106,0.025)_73.82%)]'
                            : 'text-[#999999] hover:text-white'
                        }`}
                        aria-pressed={activeTab === tab}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="border-b border-white/5 w-full max-w-full lg:max-w-[56.02571rem] min-w-0 overflow-x-auto px-4 py-3 sm:px-5 lg:px-[1.34187rem] lg:py-[0.67125rem]">
                    <div className="flex flex-wrap lg:flex-nowrap lg:items-start lg:justify-around">
                      <div className="flex min-w-0 lg:min-w-[15rem] flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3 text-white">
                          <span className="font-['Font-family'] text-lg lg:text-[1.11813rem] font-normal leading-6 lg:leading-[1.34187rem]">MSFT</span>
                          <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem]">Microsoft Corp NASDAQ</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#999999] p-1 text-white/60 transition hover:text-white"
                            >
                              <svg
                                width="11.596595764160156"
                                height="6.861751079559326"
                                viewBox="0 0 13 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M6.25436 2.63314C6.88708 2.63314 7.49388 2.88449 7.94128 3.33189C8.38868 3.77928 8.64002 4.38609 8.64002 5.0188C8.64002 5.65152 8.38868 6.25832 7.94128 6.70572C7.49388 7.15312 6.88708 7.40446 6.25436 7.40446C5.62164 7.40446 5.01484 7.15312 4.56745 6.70572C4.12005 6.25832 3.8687 5.65152 3.8687 5.0188C3.8687 4.38609 4.12005 3.77928 4.56745 3.33189C5.01484 2.88449 5.62164 2.63314 6.25436 2.63314ZM6.25436 0.542709C9.00562 0.542709 11.3811 2.42142 12.0402 5.05399C12.069 5.16907 12.051 5.2909 11.9901 5.39268C11.9291 5.49446 11.8302 5.56786 11.7151 5.59673C11.6001 5.6256 11.4782 5.60757 11.3764 5.54661C11.2747 5.48565 11.2013 5.38676 11.1724 5.27168C10.8967 4.17595 10.263 3.20367 9.37181 2.50911C8.48062 1.81455 7.38301 1.4375 6.25313 1.43777C5.12325 1.43805 4.02583 1.81564 3.13498 2.51063C2.24413 3.20562 1.61089 4.17821 1.33573 5.27407C1.30483 5.38675 1.23107 5.48287 1.13022 5.54187C1.02936 5.60086 0.909431 5.61806 0.796065 5.58978C0.682699 5.5615 0.5849 5.48998 0.523581 5.39052C0.462263 5.29106 0.442294 5.17156 0.467945 5.05757C0.791365 3.7678 1.5364 2.62304 2.58475 1.80506C3.63309 0.987091 4.92466 0.54279 6.25436 0.542709Z"
                                  fill="#FFFFFF"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#999999] p-1 text-white/60 transition hover:text-white"
                            >
                              <svg
                                width="10.734420776367188"
                                height="11.6299467086792"
                                viewBox="0 0 12 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M4.53443 10.9282H8.0509C7.98064 11.3437 7.76551 11.7209 7.44366 11.9929C7.12182 12.2648 6.71405 12.4141 6.29267 12.4141C5.87128 12.4141 5.46351 12.2648 5.14167 11.9929C4.81982 11.7209 4.60469 11.3437 4.53443 10.9282ZM6.29267 0.823395C7.475 0.823395 8.60891 1.29308 9.44495 2.12911C10.281 2.96515 10.7507 4.09907 10.7507 5.2814V7.65901L11.5935 9.53731C11.6319 9.62322 11.6481 9.71734 11.6408 9.81112C11.6335 9.90491 11.6029 9.99538 11.5518 10.0743C11.5006 10.1533 11.4306 10.2182 11.348 10.2632C11.2654 10.3082 11.1728 10.3319 11.0788 10.332H1.50893C1.41473 10.332 1.32204 10.3084 1.23929 10.2634C1.15653 10.2184 1.08635 10.1535 1.03513 10.0744C0.983905 9.99537 0.953271 9.90476 0.946014 9.81085C0.938758 9.71694 0.955109 9.6227 0.99358 9.53672L1.83466 7.65841V5.27368L1.83763 5.12507C1.87829 3.97066 2.36546 2.8771 3.19649 2.07478C4.02752 1.27247 5.13754 0.823449 6.29267 0.823395Z"
                                  fill="#FFFFFF"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-['Font-family'] text-4xl lg:text-[2.23625rem] font-semibold leading-10 lg:leading-[2.46rem] text-[#DAA56A]">
                            {latestCandle.close.toFixed(2)}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#0FEDBE]">
                              {formatSigned(dailyChange)}
                            </span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#0FEDBE]">
                              {formatSigned(dailyChangePct)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 font-poppins text-white/60">
                          <div className="flex flex-wrap items-center gap-2 tracking-wider">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">After hours:</span>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#D70000]">406.83</span>
                              <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#D70000]">-0.27</span>
                              <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#D70000]">-0.07%</span>
                            </div>
                          </div>
                          <span className="hidden h-4 w-px bg-white/30 sm:inline-flex" aria-hidden="true" />
                          <div className="flex items-center">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white tracking-wide">19:59 04/26 EDT</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid flex-1 min-w-0 lg:min-w-[16.25rem] gap-4 text-sm font-poppins text-white/70 sm:grid-cols-2 md:gap-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">Open</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#D70000] [font-variant-numeric:lining-nums_tabular-nums]">
                              401.23
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">Low</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#D70000] [font-variant-numeric:lining-nums_tabular-nums]">
                              400.10
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">High</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#0FEDBE] [font-variant-numeric:lining-nums_tabular-nums]">
                              408.36
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">52 wk high</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white [font-variant-numeric:lining-nums_tabular-nums]">
                              430.82
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">52 wk low</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white [font-variant-numeric:lining-nums_tabular-nums]">
                              273.13
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">Avg Vol (3M)</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white [font-variant-numeric:lining-nums_tabular-nums]">
                              21.73M
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">Shares Outstanding</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white [font-variant-numeric:lining-nums_tabular-nums]">
                              7.43B
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">Mkt Cap</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white [font-variant-numeric:lining-nums_tabular-nums]">
                              3.02T
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-[#999999]">Div Yield</span>
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white [font-variant-numeric:lining-nums_tabular-nums]">
                              0.74%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-['Font-family'] text-xs lg:text-[0.7825rem] font-normal leading-4 lg:leading-[1.00625rem] text-white">View all</span>
                            <span className="flex h-4 w-6 items-center justify-end text-white">
                              <svg
                                className="h-full w-full"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path d="M4.5 3.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart flex w-full min-h-0 min-w-0 flex-1">
                  <div className="flex h-full w-full min-w-0 flex-col gap-4 lg:gap-[0.89438rem]">
                    <ChartPlaceHolder
                      candles={candles}
                      overlays={overlays}
                      indicator={indicator}
                      timeframeOptions={TIMEFRAME_OPTIONS}
                      selectedTimeframe={selectedTimeframe}
                      onTimeframeChange={setSelectedTimeframe}
                    />
                  </div>
                </div>
              </section>

              <aside className="flex w-full flex-col gap-4 lg:gap-[0.89438rem] lg:w-[20rem]">
                <section className="flex w-full flex-col rounded lg:rounded-[0.22375rem] bg-[#0A0A0A] pb-4 lg:pb-[0.89438rem]">
                  <header className="flex w-full items-center justify-between gap-2 lg:gap-[0.4475rem] bg-[#1F1F1F] px-5 lg:px-[1.34187rem] py-4 lg:py-[0.89438rem]">
                    <h3 className="font-poppins text-sm lg:text-[0.89438rem] font-semibold leading-6 lg:leading-[1.34187rem] tracking-normal lg:tracking-[0] text-white">Trade</h3>
                    <button type="button" aria-label="Trade menu" className="rounded-md p-2 text-white/60 transition hover:text-white">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M6 2C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0C5.44772 0 5 0.447715 5 1C5 1.55228 5.44772 2 6 2Z" fill="currentColor" />
                        <path d="M6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7Z" fill="currentColor" />
                        <path d="M6 12C6.55228 12 7 11.5523 7 11C7 10.4477 6.55228 10 6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12Z" fill="currentColor" />
                      </svg>
                    </button>
                  </header>
                  <div className="flex flex-col gap-4 lg:gap-[0.89438rem]">
                    <div className="flex w-full bg-[#111111] font-poppins text-sm lg:text-[0.89438rem]">
                      <button
                        type="button"
                        onClick={() => setTradeSide('buy')}
                        className={`flex flex-1 items-center justify-center gap-2 lg:gap-[0.4475rem] py-3
                          px-[0.9375rem] text-center font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] transition
                          ${tradeSide === 'buy'
                            ? 'text-[#DAA56A] border-b-[0.11188rem] border-b-[#DAA56A] bg-[linear-gradient(180deg,rgba(250,218,189,0)_32.15%,rgba(250,218,189,0.25)_100%)]'
                            : 'text-[#999999] border-b lg:border-b-[0.05563rem] border-b-[#999999] bg-[#0A0A0A]'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        onClick={() => setTradeSide('sell')}
                        className={`flex flex-1 items-center justify-center gap-2 lg:gap-[0.4475rem] py-3
                          px-[0.9375rem] text-center font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] transition
                          ${tradeSide === 'sell'
                            ? 'text-[#DAA56A] border-b-[0.11188rem] border-b-[#DAA56A] bg-[linear-gradient(180deg,rgba(250,218,189,0)_32.15%,rgba(250,218,189,0.25)_100%)]'
                            : 'text-[#999999] border-b lg:border-b-[0.05563rem] border-b-[#999999] bg-[#0A0A0A]'
                        }`}
                      >
                        Sell
                      </button>
                    </div>
                    <div className="flex flex-col gap-4 lg:gap-[0.89438rem] px-5 lg:px-[1.34187rem] pb-5 lg:pb-[1.26937rem]
                      bg-[repeating-linear-gradient(to_right,#1F1F1F_0_0.875rem,transparent_0.875rem_1.75rem)] bg-bottom bg-repeat-x bg-[length:1.75rem_0.0625rem]">
                      <div className="flex flex-col w-full lg:w-[16.88599rem] h-14 lg:h-[3.41074rem] space-y-1 lg:space-y-[0.22375rem]">
                        <label htmlFor="orderType" className="font-[poppins] font-medium text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] align-middle text-white/70">Order Type</label>
                        <div className="relative rounded-md lg:rounded-[0.33563rem] p-px lg:p-[0.03125rem] 
                                        bg-[radial-gradient(70.97%_837.53%_at_98.29%_13.75%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.075)_14.95%),radial-gradient(57.27%_124.88%_at_28.43%_0%,rgba(218,165,106,0.427451)_0%,rgba(255,255,255,0.05)_78.07%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(0,0,0,0.5)_100%)] 
                                        shadow-sm lg:shadow-[0_0.11188rem_0.33563rem_0_#00000080]">
                          <select
                            id="orderType"
                            value={orderType}
                            onChange={(e) => setOrderType(e.target.value)}
                            className="
                              appearance-none w-full lg:w-[16.88599rem] h-9 lg:h-[2.23656rem] rounded-md lg:rounded-[0.33563rem] bg-[#191919] pl-3 lg:pl-[0.67125rem] pr-7 lg:pr-[1.75rem]
                              font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-white focus:outline-none focus:ring-0"
                          >
                            {orderTypes.map((type) => (
                              <option
                                key={type}
                                value={type}
                                className="bg-[#191919] text-white font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%]">
                                {type}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-[0.67125rem] top-1/2 -translate-y-1/2 text-white">
                            <svg
                              width="10" height="4.5" viewBox="0 0 8 5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path d="M4.39844 4.14319L0.832031 0.576782H7.96484L4.39844 4.14319Z" />
                            </svg>
                          </span>

                        </div>
                      </div>

                      <div className="w-full lg:w-[16.88599rem] h-24 lg:h-[6.03897rem] space-y-1">
                        <div className="flex items-center w-full lg:w-[16.88599rem] h-5 lg:h-[1.0625rem] gap-1 lg:gap-[0.22375rem]">
                          <label className="font-[Font-family] font-medium text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] align-middle text-[#999999]">Quantity</label>
                          <span className="flex items-center justify-center w-12 lg:w-[2.92097rem] h-5 lg:h-[1.0625rem] gap-2 lg:gap-[0.4475rem] rounded-full lg:rounded-[5.59125rem] border border-[#C99046]/40 px-1.5 lg:px-[0.33563rem] text-[0.6875rem] lg:text-[0.67125rem] leading-4 lg:leading-[1.00625rem] font-normal text-[#DAA56A] align-middle font-[Font-family]">Shares</span>
                        </div>
                        <div className="p-px lg:p-[0.02813rem] rounded-md lg:rounded-[0.33563rem] bg-[radial-gradient(70.97%_837.53%_at_98.29%_13.75%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.075)_14.95%),radial-gradient(57.27%_124.88%_at_28.43%_0%,#DAA56A_0%,rgba(255,255,255,0.1)_64.02%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(0,0,0,0.5)_100%)] shadow-sm lg:shadow-[0_0.11188rem_0.33563rem_0_#00000080]">
                          <div className="relative">
                            <input
                              type="number"
                              value={selectedQuantity}
                              min={1}
                              step={1}
                              onChange={(event) => setSelectedQuantity(Number(event.target.value))}
                              className="w-full lg:w-[16.88599rem] h-9 lg:h-[2.23656rem] rounded-md lg:rounded-[0.33563rem] bg-[#191919] px-3 lg:px-[0.67125rem] pr-7 lg:pr-[1.75rem] font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] text-white/80 focus:outline-none focus:ring-0 focus-visible:ring-0 block
                                          appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                            />
                            <div className="absolute right-[0.67125rem] top-1/2 flex h-3 lg:h-[0.78279rem] w-2 lg:w-[0.44731rem] -translate-y-1/2 flex-col items-center justify-between gap-px lg:gap-[0.09375rem]">
                              <button
                                type="button"
                                className="flex items-center justify-center text-white"
                                onClick={() =>
                                  setSelectedQuantity((prev) => Math.max(1, (Number.isFinite(prev) ? prev : 0) + 1))
                                }
                              >
                                <svg
                                  width="7.15"
                                  height="6.25"
                                  viewBox="0 0 8 5"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M4.39844 0.856812L0.832031 4.42322H7.96484L4.39844 0.856812Z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="flex items-center justify-center text-white"
                                onClick={() =>
                                  setSelectedQuantity((prev) =>
                                    Math.max(1, (Number.isFinite(prev) ? prev : 1) - 1)
                                  )
                                }
                              >
                                <svg
                                  width="7.15"
                                  height="6.25"
                                  viewBox="0 0 8 5"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M4.39844 4.14319L0.832031 0.576782H7.96484L4.39844 4.14319Z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center w-full lg:w-[16.88599rem] h-8 lg:h-[1.95713rem] gap-2 lg:gap-[0.55937rem]">
                          {quickQuantities.map((quantity) => (
                            <span
                              key={quantity}
                              className="flex w-full lg:w-[3.5rem] h-8 lg:h-[1.9375rem] p-px lg:p-[0.02813rem] rounded-full lg:rounded-[55.91375rem]
                                        bg-[radial-gradient(42.19%_194.24%_at_30.88%_57.81%,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06))]
                                        shadow-sm lg:shadow-[0_0.11188rem_0.33563rem_0_#00000080]">
                              <button
                                type="button"
                                onClick={() => setSelectedQuantity(quantity)}
                                className="flex w-full h-full items-center justify-center
                                          rounded-full lg:rounded-[55.91375rem] bg-[#1F1F1F]
                                          font-[Font-family] font-normal
                                          text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] text-white
                                          transition"
                              >
                                {quantity}
                              </button>
                            </span>
                          ))}

                          <div className="flex items-center justify-center w-4 lg:w-[0.89438rem] h-4 lg:h-[0.89438rem] rounded-sm lg:rounded-[0.11188rem]">
                            <svg
                              width="12.41"
                              height="12.35"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              className="text-white"
                            >
                              <path
                                d="M8.5 1.5l2 2-6.5 6.5-2.5.5.5-2.5L8.5 1.5Z"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7 3l2 2"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col w-full lg:w-[16.88599rem] h-14 lg:h-[3.41074rem] space-y-1 lg:space-y-[0.22375rem]">
                        <label
                          htmlFor="timeInForce"
                          className="font-[poppins] font-medium text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] align-middle text-white/70"
                        >
                          Time-in-Force
                        </label>

                        <div
                          className="relative rounded-md lg:rounded-[0.33563rem] p-px lg:p-[0.03125rem]
                                    bg-[radial-gradient(70.97%_837.53%_at_98.29%_13.75%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.075)_14.95%),radial-gradient(57.27%_124.88%_at_28.43%_0%,rgba(218,165,106,0.427451)_0%,rgba(255,255,255,0.05)_78.07%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(0,0,0,0.5)_100%)]
                                    shadow-sm lg:shadow-[0_0.11188rem_0.33563rem_0_#00000080]"
                        >
                          <select
                            id="timeInForce"
                            value={timeInForce}
                            onChange={(e) => setTimeInForce(e.target.value)}
                            className="
                              appearance-none w-full lg:w-[16.88599rem] h-9 lg:h-[2.23656rem] rounded-md lg:rounded-[0.33563rem] bg-[#191919]
                              pl-3 lg:pl-[0.67125rem] pr-7 lg:pr-[1.75rem]
                              font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-white
                              focus:outline-none focus:ring-0
                            "
                          >
                            {timeInForceOptions.map((option) => (
                              <option
                                key={option}
                                value={option}
                                className="bg-[#191919] text-white font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%]"
                              >
                                {option}
                              </option>
                            ))}
                          </select>

                          <span className="pointer-events-none absolute right-[0.67125rem] top-1/2 -translate-y-1/2 text-white">
                            <svg
                              width="10"
                              height="4.5"
                              viewBox="0 0 8 5"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path d="M4.39844 4.14319L0.832031 0.576782H7.96484L4.39844 4.14319Z" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col w-full lg:w-[16.88599rem] h-20 lg:h-[5.31196rem] gap-1.5 lg:gap-[0.33563rem]">
                        <div className="flex items-center w-28 lg:w-[6.39771rem] h-6 lg:h-[1.34193rem] gap-3 lg:gap-[0.67125rem] pb-1 lg:pb-[0.22375rem] mt-1">
                          <button
                            type="button"
                            onClick={() => setIsStopEnabled((prev) => !prev)}
                            className={`relative inline-flex w-[2.0129rem] h-[1.11827rem] items-center rounded-full lg:rounded-[55.91375rem] p-[0.22375rem] transition 
                              ${isStopEnabled ? 'bg-[#DAA56A]' : 'bg-[#2A2A2A]'}`}
                            >
                            <span
                              className={`inline-block w-[0.67097rem] h-[0.67097rem] transform rounded-full bg-[#050505] shadow-[0_0.08375rem_0.11188rem_0_#0000004D] transition 
                                ${isStopEnabled ? 'translate-x-[0.875rem]' : 'translate-x-[0]'}`}
                            />
                          </button>

                          <span className="font-[Font-family] font-medium text-sm lg:text-[0.8125rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] align-middle text-white">Stop Price</span>
                        </div>
                        <div className="w-full lg:w-[16.88599rem] h-9 lg:h-[2.23656rem] rounded-md lg:rounded-[0.33563rem] p-px lg:p-[0.03125rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(0,0,0,0.5)_100%),radial-gradient(47.93%_96.25%_at_7.45%_3.75%,#2DCAFF_0%,rgba(255,255,255,0.1)_64.02%)] shadow-sm lg:shadow-[0_0.11188rem_0.33563rem_0_#00000080]">
                          <div className="flex items-center justify-between gap-3 lg:gap-[0.67125rem] rounded-md lg:rounded-[0.33563rem] p-3 lg:p-[0.6875rem] h-full w-full bg-[#191919]">
                            <span className="rounded-full font-[Golos_Text] font-normal text-sm lg:text-[0.89438rem] leading-6 lg:leading-[1.34187rem] text-white">$</span>
                            <input
                              type="number"
                              value={Number.isFinite(stopPrice) ? stopPrice.toFixed(2) : ''}
                              min={0}
                              step="0.01"
                              onChange={(event) => {
                                const { value } = event.target;
                                setStopPrice(value === '' ? Number.NaN : Number(value));
                              }}
                              className="w-full lg:w-[13.12981rem] h-5 lg:h-[1.0625rem] bg-transparent 
                                        font-[Font-family] font-normal
                                        text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] 
                                        text-white placeholder:text-white/30 focus:outline-none
                                        appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                              placeholder="400.00"
                              disabled={!isStopEnabled}
                            />
                            <div className="flex flex-col items-center justify-between h-3 lg:h-[0.78279rem] w-2 lg:w-[0.44731rem] gap-px lg:gap-[0.09375rem] bg-transparent">
                              <button
                                type="button"
                                className="flex items-center justify-center text-white"
                                onClick={() =>
                                  setStopPrice((prev) => {
                                    const next = Number.isFinite(prev) ? prev + 0.01 : 0.01;
                                    return Number(next.toFixed(2));
                                  })
                                }
                              >
                                <svg
                                  width="7.15"
                                  height="6.25"
                                  viewBox="0 0 8 5"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M4.39844 0.856812L0.832031 4.42322H7.96484L4.39844 0.856812Z" />
                                </svg>
                              </button>

                              {/* Down arrow */}
                              <button
                                type="button"
                                className="flex items-center justify-center text-white"
                                onClick={() =>
                                  setStopPrice((prev) => {
                                    const base = Number.isFinite(prev) ? prev : 0;
                                    const next = Math.max(0, base - 0.01);
                                    return Number(next.toFixed(2));
                                  })
                                }
                              >
                                <svg
                                  width="7.15"
                                  height="6.25"
                                  viewBox="0 0 8 5"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M4.39844 4.14319L0.832031 0.576782H7.96484L4.39844 4.14319Z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="flex w-32 lg:w-[7.53616rem] h-5 lg:h-[1.0625rem] items-center justify-center">
                          <span className="w-14 lg:w-[3.6875rem] h-5 lg:h-[1.0625rem] font-[Font-family] font-normal 
                                          text-sm lg:text-[0.8125rem] leading-4 lg:leading-[1.00625rem] text-[#999999]">
                            Est. Loss:
                          </span>
                          <span className="w-14 lg:w-[3.625rem] h-5 lg:h-[1.0625rem] font-[Font-family] font-normal
                                          text-sm lg:text-[0.8125rem] leading-4 lg:leading-[1.00625rem] text-[#D70000]">
                            $12,057.36
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex w-full flex-col gap-2 lg:gap-[0.4475rem] bg-[#0B0B0B] px-5 lg:px-[1.34187rem] py-1">
                      <div className="flex w-full items-center justify-between gap-4 lg:gap-[0.89438rem] text-white/70">
                        <span className="font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] align-middle text-[#999999]">Buying Power</span>
                        <span className="font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-right text-white [font-variant-numeric:lining-nums_tabular-nums]">{formatCurrency(122912.5)}</span>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 lg:gap-[0.89438rem] text-white/70">
                        <span className="font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] align-middle text-[#999999]">Transaction Fees</span>
                        <span className="font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-right text-white [font-variant-numeric:lining-nums_tabular-nums]">$4.00</span>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 lg:gap-[0.89438rem] text-white/70">
                        <span className="font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] align-middle text-[#999999]">Estimated Total</span>
                        <span className="font-[Font-family] font-normal text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-right text-white [font-variant-numeric:lining-nums_tabular-nums]">{formatCurrency(selectedQuantity * latestCandle.close)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex w-full items-center justify-center  
                                px-5 lg:px-[1.34187rem] pb-2 font-[Font-family] font-normal 
                                text-xs lg:text-[0.75rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-white transition">
                      Disclaimer
                      <svg
                        width="25"
                        height="15"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="relative top-px lg:top-[0.0625rem] text-white"
                      >
                        <path
                          d="M4.5 3.5l3 2.5-3 2.5"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>


                  </div>
                </section>

                <section className="flex w-full flex-col overflow-hidden rounded lg:rounded-[0.22375rem] bg-[#0A0A0A]">
                  <header className="flex w-full items-center justify-between gap-2 lg:gap-[0.4475rem] bg-[#1F1F1F] px-5 lg:px-[1.34187rem] py-4 lg:py-[0.89438rem]">
                    <h3 className="font-[Font-family] font-semibold text-sm lg:text-[0.89438rem] leading-6 lg:leading-[1.34187rem] text-white">Time &amp; Sales</h3>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md text-white transition" aria-label="Time & sales menu">
                      <svg
                        width="11.926973342895508"
                        height="8.34980583190918"
                        viewBox="0 0 13 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M0.847707 7.98168H8.00468C8.1567 7.98185 8.30291 8.04006 8.41345 8.14441C8.52398 8.24877 8.5905 8.39139 8.59941 8.54314C8.60832 8.6949 8.55895 8.84433 8.46138 8.9609C8.36381 9.07747 8.22541 9.15238 8.07446 9.17034L8.00468 9.17451H0.847707C0.695693 9.17434 0.549481 9.11614 0.438943 9.01178C0.328406 8.90743 0.261888 8.7648 0.252979 8.61305C0.24407 8.4613 0.293444 8.31187 0.391011 8.1953C0.488579 8.07873 0.626976 8.00381 0.777927 7.98586L0.847707 7.98168ZM0.847707 4.4032H11.5832C11.7352 4.40336 11.8814 4.46157 11.9919 4.56593C12.1025 4.67028 12.169 4.8129 12.1779 4.96466C12.1868 5.11641 12.1374 5.26584 12.0399 5.38241C11.9423 5.49898 11.8039 5.5739 11.653 5.59185L11.5832 5.59602H0.847707C0.695693 5.59586 0.549481 5.53765 0.438943 5.43329C0.328406 5.32894 0.261888 5.18632 0.252979 5.03456C0.24407 4.88281 0.293444 4.73338 0.391011 4.61681C0.488579 4.50024 0.626976 4.42532 0.777927 4.40737L0.847707 4.4032ZM0.847707 0.824707H9.79393C9.94594 0.824876 10.0922 0.883083 10.2027 0.987438C10.3132 1.09179 10.3797 1.23442 10.3887 1.38617C10.3976 1.53792 10.3482 1.68735 10.2506 1.80392C10.1531 1.92049 10.0147 1.99541 9.86371 2.01336L9.79393 2.01754H0.847707C0.695693 2.01737 0.549481 1.95916 0.438943 1.85481C0.328406 1.75045 0.261888 1.60783 0.252979 1.45607C0.24407 1.30432 0.293444 1.15489 0.391011 1.03832C0.488579 0.921752 0.626976 0.846836 0.777927 0.828882L0.847707 0.824707Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </header>
                  <div className="flex h-full w-full flex-col gap-3 lg:gap-[0.7825rem] overflow-hidden px-5 lg:px-[1.34187rem] pb-5 lg:pb-[1.34187rem] pt-5 lg:pt-[1.125rem]">
                    {timeSalesRows.map((row) => (
                      <div key={`${row.time}-${row.price}`} className="flex w-full justify-between text-sm font-poppins text-white/80">
                        <span className="font-[Font-family] font-normal not-italic text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-white [font-variant-numeric:lining-nums_tabular-nums]">{row.time}</span>
                        <span className="font-[Font-family] font-normal not-italic text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-white [font-variant-numeric:lining-nums_tabular-nums]">{row.price}</span>
                        <span className="font-[Font-family] font-normal not-italic text-xs lg:text-[0.7825rem] leading-4 lg:leading-[1.00625rem] tracking-normal lg:tracking-[0%] text-white [font-variant-numeric:lining-nums_tabular-nums]">{row.size}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close navigation overlay" onClick={closeSidebar} />
          <div className="relative z-10 h-full w-64 max-w-full sm:max-w-[80vw] p-4 pt-6 shadow-2xl">
            <Sidebar onLogout={handleLogout} activeItem="dashboard" onNavigate={closeSidebar} onClose={closeSidebar} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
