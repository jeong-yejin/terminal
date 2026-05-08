"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import type { HistoryFilters, PositionHistoryItem } from "@/types/mypage";
import { formatUsd } from "@/lib/format";
import { usePositionHistory } from "@/hooks/useHistory";
import { PnlShareModal } from "./PnlShareModal";

interface PositionHistoryTableProps {
  filters: HistoryFilters;
}

/**
 * Position History table (Futures only)
 *
 * Columns:
 *   - Exchange / Symbol / Side / Entry / Exit
 *   - Realized P&L  (color-coded)
 *   - ROE %         (realizedPnl ÷ notional × 100, approximate without leverage)
 *   - Est. Rebate
 *   - Closed At
 *   - Share         → PnlShareModal
 */
export function PositionHistoryTable({ filters }: PositionHistoryTableProps) {
  const { data, isLoading } = usePositionHistory(filters);
  const [sharingPosition, setSharingPosition] = useState<PositionHistoryItem | null>(null);

  if (isLoading) return <TableSkeleton cols={9} />;
  if (!data?.length) return <EmptyState />;

  return (
    <>
      <div
        id="tabpanel-position"
        role="tabpanel"
        aria-labelledby="tab-position"
        className="overflow-x-auto"
      >
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-2">
              {[
                "Exchange", "Symbol", "Side",
                "Entry", "Exit",
                "Realized P&L", "ROE", "Est. Rebate",
                "Closed At", "",
              ].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-text-tertiary"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <PositionRow
                key={row.id}
                row={row}
                onShare={() => setSharingPosition(row)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* P&L Share Modal */}
      {sharingPosition && (
        <PnlShareModal
          position={sharingPosition}
          open={true}
          onClose={() => setSharingPosition(null)}
        />
      )}
    </>
  );
}

// ─── PositionRow ──────────────────────────────────────────────────────────────

interface PositionRowProps {
  row: PositionHistoryItem;
  onShare: () => void;
}

function PositionRow({ row, onShare }: PositionRowProps) {
  const pnlPositive = row.realizedPnlUsd >= 0;

  // ROE = realizedPnl / notional × 100 (approximate without leverage)
  const notional = row.entryPrice * row.quantity;
  const roe = notional > 0 ? (row.realizedPnlUsd / notional) * 100 : 0;
  const roePositive = roe >= 0;

  return (
    <tr className="group border-b border-white/10 hover:bg-surface-2/30 last:border-0">
      <td className="px-4 py-3 text-text-secondary">{row.exchangeId}</td>
      <td className="px-4 py-3 font-medium text-text-primary">{row.symbol}</td>
      <td className="px-4 py-3">
        <span className={`font-semibold ${row.side === "long" ? "text-positive" : "text-negative"}`}>
          {row.side === "long" ? "▲" : "▼"} {row.side.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3 tabular-nums text-text-secondary">{formatUsd(row.entryPrice)}</td>
      <td className="px-4 py-3 tabular-nums text-text-secondary">{formatUsd(row.exitPrice)}</td>

      {/* Realized P&L — key figure, highlighted */}
      <td className={`px-4 py-3 font-semibold tabular-nums ${pnlPositive ? "text-positive" : "text-negative"}`}>
        {pnlPositive ? "+" : ""}{formatUsd(row.realizedPnlUsd)}
      </td>

      {/* ROE */}
      <td className={`px-4 py-3 text-xs font-medium tabular-nums ${roePositive ? "text-positive/80" : "text-negative/80"}`}>
        {roePositive ? "+" : ""}{roe.toFixed(2)}%
      </td>

      {/* Est. Rebate */}
      <td className="px-4 py-3 font-medium tabular-nums text-positive" title="Estimated fee rebate from ReboundX">
        +{formatUsd(row.estRebateUsd)}
      </td>

      <td className="px-4 py-3 text-text-tertiary">
        {new Date(row.closedAt).toLocaleDateString()}
      </td>

      {/* Share — visible on row hover */}
      <td className="px-4 py-3">
        <button
          onClick={onShare}
          aria-label={`Share ${row.symbol} trade result`}
          title="Share trade result"
          className="flex items-center gap-1.5 rounded-md border border-border-subtle px-2.5 py-1.5
            text-xs font-medium text-text-tertiary
            opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100
            hover:border-primary/40 hover:text-text-primary focus-ring"
        >
          <Share2 size={12} aria-hidden />
          Share
        </button>
      </td>
    </tr>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

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
