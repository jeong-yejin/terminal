"use client";

import { ArrowRight } from "lucide-react";
import { EXCHANGES } from "./constants";

interface ExchangeBalance {
  marginBalance: number;
  availableBalance: number;
}

interface BalancePanelProps {
  balances?: Record<string, ExchangeBalance>;
}

function fmtBal(v: number): string {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ExchangeRow({
  label,
  color,
  margin,
  available,
  active,
  isLast,
}: {
  label: string;
  color: string;
  margin: number;
  available: number;
  active: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 py-2.5"
      style={!isLast ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : undefined}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden="true"
        />
        <span className={`text-[12px] font-semibold leading-none tracking-[0.18px] ${active ? "text-text-primary" : "text-text-disabled"}`}>
          {label}
        </span>
        {active && (
          <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-primary">
            Active
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 text-[12px] leading-[1.5] tracking-[0.18px]">
        <div className="flex items-center justify-between">
          <span className={active ? "text-text-disabled" : "text-text-disabled opacity-60"}>Margin</span>
          <div className="flex items-center gap-1">
            <span className={`num-mono font-bold ${active ? "text-text-primary" : "text-text-disabled"}`}>
              {fmtBal(margin)}
            </span>
            <span className="text-text-disabled opacity-60">USDT</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={active ? "text-text-disabled" : "text-text-disabled opacity-60"}>Available</span>
          <div className="flex items-center gap-1">
            <span className={`num-mono font-bold ${active ? "text-text-secondary" : "text-text-disabled"}`}>
              {fmtBal(available)}
            </span>
            <span className="text-text-disabled opacity-60">USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BalancePanel({ balances = {} }: BalancePanelProps) {
  const def: ExchangeBalance = { marginBalance: 0, availableBalance: 0 };

  const binance = balances["BINANCE"] ?? def;
  const bybit   = balances["BYBIT"]   ?? def;

  const binanceEx = EXCHANGES.find((e) => e.id === "BINANCE")!;
  const bybitEx   = EXCHANGES.find((e) => e.id === "BYBIT")!;

  return (
    <div className="flex flex-col gap-2.5 border-t border-border-subtle px-3 pt-2.5 pb-2">

      {/* Header */}
      <p className="section-label">Balance</p>

      {/* Exchange rows — no outer box, dividers only */}
      <ExchangeRow
        label={binanceEx.label}
        color={binanceEx.color}
        margin={binance.marginBalance}
        available={binance.availableBalance}
        active={true}
        isLast={false}
      />
      <ExchangeRow
        label={bybitEx.label}
        color="#3a3f52"
        margin={bybit.marginBalance}
        available={bybit.availableBalance}
        active={false}
        isLast={true}
      />

      {/* Action buttons */}
      <div className="flex flex-col gap-1.5 pt-0.5">
        <button className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-gradient-to-t from-[#a1e53c] via-[#caff5d] to-[#edff9f] py-[8px] text-[13px] font-bold text-text-inverse transition-opacity hover:opacity-90 active:scale-[0.98]">
          Deposit to Binance
          <ArrowRight size={13} />
        </button>
        <button className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-border-subtle py-[8px] text-[13px] font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]">
          Transfer
        </button>
      </div>
    </div>
  );
}
