"use client";

import type { HistoryFilters } from "@/types/mypage";
import { useTransferHistory } from "@/hooks/useHistory";
import { formatUsd } from "@/lib/format";

interface TransferHistoryTableProps {
  filters: HistoryFilters;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "text-positive",
  failed: "text-negative",
  pending: "text-yellow-400",
};

export function TransferHistoryTable({ filters }: TransferHistoryTableProps) {
  const { data, isLoading } = useTransferHistory(filters);

  if (isLoading) {
    return (
      <div
        className="h-48 animate-pulse rounded-xl border border-border-subtle bg-surface-1"
        aria-busy="true"
        aria-label="Loading transfer history"
      />
    );
  }

  if (!data?.length) {
    return (
      <div className="py-16 text-center text-sm text-text-secondary">
        No transfer history.
      </div>
    );
  }

  return (
    <div
      id="tabpanel-transfer"
      role="tabpanel"
      aria-labelledby="tab-transfer"
      className="overflow-x-auto"
    >
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "Asset", "Amount", "From", "To", "Status", "Date"].map((h) => (
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
              <td className="px-4 py-3 capitalize text-text-secondary">{row.fromAccount}</td>
              <td className="px-4 py-3 capitalize text-text-secondary">{row.toAccount}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium capitalize ${STATUS_STYLES[row.status] ?? "text-text-tertiary"}`}
                >
                  {row.status}
                </span>
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
