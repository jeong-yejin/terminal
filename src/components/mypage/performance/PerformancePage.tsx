"use client";

import { usePerformance } from "@/hooks/usePerformance";
import { PnlChart } from "./PnlChart";
import { ExchangePnlBar } from "./ExchangePnlBar";
import { RebateCard } from "./RebateCard";
import { PerformanceTable } from "./PerformanceTable";

/**
 * Performance 페이지
 *
 * ⚠️ 개발단 협의 필요:
 *   - 이전 거래에 대한 P&L 수치 API 제공 범위
 *   - 리베이트 데이터 연동 방식 (자체 계산 vs 거래소 API)
 *
 * 레이아웃:
 *   - 상단: PnlChart (기간별 총 P&L)
 *   - 중단 2열: ExchangePnlBar + RebateCard
 *   - 하단: PerformanceTable (성과 내역)
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
