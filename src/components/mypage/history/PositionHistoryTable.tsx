"use client";

import type { HistoryFilters, PositionHistoryItem } from "@/types/mypage";
import { formatUsd } from "@/lib/format";
import { usePositionHistory } from "@/hooks/useHistory";

interface PositionHistoryTableProps {
  filters: HistoryFilters;
}

/**
 * Position History 테이블
 *
 * 컬럼:
 *   - Exchange / Symbol / Side / Entry Price / Exit Price
 *   - Realized P&L (색상: 양수 green / 음수 red)
 *   - Est. Rebate (개발 확인 필요: 이전 거래 P&L 수치 확인)
 *   - Closed At
 *
 * 스펙:
 *   - Realized P&L: color-positive / color-negative
 *   - Est. Rebate: color-text-secondary, 툴팁 "예상 수수료 환급액"
 */
export function PositionHistoryTable({ filters }: PositionHistoryTableProps) {
  const { data, isLoading } = usePositionHistory(filters);

  if (isLoading) return <TableSkeleton cols={8} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div
      id="tabpanel-position"
      role="tabpanel"
      aria-labelledby="tab-position"
      className="overflow-x-auto"
    >
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "Symbol", "Side", "Entry", "Exit", "Realized P&L", "Est. Rebate", "Closed At"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <PositionRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PositionRow({ row }: { row: PositionHistoryItem }) {
  const pnlPositive = row.realizedPnlUsd >= 0;

  return (
    <tr className="border-b border-white/10 hover:bg-surface-2/30">
      <td className="px-4 py-3 text-text-secondary">{row.exchangeId}</td>
      <td className="px-4 py-3 font-medium text-text-primary">{row.symbol}</td>
      <td className="px-4 py-3">
        <span className={row.side === "long" ? "text-positive" : "text-negative"}>
          {row.side.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3 text-text-secondary">{formatUsd(row.entryPrice)}</td>
      <td className="px-4 py-3 text-text-secondary">{formatUsd(row.exitPrice)}</td>
      <td className={`px-4 py-3 font-medium ${pnlPositive ? "text-positive" : "text-negative"}`}>
        {pnlPositive ? "+" : ""}{formatUsd(row.realizedPnlUsd)}
      </td>
      <td className="px-4 py-3 text-text-secondary" title="Estimated fee rebate">
        {formatUsd(row.estRebateUsd)}
      </td>
      <td className="px-4 py-3 text-text-tertiary">
        {new Date(row.closedAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 animate-pulse rounded bg-surface-2" />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center text-sm text-text-secondary">
      No position history.
    </div>
  );
}
