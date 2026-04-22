"use client";

import { useMemo, useState } from "react";
import type { SymbolMeta } from "./constants";

type BookTab = "orderbook" | "trades";

// ─── Mock order book generation ───────────────────────────────────────────────

function seed(n: number) {
  return ((Math.sin(n) * 0.5 + 0.5) * 0.9 + 0.05);
}

interface Level {
  price: number;
  size:  number;
  total: number;
}

function generateLevels(basePrice: number, side: "ask" | "bid", count = 14): Level[] {
  const step = basePrice * 0.0002;
  const levels: Level[] = [];
  let running = 0;
  for (let i = 0; i < count; i++) {
    const offset = (i + 1) * step;
    const price  = side === "ask" ? basePrice + offset : basePrice - offset;
    const size   = parseFloat((seed(price * 1.3 + i) * 5 + 0.1).toFixed(4));
    running += size;
    levels.push({ price, size, total: running });
  }
  return side === "ask" ? levels.reverse() : levels;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtPrice(v: number, decimals = 2): string {
  return v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtSize(v: number): string {
  return v.toFixed(3);
}

// ─── OrderRow ─────────────────────────────────────────────────────────────────

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
  const pct   = (level.total / maxTotal) * 100;
  const isAsk = side === "ask";

  return (
    <li className="relative flex cursor-default items-center justify-between gap-1 px-2 py-[2.5px] text-[12px] tracking-[0.2px] hover:bg-surface-3/20">
      {/* depth bar */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 ${
          isAsk ? "bg-negative/10" : "bg-positive/10"
        }`}
        style={{ width: `${pct}%` }}
      />
      <span className={`num-mono font-medium ${isAsk ? "text-negative" : "text-positive"}`}>
        {fmtPrice(level.price, decimals)}
      </span>
      <span className="num-mono text-text-secondary">{fmtSize(level.size)}</span>
      <span className="num-mono text-text-tertiary">{level.total.toFixed(2)}</span>
    </li>
  );
}

// ─── Orderbook ────────────────────────────────────────────────────────────────

export function Orderbook({ symbol }: { symbol: SymbolMeta }) {
  const [tab, setTab] = useState<BookTab>("orderbook");
  const decimals = symbol.price < 1 ? 6 : symbol.price < 10 ? 4 : 2;

  const asks = useMemo(() => generateLevels(symbol.price, "ask"), [symbol.price]);
  const bids = useMemo(() => generateLevels(symbol.price, "bid"), [symbol.price]);

  const maxAskTotal = asks[asks.length - 1]?.total ?? 1;
  const maxBidTotal = bids[bids.length - 1]?.total ?? 1;
  const maxTotal    = Math.max(maxAskTotal, maxBidTotal);

  const spread    = asks[asks.length - 1] ? asks[asks.length - 1].price - (bids[0]?.price ?? 0) : 0;
  const spreadPct = ((spread / symbol.price) * 100).toFixed(3);

  // Buy/Sell ratio (mock: ask side total vs bid side total)
  const totalAskVol = asks.reduce((s, l) => s + l.size, 0);
  const totalBidVol = bids.reduce((s, l) => s + l.size, 0);
  const totalVol    = totalAskVol + totalBidVol || 1;
  const bidPct      = Math.round((totalBidVol / totalVol) * 100);
  const askPct      = 100 - bidPct;

  return (
    <div className="flex h-full flex-col select-none bg-surface-1">

      {/* ── Tab: Order Book / Recent Trades ── */}
      <div className="flex-shrink-0 border-b border-border-subtle px-2 pt-2">
        <div className="flex rounded-lg bg-surface-2 p-[3px]">
          {(["orderbook", "trades"] as BookTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 cursor-pointer rounded-md px-3 py-[6px] text-[13px] font-bold leading-[1.5] tracking-[0.14px] transition-colors ${
                tab === t
                  ? "bg-surface-1 text-text-primary shadow-[0px_1px_4px_0px_rgba(255,255,255,0.08)]"
                  : "bg-transparent text-text-disabled hover:text-text-tertiary"
              }`}
            >
              {t === "orderbook" ? "Order Book" : "Recent Trades"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Column labels ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-2 py-1.5 text-[11px] font-medium tracking-wide text-text-disabled">
        <span>Price (USDT)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      {/* ── Asks ── */}
      <ul className="flex-1 overflow-y-auto" aria-label="Ask orders">
        {asks.map((lvl, i) => (
          <OrderRow key={i} level={lvl} maxTotal={maxTotal} side="ask" decimals={decimals} />
        ))}
      </ul>

      {/* ── Spread / Mid-price ── */}
      <div className="flex-shrink-0 bg-surface-2 px-2 py-[5px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* green arrow-up icon */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M7.666 14.167V1.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6l4.666-4.5L12.333 6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="num-mono text-[14px] font-bold text-positive leading-[1.5] tracking-[0.2px]">
              {fmtPrice(symbol.price, decimals)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* flag icon for mark price */}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2h8l-2 3 2 3H2V2z" stroke="#767676" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M2 11V8" stroke="#767676" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="num-mono text-[12px] font-medium text-text-secondary tracking-[0.2px]">
              {fmtPrice(symbol.price * 1.0001, decimals)}
            </span>
            <span className="text-[10px] text-text-disabled ml-1">
              Spread <span className="text-cautionary">{spreadPct}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Bids ── */}
      <ul className="flex-1 overflow-y-auto" aria-label="Bid orders">
        {bids.map((lvl, i) => (
          <OrderRow key={i} level={lvl} maxTotal={maxTotal} side="bid" decimals={decimals} />
        ))}
      </ul>

      {/* ── Buy / Sell ratio strip ── */}
      <div className="flex-shrink-0 border-t border-border-subtle">
        <div className="flex h-[20px] overflow-hidden rounded-none text-[11px] font-bold leading-[1.5] tracking-[0.2px]">
          {/* Buy side */}
          <div
            className="flex items-center gap-1.5 bg-positive/10 pl-2"
            style={{ width: `${bidPct}%` }}
          >
            <span className="inline-flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[2px] border border-positive bg-positive/15 text-[11px] font-bold text-positive">B</span>
            <span className="text-positive">{bidPct}%</span>
          </div>
          {/* Sell side */}
          <div
            className="flex items-center justify-end gap-1.5 bg-negative/10 pr-2"
            style={{ width: `${askPct}%` }}
          >
            <span className="text-negative">{askPct}%</span>
            <span className="inline-flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[2px] border border-negative bg-negative/15 text-[11px] font-bold text-negative">S</span>
          </div>
        </div>
      </div>
    </div>
  );
}
