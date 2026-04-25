"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { ChevronDown, RefreshCw, Flame, CheckCircle2, Zap } from "lucide-react";
import type { SymbolMeta } from "./constants";

type OrderType  = "Limit" | "Market" | "Stop Limit";
type MarginMode = "Cross" | "Isolated";
const ORDER_TYPES: OrderType[]  = ["Limit", "Market", "Stop Limit"];
const LEVERAGE_PRESETS          = [1, 5, 10, 25, 50, 100];

// 0.04% maker rebate rate passed back by ReboundX
const REBATE_RATE = 0.0004;

interface OrderFormProps {
  symbol: SymbolMeta;
}

// ─── Leverage risk color ──────────────────────────────────────────────────────

function leverageColor(lev: number): string {
  if (lev <= 10) return "#22C55E";  // green
  if (lev <= 25) return "#FBBF24";  // amber
  if (lev <= 50) return "#F97316";  // orange
  return "#EF4444";                  // red
}

// ─── Streak motivator ─────────────────────────────────────────────────────────

function StreakMotivator() {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-text-disabled">
      <Flame size={11} className="text-orange-400 shrink-0" />
      <span>3-trade streak</span>
      <span className="text-border-ghost">·</span>
      <span>47 trades this week</span>
      <span className="text-border-ghost">·</span>
      <span className="text-primary">Lv.16 in 26 trades</span>
    </div>
  );
}

// ─── Submit toast ─────────────────────────────────────────────────────────────

function SubmitToast({ rebate }: { rebate: number; side: "buy" | "sell" }) {
  return (
    <div className="animate-[reveal-up_0.25s_var(--ease-out-smooth)] flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-[12px]">
      <CheckCircle2 size={12} className="text-positive shrink-0" />
      <span className="font-semibold text-text-secondary">Order submitted</span>
      <span className="text-border-ghost">·</span>
      <span className="num-mono font-bold text-primary ml-auto">+${rebate.toFixed(2)} rebate</span>
    </div>
  );
}

// ─── OrderForm ────────────────────────────────────────────────────────────────

