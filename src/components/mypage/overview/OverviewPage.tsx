"use client";

import { AssetSummaryCard } from "./AssetSummaryCard";
import { ExchangeStatusList } from "./ExchangeStatusList";
import { useOverview } from "@/hooks/useOverview";

/**
 * Overview 페이지
 *
 * 레이아웃:
 *   - 상단: AssetSummaryCard (전체 자산 요약)
 *   - 하단: ExchangeStatusList (연동 거래소 상태)
 *   - 그리드: 1col (mobile) → 2col (≥1024px)
 *
 * 로딩 상태: 각 카드 스켈레톤
 * 에러 상태: 인라인 에러 메시지 + Retry 버튼
 */
export function OverviewPage() {
  const { data, isLoading, error, refetch } = useOverview();

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-text-secondary">
          데이터를 불러오지 못했습니다.
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Overview</h1>

      <AssetSummaryCard summary={data?.summary} isLoading={isLoading} />

      <ExchangeStatusList
        exchanges={data?.connectedExchanges}
        isLoading={isLoading}
      />
    </div>
  );
}
