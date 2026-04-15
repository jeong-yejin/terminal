"use client";

import type { HistoryFilters } from "@/types/mypage";
import { useDepositHistory } from "@/hooks/useHistory";
import { formatUsd } from "@/lib/format";

interface DepositHistoryTableProps {
  filters: HistoryFilters;
}

export function DepositHistoryTable({ filters }: DepositHistoryTableProps) {
  const { data, isLoading } = useDepositHistory(filters);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />;
  }

  if (!data?.length) {
    return <div className="py-16 text-center text-sm text-text-secondary">No deposit history.</div>;
  }

  return (
    <div id="tabpanel-deposit" role="tabpanel" aria-labelledby="tab-deposit" className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2">
            {["Exchange", "Asset", "Amount", "Status", "Tx Hash", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-white/10 hover:bg-surface-2/30">
              <td className="px-4 py-3 text-text-secondary">{row.exchangeId}</td>
              <td className="px-4 py-3 font-medium text-text-primary">{row.asset}</td>
              <td className="px-4 py-3 text-text-secondary">{formatUsd(row.amount)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium capitalize ${
                  row.status === "completed" ? "text-positive" :
                  row.status === "failed" ? "text-negative" : "text-yellow-400"
                }`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 max-w-[120px] truncate text-xs text-text-tertiary" title={row.txHash}>
                {row.txHash ?? "—"}
              </td>
              <td className="px-4 py-3 text-text-tertiary">{new Date(row.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
