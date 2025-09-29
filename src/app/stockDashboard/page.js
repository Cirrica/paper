'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';

const chartTabs = ['Chart', 'Options', 'News', 'Financials', 'Analysts', 'Risk Analysis', 'Releases', 'Notes', 'Profile'];
const timeframePresets = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', 'D', 'W', 'All', '2m ▼'];
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

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

function generateMockStockData() {
  const candles = [];
  const ma50 = [];
  const ma200 = [];
  const indicator = [];
  const startTimestamp = Math.floor(new Date('2023-11-01T00:00:00Z').getTime() / 1000);
  const totalPoints = 240;
  let baseline = 340;
  let ma50Sum = 0;
  let ma200Sum = 0;

  for (let index = 0; index < totalPoints; index += 1) {
    const time = startTimestamp + index * 24 * 60 * 60;
    const trend = index * 0.45;
    const volatility = Math.sin(index * 0.24) * 4.8 + Math.cos(index * 0.11) * 3.2;
    const open = baseline + trend + volatility;
    const drift = Math.sin((index + 5) * 0.31) * 2.7;
    const close = open + drift;
    const highest = Math.max(open, close) + Math.abs(Math.cos(index * 0.22)) * 4.4 + 1.2;
    const lowest = Math.min(open, close) - Math.abs(Math.sin(index * 0.27)) * 4.1 - 1.2;
    const volume = 2200000 + Math.floor(Math.abs(Math.sin(index * 0.53)) * 1100000 + index * 1200);

    const candle = {
      time,
      open: roundToTwo(open),
      high: roundToTwo(highest),
      low: roundToTwo(lowest),
      close: roundToTwo(close),
      volume,
    };

    candles.push(candle);
    baseline = candle.close;

    ma50Sum += candle.close;
    ma200Sum += candle.close;

    if (index >= 50) {
      ma50Sum -= candles[index - 50].close;
    }

    if (index >= 200) {
      ma200Sum -= candles[index - 200].close;
    }

    if (index >= 49) {
      ma50.push({ time, value: roundToTwo(ma50Sum / 50) });
    }

    if (index >= 199) {
      ma200.push({ time, value: roundToTwo(ma200Sum / 200) });
    }
    const oscillator = 50 + Math.sin(index * 0.35) * 18 + Math.cos(index * 0.09) * 9;
    indicator.push({
      time,
      value: Math.max(20, Math.min(80, roundToTwo(oscillator))),
    });
  }

  return {
    candles,
    overlays: [
      { label: 'MA50', color: '#5B8DEF', colorClass: 'bg-[#5B8DEF]', lineWidth: 2, data: ma50 },
      { label: 'MA200', color: '#1EC8FF', colorClass: 'bg-[#1EC8FF]', lineWidth: 2, data: ma200 },
    ],
    indicator,
  };
}

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
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [tradeSide, setTradeSide] = useState('buy');
  const [orderType, setOrderType] = useState(orderTypes[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [timeInForce, setTimeInForce] = useState(timeInForceOptions[0]);
  const [stopPrice, setStopPrice] = useState(400);
  const [isStopEnabled, setIsStopEnabled] = useState(true);
  const router = useRouter();

  const { candles, overlays, indicator } = useMemo(() => generateMockStockData(), []);
  const latestCandle = candles[candles.length - 1];
  const previousCandle = candles[candles.length - 2];
  const dailyChange = latestCandle.close - previousCandle.close;
  const dailyChangePct = (dailyChange / previousCandle.close) * 100;
  const dailyChangeClass = dailyChange >= 0 ? 'text-positive' : 'text-danger';
  const fiftyTwoWeekHigh = candles.reduce((maxValue, candle) => (candle.high > maxValue ? candle.high : maxValue), candles[0].high);
  const fiftyTwoWeekLow = candles.reduce((minValue, candle) => (candle.low < minValue ? candle.low : minValue), candles[0].low);
  const latestMA50 = overlays[0]?.data ? overlays[0].data[overlays[0].data.length - 1]?.value : null;
  const latestMA200 = overlays[1]?.data ? overlays[1].data[overlays[1].data.length - 1]?.value : null;

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
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <aside className="hidden h-full border-r border-white/10 bg-surface px-5 py-6 lg:flex lg:w-56 lg:flex-col lg:shrink-0">
          <Sidebar onLogout={handleLogout} activeItem="dashboard" />
        </aside>

        <main className="flex flex-1 flex-col items-center">
          <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-black px-5 py-4 lg:hidden">
            <button
              type="button"
              
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              aria-label="Open navigation"
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M1 1H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 7H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 13H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-poppins text-xs font-semibold  tracking-wider text-current">Menu</span>
            </button>
            <div className="flex-1 text-right">
              <p className="font-poppins text-xs font-medium  tracking-widest text-white/60">Dashboard</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center w-full">
            <header className="mb-3 flex w-full max-w-[1250px] items-center justify-between border border-white/10 px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.4)]">
              <div className="flex w-[997.7021484375px] items-center">
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
                  <div className="flex h-[21.3984375px] w-[21.3984375px] items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
                    <span className="font-poppins text-[9px] text-white">JR</span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-poppins text-[12.48px] font-normal leading-[16.05px] text-white">James Raymond</span>
                    <span className="mt-1 font-poppins text-[10.7px] font-normal leading-[16.05px] text-[#999999]">Account: 4453728992</span>
                  </div>
                  <span className="mx-1 h-4 w-px border-[0.89px] border-[#595959]" aria-hidden="true" />
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
                <div className="ml-6 grid h-[39px] w-[199.53125px] grid-cols-2 gap-[28.53px]">
                  <div className="flex flex-col">
                    <span className="font-[Golos Text] text-[10.7px] font-normal leading-[21.4px] text-[#999999]">Portfolio Balance</span>
                    <span className="font-poppins text-[12.48px] font-normal leading-[16.05px] text-white [font-variant-numeric:lining-nums_tabular-nums]">{formatCurrency(623098.17)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-[Golos Text] text-[10.7px] font-normal leading-[21.4px] text-[#999999]">Available Funds</span>
                    <span className="font-poppins text-[12.48px] font-normal leading-[16.05px] text-white [font-variant-numeric:lining-nums_tabular-nums]">{formatCurrency(122912.5)}</span>
                  </div>
                </div>
              </div>
              <div className="w-[200.61036682128906px] rounded-[5.35px] bg-gradient-to-b from-white/50 to-black/50 p-[0.45px]">
                <div className="flex h-[28.53125px] w-full items-center rounded-[5.35px] bg-[#191919] px-[10.7px]">
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
                    className="ml-3 w-full bg-transparent font-poppins text-[12.48px] font-normal leading-[16.05px] text-[#999999] placeholder:text-white/40 focus:outline-none"
                  />
                </div>
              </div>
            </header>

            <div className="grid h-[848.3330078125px] w-[1231px] gap-[7.16px] p-[7.16px] lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="flex flex-col">
                <div className="top container">
                    <div className="flex h-[50.99563980102539px] w-[896.4113159179688px] items-center justify-between overflow-x-auto border-b-[0.89px] border-[#1F1F1F] bg-[#1F1F1F] pr-[21.47px] pl-[21.47px]">
                    {chartTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-[#F0C37A]/60 to-[#C78444]/60 text-white shadow-[0_6px_18px_rgba(239,178,92,0.25)]'
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="border-b border-white/5 h-[121.94186401367188px] w-[896.4113159179688px] gap-[35.78px] pt-[10.74px] pr-[21.47px] pb-[10.74px] pl-[21.47px]">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex h-[100.47093200683594px] w-[313.0494079589844px] flex-col gap-[10.74px]">
                        <div className="flex h-[100.47093200683594px] w-[313.0494079589844px] flex-wrap items-center gap-[10.74px]">
                          <span className="font-['Font-family'] text-[17.89px] font-normal leading-[21.47px]  text-white">MSFT</span>
                          <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-white">Microsoft Corp NASDAQ</span>
                          <div className="flex h-[21.470930099487305px] w-[50.09884262084961px] items-center gap-[7.16px]">
                            <button type="button" className="flex h-[21.470930099487305px] w-[21.470930099487305px] items-center justify-center gap-[7.16px] rounded-[89.46px] border-[0.45px] border-[#999999] p-[3.58px] text-white/60 transition hover:text-white">
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
                            <button type="button" className="flex h-[21.470930099487305px] w-[21.470930099487305px] items-center justify-center gap-[7.16px] rounded-[89.46px] border-[0.45px] border-[#999999] p-[3.58px] text-white/60 transition hover:text-white">
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
                        <div className="flex h-[40px] w-[174.156982421875px] items-end justify-between gap-[7.16px]">
                            <span className="font-['Font-family'] text-[35.78px] font-semibold leading-[39.36px]  text-[#DAA56A] [font-variant-numeric:lining-nums_tabular-nums]">
                              {latestCandle.close.toFixed(2)}
                            </span>
                            <div className="flex h-[37.578487396240234px] w-[44px] flex-col gap-[3.58px] text-right">
                              <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-[#0FEDBE]">
                                {formatSigned(dailyChange)}
                              </span>
                              <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-[#0FEDBE]">
                                {formatSigned(dailyChangePct)}%
                              </span>
                            </div>
                          </div>
                        <div className="flex h-[17px] w-[313.0494079589844px] items-center gap-[7px] font-poppins text-white/60">
                          <div className="flex h-[17px] w-[199.73545837402344px] justify-between items-center gap-[3.58px] tracking-wider">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-[#999999]">
                              After hours:
                            </span>
                            <div className="flex h-[17px] w-[124.15697479248047px] justify-between items-center gap-[3.58px]">
                              <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-[#D70000]">
                                406.83
                              </span>
                              <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-[#D70000]">
                                -0.27
                              </span>
                              <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px]  text-[#D70000]">
                                -0.07%
                              </span>
                            </div>
                          </div>
                          <div className="flex h-[8.946221351623535px] w-[0.89px] items-center justify-center text-[#999999]">
                            |
                          </div>
                          <div className="flex h-[17px] items-center">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-white tracking-wide">
                              19:59 04/26 EDT
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid h-[99.31395721435547px] w-[504.6351623535156px] grid-cols-2 gap-[28.63px] text-sm font-poppins text-white/70">
                        <div className="flex h-[99.31395721435547px] w-[238.00363159179688px] flex-col gap-[3.58px]">
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">Open</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-[#D70000] [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              401.23
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">Low</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-[#D70000] [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              400.10
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">High</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-[#0FEDBE] [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              408.36
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">52 wk high</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              430.82
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">52 wk low</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              273.13
                            </span>
                          </div>
                        </div>
                        <div className="flex h-[99.31395721435547px] w-[238.00363159179688px] flex-col gap-[3.58px]">
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">Avg Vol (3M)</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              21.73M
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">Shares Outstanding</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              7.43B
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">Mkt Cap</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              3.02T
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] text-[#999999]">Div Yield</span>
                            <span
                              className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white [font-variant-numeric:lining-nums_tabular-nums]"
                            >
                              0.74%
                            </span>
                          </div>
                          <div className="flex h-[17px] w-[238.00363159179688px] items-center justify-between gap-[14.31px]">
                            <span className="font-['Font-family'] text-[12.52px] font-normal leading-[16.1px] tracking-[0px] text-white">
                              View all
                            </span>
                            <span className="flex h-[15px] w-[30px] items-center justify-end text-white">
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

                <div className="chart flex-1 mt-3">
                  <div className="flex h-[646.767578125px] w-[896.4113159179688px] flex-col gap-[14.31px] px-6 py-6">
                    <div className="border-b border-white/5 px-4 pb-4">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-poppins text-[13px] text-white/70">
                        <span>
                          Open <span className="text-white">{latestCandle.open.toFixed(2)}</span>
                        </span>
                        <span>
                          High <span className="text-white">{latestCandle.high.toFixed(2)}</span>
                        </span>
                        <span>
                          Low <span className="text-white">{latestCandle.low.toFixed(2)}</span>
                        </span>
                        <span>
                          Close <span className={`font-semibold ${dailyChange >= 0 ? 'text-positive' : 'text-danger'}`}>{latestCandle.close.toFixed(2)}</span>
                        </span>
                        <span>
                          Vol <span className="text-white">{formatCompactNumber(latestCandle.volume)}</span>
                        </span>
                        {latestMA50 !== null ? (
                          <span>
                            MA50 <span className="text-positive">{latestMA50.toFixed(2)}</span>
                          </span>
                        ) : null}
                        {latestMA200 !== null ? (
                          <span>
                            MA200 <span className="text-positive">{latestMA200.toFixed(2)}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="border-b border-white/5 px-4 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#1F1F1F] bg-[#101010] px-4 py-3 text-xs text-white/60">
                        <div className="flex flex-wrap items-center gap-3">
                          {overlays.map((overlay) => {
                            const latestValue = overlay.data[overlay.data.length - 1]?.value;

                            return (
                              <span key={overlay.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0F0F0F] px-3 py-1 font-poppins">
                                <span className={`h-2 w-2 rounded-full ${overlay.colorClass}`} />
                                {overlay.label}: {latestValue !== undefined ? latestValue.toFixed(2) : '--'}
                              </span>
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {['cursor','trend','measure','notes','fullscreen'].map((tool) => (
                            <button key={tool} type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#0F0F0F] text-white/50 transition hover:text-white">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M3 3l8 4-4 1-1 4-3-9Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          ))}
                          <button type="button" className="rounded-md border border-white/15 px-3 py-1 font-poppins text-xs font-semibold  tracking-[0.24em] text-white/60 transition hover:text-white">
                            Indicators
                          </button>
                          <button type="button" className="rounded-md border border-white/15 px-3 py-1 font-poppins text-xs font-semibold  tracking-[0.24em] text-white/60 transition hover:text-white">
                            Compare
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-[#1F1F1F] bg-[#090909] text-white/40">
                      <div className="flex flex-col items-center justify-center gap-6">
                        <span className="font-poppins text-sm  tracking-[0.3em]">Chart Placeholder</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1F1F1F] bg-[#101010] px-4 py-3 text-xs font-poppins  tracking-[0.24em] text-white/60">
                      <div className="flex flex-wrap items-center gap-2">
                        {timeframePresets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setSelectedTimeframe(preset)}
                            className={`rounded-full px-3 py-1.5 transition ${
                              selectedTimeframe === preset
                                ? 'bg-gradient-to-r from-[#F0C37A]/60 to-[#C78444]/60 text-white shadow-[0_6px_18px_rgba(239,178,92,0.25)]'
                                : 'bg-[#151515] text-white/60 hover:text-white'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="flex h-full flex-col gap-6">
                <section className="">
                  <header className="flex items-center justify-between bg-[#111111] px-5 py-4">
                    <h3 className="font-poppins text-lg font-semibold text-white">Trade</h3>
                    <button type="button" aria-label="Trade menu" className="rounded-md border border-white/15 p-2 text-white/60 transition hover:text-white">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M6 2C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0C5.44772 0 5 0.447715 5 1C5 1.55228 5.44772 2 6 2Z" fill="currentColor" />
                        <path d="M6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7Z" fill="currentColor" />
                        <path d="M6 12C6.55228 12 7 11.5523 7 11C7 10.4477 6.55228 10 6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12Z" fill="currentColor" />
                      </svg>
                    </button>
                  </header>
                  <div className="m-5 flex bg-[#111111] text-sm font-poppins">
                    <button
                      type="button"
                      onClick={() => setTradeSide('buy')}
                      className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-center font-semibold transition ${
                        tradeSide === 'buy'
                          ? 'bg-gradient-to-r from-[#F0C37A] to-[#C78444] text-black shadow-[0_8px_20px_rgba(239,178,92,0.35)]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeSide('sell')}
                      className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-center font-semibold transition ${
                        tradeSide === 'sell'
                          ? 'bg-gradient-to-r from-[#6450FF] to-[#9933FF] text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                  <div className="space-y-5 px-5 pb-5">
                    <div className="space-y-3">
                      <label htmlFor="orderType" className="font-poppins text-sm font-semibold text-white/70">Order Type</label>
                      <select
                        id="orderType"
                        value={orderType}
                        onChange={(event) => setOrderType(event.target.value)}
                        className="h-12 w-full rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] px-4 font-poppins text-sm text-white/80 focus:border-[#C99046] focus:outline-none"
                      >
                        {orderTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#0E0E0E] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-poppins text-sm font-semibold text-white/70">Quantity</label>
                        <span className="rounded-full border border-[#C99046]/40 bg-[#2A1A04] px-3 py-0.5 text-xs font-semibold  tracking-[0.24em] text-[#E9B872]">Shares</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedQuantity}
                          min={1}
                          step={1}
                          onChange={(event) => setSelectedQuantity(Number(event.target.value))}
                          className="h-12 w-full rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] px-4 font-poppins text-sm text-white/80 focus:border-[#C99046] focus:outline-none"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px]  tracking-[0.24em] text-white/40">Shares</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {quickQuantities.map((quantity) => (
                          <button
                            key={quantity}
                            type="button"
                            onClick={() => setSelectedQuantity(quantity)}
                            className={`rounded-full px-4 py-2 font-poppins text-xs font-semibold transition ${
                              selectedQuantity === quantity
                                ? 'bg-gradient-to-r from-[#F0C37A] to-[#C78444] text-black shadow-[0_6px_18px_rgba(239,178,92,0.35)]'
                                : 'bg-[#151515] text-white/70 hover:text-white'
                            }`}
                          >
                            {quantity}
                          </button>
                        ))}
                        <button type="button" className="flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2 text-xs font-semibold text-white/60 transition hover:text-white">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M11.0833 2.91675L6.41667 7.58341" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.0833 2.91675L8.16667 11.0834L6.41667 7.58341L2.91667 5.83341L11.0833 2.91675Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Custom
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="timeInForce" className="font-poppins text-sm font-semibold text-white/70">Time-in-Force</label>
                      <select
                        id="timeInForce"
                        value={timeInForce}
                        onChange={(event) => setTimeInForce(event.target.value)}
                        className="h-12 w-full rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] px-4 font-poppins text-sm text-white/80 focus:border-[#C99046] focus:outline-none"
                      >
                        {timeInForceOptions.map((option) => (
                          <option key={option} value={option} className="bg-[#0E0E0E] text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-poppins text-sm font-semibold text-white">Stop Price</span>
                        <button
                          type="button"
                          onClick={() => setIsStopEnabled((prev) => !prev)}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                            isStopEnabled ? 'bg-gradient-to-r from-[#F0C37A] to-[#C78444]' : 'bg-[#2A2A2A]'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-black transition ${
                              isStopEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                        isStopEnabled ? 'border-[#C99046] bg-[#1C1406]' : 'border-[#2A2A2A] bg-[#0E0E0E]'
                      }`}
                      >
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold  tracking-[0.3em] text-white/60">$</span>
                        <input
                          type="number"
                          value={stopPrice}
                          min={0}
                          step="0.01"
                          onChange={(event) => setStopPrice(Number(event.target.value))}
                          className="w-full bg-transparent font-poppins text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none"
                          placeholder="0.00"
                          disabled={!isStopEnabled}
                        />
                      </div>
                      <p className="font-poppins text-xs text-white/50">Est. Loss · <span className="font-semibold text-[#FF4D4D]">$12,057.36</span></p>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-dashed border-white/15 bg-[#0B0B0B] px-4 py-4 text-sm">
                      <div className="flex items-center justify-between text-white/70">
                        <span className="font-poppins">Buying Power</span>
                        <span className="font-poppins">{formatCurrency(122912.5)}</span>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span className="font-poppins">Transaction Fees</span>
                        <span className="font-poppins">$4.00</span>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span className="font-poppins">Estimated Total</span>
                        <span className="font-poppins">{formatCurrency(selectedQuantity * latestCandle.close)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full rounded-2xl px-4 py-3 font-poppins text-sm font-semibold  tracking-[0.3em] transition ${
                        tradeSide === 'buy'
                          ? 'bg-gradient-to-r from-[#F0C37A] to-[#C78444] text-black shadow-[0_12px_30px_rgba(239,178,92,0.3)] hover:brightness-110'
                          : 'bg-gradient-to-r from-[#FF5E5E] to-[#D02A2A] text-white shadow-[0_12px_30px_rgba(255,94,94,0.25)] hover:brightness-110'
                      }`}
                    >
                      Submit {tradeSide === 'buy' ? 'Buy' : 'Sell'} Order
                    </button>

                    <button type="button" className="flex items-center justify-center gap-2 text-xs font-semibold  tracking-[0.3em] text-white/50 transition hover:text-white/70">
                      Disclaimer
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M4.5 3.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </section>

                <section className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                  <header className="flex items-center justify-between bg-gradient-to-b from-[#1F1F1F] to-[#111111] px-5 py-4">
                    <h3 className="font-poppins text-base font-semibold text-white">Time &amp; Sales</h3>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/60 transition hover:text-white" aria-label="Time & sales menu">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1.5 3h9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        <path d="M1.5 6h9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        <path d="M1.5 9h9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </button>
                  </header>
                  <div className="m-5 rounded-2xl border border-[#2A2A2A]">
                    <div className="grid grid-cols-3 border-b border-[#2A2A2A] bg-[#121212] px-4 py-2 text-[11px] font-poppins  tracking-[0.2em] text-white/40">
                      <span>Time</span>
                      <span className="text-right">Price</span>
                      <span className="text-right">Size</span>
                    </div>
                    <div className="max-h-[220px] divide-y divide-[#2A2A2A] overflow-hidden">
                      {timeSalesRows.map((row) => (
                        <div key={`${row.time}-${row.price}`} className="grid grid-cols-3 px-4 py-2 text-sm font-poppins text-white/80">
                          <span>{row.time}</span>
                          <span className="text-right">{row.price}</span>
                          <span className="text-right">{row.size}</span>
                        </div>
                      ))}
                    </div>
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
          <div className="relative z-10 h-full w-64 max-w-[80vw] p-4 pt-6 shadow-2xl">
            <Sidebar onLogout={handleLogout} activeItem="dashboard" onNavigate={closeSidebar} onClose={closeSidebar} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
