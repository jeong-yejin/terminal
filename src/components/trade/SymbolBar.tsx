"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, ArrowUp, ArrowDown } from "lucide-react";
import { SYMBOLS, EXCHANGES, type SymbolMeta, type ExchangeKey, type ExchangeMeta } from "./constants";

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtPrice(v: number): string {
  if (v >= 10_000) return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (v >= 10)     return v.toFixed(2);
  if (v >= 1)      return v.toFixed(4);
  return v.toFixed(6);
}

function fmtVol(v: number): string {
  if (v >= 1e9) return (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  return (v / 1e3).toFixed(0) + "K";
}

// ─── Dropdowns ────────────────────────────────────────────────────────────────

function ExchangeDropdown({
  value,
  onChange,
}: {
  value: ExchangeMeta;
  onChange: (e: ExchangeMeta) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-[6px] text-[13px] font-bold text-text-primary transition-colors hover:bg-surface-3 focus-ring"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: value.color }} aria-hidden="true" />
        {value.label}
        <ChevronDown size={12} className={`text-text-tertiary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 min-w-[130px] overflow-hidden rounded-xl border border-border-subtle bg-surface-2 py-1 shadow-xl"
        >
          {EXCHANGES.map((ex) => (
            <li key={ex.id}>
              <button
                role="option"
                aria-selected={ex.id === value.id}
                onClick={() => { onChange(ex); setOpen(false); }}
                className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors hover:bg-surface-3 ${
                  ex.id === value.id ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: ex.color }} aria-hidden="true" />
                {ex.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SymbolDropdown({
  value,
  onChange,
}: {
  value: SymbolMeta;
  onChange: (s: SymbolMeta) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = SYMBOLS.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-[6px] text-[16px] font-bold text-text-primary transition-colors hover:bg-surface-3 focus-ring"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value.label}
        <ChevronDown size={13} className={`text-text-tertiary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-border-subtle bg-surface-2 shadow-xl">
          <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
            <Search size={12} className="text-text-tertiary" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbol…"
              className="flex-1 bg-transparent text-[12px] text-text-primary outline-none placeholder:text-text-disabled"
            />
          </div>
          <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
            {filtered.map((s) => {
              const pos = s.change24h >= 0;
              return (
                <li key={s.tv}>
                  <button
                    role="option"
                    aria-selected={s.tv === value.tv}
                    onClick={() => { onChange(s); setOpen(false); setQuery(""); }}
                    className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-[12px] transition-colors hover:bg-surface-3 ${
                      s.tv === value.tv ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    <span className="font-semibold">{s.label}</span>
                    <span className={pos ? "text-positive" : "text-negative"}>
                      {pos ? "+" : ""}{s.change24h.toFixed(2)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Stat items ───────────────────────────────────────────────────────────────

function StatItem({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="num-mono text-[11px] leading-[1.5] tracking-[0.165px] text-text-disabled">{label}</span>
      <span className={`num-mono text-[13px] font-bold leading-[1.5] tracking-[0.195px] ${valueClass ?? "text-text-secondary"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Effective Fee item — highlights ReboundX rebate advantage ───────────────

function EffectiveFeeItem() {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="num-mono text-[11px] leading-[1.5] tracking-[0.165px] text-text-disabled">
        Effective Fee
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="num-mono text-[13px] font-bold leading-[1.5] tracking-[0.195px] text-primary">
          0.02%
        </span>
        <span className="num-mono text-[10px] text-text-disabled line-through">
          0.06%
        </span>
        <span className="rounded bg-primary/15 px-1 py-px text-[9px] font-bold text-primary">
          -66%
        </span>
      </div>
    </div>
  );
}

// ─── SymbolBar ────────────────────────────────────────────────────────────────

export interface SymbolBarState {
  exchange: ExchangeMeta;
  symbol: SymbolMeta;
  onExchangeChange: (e: ExchangeMeta) => void;
  onSymbolChange: (s: SymbolMeta) => void;
}

export function SymbolBar({ exchange, symbol, onExchangeChange, onSymbolChange }: SymbolBarState) {
  const isPositive = symbol.change24h >= 0;

  return (
    <div className="flex flex-shrink-0 items-center flex-wrap gap-x-5 gap-y-2 border-b border-border-subtle bg-surface-1 px-5 py-2">

        {/* Exchange + Symbol selectors */}
        <div className="flex items-center gap-2">
          <ExchangeDropdown value={exchange} onChange={onExchangeChange} />
          <span className="h-4 w-px bg-border-subtle" aria-hidden="true" />
          <SymbolDropdown value={symbol} onChange={onSymbolChange} />
          <span className="rounded-md border border-border-subtle bg-surface-2 px-2 py-[3px] text-[12px] font-bold text-text-secondary">
            Perp
          </span>
        </div>

        {/* Price + change */}
        <div className="flex items-center gap-2.5">
          <span className={`num-mono text-[18px] font-bold leading-none ${isPositive ? "text-positive" : "text-negative"}`}>
            {fmtPrice(symbol.price)}
          </span>
          <span
            className={`flex items-center gap-1 rounded-lg border px-2 py-[3px] num-mono text-[12px] font-bold ${
              isPositive
                ? "border-positive/50 bg-positive/10 text-positive"
                : "border-negative/50 bg-negative/10 text-negative"
            }`}
          >
            {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {isPositive ? "+" : ""}{symbol.change24h.toFixed(2)}%
          </span>
        </div>

        <span className="hidden h-6 w-px bg-border-subtle md:block" aria-hidden="true" />

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <StatItem label="24H High"      value={fmtPrice(symbol.high24h)} valueClass="text-positive" />
          <StatItem label="24H Low"       value={fmtPrice(symbol.low24h)}  valueClass="text-negative" />
          <StatItem label="24H Vol(USDT)" value={fmtVol(symbol.vol24h)} />
          <StatItem
            label="Funding Rate"
            value={`${symbol.fundingRate >= 0 ? "+" : ""}${symbol.fundingRate.toFixed(4)}%`}
            valueClass={symbol.fundingRate >= 0 ? "text-primary" : "text-negative"}
          />
          {/* Effective fee — replaces generic "Fee: 0.06%" with rebate-aware display */}
          <EffectiveFeeItem />
        </div>
    </div>
  );
}
