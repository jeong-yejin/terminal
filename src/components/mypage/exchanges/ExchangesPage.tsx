"use client";

import { ExchangeList } from "./ExchangeList";
import { AddExchangeButton } from "./AddExchangeButton";
import { useExchanges } from "@/hooks/useExchanges";

/**
 * Exchanges 페이지
 *
 * 기능:
 *   - 연동된 거래소 목록 + 상태
 *   - 거래소 추가 (OAuth 방식)
 *   - 연동 해제
 *
 * "거래소 추가"는 버튼 CTA 라벨 — 메뉴명은 "Exchanges"로 유지
 */
export function ExchangesPage() {
  const { data, isLoading, refetch } = useExchanges();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Exchanges</h1>
        <AddExchangeButton onSuccess={refetch} />
      </div>

      <ExchangeList exchanges={data} isLoading={isLoading} onDisconnect={refetch} />
    </div>
  );
}
