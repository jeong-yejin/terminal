"use client";

import { usePerformance } from "@/hooks/usePerformance";
import { ExchangePnlBar } from "./ExchangePnlBar";
import { RebateCard } from "./RebateCard";
import { PerformanceTable } from "./PerformanceTable";

export function PerformancePage() {
  const { data, isLoading } = usePerformance();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Performance</h1>

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
