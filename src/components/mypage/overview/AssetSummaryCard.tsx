"use client";

import type { AssetSummary } from "@/types/mypage";
import { formatUsd, formatPct } from "@/lib/format";

interface AssetSummaryCardProps {
  summary?: AssetSummary;
  isLoading?: boolean;
}

/**
 * 전체 자산 요약 카드
 *
 * 포함 지표:
 *   - Total Asset (전 거래소 합산)
 *   - Funding / Trading 잔고 (개발 확인 필요: 거래소 API 지원 여부)
 *   - Available Balance
 *   - Used Margin
 *   - 24H P&L (값 + 비율, 양수 green / 음수 red)
 *   - Open Positions 수
 *
 * 스펙:
 *   - 카드 배경: color-surface-1, border color-border-subtle, radius 12px
 *   - Total Asset 수치: font-heading-xl/semibold
 *   - 보조 지표: font-body-sm/regular, 2×3 그리드
 *   - P&L 색상: color-positive(#22c55e) / color-negative(#ef4444)
 */
export function AssetSummaryCard({ summary, isLoading }: AssetSummaryCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
        <div className="mb-4 h-5 w-32 animate-pulse rounded bg-surface-3" />
        <div className="mb-2 h-9 w-48 animate-pulse rounded bg-surface-3" />
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-surface-3" />
              <div className="h-5 w-28 animate-pulse rounded bg-surface-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pnlPositive = (summary?.pnl24hUsd ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
      <p className="mb-1 text-sm text-text-tertiary">Total Asset</p>
      <p className="text-3xl font-semibold text-text-primary">
        {formatUsd(summary?.totalAssetUsd)}
      </p>

      {/* Funding / Trading 분리 — 개발 확인 항목 */}
      <div className="mt-2 flex gap-4">
        <span className="text-xs text-text-tertiary">
          Funding{" "}
          <span className="font-medium text-text-secondary">
            {formatUsd(summary?.fundingTotalUsd)}
          </span>
        </span>
        <span className="text-xs text-text-tertiary">
          Trading{" "}
          <span className="font-medium text-text-secondary">
            {formatUsd(summary?.tradingTotalUsd)}
          </span>
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
        <MetricItem label="Available Balance" value={formatUsd(summary?.availableBalanceUsd)} />
        <MetricItem label="Used Margin" value={formatUsd(summary?.usedMarginUsd)} />
        <MetricItem
          label="24H P&L"
          value={`${pnlPositive ? "+" : ""}${formatUsd(summary?.pnl24hUsd)} (${formatPct(summary?.pnl24hPct)})`}
          valueClassName={pnlPositive ? "text-positive" : "text-negative"}
        />
        <MetricItem
          label="Open Positions"
          value={String(summary?.openPositionsCount ?? "—")}
        />
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className={`mt-0.5 text-sm font-medium text-text-primary ${valueClassName ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
