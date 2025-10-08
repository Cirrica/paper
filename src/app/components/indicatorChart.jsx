"use client";

import { useEffect, useRef, useState } from "react";

let lightweightChartsPromise;

function loadLightweightCharts() {
  if (!lightweightChartsPromise) {
    lightweightChartsPromise = import("lightweight-charts");
  }

  return lightweightChartsPromise;
}

export default function IndicatorChart({ data = [], height = 160, className = "" }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
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

        const areaSeries = chart.addAreaSeries({
          lineColor: "#0FEDBE",
          topColor: "rgba(15, 237, 190, 0.35)",
          bottomColor: "rgba(15, 237, 190, 0.05)",
          lineWidth: 2,
          priceLineVisible: false,
        });

        chartRef.current = chart;
        seriesRef.current = areaSeries;
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
        chartInstance.remove();
      }

      chartRef.current = null;
      seriesRef.current = null;
      setIsChartReady(false);
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || !data?.length || !isChartReady) {
      return;
    }

    seriesRef.current.setData(
      data.map((point) => ({
        time: point.time,
        value: point.value,
      })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [data, isChartReady]);

  return <div ref={containerRef} className={className} />;
}
