"use client";

import type { HistoryFilters, MarketType } from "@/types/mypage";
import { useOrderHistory } from "@/hooks/useHistory";
import { formatUsd } from "@/lib/format";

interface OrderHistoryTableProps {
  filters: HistoryFilters;
}

// ─── Market Type Badge ────────────────────────────────────────────────────────

function MarketTypeBadge({ type }: { type: MarketType }) {
  return type === "futures" ? (
    <span className="inline-block rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
      PERP
    </span>
  ) : (
    <span className="inline-block rounded-full bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
      SPOT
    </span>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

export function OrderHistoryTable({ filters }: OrderHistoryTableProps) {
  const { data, isLoading } = useOrderHistory(filters);

  if (isLoading) {
    return (
      <div
        className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle"
        aria-busy="true"
        aria-label="Loading order history"
      />
    );
  }

  // marketType 필터 적용 (클라이언트 사이드 — API가 지원하면 서버로 이동)
  const filtered = data?.filter((row) =>
    !filters.marketType || filters.marketType === "all"
      ? true
      : row.marketType === filters.marketType
  );

  if (!filtered?.length) {
    return (
      <div className="py-16 text-center text-sm text-text-secondary">
        No order history.
      </div>
    );
  }

  return (
    <div id="tabpanel-order" role="tabpanel" aria-labelledby="tab-order" className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Type", "Exchange", "Symbol", "Side", "Price", "Quantity", "Status", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.id} className="border-b border-white/10 hover:bg-surface-2/30">
              <td className="px-4 py-3">
                <MarketTypeBadge type={row.marketType} />
              </td>
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
