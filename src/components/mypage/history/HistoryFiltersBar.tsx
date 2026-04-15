"use client";

import type { HistoryFilters } from "@/types/mypage";

interface HistoryFiltersBarProps {
  value: HistoryFilters;
  onChange: (filters: HistoryFilters) => void;
}

/**
 * Shared filter bar — used across all History tabs
 *
 * Filters:
 *   - Exchange (All + connected exchanges)
 *   - Date range: start ~ end (max 90 days)
 *   - Reset button
 *
 * WCAG:
 *   - Explicit <label> associations via aria-label
 *   - Consistent focus-ring on all interactive elements
 *   - Reset communicates intent clearly
 */
export function HistoryFiltersBar({ value, onChange }: HistoryFiltersBarProps) {
  const handleExchangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, exchangeId: e.target.value });
  };

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, startDate: e.target.value });
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, endDate: e.target.value });
  };

  const handleReset = () => {
    onChange({ exchangeId: "all" });
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="group"
      aria-label="History filters"
    >
      {/* Exchange filter */}
      <select
        value={value.exchangeId ?? "all"}
        onChange={handleExchangeChange}
        aria-label="Filter by exchange"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus-ring cursor-pointer"
      >
        <option value="all">All Exchanges</option>
        {/* TODO: dynamically render connected exchanges */}
      </select>

      {/* Start date */}
      <input
        type="date"
        value={value.startDate ?? ""}
        onChange={handleStartDate}
        aria-label="Start date"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus-ring"
      />

      <span aria-hidden="true" className="text-text-tertiary">–</span>

      {/* End date */}
      <input
        type="date"
        value={value.endDate ?? ""}
        onChange={handleEndDate}
        aria-label="End date"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus-ring"
      />

      {/* Reset */}
      <button
        onClick={handleReset}
        className="h-9 rounded-lg border border-border-subtle px-3 text-sm text-text-secondary
          hover:text-text-primary focus-ring transition-colors"
        aria-label="Reset all filters"
      >
        Reset
      </button>
    </div>
  );
}
