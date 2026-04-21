"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, LayoutTemplate } from "lucide-react";
import { TradingChart } from "./TradingChart";
import {
  EXCHANGES, INTERVALS,
  type ExchangeMeta, type SymbolMeta, type IntervalValue,
} from "./constants";

// ─── Per-panel exchange selector ──────────────────────────────────────────────

function PanelExchangeTab({
  value,
  onChange,
  color,
}: {
  value: ExchangeMeta;
  onChange: (e: ExchangeMeta) => void;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-surface-2/80 px-2.5 py-1 text-[11px] font-semibold text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        {value.label}
        <ChevronDown size={10} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute left-0 top-full z-50 mt-1 min-w-[110px] overflow-hidden rounded-xl border border-border-subtle bg-surface-2 py-1 shadow-xl">
            {EXCHANGES.map((ex) => (
              <li key={ex.id}>
                <button
                  onClick={() => { onChange(ex); setOpen(false); }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-surface-3 ${
                    ex.id === value.id ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ex.color }} />
                  {ex.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Single chart panel ───────────────────────────────────────────────────────

function ChartPanel({
  symbol,
  defaultExchange,
  controlledExchange,
  interval,
  showExchangeSelector,
}: {
  symbol: SymbolMeta;
  defaultExchange: ExchangeMeta;
  controlledExchange?: ExchangeMeta;
  interval: IntervalValue;
  showExchangeSelector: boolean;
}) {
  const [localExchange, setLocalExchange] = useState(defaultExchange);
  const exchange = controlledExchange ?? localExchange;

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      {showExchangeSelector && (
        <div className="absolute left-2 top-2 z-10">
          <PanelExchangeTab
            value={exchange}
            onChange={setLocalExchange}
            color={exchange.color}
          />
        </div>
      )}
      <TradingChart
        exchange={exchange.id}
        symbol={symbol.tv}
        interval={interval}
      />
    </div>
  );
}

// ─── ChartArea ────────────────────────────────────────────────────────────────

type SplitCount = 1 | 2 | 3;

const SPLIT_ICONS: Record<SplitCount, ReactNode> = {
  1: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="12" height="12" rx="1.5" />
    </svg>
  ),
  2: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="1"   y="1" width="5.5" height="12" rx="1.5" />
      <rect x="7.5" y="1" width="5.5" height="12" rx="1.5" />
    </svg>
  ),
  3: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="1"   y="1" width="3.5" height="12" rx="1.5" />
      <rect x="5.5" y="1" width="3.5" height="12" rx="1.5" />
      <rect x="10"  y="1" width="3.5" height="12" rx="1.5" />
    </svg>
  ),
};

export function ChartArea({
  symbol,
  primaryExchange,
}: {
  symbol: SymbolMeta;
  primaryExchange: ExchangeMeta;
}) {
  const [interval, setChartInterval] = useState<IntervalValue>("60");
  const [splitCount, setSplitCount] = useState<SplitCount>(1);

  // second + third default exchanges
  const secondExchange = EXCHANGES.find((e) => e.id !== primaryExchange.id) ?? EXCHANGES[1];
  const thirdExchange  = EXCHANGES.find((e) => e.id !== primaryExchange.id && e.id !== secondExchange.id) ?? EXCHANGES[2];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ── Controls bar ─────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-1 px-3 py-1.5">
        {/* Interval buttons */}
        <div className="flex items-center gap-0.5">
          {INTERVALS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setChartInterval(value)}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                interval === value
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="ml-auto flex items-center gap-1 text-[11px] text-text-disabled">
          <LayoutTemplate size={11} />
          Split
        </span>

        {/* Split view toggle */}
        <div className="flex items-center rounded-lg border border-border-subtle bg-surface-2 p-0.5">
          {([1, 2, 3] as SplitCount[]).map((n) => (
            <button
              key={n}
              onClick={() => setSplitCount(n)}
              aria-label={`${n} chart${n > 1 ? "s" : ""}`}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                splitCount === n
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-disabled hover:text-text-tertiary"
              }`}
            >
              {SPLIT_ICONS[n]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chart panels ─────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {splitCount === 1 && (
          <ChartPanel
            symbol={symbol}
            defaultExchange={primaryExchange}
            controlledExchange={primaryExchange}
            interval={interval}
            showExchangeSelector={false}
          />
        )}

        {splitCount === 2 && (
          <>
            <ChartPanel
              symbol={symbol}
              defaultExchange={primaryExchange}
              interval={interval}
              showExchangeSelector
            />
            <div className="w-px flex-shrink-0 bg-border-subtle" />
            <ChartPanel
              symbol={symbol}
              defaultExchange={secondExchange}
              interval={interval}
              showExchangeSelector
            />
          </>
        )}

        {splitCount === 3 && (
          <>
            <ChartPanel
              symbol={symbol}
              defaultExchange={primaryExchange}
              interval={interval}
              showExchangeSelector
            />
            <div className="w-px flex-shrink-0 bg-border-subtle" />
            <ChartPanel
              symbol={symbol}
              defaultExchange={secondExchange}
              interval={interval}
              showExchangeSelector
            />
            <div className="w-px flex-shrink-0 bg-border-subtle" />
            <ChartPanel
              symbol={symbol}
              defaultExchange={thirdExchange}
              interval={interval}
              showExchangeSelector
            />
          </>
        )}
      </div>
    </div>
  );
}
