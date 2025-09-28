'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import StockChart from '@/app/components/stockChart';
import IndicatorChart from '@/app/components/indicatorChart';

const chartTabs = ['Chart', 'Options', 'News', 'Financials', 'Analysts', 'Risk Analysis', 'Releases', 'Notes', 'Profile'];
const timeframePresets = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', 'D', 'W', 'All', '2m ▼'];
const quickQuantities = [10, 50, 100, 500];
const orderTypes = ['Market Price', 'Limit Order', 'Stop Order', 'Trailing Stop'];
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
      { label: 'MA50', color: '#5B8DEF', lineWidth: 2, data: ma50 },
      { label: 'MA200', color: '#1EC8FF', lineWidth: 2, data: ma200 },
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

export default function StockDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Chart');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [tradeSide, setTradeSide] = useState('buy');
  const [orderType, setOrderType] = useState(orderTypes[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [isStopEnabled, setIsStopEnabled] = useState(true);
  const router = useRouter();

  const { candles, overlays, indicator } = useMemo(() => generateMockStockData(), []);
  const latestCandle = candles[candles.length - 1];
  const previousCandle = candles[candles.length - 2];
  const dailyChange = latestCandle.close - previousCandle.close;
  const dailyChangePct = (dailyChange / previousCandle.close) * 100;
  const fiftyTwoWeekHigh = candles.reduce((maxValue, candle) => (candle.high > maxValue ? candle.high : maxValue), candles[0].high);
  const fiftyTwoWeekLow = candles.reduce((minValue, candle) => (candle.low < minValue ? candle.low : minValue), candles[0].low);

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

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white'>
        <div className='text-center'>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  const headerStyle = {
    width: '1226.84375px',
    height: '67.53125px',
    padding: '14.27px',
    background: '#050505',
    borderBottom: '0.89px solid #1F1F1F',
    opacity: 1,
  };

  const contentWrapperStyle = {
    width: '1231px',
    height: '848.3330078125px',
    gap: '7.16px',
    padding: '7.16px',
    opacity: 1,
  };

  const leftSectionStyle = {
    width: '896.4113159179688px',
    height: '834.01904296875px',
    gap: '14.31px',
    borderRadius: '3.58px',
    opacity: 1,
  };

  const rightSectionStyle = {
    width: '313.1177673339844px',
    height: '834.01904296875px',
    gap: '7.16px',
    opacity: 1,
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
              <p className="font-poppins text-xs font-medium uppercase tracking-widest text-white/60">Dashboard</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center px-5 pb-6 lg:px-8">
            <header
              className="mb-3 flex w-full max-w-[1226.84375px] items-center justify-between rounded-[3.5px]"
              style={headerStyle}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black font-poppins text-base font-semibold uppercase">JR</div>
                <div className="leading-tight">
                  <p className="font-poppins text-sm font-semibold text-white">James Raymond</p>
                  <p className="font-poppins text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">Account · 443728992</p>
                </div>
              </div>
              <div className="ml-10 flex items-center gap-10">
                <div className="leading-tight">
                  <p className="font-poppins text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">Portfolio Balance</p>
                  <p className="font-poppins text-base font-semibold text-white">{formatCurrency(623098.17)}</p>
                </div>
                <div className="leading-tight">
                  <p className="font-poppins text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">Available Funds</p>
                  <p className="font-poppins text-base font-semibold text-white">{formatCurrency(122912.5)}</p>
                </div>
              </div>
              <div className="ml-auto w-[240px]">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search"
                    className="h-10 w-full rounded-full border border-white/20 bg-black px-4 pl-11 font-poppins text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M11.2598 11.2598L15.75 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="7.5" cy="7.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </div>
              </div>
            </header>

            <div
              className="flex w-full max-w-[1231px] flex-1"
              style={contentWrapperStyle}
            >
              <section
                className="flex flex-col rounded-[3.58px] border border-white/10 bg-[#121212] px-5 pb-5 pt-4"
                style={leftSectionStyle}
              >
                <div className="flex items-center gap-5 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-4">
                    {chartTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`font-poppins text-xs font-semibold uppercase tracking-[0.24em] transition ${
                          activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="font-poppins text-[26px] font-semibold text-white tracking-tight">406.32</h2>
                      <div className="flex flex-col text-positive">
                        <span className="font-poppins text-sm font-semibold">+2.24</span>
                        <span className="font-poppins text-xs font-semibold">+0.26%</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-poppins text-white/80">MSFT <span className="text-white/60">Microsoft Corp · NASDAQ</span></p>
                      <p className="font-poppins text-white/50">After hours: <span className="text-positive">{(latestCandle.close + 1.63).toFixed(2)} · +0.41%</span> · 19:59 04/26 EDT</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-poppins text-white/80 sm:grid-cols-4">
                    <div>
                      <p className="text-white/40">Open</p>
                      <p className="mt-1 text-sm text-white">{latestCandle.open.toFixed(2)}</p>
                      <p className="mt-1 text-white/40">High {latestCandle.high.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Low</p>
                      <p className="mt-1 text-sm text-white">{latestCandle.low.toFixed(2)}</p>
                      <p className="mt-1 text-white/40">Close {latestCandle.close.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Avg Vol (3M)</p>
                      <p className="mt-1 text-sm text-white">21.73M</p>
                      <p className="mt-1 text-white/40">Shares Outstanding 7.43B</p>
                    </div>
                    <div>
                      <p className="text-white/40">52 wk high {fiftyTwoWeekHigh.toFixed(2)}</p>
                      <p className="mt-1 text-sm text-white">52 wk low {fiftyTwoWeekLow.toFixed(2)}</p>
                      <p className="mt-1 text-white/40">Mkt Cap 3.02T · Div Yield 0.74%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-black/60 px-4 py-2 text-xs text-white/60">
                    <div className="flex flex-wrap items-center gap-3">
                      {overlays.map((overlay) => (
                        <span key={overlay.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-poppins">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: overlay.color }} />
                          {overlay.label}: {overlay.data[overlay.data.length - 1]?.value.toFixed(2)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-white/15 px-3 py-1 font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-white/60 hover:text-white">Indicators</button>
                      <button type="button" className="rounded-md border border-white/15 px-3 py-1 font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-white/60 hover:text-white">Compare</button>
                    </div>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-3">
                    <div className="h-[320px] overflow-hidden rounded-xl border border-white/10 bg-black/70">
                      <StockChart candles={candles} overlays={overlays} height={320} className="h-full w-full" />
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/70 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="font-poppins text-white">RSI (6, 14, 24) <span className="text-positive">· {indicator[indicator.length - 1]?.value.toFixed(2)}</span></div>
                        <div className="flex flex-wrap gap-2">
                          {timeframePresets.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setSelectedTimeframe(preset)}
                              className={`rounded-full px-3 py-1 font-poppins text-[11px] font-semibold uppercase tracking-[0.24em] ${
                                selectedTimeframe === preset ? 'bg-gold text-black' : 'bg-black/40 text-white/50 hover:text-white'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 h-[120px] overflow-hidden rounded-lg border border-white/10 bg-black/80">
                        <IndicatorChart data={indicator} height={120} className="h-full w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <aside
                className="ml-[7.16px] flex shrink-0 flex-col"
                style={rightSectionStyle}
              >
                <section className="rounded-2xl border border-white/10 bg-[#1A1A1A] px-5 py-5">
                  <header className="flex items-center justify-between">
                    <h3 className="font-poppins text-base font-semibold text-white">Trade</h3>
                    <button type="button" aria-label="Trade menu" className="rounded-md border border-white/15 p-2 text-white/40 transition hover:text-white">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M6 2C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0C5.44772 0 5 0.447715 5 1C5 1.55228 5.44772 2 6 2Z" fill="currentColor" />
                        <path d="M6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7Z" fill="currentColor" />
                        <path d="M6 12C6.55228 12 7 11.5523 7 11C7 10.4477 6.55228 10 6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12Z" fill="currentColor" />
                      </svg>
                    </button>
                  </header>

                  <div className="mt-4 flex rounded-xl border border-white/15 bg-black/50 p-1 text-sm font-poppins uppercase tracking-[0.24em]">
                    <button
                      type="button"
                      onClick={() => setTradeSide('buy')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center font-semibold transition ${tradeSide === 'buy' ? 'bg-positive text-black' : 'text-white/60 hover:text-white'}`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeSide('sell')}
                      className={`flex-1 rounded-lg px-3 py-2 text-center font-semibold transition ${tradeSide === 'sell' ? 'bg-danger text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      Sell
                    </button>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label htmlFor="orderType" className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/50">Order Type</label>
                      <select
                        id="orderType"
                        value={orderType}
                        onChange={(event) => setOrderType(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/80 px-4 py-3 font-poppins text-sm text-white focus:border-gold focus:outline-none"
                      >
                        {orderTypes.map((type) => (
                          <option key={type} value={type} className="bg-surface text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/50">Quantity</label>
                        <span className="font-poppins text-xs text-white/40">Max 500 shares</span>
                      </div>
                      <div className="relative mt-2">
                        <input
                          type="number"
                          value={selectedQuantity}
                          min={1}
                          step={1}
                          onChange={(event) => setSelectedQuantity(Number(event.target.value))}
                          className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 font-poppins text-sm text-white focus:border-gold focus:outline-none"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[10px] uppercase tracking-[0.28em] text-white/40">Shares</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {quickQuantities.map((quantity) => (
                          <button
                            key={quantity}
                            type="button"
                            onClick={() => setSelectedQuantity(quantity)}
                            className={`rounded-full border px-3 py-1.5 font-poppins text-xs font-semibold transition ${
                              selectedQuantity === quantity ? 'border-gold text-gold' : 'border-white/15 text-white/60 hover:text-white'
                            }`}
                          >
                            {quantity}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/50">Time-in-Force</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" className="flex-1 rounded-full border border-gold bg-gold/15 px-3 py-2 font-poppins text-xs font-semibold text-gold">
                          Day
                        </button>
                        <button type="button" className="flex-1 rounded-full border border-white/15 bg-black px-3 py-2 font-poppins text-xs font-semibold text-white/60 hover:text-white">
                          GTC
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-white">Stop Price</span>
                        <button
                          type="button"
                          onClick={() => setIsStopEnabled((prev) => !prev)}
                          className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                            isStopEnabled ? 'bg-gold' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-black transition ${
                              isStopEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className={`rounded-2xl border px-4 py-3 ${
                        isStopEnabled ? 'border-gold bg-gold/15' : 'border-white/15 bg-black/80'
                      }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/50">Price</span>
                          <span className="font-poppins text-sm font-semibold text-white">$400.00</span>
                        </div>
                        <p className="mt-2 font-poppins text-xs text-white/40">Est. Loss · <span className="text-danger">$12,057.36</span></p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white/70">
                      <div className="flex items-center justify-between">
                        <span className="font-poppins">Buying Power</span>
                        <span className="font-poppins">{formatCurrency(122912.5)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-poppins">Transaction Fees</span>
                        <span className="font-poppins">$4.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-poppins">Estimated Total</span>
                        <span className="font-poppins">{formatCurrency(selectedQuantity * latestCandle.close)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`mt-6 w-full rounded-2xl px-4 py-3 font-poppins text-sm font-semibold uppercase tracking-[0.3em] transition ${
                      tradeSide === 'buy' ? 'bg-positive text-black hover:brightness-110' : 'bg-danger text-white hover:brightness-110'
                    }`}
                  >
                    Submit {tradeSide === 'buy' ? 'Buy' : 'Sell'} Order
                  </button>
                </section>

                <section className="flex-1 rounded-2xl border border-white/10 bg-[#121212] px-5 py-5">
                  <header className="flex items-center justify-between">
                    <h3 className="font-poppins text-base font-semibold text-white">Time &amp; Sales</h3>
                    <button type="button" className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/50">
                      Export
                    </button>
                  </header>
                  <div className="mt-4 rounded-xl border border-white/10">
                    <div className="grid grid-cols-3 bg-black/70 px-3 py-2 text-[11px] font-poppins uppercase tracking-[0.2em] text-white/40">
                      <span>Time</span>
                      <span className="text-right">Price</span>
                      <span className="text-right">Size</span>
                    </div>
                    <div className="max-h-[220px] divide-y divide-white/10 overflow-hidden">
                      {timeSalesRows.map((row) => (
                        <div key={`${row.time}-${row.price}`} className="grid grid-cols-3 px-3 py-2 text-sm font-poppins text-white/80">
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
