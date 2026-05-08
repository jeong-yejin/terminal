"use client";

import { cn } from "@/lib/utils";
import type { HistoryFilters, MarketType } from "@/types/mypage";
import type { HistorySection } from "./HistoryTabs";
import { useExchanges } from "@/hooks/useExchanges";

interface HistoryFiltersBarProps {
  section: HistorySection;
  value: HistoryFilters;
  onChange: (filters: HistoryFilters) => void;
}

const MARKET_TYPE_OPTIONS: { id: MarketType | "all"; label: string }[] = [
  { id: "all",     label: "All" },
  { id: "spot",    label: "Spot" },
  { id: "futures", label: "Futures" },
];

/**
 * Shared filter bar — used across all History tabs
 *
 * Filters:
 *   - Market Type chip (Spot / Futures / All) — Trade History section only
 *   - Exchange (All + connected exchanges)
 *   - Date range: start ~ end (max 90 days)
 *   - Reset button
 */
export function HistoryFiltersBar({ section, value, onChange }: HistoryFiltersBarProps) {
  const { data: exchanges } = useExchanges();
  const activeMarket = value.marketType ?? "all";

  const handleMarketType = (mt: MarketType | "all") => {
    onChange({ ...value, marketType: mt });
  };

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
    onChange({ exchangeId: "all", marketType: "all" });
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="group"
      aria-label="History filters"
    >
      {/* Market Type chip — Trade section only */}
      {section === "trade" && (
        <div
          role="group"
          aria-label="Filter by market type"
          className="flex rounded-lg border border-border-subtle bg-surface-1 p-0.5"
        >
          {MARKET_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleMarketType(opt.id)}
              aria-pressed={activeMarket === opt.id}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1",
                activeMarket === opt.id
                  ? opt.id === "futures"
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-2 text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Exchange filter */}
      <select
        value={value.exchangeId ?? "all"}
        onChange={handleExchangeChange}
        aria-label="Filter by exchange"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus-ring cursor-pointer"
      >
        <option value="all">All Exchanges</option>
        {exchanges?.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
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
