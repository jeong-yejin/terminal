"use client";

import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { DepositModal } from "./DepositModal";

interface DepositEntryPointProps {
  exchangeId: string;
  exchangeName: string;
}

/**
 * 입금 기능 진입점
 *
 * 위치: Assets 페이지 헤더 우측
 * 동작: 선택된 거래소의 플랫폼 내 입금 모달 열기
 *       "All" 선택 시: 버튼 비활성화 + 툴팁 "거래소를 선택하세요"
 *
 * 스펙:
 *   - 크기: height 36px, padding px-3
 *   - disabled: opacity-40, cursor-not-allowed
 */
export function DepositEntryPoint({ exchangeId, exchangeName }: DepositEntryPointProps) {
  const [open, setOpen] = useState(false);
  const isDisabled = exchangeId === "all";

  return (
    <>
      <button
        disabled={isDisabled}
        title={isDisabled ? "Select an exchange first" : `Deposit to ${exchangeName}`}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
          hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setOpen(true)}
      >
        <ArrowDownToLine size={16} aria-hidden="true" />
        Deposit
      </button>

      <DepositModal
        exchangeId={exchangeId}
        exchangeName={exchangeName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
