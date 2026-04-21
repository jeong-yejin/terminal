"use client";

import { useEffect, useRef } from "react";
import type { IntervalValue } from "./constants";

interface TradingChartProps {
  exchange: string;
  symbol: string;
  interval: IntervalValue;
}

export function TradingChart({ exchange, symbol, interval }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `${exchange.toUpperCase()}:${symbol}`,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(23,23,23,0)",
      gridColor: "rgba(255,255,255,0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [exchange, symbol, interval]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-label={`${exchange} ${symbol} chart`}
    />
  );
}
