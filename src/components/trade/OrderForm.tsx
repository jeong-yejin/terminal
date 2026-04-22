"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import type { SymbolMeta } from "./constants";

type OrderType   = "Limit" | "Market" | "Stop Limit";
type MarginMode  = "Cross" | "Isolated";
const ORDER_TYPES: OrderType[] = ["Limit", "Market", "Stop Limit"];
const LEVERAGE_PRESETS = [1, 5, 10, 25, 50, 100];

interface OrderFormProps {
  symbol: SymbolMeta;
}

export function OrderForm({ symbol }: OrderFormProps) {
  const [orderType,  setOrderType]  = useState<OrderType>("Market");
  const [marginMode, setMarginMode] = useState<MarginMode>("Cross");
  const [price,      setPrice]      = useState(symbol.price.toFixed(2));
  const [amount,     setAmount]     = useState("");
  const [leverage,   setLeverage]   = useState(10);
  const [sliderPct,  setSliderPct]  = useState(0);
  const [tpsl,       setTpsl]       = useState(false);
  const [showLevDrop, setShowLevDrop] = useState(false);

  const availableBalance = 10_240.50;

  const total = useMemo(() => {
    const p = parseFloat(price) || 0;
    const a = parseFloat(amount) || 0;
    return p * a;
  }, [price, amount]);

  const onSlider = useCallback(
    (pct: number) => {
      setSliderPct(pct);
      const p      = parseFloat(price) || symbol.price;
      const maxQty = (availableBalance * leverage * (pct / 100)) / p;
      setAmount(maxQty > 0 ? maxQty.toFixed(4) : "");
    },
    [price, symbol.price, leverage]
  );

  const handleSubmit = useCallback((side: "buy" | "sell") => {
    // Placeholder — wire to real order submission
  }, []);

  return (
    <div className="flex flex-col gap-0 border-t border-border-subtle">

      {/* ── Order type tabs ── */}
      <div className="px-2 pt-2 pb-1.5">
        <div className="flex rounded-lg bg-surface-2 p-[3px] gap-[3px]">
          {ORDER_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`flex-1 cursor-pointer rounded-md px-2 py-[6px] text-[13px] leading-[1.5] tracking-[0.14px] transition-colors whitespace-nowrap ${
                orderType === t
                  ? "bg-surface-3 font-bold text-text-primary shadow-[0px_1px_4px_0px_rgba(255,255,255,0.08)]"
                  : "font-normal text-text-disabled hover:text-text-tertiary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── MarginMode row: Cross | Leverage ── */}
      <div className="flex items-center border-b border-border-subtle px-2 pb-0">
        {/* Cross mode selector */}
        <button
          onClick={() => setMarginMode(m => m === "Cross" ? "Isolated" : "Cross")}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1 border-b-2 border-primary pb-2 pt-1.5 text-[13px] font-bold text-text-primary transition-colors hover:text-primary"
        >
          {marginMode}
          <ChevronDown size={13} className="text-text-tertiary" />
        </button>

        {/* divider */}
        <span className="mx-2 h-4 w-px bg-border-subtle flex-shrink-0" aria-hidden="true" />

        {/* Leverage selector */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowLevDrop(v => !v)}
            className="flex w-full cursor-pointer items-center justify-center gap-1 pb-2 pt-1.5 text-[13px] font-bold text-primary transition-colors hover:text-primary-strong"
          >
            {leverage}×
            <ChevronDown size={13} className="text-primary/70" />
          </button>
          {showLevDrop && (
            <div className="absolute bottom-full left-1/2 z-50 mb-1 w-[140px] -translate-x-1/2 rounded-xl border border-border-subtle bg-surface-2 p-2 shadow-xl">
              <div className="grid grid-cols-3 gap-1">
                {LEVERAGE_PRESETS.map((lev) => (
                  <button
                    key={lev}
                    onClick={() => { setLeverage(lev); setShowLevDrop(false); }}
                    className={`cursor-pointer rounded-md py-1.5 text-[12px] font-bold transition-colors ${
                      leverage === lev
                        ? "bg-primary text-text-inverse"
                        : "bg-surface-3 text-text-tertiary hover:bg-surface-3/80 hover:text-text-secondary"
                    }`}
                  >
                    {lev}×
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-2 pt-2.5 pb-2">

        {/* ── Available balance ── */}
        <div className="flex items-center gap-1.5 text-[12px] tracking-[0.2px]">
          <span className="text-text-tertiary">Available</span>
          <span className="num-mono font-bold text-text-primary">
            {availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-text-disabled">USDT</span>
          <button
            className="ml-auto cursor-pointer text-primary hover:text-primary-strong transition-colors"
            aria-label="Refresh balance"
          >
            <RefreshCw size={11} />
          </button>
        </div>

        {/* ── Price field (hidden for Market) ── */}
        {orderType !== "Market" && (
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-text-tertiary tracking-[0.165px]">
              {orderType === "Stop Limit" ? "Stop Price" : "Price"}
            </span>
            <div className="flex items-center rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] focus-within:border-primary/40 transition-colors">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent num-mono text-text-primary outline-none"
                aria-label="Order price"
                step="0.01"
              />
              <span className="ml-2 flex-shrink-0 text-text-disabled">USDT</span>
            </div>
          </label>
        )}

        {/* ── Amount ── */}
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-text-tertiary tracking-[0.165px]">Amount</span>
          <div className="flex items-center rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-[12px] focus-within:border-primary/40 transition-colors">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              className="flex-1 bg-transparent num-mono text-text-primary placeholder-text-disabled outline-none"
              aria-label="Order amount"
              step="0.0001"
            />
            <span className="ml-2 flex-shrink-0 text-text-disabled">{symbol.base}</span>
          </div>
        </label>

        {/* ── Custom progress slider ── */}
        <div className="flex flex-col gap-2">
          {/* Track */}
          <div className="relative h-2 w-full cursor-pointer rounded-full bg-surface-2">
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
              style={{ width: `${sliderPct}%` }}
            />
            {/* Knob */}
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-[2.5px] border-primary bg-text-primary shadow-sm transition-all"
              style={{ left: `calc(${sliderPct}% - 6px)` }}
            />
            {/* Range input overlay */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPct}
              onChange={(e) => onSlider(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Position size percentage"
            />
          </div>
          {/* Labels */}
          <div className="flex items-center justify-between num-mono text-[11px]">
            {[{ label: "1%", val: 1 }, { label: "25%", val: 25 }, { label: "50%", val: 50 }, { label: "75%", val: 75 }, { label: "100%", val: 100 }].map(({ label, val }) => (
              <button
                key={label}
                onClick={() => onSlider(val)}
                className={`cursor-pointer transition-colors ${
                  sliderPct >= val ? "font-bold text-text-primary" : "text-text-disabled hover:text-text-tertiary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Total ── */}
        <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-[12px]">
          <span className="text-text-tertiary">Total</span>
          <span className="num-mono font-bold text-text-primary">
            {total > 0
              ? total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : "—"}{" "}
            USDT
          </span>
        </div>

        {/* ── TP/SL checkbox ── */}
        <label className="flex cursor-pointer items-center gap-2">
          <div
            onClick={() => setTpsl(v => !v)}
            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
              tpsl ? "border-primary bg-primary" : "border-border-subtle bg-transparent"
            }`}
            role="checkbox"
            aria-checked={tpsl}
            tabIndex={0}
            onKeyDown={(e) => e.key === " " && setTpsl(v => !v)}
          >
            {tpsl && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5l2.5 2.5L8 3" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-[12px] text-text-primary">TP/SL</span>
        </label>

        {/* ── Side-by-side Buy / Sell buttons ── */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit("buy")}
            className="flex-1 cursor-pointer rounded-lg bg-positive py-[8px] text-[13px] font-bold text-white transition-colors hover:bg-positive/90 active:translate-y-px focus-ring"
            aria-label={`Buy / Long ${symbol.base}`}
          >
            Buy/Long
          </button>
          <button
            onClick={() => handleSubmit("sell")}
            className="flex-1 cursor-pointer rounded-lg bg-negative py-[8px] text-[13px] font-bold text-white transition-colors hover:bg-negative/90 active:translate-y-px focus-ring"
            aria-label={`Sell / Short ${symbol.base}`}
          >
            Sell/Short
          </button>
        </div>
      </div>
    </div>
  );
}
