"use client";

import Image from "next/image";
import type { ExchangeConnection } from "@/types/mypage";
import { cn } from "@/lib/utils";

interface ExchangeListProps {
  exchanges?: ExchangeConnection[];
  isLoading?: boolean;
  onDisconnect?: () => void;
}

const STATUS_LABEL: Record<ExchangeConnection["status"], string> = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
};

/**
 * 연동 거래소 목록
 *
 * 각 항목:
 *   - 거래소 로고 + 이름
 *   - 상태 뱃지
 *   - API Key (마스킹 표시)
 *   - 연결일
 *   - 연동 해제 버튼 (confirm 다이얼로그 필요)
 *
 * 빈 상태: "연동된 거래소가 없습니다 — 거래소 추가 안내"
 */
export function ExchangeList({ exchanges, isLoading, onDisconnect }: ExchangeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />
        ))}
      </div>
    );
  }

  if (!exchanges?.length) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-10 text-center">
        <p className="text-sm text-text-secondary">연동된 거래소가 없습니다.</p>
        <p className="mt-1 text-xs text-text-tertiary">
          우측 상단 "거래소 추가" 버튼을 눌러 OAuth로 연동하세요.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {exchanges.map((exchange) => (
        <li
          key={exchange.id}
          className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-1 px-5 py-4"
        >
          {/* 로고 */}
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-surface-2">
            <Image src={exchange.logoUrl} alt={exchange.name} fill sizes="32px" className="object-contain p-0.5" />
          </div>

          {/* 정보 */}
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">{exchange.name}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  exchange.status === "connected" && "bg-positive/10 text-positive",
                  exchange.status === "disconnected" && "bg-surface-3 text-text-tertiary",
                  exchange.status === "error" && "bg-negative/10 text-negative"
                )}
              >
                {STATUS_LABEL[exchange.status]}
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              API Key: {exchange.apiKeyMasked} · 연결일{" "}
              {new Date(exchange.connectedAt).toLocaleDateString()}
            </p>
          </div>

          {/* 연동 해제 */}
          <button
            onClick={() => {
              if (confirm(`${exchange.name} 연동을 해제하시겠습니까?`)) {
                // TODO: DELETE /api/exchanges/:id
                onDisconnect?.();
              }
            }}
            className="text-xs text-text-tertiary hover:text-negative
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            연동 해제
          </button>
        </li>
      ))}
    </ul>
  );
}
