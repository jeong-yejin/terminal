"use client";

import { useState, useCallback, useMemo } from "react";
import type { SymbolMeta } from "./constants";

type OrderType = "Limit" | "Market" | "Stop";
type Side = "buy" | "sell";

const ORDER_TYPES: OrderType[] = ["Limit", "Market", "Stop"];
const LEVERAGE_PRESETS = [1, 5, 10, 25, 50, 100];

interface OrderFormProps {
  symbol: SymbolMeta;
}

export function OrderForm({ symbol }: OrderFormProps) {
  const [side, setSide] = useState<Side>("buy");
  const [orderType, setOrderType] = useState<OrderType>("Limit");
  const [price, setPrice] = useState(symbol.price.toFixed(2));
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [sliderPct, setSliderPct] = useState(0);

  const availableBalance = 10_240.50;

  const total = useMemo(() => {
    const p = parseFloat(price) || 0;
    const a = parseFloat(amount) || 0;
    return p * a;
  }, [price, amount]);

  const onSlider = useCallback(
    (pct: number) => {
      setSliderPct(pct);
      const p = parseFloat(price) || symbol.price;
      const maxQty = (availableBalance * leverage * (pct / 100)) / p;
      setAmount(maxQty.toFixed(4));
    },
    [price, symbol.price, leverage]
  );

  const isBuy = side === "buy";

  return (
    <div className="flex flex-col gap-3 border-t border-border-subtle p-3">
      {/* Buy / Sell toggle */}
      <div className="flex rounded-lg overflow-hidden border border-border-subtle text-xs font-semibold">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 transition-colors ${
            isBuy
              ? "bg-positive text-white"
              : "bg-surface-2 text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Buy / Long
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 transition-colors ${
            !isBuy
              ? "bg-negative text-white"
              : "bg-surface-2 text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Sell / Short
        </button>
      </div>

      {/* Order type tabs */}
      <div className="flex gap-1 border-b border-border-subtle pb-2">
        {ORDER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              orderType === t
                ? "bg-surface-3 text-text-primary"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Leverage */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-text-tertiary">
          <span>Leverage</span>
          <span className="font-semibold text-primary">{leverage}×</span>
        </div>
        <div className="flex gap-1">
          {LEVERAGE_PRESETS.map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`flex-1 rounded py-1 text-[10px] font-medium transition-colors ${
                leverage === lev
                  ? "bg-primary text-text-inverse"
                  : "bg-surface-2 text-text-tertiary hover:bg-surface-3 hover:text-text-secondary"
              }`}
            >
              {lev}×
            </button>
          ))}
        </div>
      </div>

      {/* Price field (hidden for Market) */}
      {orderType !== "Market" && (
        <label className="space-y-1">
          <span className="text-[11px] text-text-tertiary">
            {orderType === "Stop" ? "Stop Price" : "Price"}
          </span>
          <div className="flex items-center rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs focus-within:border-primary/50">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 bg-transparent tabular-nums text-text-primary outline-none"
              aria-label="Order price"
              step="0.01"
            />
            <span className="ml-2 flex-shrink-0 text-text-disabled">USDT</span>
          </div>
        </label>
      )}

      {/* Amount */}
      <label className="space-y-1">
        <span className="text-[11px] text-text-tertiary">Amount</span>
        <div className="flex items-center rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs focus-within:border-primary/50">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0000"
            className="flex-1 bg-transparent tabular-nums text-text-primary placeholder-text-disabled outline-none"
            aria-label="Order amount"
            step="0.0001"
          />
          <span className="ml-2 flex-shrink-0 text-text-disabled">{symbol.base}</span>
        </div>
      </label>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPct}
          onChange={(e) => onSlider(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
          aria-label="Position size percentage"
        />
        <div className="flex justify-between text-[10px] text-text-disabled">
          {[0, 25, 50, 75, 100].map((p) => (
            <button
              key={p}
              onClick={() => onSlider(p)}
              className="hover:text-text-tertiary"
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-xs">
        <span className="text-text-tertiary">Total</span>
        <span className="tabular-nums text-text-primary">
          {total > 0
            ? total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "—"}{" "}
          USDT
        </span>
      </div>

      {/* Avail balance */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-text-tertiary">Available</span>
        <span className="tabular-nums text-text-secondary">
          {availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT
        </span>
      </div>

      {/* Submit */}
      <button
        className={`w-full rounded-lg py-2.5 text-sm font-bold transition-colors focus-ring ${
          isBuy
            ? "bg-positive hover:bg-positive/90 text-white"
            : "bg-negative hover:bg-negative/90 text-white"
        }`}
        aria-label={`${isBuy ? "Buy" : "Sell"} ${symbol.base}`}
      >
        {isBuy ? "Buy / Long" : "Sell / Short"} {symbol.base}
      </button>
    </div>
  );
}
