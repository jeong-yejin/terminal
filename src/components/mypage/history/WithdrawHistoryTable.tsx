"use client";

import type { HistoryFilters } from "@/types/mypage";
import { useWithdrawHistory } from "@/hooks/useHistory";
import { formatUsd } from "@/lib/format";

interface WithdrawHistoryTableProps {
  filters: HistoryFilters;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "text-positive",
  failed: "text-negative",
  pending: "text-yellow-400",
};

export function WithdrawHistoryTable({ filters }: WithdrawHistoryTableProps) {
  const { data, isLoading } = useWithdrawHistory(filters);

  if (isLoading) {
    return (
      <div
        className="h-48 animate-pulse rounded-xl border border-border-subtle bg-surface-1"
        aria-busy="true"
        aria-label="Loading withdraw history"
      />
    );
  }

  if (!data?.length) {
    return (
      <div className="py-16 text-center text-sm text-text-secondary">
        No withdraw history.
      </div>
    );
  }

  return (
    <div
      id="tabpanel-withdraw"
      role="tabpanel"
      aria-labelledby="tab-withdraw"
      className="overflow-x-auto"
    >
      {/* Withdrawal notice — withdrawals must be initiated from each exchange */}
      <p className="mb-3 rounded-lg border border-border-subtle bg-surface-2 px-4 py-2.5 text-xs text-text-tertiary">
        Withdrawals can only be initiated from your exchange app or website. This screen shows records only.
      </p>

      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "Asset", "Amount", "Network", "To Address", "Status", "Tx Hash", "Date"].map((h) => (
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
            <tr
              key={row.id}
              className="border-b border-white/10 transition-colors hover:bg-surface-2/30 last:border-0"
            >
              <td className="px-4 py-3 text-text-secondary">{row.exchangeId}</td>
              <td className="px-4 py-3 font-medium text-text-primary">{row.asset}</td>
              <td className="px-4 py-3 text-text-secondary">{formatUsd(row.amount)}</td>
              <td className="px-4 py-3 text-text-tertiary">{row.network ?? "—"}</td>
              <td
                className="max-w-[120px] truncate px-4 py-3 font-mono text-xs text-text-tertiary"
                title={row.toAddress}
              >
                {row.toAddress}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium capitalize ${STATUS_STYLES[row.status] ?? "text-text-tertiary"}`}
                >
                  {row.status}
                </span>
              </td>
              <td
                className="max-w-[120px] truncate px-4 py-3 font-mono text-xs text-text-tertiary"
                title={row.txHash}
              >
                {row.txHash ?? "—"}
              </td>
              <td className="px-4 py-3 text-text-tertiary">
                {new Date(row.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
