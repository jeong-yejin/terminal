"use client";

import Image from "next/image";
import type { ConnectedExchange } from "@/types/mypage";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ExchangeStatusListProps {
  exchanges?: ConnectedExchange[];
  isLoading?: boolean;
}

const STATUS_LABEL: Record<ConnectedExchange["status"], string> = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
};

/**
 * 연동 거래소 상태 목록
 *
 * 스펙:
 *   - 카드형 리스트, 거래소당 1행
 *   - 거래소 로고 28×28px
 *   - 상태 뱃지: connected(green) / disconnected(gray) / error(red)
 *   - 총 자산 우측 정렬
 *   - 빈 상태: "연동된 거래소가 없습니다" + Exchanges 링크
 */
export function ExchangeStatusList({
  exchanges,
  isLoading,
}: ExchangeStatusListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-surface-1 border border-border-subtle"
          />
        ))}
      </div>
    );
  }

  if (!exchanges?.length) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-8 text-center">
        <p className="text-sm text-text-secondary">연동된 거래소가 없습니다.</p>
        <a
          href="/mypage/exchanges"
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          거래소 추가하기 →
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-text-secondary">
        Connected Exchanges
      </h2>
      <ul role="list" className="space-y-2">
        {exchanges.map((exchange) => (
          <li
            key={exchange.id}
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-1 px-4 py-3"
          >
            {/* 로고 */}
            <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-surface-2">
              <Image
                src={exchange.logoUrl}
                alt={exchange.name}
                fill
                sizes="28px"
                className="object-contain p-0.5"
              />
            </div>

            {/* 이름 */}
            <span className="flex-1 text-sm font-medium text-text-primary">
              {exchange.name}
            </span>

            {/* 상태 뱃지 */}
            <StatusBadge status={exchange.status} />

            {/* 총 자산 */}
            <span className="text-sm font-medium text-text-primary">
              {formatUsd(exchange.totalUsd)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: ConnectedExchange["status"] }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-positive/10 text-positive": status === "connected",
          "bg-surface-3 text-text-tertiary": status === "disconnected",
          "bg-negative/10 text-negative": status === "error",
        }
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-positive": status === "connected",
          "bg-text-tertiary": status === "disconnected",
          "bg-negative": status === "error",
        })}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
