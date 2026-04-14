"use client";

import type { ExchangePnlBreakdown } from "@/types/mypage";
import { formatUsd, formatPct } from "@/lib/format";

interface PerformanceTableProps {
  data?: ExchangePnlBreakdown[];
  isLoading?: boolean;
}

export function PerformanceTable({ data, isLoading }: PerformanceTableProps) {
  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1">
      <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-medium text-text-secondary">
        Performance Summary
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "P&L (USD)", "P&L (%)"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.exchangeId} className="border-b border-white/10 last:border-0">
              <td className="px-5 py-3 font-medium text-text-primary">{row.exchangeName}</td>
              <td className={`px-5 py-3 font-medium ${row.pnlUsd >= 0 ? "text-positive" : "text-negative"}`}>
                {row.pnlUsd >= 0 ? "+" : ""}{formatUsd(row.pnlUsd)}
              </td>
              <td className={`px-5 py-3 ${row.pnlPct >= 0 ? "text-positive" : "text-negative"}`}>
                {formatPct(row.pnlPct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
