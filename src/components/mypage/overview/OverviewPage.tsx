"use client";

import { memo, useMemo, useCallback } from "react";
import {
  CircleDollarSign,
  BarChart2,
  Zap,
  Crosshair,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useOverview } from "@/hooks/useOverview";

// Intl.NumberFormat 인스턴스 모듈 스코프 캐시 — 매 호출마다 생성 방지
const USDT_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatUsdt(value?: number): string {
  if (value == null) return "—";
  return USDT_FORMATTER.format(value);
}

function formatPct(value?: number): string {
  if (value == null) return "—";
  return value.toFixed(2);
}

// 정적 JSX — 매 렌더마다 새 객체 생성 방지 (memo된 MetricCard의 props 안정화)
const TRANSFER_ACTION = (
  <Link
    href="#"
    className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
  >
    Transfer <span aria-hidden>→</span>
  </Link>
);

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  noBorder?: boolean;
}

// memo: 부모 리렌더 시 props 변경 없으면 스킵
const MetricCard = memo(function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  action,
  isLoading,
  noBorder,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className={`rounded-xl bg-surface-1 p-5${noBorder ? "" : " border border-border-subtle"}`}>
        {/* 아이콘+라벨 행 스켈레톤 */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-7 w-7 animate-pulse rounded-full bg-surface-3" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="h-8 w-36 animate-pulse rounded bg-surface-3" />
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-surface-1 p-5${noBorder ? "" : " border border-border-subtle"}`}>
      {/* 아이콘 + 라벨 같은 행, gap 8px */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 아이콘 원형 컨테이너 */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary">
            <Icon size={15} className="text-primary" aria-hidden />
          </div>
          <span className="text-body-2 font-medium text-text-tertiary">{label}</span>
        </div>
        {action}
      </div>

      {/* 값 */}
      <p className="flex items-end justify-end gap-2">
        <span className="text-3xl font-semibold text-text-normal">{value}</span>
        {unit && (
          <span className="text-base font-medium text-primary">{unit}</span>
        )}
      </p>
    </div>
  );
});

export function OverviewPage() {
  const { data, isLoading, error, refetch } = useOverview();

  // useCallback: 에러 버튼 클릭 핸들러 안정화
  const handleRetry = useCallback(() => refetch(), [refetch]);

  // useMemo: data 변경 시에만 포맷 연산 재실행
  const metrics = useMemo(() => {
    const s = data?.summary;
    return {
      totalBalance: formatUsdt(s?.totalAssetUsd),
      availableBalance: formatUsdt(s?.availableBalanceUsd),
      pnl24h: formatPct(s?.pnl24hPct),
      usedMargin: formatUsdt(s?.usedMarginUsd),
      openPositions: String(s?.openPositionsCount ?? 0),
      connectedExchanges: String(data?.connectedExchanges?.length ?? 0),
    };
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-text-secondary">데이터를 불러오지 못했습니다.</p>
        <button
          onClick={handleRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Total Balance | Available Balance */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    
    {/* Gradient Border Wrapper */}
    <div className="rounded-xl p-[1px] bg-gradient-to-b from-primary/10 to-primary">
      <div className="h-full w-full rounded-xl bg-surface-1">
        <MetricCard
          icon={CircleDollarSign}
          label="Total Balance"
          value={metrics.totalBalance}
          unit="USDT"
          isLoading={isLoading}
          noBorder
        />
      </div>
    </div>

    {/* Gradient Border Wrapper */}
    <div className="rounded-xl p-[1px] bg-gradient-to-b from-primary/10 to-primary">
      <div className="h-full w-full rounded-xl bg-surface-1">
        <MetricCard
          icon={CircleDollarSign}
          label="Available Balance"
          value={metrics.availableBalance}
          unit="USDT"
          action={TRANSFER_ACTION}
          isLoading={isLoading}
          noBorder
        />
      </div>
    </div>

  </div>

      {/* Row 2: 24H P&L | usedMargin | Open Positions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={BarChart2}
          label="24H P&L"
          value={metrics.pnl24h}
          unit="%"
          isLoading={isLoading}
        />
        <MetricCard
          icon={Zap}
          label="usedMargin"
          value={metrics.usedMargin}
          unit="USDT"
          isLoading={isLoading}
        />
        <MetricCard
          icon={Crosshair}
          label="Open Positions"
          value={metrics.openPositions}
          isLoading={isLoading}
        />
      </div>

      {/* Row 3: Connected Exchanges */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Building2}
          label="Connected Exchanges"
          value={metrics.connectedExchanges}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
