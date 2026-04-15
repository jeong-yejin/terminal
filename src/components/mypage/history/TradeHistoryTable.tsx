"use client";

import type { HistoryFilters } from "@/types/mypage";
import { useTradeHistory } from "@/hooks/useHistory";
import { formatUsd } from "@/lib/format";

interface TradeHistoryTableProps {
  filters: HistoryFilters;
}

export function TradeHistoryTable({ filters }: TradeHistoryTableProps) {
  const { data, isLoading } = useTradeHistory(filters);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" aria-busy="true" aria-label="Loading trade history" />;
  }

  if (!data?.length) {
    return <div className="py-16 text-center text-sm text-text-secondary">No trade history.</div>;
  }

  return (
    <div id="tabpanel-trade" role="tabpanel" aria-labelledby="tab-trade" className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "Symbol", "Side", "Price", "Quantity", "Fee", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-white/10 hover:bg-surface-2/30">
              <td className="px-4 py-3 text-text-secondary">{row.exchangeId}</td>
              <td className="px-4 py-3 font-medium text-text-primary">{row.symbol}</td>
              <td className={`px-4 py-3 font-medium ${row.side === "buy" ? "text-positive" : "text-negative"}`}>
                {row.side.toUpperCase()}
              </td>
              <td className="px-4 py-3 text-text-secondary">{formatUsd(row.price)}</td>
              <td className="px-4 py-3 text-text-secondary">{row.quantity}</td>
              <td className="px-4 py-3 text-text-secondary">{formatUsd(row.fee)}</td>
              <td className="px-4 py-3 text-text-tertiary">{new Date(row.executedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
