"use client";

import { useEffect, useRef, useState } from "react";

function prepareVolumeData(candleData = []) {
  return candleData.map((item) => ({
    time: item.time,
    value: item.volume ?? 0,
    color: (item.close ?? 0) >= (item.open ?? 0)
      ? "rgba(15, 237, 190, 0.4)"
      : "rgba(236, 34, 31, 0.4)",
  }));
}

let lightweightChartsPromise;

function loadLightweightCharts() {
  if (!lightweightChartsPromise) {
    lightweightChartsPromise = import("lightweight-charts");
  }

  return lightweightChartsPromise;
}

export default function StockChart({
  candles = [],
  overlays = [],
  height = 420,
  className = "",
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const overlaySeriesRefs = useRef([]);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) {
      return () => {};
    }

    let disposed = false;
    let chartInstance = null;
    let handleResize;

    loadLightweightCharts()
      .then(({ createChart, ColorType }) => {
        if (disposed || !containerRef.current || chartRef.current) {
          return;
        }

        const chart = createChart(containerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: "#050505" },
            textColor: "rgba(255,255,255,0.6)",
          },
          grid: {
            vertLines: { color: "rgba(255,255,255,0.04)" },
            horzLines: { color: "rgba(255,255,255,0.04)" },
          },
          crosshair: {
            mode: 0,
            vertLine: {
              color: "rgba(255,255,255,0.2)",
              labelBackgroundColor: "#1b1b1b",
            },
            horzLine: {
              color: "rgba(255,255,255,0.2)",
              labelBackgroundColor: "#1b1b1b",
            },
          },
          rightPriceScale: {
            borderVisible: false,
            textColor: "rgba(255,255,255,0.6)",
          },
          timeScale: {
            borderVisible: false,
            timeVisible: true,
            secondsVisible: false,
          },
          width: containerRef.current.clientWidth,
          height,
        });

        const candleSeries = chart.addCandlestickSeries({
          upColor: "#0FEDBE",
          downColor: "#EC221F",
          borderVisible: false,
          wickUpColor: "#0FEDBE",
          wickDownColor: "#EC221F",
          priceFormat: { type: "price", precision: 2, minMove: 0.01 },
        });

        const volumeSeries = chart.addHistogramSeries({
          priceScaleId: "",
          scaleMargins: { top: 0.88, bottom: 0 },
          priceFormat: { type: "volume" },
        });

        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;
        chartRef.current = chart;
        chartInstance = chart;
        setIsChartReady(true);

        handleResize = () => {
          if (!containerRef.current) {
            return;
          }

          chart.applyOptions({ width: containerRef.current.clientWidth });
        };

        window.addEventListener("resize", handleResize);
        handleResize();
      })
      .catch((error) => {
        console.error("Failed to load lightweight-charts", error);
      });

    return () => {
      disposed = true;

      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }

      if (chartInstance) {
        overlaySeriesRefs.current.forEach((series) => {
          chartInstance.removeSeries(series);
        });
        overlaySeriesRefs.current = [];
        chartInstance.remove();
      }

      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      setIsChartReady(false);
    };
  }, [height]);

  useEffect(() => {
    if (!chartRef.current || !isChartReady) {
      return;
    }

    if (overlaySeriesRefs.current.length !== overlays.length) {
      overlaySeriesRefs.current.forEach((series) => {
        chartRef.current.removeSeries(series);
      });
      overlaySeriesRefs.current = overlays.map((overlay) =>
        chartRef.current.addLineSeries({
          color: overlay.color ?? "#5B8DEF",
          lineWidth: overlay.lineWidth ?? 2,
          priceFormat: { type: "price" },
          lastValueVisible: false,
          priceLineVisible: false,
        }),
      );
    }

    overlaySeriesRefs.current.forEach((series, index) => {
      const overlay = overlays[index];
      if (!overlay || !overlay.data?.length) {
        series.setData([]);
        return;
      }

      series.setData(
        overlay.data.map((point) => ({
          time: point.time,
          value: point.value,
        })),
      );
    });
  }, [overlays, isChartReady]);

  useEffect(() => {
    if (!candleSeriesRef.current || !candles?.length || !isChartReady) {
      return;
    }

    const seriesData = candles.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    candleSeriesRef.current.setData(seriesData);
    volumeSeriesRef.current?.setData(prepareVolumeData(seriesData));
    chartRef.current?.timeScale().fitContent();
  }, [candles, isChartReady]);

  return <div ref={containerRef} className={className} />;
}
