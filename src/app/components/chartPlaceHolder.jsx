'use client';

import { useEffect, useRef } from 'react';

const SUPPORT_LEVELS = [340, 360, 380, 400, 420];
const RSI_LEVELS = [70, 50, 30];

function applyPriceLines(series, levels, baseOptions = {}) {
  levels.forEach((price) => {
    series.createPriceLine({
      price,
      axisLabelVisible: false,
      title: '',
      ...baseOptions,
    });
  });
}

export default function ChartPlaceHolder({
  candles = [],
  overlays = [],
  indicator = [],
  timeframeOptions = [],
  selectedTimeframe,
  onTimeframeChange = () => {},
  className = '',
}) {
  const rootRef = useRef(null);
  const priceRef = useRef(null);
  const indicatorRef = useRef(null);

  const latestCandle = candles[candles.length - 1] ?? {};
  const previousCandle = candles[candles.length - 2] ?? latestCandle;
  const priceChange = latestCandle && previousCandle ? latestCandle.close - previousCandle.close : 0;
  const priceChangePercent = previousCandle?.close ? (priceChange / previousCandle.close) * 100 : 0;
  const priceDeltaColor = priceChange >= 0 ? 'text-[#1EC8FF]' : 'text-[#F04438]';

  const statItems = [
    { label: 'Open', value: formatPrice(latestCandle?.open) },
    { label: 'High', value: formatPrice(latestCandle?.high) },
    { label: 'Low', value: formatPrice(latestCandle?.low) },
    { label: 'Close', value: formatPrice(latestCandle?.close) },
    {
      label: 'Change',
      value: `${formatSignedChange(priceChange)} (${formatSignedChange(priceChangePercent)}%)`,
      accent: true,
    },
    { label: 'Volume', value: formatVolume(latestCandle?.volume) },
  ];

  const overlayLegend = overlays.map((overlay) => {
    const data = overlay?.data ?? [];
    const lastPoint = data[data.length - 1];
    return {
      label: overlay.label,
      color: overlay.color,
      latestValue: formatPrice(lastPoint?.value),
    };
  });

  const indicatorLatest = indicator[indicator.length - 1];
  const indicatorLatestValue = indicatorLatest ? formatPrice(indicatorLatest.value) : null;
  const containerClasses = [
    'min-w-0 w-full border border-[#101822] bg-[#0A1018] p-6 flex h-full flex-col',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    let cleanup = () => {};
    let disposed = false;

    async function bootstrap() {
      const module = await import('lightweight-charts');
      if (disposed) {
        return;
      }

      const {
        createChart,
        CrosshairMode,
        LineStyle,
        CandlestickSeries,
        HistogramSeries,
        LineSeries,
        AreaSeries,
      } = module;

      const root = rootRef.current;
      const priceContainer = priceRef.current;
      const indicatorContainer = indicatorRef.current;

      if (!root || !priceContainer || !indicatorContainer || candles.length === 0) {
        return;
      }

      const getDimension = (value, fallback) => {
        if (Number.isFinite(value) && value > 0) {
          return Math.floor(value);
        }
        return fallback;
      };

      const priceBounds = priceContainer.getBoundingClientRect();
      const indicatorBounds = indicatorContainer.getBoundingClientRect();

      const chartWidth = getDimension(
        priceContainer.clientWidth || priceBounds.width,
        getDimension(root.clientWidth, 600),
      );
      const priceHeight = getDimension(
        priceContainer.clientHeight || priceBounds.height,
        480,
      );
      const indicatorHeight = getDimension(
        indicatorContainer.clientHeight || indicatorBounds.height,
        160,
      );

      const indicatorValuesByTime = new Map(indicator.map((item) => [item.time, item.value]));
      const closeValuesByTime = new Map(candles.map((item) => [item.time, item.close]));

      const priceChart = createChart(priceContainer, {
        autoSize: false,
        width: chartWidth,
        height: priceHeight,
        layout: {
          background: { type: 'solid', color: '#050B11' },
          textColor: '#E3E8F5',
          fontSize: 12,
          fontFamily: 'Poppins, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.06)', style: LineStyle.Solid },
          horzLines: { color: 'rgba(255, 255, 255, 0.06)', style: LineStyle.Solid },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: 'rgba(30, 200, 255, 0.7)',
            width: 1,
            style: LineStyle.Solid,
          },
          horzLine: {
            color: 'rgba(30, 200, 255, 0.7)',
            width: 1,
            style: LineStyle.Solid,
          },
        },
        localization: {
          priceFormatter: (price) => price.toFixed(2),
        },
        timeScale: {
          visible: false,
          borderVisible: false,
          borderColor: 'rgba(255, 255, 255, 0.16)',
          rightOffset: 6,
          barSpacing: 11,
          fixLeftEdge: true,
          fixRightEdge: false,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.16)',
          textColor: '#C5D2E4',
          scaleMargins: { top: 0.05, bottom: 0.28 },
        },
        leftPriceScale: { visible: false },
        watermark: { visible: false },
      });

      const indicatorChart = createChart(indicatorContainer, {
        autoSize: false,
        width: chartWidth,
        height: indicatorHeight,
        layout: {
          background: { type: 'solid', color: '#050B11' },
          textColor: '#E3E8F5',
          fontSize: 11,
          fontFamily: 'Poppins, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.06)', style: LineStyle.Solid },
          horzLines: { color: 'rgba(255, 255, 255, 0.06)', style: LineStyle.Solid },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: 'rgba(30, 200, 255, 0.7)',
            width: 1,
            style: LineStyle.Solid,
          },
          horzLine: {
            color: 'rgba(30, 200, 255, 0.7)',
            width: 1,
            style: LineStyle.Solid,
          },
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.16)',
          rightOffset: 6,
          barSpacing: 11,
          fixLeftEdge: true,
          fixRightEdge: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.16)',
          textColor: '#C5D2E4',
          scaleMargins: { top: 0.2, bottom: 0.1 },
        },
        leftPriceScale: { visible: false },
        watermark: { visible: false },
      });

      const candleSeries = priceChart.addSeries(CandlestickSeries, {
        upColor: '#1EC8FF',
        downColor: '#F04438',
        wickUpColor: '#1EC8FF',
        wickDownColor: '#F04438',
        borderVisible: false,
      });
      candleSeries.setData(candles);

      applyPriceLines(candleSeries, SUPPORT_LEVELS, {
        color: 'rgba(255, 255, 255, 0.14)',
        lineStyle: LineStyle.Solid,
        lineWidth: 1,
      });

      candleSeries.applyOptions({
        priceLineVisible: false,
        lastValueVisible: false,
        wickVisible: true,
        upColor: '#24E1F7',
        downColor: '#F04438',
        wickUpColor: '#24E1F7',
        wickDownColor: '#F04438',
        borderVisible: false,
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });

      const volumeSeries = priceChart.addSeries(HistogramSeries, {
        priceScaleId: 'volume',
        priceFormat: { type: 'volume' },
        priceLineVisible: false,
        lastValueVisible: false,
      });
      volumeSeries.setData(
        candles.map((candle) => ({
          time: candle.time,
          value: candle.volume,
          color: candle.close >= candle.open ? 'rgba(30, 232, 211, 0.8)' : 'rgba(244, 68, 56, 0.82)',
        })),
      );
      priceChart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.78, bottom: 0 },
        borderColor: 'rgba(255, 255, 255, 0.16)',
      });

      overlays.forEach((overlay) => {
        const lineSeries = priceChart.addSeries(LineSeries, {
          color: overlay.color,
          lineWidth: overlay.lineWidth ?? 2,
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        });
        lineSeries.applyOptions({
          lineType: 2,
          priceLineVisible: false,
        });
        lineSeries.setData(overlay.data ?? []);
      });

      const rsiSeries = indicatorChart.addSeries(AreaSeries, {
        lineColor: '#1EC8FF',
        topColor: 'rgba(30, 200, 255, 0.32)',
        bottomColor: 'rgba(30, 200, 255, 0.05)',
        lineWidth: 2,
        priceLineVisible: false,
      });
      rsiSeries.applyOptions({ lineColor: '#1BD5BA' });
      rsiSeries.setData(indicator);
      applyPriceLines(rsiSeries, RSI_LEVELS, {
        color: 'rgba(255, 255, 255, 0.1)',
        lineStyle: LineStyle.Solid,
        lineWidth: 1,
      });

      const setChartCrosshair = (chart, series, price, time) => {
        if (typeof chart.setCrosshairPosition === 'function') {
          chart.setCrosshairPosition(price, time, series);
          return;
        }
        if (typeof chart.moveCrosshair === 'function') {
          const x = chart.timeScale().timeToCoordinate?.(time);
          const y = series.priceToCoordinate?.(price);
          if (x != null && y != null) {
            chart.moveCrosshair({ x, y });
          }
        }
      };

      const clearChartCrosshair = (chart) => {
        if (typeof chart.clearCrosshairPosition === 'function') {
          chart.clearCrosshairPosition();
        } else if (typeof chart.clearCrosshair === 'function') {
          chart.clearCrosshair();
        }
      };

      let blockPriceRange = false;
      let blockIndicatorRange = false;

      const syncPriceRange = (range) => {
        if (blockPriceRange || !range) {
          return;
        }
        blockIndicatorRange = true;
        indicatorChart.timeScale().setVisibleLogicalRange(range);
        blockIndicatorRange = false;
      };

      const syncIndicatorRange = (range) => {
        if (blockIndicatorRange || !range) {
          return;
        }
        blockPriceRange = true;
        priceChart.timeScale().setVisibleLogicalRange(range);
        blockPriceRange = false;
      };

      priceChart.timeScale().subscribeVisibleLogicalRangeChange(syncPriceRange);
      indicatorChart.timeScale().subscribeVisibleLogicalRangeChange(syncIndicatorRange);

      let mutePriceCrosshair = false;
      let muteIndicatorCrosshair = false;

      const handlePriceCrosshair = (param) => {
        if (mutePriceCrosshair) {
          return;
        }
        if (!param || param.time === undefined || !param.point) {
          muteIndicatorCrosshair = true;
          clearChartCrosshair(indicatorChart);
          muteIndicatorCrosshair = false;
          return;
        }
        const indicatorValue = indicatorValuesByTime.get(param.time);
        muteIndicatorCrosshair = true;
        if (indicatorValue !== undefined) {
          setChartCrosshair(indicatorChart, rsiSeries, indicatorValue, param.time);
        } else {
          clearChartCrosshair(indicatorChart);
        }
        muteIndicatorCrosshair = false;
      };

      const handleIndicatorCrosshair = (param) => {
        if (muteIndicatorCrosshair) {
          return;
        }
        if (!param || param.time === undefined || !param.point) {
          mutePriceCrosshair = true;
          clearChartCrosshair(priceChart);
          mutePriceCrosshair = false;
          return;
        }
        const priceValueFromSeries = param.seriesData?.get(candleSeries)?.close;
        const priceValue = priceValueFromSeries ?? closeValuesByTime.get(param.time);
        mutePriceCrosshair = true;
        if (priceValue !== undefined) {
          setChartCrosshair(priceChart, candleSeries, priceValue, param.time);
        } else {
          clearChartCrosshair(priceChart);
        }
        mutePriceCrosshair = false;
      };

      priceChart.subscribeCrosshairMove(handlePriceCrosshair);
      indicatorChart.subscribeCrosshairMove(handleIndicatorCrosshair);

      priceChart.timeScale().applyOptions({
        rightBarStaysOnScroll: true,
        visible: false,
        borderVisible: false,
      });
      priceChart.timeScale().fitContent();
      indicatorChart.timeScale().applyOptions({ borderColor: 'rgba(255, 255, 255, 0.16)' });
      indicatorChart.timeScale().fitContent();

      const resizeCharts = () => {
        const nextPriceBounds = priceContainer.getBoundingClientRect();
        const nextIndicatorBounds = indicatorContainer.getBoundingClientRect();

        const nextWidth = getDimension(
          priceContainer.clientWidth || nextPriceBounds.width,
          chartWidth,
        );
        const nextPriceHeight = getDimension(
          priceContainer.clientHeight || nextPriceBounds.height,
          priceHeight,
        );
        const nextIndicatorHeight = getDimension(
          indicatorContainer.clientHeight || nextIndicatorBounds.height,
          indicatorHeight,
        );

        if (nextWidth > 0 && nextPriceHeight > 0) {
          priceChart.resize(nextWidth, nextPriceHeight);
        }
        if (nextWidth > 0 && nextIndicatorHeight > 0) {
          indicatorChart.resize(nextWidth, nextIndicatorHeight);
        }
      };

      resizeCharts();

      const resizeObservers = [];
      if (typeof ResizeObserver === 'function') {
        const observer = new ResizeObserver(resizeCharts);
        observer.observe(priceContainer);
        observer.observe(indicatorContainer);
        resizeObservers.push(observer);
      }

      cleanup = () => {
        resizeObservers.forEach((observer) => observer.disconnect());
        priceChart.timeScale().unsubscribeVisibleLogicalRangeChange(syncPriceRange);
        indicatorChart.timeScale().unsubscribeVisibleLogicalRangeChange(syncIndicatorRange);
        priceChart.unsubscribeCrosshairMove(handlePriceCrosshair);
        indicatorChart.unsubscribeCrosshairMove(handleIndicatorCrosshair);
        priceChart.remove();
        indicatorChart.remove();
      };
    }

    bootstrap();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [candles, overlays, indicator]);

  return (
    <section className={containerClasses}>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-7 text-[13px] font-medium text-[#A7B4C2]">
          {statItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-white">{item.label}</span>
              <span
                className={`${
                  item.accent
                    ? `${priceDeltaColor} [font-variant-numeric:tabular-nums]`
                    : 'text-white [font-variant-numeric:tabular-nums]'
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex shrink-0 flex-wrap items-center gap-3 text-[13px]">
          <div className="flex items-center gap-3 text-white/65">
            {overlayLegend.map((overlay) => (
              <div
                key={overlay.label}
                className="flex items-center gap-2 rounded-full bg-[rgba(8,13,18,0.9)] px-3 py-1.5"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: overlay.color }} aria-hidden="true" />
                <span className="text-white/70">{overlay.label}</span>
                <span className="text-white/55 [font-variant-numeric:tabular-nums]">{overlay.latestValue}</span>
              </div>
            ))}
          </div>
          {indicatorLatestValue ? (
            <div className="flex items-center gap-2 rounded-full bg-[rgba(8,13,18,0.9)] px-3 py-1.5 text-white/60">
              <span className="h-2 w-2 rounded-full bg-[#1BD5BA]" aria-hidden="true" />
              <span>RSI</span>
              <span className="[font-variant-numeric:tabular-nums]">{indicatorLatestValue}</span>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-[#070C14] p-4">
          <div ref={rootRef} className="flex min-h-0 w-full flex-1 flex-col gap-[14.31px]">
            <div
              ref={priceRef}
              className="min-h-0 w-full min-w-0 flex-1 rounded-[22px] border border-[#101B2A] bg-[#050B11]"
              style={{ flex: 3 }}
            />
            <div
              ref={indicatorRef}
              className="min-h-0 w-full min-w-0 flex-1 rounded-[22px] border border-[#101B2A] bg-[#050B11]"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-[12px] text-white/60">
          <div className="flex items-center gap-3">
            <span className="tracking-[0.15em] text-white/35">Time frame:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {timeframeOptions.map((option) => {
                const isActive = option === selectedTimeframe;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onTimeframeChange(option)}
                    className={`rounded-full px-3 py-1 transition [font-variant-numeric:tabular-nums] ${
                      isActive
                        ? 'bg-[#1EC8FF] text-[#071620] shadow-[0_8px_18px_rgba(30,200,255,0.35)]'
                        : 'bg-[rgba(10,16,24,0.9)] text-white/65 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatPrice(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

function formatVolume(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function formatSignedChange(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const formatted = Math.abs(value).toFixed(digits);
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return `-${formatted}`;
  }
  return formatted;
}
