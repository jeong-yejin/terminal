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
}: {
  label: string;
  color: string;
  margin: number;
  available: number;
  active: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[4px] bg-surface-2 p-2">
      <div className="flex items-center gap-1.5">
        <span
          className="h-4 w-4 flex-shrink-0 rounded-full border border-white/10"
          style={{ background: color }}
          aria-hidden="true"
        />
        <span className={`text-[13px] font-bold leading-[1.5] tracking-[0.195px] ${active ? "text-text-primary" : "text-text-disabled"}`}>
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 text-[12px] leading-[1.5] tracking-[0.18px]">
        <div className="flex items-center justify-between">
          <span className={active ? "text-text-tertiary" : "text-text-disabled"}>Margin Balance</span>
          <div className="flex items-center gap-1">
            <span className={`num-mono font-bold ${active ? "text-text-primary" : "text-text-tertiary"}`}>
              {fmtBal(margin)}
            </span>
            <span className="text-text-disabled">USDT</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={active ? "text-text-tertiary" : "text-text-disabled"}>Available Balance</span>
          <div className="flex items-center gap-1">
            <span className={`num-mono font-bold ${active ? "text-text-primary" : "text-text-tertiary"}`}>
              {fmtBal(available)}
            </span>
            <span className="text-text-disabled">USDT</span>
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
    <div className="flex flex-col gap-2 border-t border-border-subtle px-2 pt-2 pb-2">

      {/* Header */}
      <p className="text-[14px] font-bold leading-[1.5] tracking-[0.14px] text-text-primary">
        Balance
      </p>

      {/* Binance */}
      <ExchangeRow
        label={binanceEx.label}
        color={binanceEx.color}
        margin={binance.marginBalance}
        available={binance.availableBalance}
        active={true}
      />

      {/* Bybit */}
      <ExchangeRow
        label={bybitEx.label}
        color="#15192a"
        margin={bybit.marginBalance}
        available={bybit.availableBalance}
        active={false}
      />

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-gradient-to-t from-[#a1e53c] via-[#caff5d] to-[#edff9f] py-[8px] text-[13px] font-bold text-text-inverse transition-opacity hover:opacity-90 active:translate-y-px">
          Deposit to Binance
          <ArrowRight size={13} />
        </button>
        <button className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-border-subtle py-[8px] text-[13px] font-bold text-primary transition-colors hover:border-primary/30 active:translate-y-px">
          Transfer
        </button>
      </div>
    </div>
  );
}
