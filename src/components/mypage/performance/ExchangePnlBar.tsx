"use client";

import type { ExchangePnlBreakdown } from "@/types/mypage";
import { formatUsd, formatPct } from "@/lib/format";

interface ExchangePnlBarProps {
  data?: ExchangePnlBreakdown[];
  isLoading?: boolean;
}

/**
 * 거래소별 P&L 비율 바 차트
 * TODO: recharts BarChart 구현으로 교체
 */
export function ExchangePnlBar({ data, isLoading }: ExchangePnlBarProps) {
  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />;
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
      <h2 className="mb-4 text-sm font-medium text-text-secondary">P&L by Exchange</h2>
      <ul className="space-y-3">
        {data?.map((ex) => (
          <li key={ex.exchangeId}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-text-secondary">{ex.exchangeName}</span>
              <span className={ex.pnlUsd >= 0 ? "text-positive" : "text-negative"}>
                {ex.pnlUsd >= 0 ? "+" : ""}{formatUsd(ex.pnlUsd)} ({formatPct(ex.pnlPct)})
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className={`h-full rounded-full ${ex.pnlUsd >= 0 ? "bg-positive" : "bg-negative"}`}
                style={{ width: `${Math.abs(ex.pnlPct)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
