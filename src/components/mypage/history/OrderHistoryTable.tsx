"use client";

import type { HistoryFilters } from "@/types/mypage";
import { useOrderHistory } from "@/hooks/useHistory";
import { formatUsd } from "@/lib/format";

interface OrderHistoryTableProps {
  filters: HistoryFilters;
}

export function OrderHistoryTable({ filters }: OrderHistoryTableProps) {
  const { data, isLoading } = useOrderHistory(filters);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" aria-busy="true" aria-label="Loading order history" />;
  }

  if (!data?.length) {
    return <div className="py-16 text-center text-sm text-text-secondary">No order history.</div>;
  }

  return (
    <div id="tabpanel-order" role="tabpanel" aria-labelledby="tab-order" className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "Symbol", "Side", "Price", "Quantity", "Status", "Date"].map((h) => (
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
              <td className="px-4 py-3 capitalize text-text-secondary">{row.status}</td>
              <td className="px-4 py-3 text-text-tertiary">{new Date(row.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