export function OrderForm({ symbol }: OrderFormProps) {
  const [orderType,    setOrderType]    = useState<OrderType>("Market");
  const [marginMode,   setMarginMode]   = useState<MarginMode>("Cross");
  const [price,        setPrice]        = useState(symbol.price.toFixed(2));
  const [amount,       setAmount]       = useState("");
  const [leverage,     setLeverage]     = useState(10);
  const [sliderPct,    setSliderPct]    = useState(0);
  const [tpsl,         setTpsl]         = useState(false);
  const [showLevDrop,  setShowLevDrop]  = useState(false);
  const [toast,        setToast]        = useState<"buy" | "sell" | null>(null);

  const availableBalance = 10_240.50;

  // effective price used for calculations
  const effectivePrice = useMemo(() => {
    const p = parseFloat(price);
    return isNaN(p) || p <= 0 ? symbol.price : p;
  }, [price, symbol.price]);

  const total = useMemo(() => {
    const a = parseFloat(amount) || 0;
    return effectivePrice * a;
  }, [effectivePrice, amount]);

  // rebate = notional (total × leverage) × rebate rate
  const rebateAmount = useMemo(() => {
    if (total <= 0) return 0;
    return total * leverage * REBATE_RATE;
  }, [total, leverage]);

  const onSlider = useCallback(
    (pct: number) => {
      setSliderPct(pct);
      const maxQty = (availableBalance * leverage * (pct / 100)) / effectivePrice;
      setAmount(maxQty > 0 ? maxQty.toFixed(4) : "");
    },
    [effectivePrice, leverage]
  );

  const handleSubmit = useCallback((side: "buy" | "sell") => {
    setToast(side);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // sync price when symbol changes
  useEffect(() => {
    setPrice(symbol.price.toFixed(2));
  }, [symbol]);

  const levColor = leverageColor(leverage);

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

      {/* ── Margin mode + Leverage row ── */}
      <div className="flex items-center border-b border-border-subtle px-2 pb-0">
        <button
          onClick={() => setMarginMode(m => m === "Cross" ? "Isolated" : "Cross")}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1 border-b-2 border-primary pb-2 pt-1.5 text-[13px] font-bold text-text-primary transition-colors hover:text-primary"
        >
          {marginMode}
          <ChevronDown size={13} className="text-text-tertiary" />
        </button>

        <span className="mx-2 h-4 w-px bg-border-subtle flex-shrink-0" aria-hidden="true" />

        <div className="relative flex-1">
          <button
            onClick={() => setShowLevDrop(v => !v)}
            className="flex w-full cursor-pointer items-center justify-center gap-1 pb-2 pt-1.5 text-[13px] font-bold transition-colors hover:opacity-80"
            style={{ color: levColor }}
          >
            {leverage}×
            <ChevronDown size={13} style={{ color: levColor, opacity: 0.7 }} />
          </button>

          {showLevDrop && (
            <div className="absolute bottom-full left-1/2 z-50 mb-1 w-[140px] -translate-x-1/2 rounded-xl border border-border-subtle bg-surface-2 p-2 shadow-xl">
              <p className="mb-2 text-center text-[10px] text-text-disabled">
                {leverage <= 10 ? "Low risk" : leverage <= 25 ? "Medium risk" : leverage <= 50 ? "High risk" : "Extreme risk"}
              </p>
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

        {/* ── Order inputs: unified container with internal ghost dividers ── */}
        <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-2 focus-within:border-primary/30 transition-colors">
          {orderType !== "Market" && (
            <label className="flex items-center gap-3 px-3 py-2 text-[12px]">
              <span className="w-[60px] shrink-0 text-[11px] text-text-tertiary tracking-[0.165px]">
                {orderType === "Stop Limit" ? "Stop Price" : "Price"}
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent num-mono text-right text-text-primary outline-none"
                aria-label="Order price"
                step="0.01"
              />
              <span className="shrink-0 text-text-disabled">USDT</span>
            </label>
          )}
          {orderType !== "Market" && <div className="divider-ghost mx-3" />}
          <label className="flex items-center gap-3 px-3 py-2 text-[12px]">
            <span className="w-[60px] shrink-0 text-[11px] text-text-tertiary tracking-[0.165px]">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                const a   = parseFloat(e.target.value) || 0;
                const max = (availableBalance * leverage) / effectivePrice;
                setSliderPct(max > 0 ? Math.min(100, (a / max) * 100) : 0);
              }}
              placeholder="0.0000"
              className="flex-1 bg-transparent num-mono text-right text-text-primary placeholder-text-disabled outline-none"
              aria-label="Order amount"
              step="0.0001"
            />
            <span className="shrink-0 text-text-disabled">{symbol.base}</span>
          </label>
        </div>

        {/* ── Slider ── */}
        <div className="flex flex-col gap-2">
          <div className="relative h-2 w-full cursor-pointer rounded-full bg-surface-2">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
              style={{ width: `${sliderPct}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-[2.5px] border-primary bg-text-primary shadow-sm transition-all"
              style={{ left: `calc(${sliderPct}% - 6px)` }}
            />
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

        {/* ── Order summary: Total + Rebate — inline rows, no outer box ── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between py-1.5 text-[12px]">
            <span className="text-text-disabled">Total</span>
            <span className="num-mono font-bold text-text-primary">
              {total > 0
                ? total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : "—"}{" "}
              USDT
            </span>
          </div>
          <div className={`flex items-center justify-between py-1.5 text-[12px] transition-colors`}>
            <div className="flex items-center gap-1.5">
              {rebateAmount > 0 && <Zap size={10} className="text-primary shrink-0" />}
              <span className={rebateAmount > 0 ? "text-primary/80" : "text-text-disabled"}>
                Est. Rebate
              </span>
            </div>
            <span className={`num-mono font-bold ${rebateAmount > 0 ? "text-primary" : "text-text-disabled"}`}>
              {rebateAmount > 0
                ? `+$${rebateAmount.toFixed(2)}`
                : "+$0.00"}
            </span>
          </div>
        </div>

        {/* ── TP/SL ── */}
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

        {/* ── Buy / Sell buttons ── */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit("buy")}
            className="flex-1 cursor-pointer rounded-lg bg-positive py-[9px] text-[13px] font-extrabold text-white transition-all hover:bg-positive/90 active:scale-[0.98] focus-ring"
            aria-label={`Buy / Long ${symbol.base}`}
          >
            Buy / Long
          </button>
          <button
            onClick={() => handleSubmit("sell")}
            className="flex-1 cursor-pointer rounded-lg bg-negative py-[9px] text-[13px] font-extrabold text-white transition-all hover:bg-negative/90 active:scale-[0.98] focus-ring"
            aria-label={`Sell / Short ${symbol.base}`}
          >
            Sell / Short
          </button>
        </div>

        {/* ── Feedback row: confirm toast OR streak motivator ── */}
        {toast ? (
          <SubmitToast rebate={rebateAmount} side={toast} />
        ) : (
          <StreakMotivator />
        )}
      </div>
    </div>
  );
}
