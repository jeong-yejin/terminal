"use client";

import { usePerformance } from "@/hooks/usePerformance";
import { PnlChart } from "./PnlChart";
import { ExchangePnlBar } from "./ExchangePnlBar";
import { RebateCard } from "./RebateCard";
import { PerformanceTable } from "./PerformanceTable";

/**
 * Performance page
 *
 * ⚠️ Needs team alignment:
 *   - API scope for P&L data on past trades
 *   - Rebate data integration method (own calculation vs exchange API)
 *
 * Layout:
 *   - Top: PnlChart (total P&L by period)
 *   - Middle 2-col: ExchangePnlBar + RebateCard
 *   - Bottom: PerformanceTable (performance breakdown)
 */
export function PerformancePage() {
  const { data, isLoading } = usePerformance();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Performance</h1>

      {/* DEV: confirm P&L data scope and rebate integration method before finalising spec */}
      {process.env.NODE_ENV === "development" && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          ⚠️ <strong>Dev note:</strong> Confirm P&L data range and rebate integration method (own calculation vs exchange API) before finalising spec.
        </div>
      )}

      <PnlChart data={data?.pnlChart} isLoading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        <ExchangePnlBar data={data?.exchangePnlBreakdown} isLoading={isLoading} />
        <RebateCard
          totalReceived={data?.totalRebateReceivedUsd}
          estimated={data?.estRebateUsd}
          totalFee={data?.totalFeePaidUsd}
          isLoading={isLoading}
        />
      </div>

      <PerformanceTable data={data?.exchangePnlBreakdown} isLoading={isLoading} />
    </div>
  );
}
