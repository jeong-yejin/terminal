"use client";

import { ArrowDownToLine } from "lucide-react";

interface DepositEntryPointProps {
  exchangeId: string;
}

/**
 * 입금 기능 진입점
 *
 * 위치: Assets 페이지 헤더 우측
 * 동작: 선택된 거래소의 Funding Account 입금 페이지로 이동
 *       "All" 선택 시: 버튼 비활성화 + 툴팁 "거래소를 선택하세요"
 *
 * 스펙:
 *   - 크기: height 36px, padding px-3
 *   - disabled: opacity-40, cursor-not-allowed
 */
export function DepositEntryPoint({ exchangeId }: DepositEntryPointProps) {
  const isDisabled = exchangeId === "all";

  return (
    <button
      disabled={isDisabled}
      title={isDisabled ? "거래소를 선택하세요" : `${exchangeId} 입금`}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
        hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={() => {
        // TODO: 거래소별 Funding Account 입금 URL로 이동
        // e.g. window.open(`https://${exchangeId}.com/deposit`, '_blank')
      }}
    >
      <ArrowDownToLine size={16} aria-hidden="true" />
      입금
    </button>
  );
}
