"use client";

import { useMemo } from "react";
import type { SymbolMeta } from "./constants";

// ─── Mock order book generation ───────────────────────────────────────────────

function seed(n: number) {
  // deterministic-ish mock
  return ((Math.sin(n) * 0.5 + 0.5) * 0.9 + 0.05);
}

interface Level {
  price: number;
  size: number;
  total: number;
}

function generateLevels(
  basePrice: number,
  side: "ask" | "bid",
  count = 14
): Level[] {
  const step = basePrice * 0.0002;
  const levels: Level[] = [];
  let running = 0;

  for (let i = 0; i < count; i++) {
    const offset = (i + 1) * step;
    const price = side === "ask" ? basePrice + offset : basePrice - offset;
    const size = parseFloat((seed(price * 1.3 + i) * 5 + 0.1).toFixed(4));
    running += size;
    levels.push({ price, size, total: running });
  }

  return side === "ask" ? levels.reverse() : levels;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtPrice(v: number, decimals = 2): string {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtSize(v: number): string {
  return v.toFixed(4);
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function OrderRow({
  level,
  maxTotal,
  side,
  decimals,
}: {
  level: Level;
  maxTotal: number;
  side: "ask" | "bid";
  decimals: number;
}) {
  const pct = (level.total / maxTotal) * 100;
  const isAsk = side === "ask";

  return (
    <li className="relative flex cursor-default items-center justify-between gap-2 px-3 py-[3px] text-[11px] tabular-nums hover:bg-surface-3/30">
      {/* depth bar */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 ${
          isAsk ? "bg-negative/8" : "bg-positive/8"
        }`}
        style={{ width: `${pct}%` }}
      />
      <span className={isAsk ? "text-negative" : "text-positive"}>
        {fmtPrice(level.price, decimals)}
      </span>
      <span className="text-text-secondary">{fmtSize(level.size)}</span>
      <span className="text-text-tertiary">{level.total.toFixed(3)}</span>
    </li>
  );
}

// ─── Orderbook ────────────────────────────────────────────────────────────────

export function Orderbook({ symbol }: { symbol: SymbolMeta }) {
  const decimals = symbol.price < 1 ? 6 : symbol.price < 10 ? 4 : 2;

  const asks = useMemo(() => generateLevels(symbol.price, "ask"), [symbol.price]);
  const bids = useMemo(() => generateLevels(symbol.price, "bid"), [symbol.price]);

  const maxAskTotal = asks[asks.length - 1]?.total ?? 1;
  const maxBidTotal = bids[bids.length - 1]?.total ?? 1;
  const maxTotal = Math.max(maxAskTotal, maxBidTotal);

  const spread = asks[asks.length - 1]
    ? asks[asks.length - 1].price - (bids[0]?.price ?? 0)
    : 0;
  const spreadPct = ((spread / symbol.price) * 100).toFixed(3);

  return (
    <div className="flex h-full flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <span className="text-xs font-semibold text-text-primary">Order Book</span>
        <span className="text-[10px] text-text-tertiary">
          {symbol.label}
        </span>
      </div>

      {/* Column labels */}
      <div className="flex items-center justify-between px-3 py-1 text-[10px] font-medium text-text-disabled">
        <span>Price (USDT)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      {/* Asks */}
      <ul className="flex-1 overflow-y-auto" aria-label="Ask orders">
        {asks.map((lvl, i) => (
          <OrderRow
            key={i}
            level={lvl}
            maxTotal={maxTotal}
            side="ask"
            decimals={decimals}
          />
        ))}
      </ul>

      {/* Spread */}
      <div className="flex items-center justify-between border-y border-border-subtle px-3 py-1.5 text-[11px]">
        <span className="font-semibold text-text-primary tabular-nums">
          {fmtPrice(symbol.price, decimals)}
        </span>
        <span className="text-text-tertiary">
          Spread{" "}
          <span className="text-cautionary">{spreadPct}%</span>
        </span>
      </div>

      {/* Bids */}
      <ul className="flex-1 overflow-y-auto" aria-label="Bid orders">
        {bids.map((lvl, i) => (
          <OrderRow
            key={i}
            level={lvl}
            maxTotal={maxTotal}
            side="bid"
            decimals={decimals}
          />
        ))}
      </ul>
    </div>
  );
}
