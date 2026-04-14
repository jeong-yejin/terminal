"use client";

import type { PnlDataPoint } from "@/types/mypage";

interface PnlChartProps {
  data?: PnlDataPoint[];
  isLoading?: boolean;
}

/**
 * P&L 라인 차트 (기간별)
 *
 * 권장 라이브러리: recharts (LineChart)
 * 스펙:
 *   - 높이: 240px
 *   - X축: 날짜 (MM/DD), Y축: USD
 *   - 양수 구간: color-positive fill, 음수: color-negative fill
 *   - 툴팁: 날짜 + P&L USD
 *   - 기간 필터 버튼: 1W / 1M / 3M / 1Y / ALL
 *
 * TODO: recharts LineChart 구현체로 교체 필요
 */
export function PnlChart({ data, isLoading }: PnlChartProps) {
  if (isLoading) {
    return <div className="h-60 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />;
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
      <h2 className="mb-4 text-sm font-medium text-text-secondary">Total P&L</h2>
      {/* TODO: recharts LineChart 구현 */}
      <div className="flex h-52 items-center justify-center text-xs text-text-tertiary">
        Chart placeholder — recharts LineChart
      </div>
    </div>
  );
}
