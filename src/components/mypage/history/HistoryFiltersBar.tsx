"use client";

import type { HistoryFilters } from "@/types/mypage";

interface HistoryFiltersBarProps {
  value: HistoryFilters;
  onChange: (filters: HistoryFilters) => void;
}

/**
 * 공통 필터 바 (History 전 탭 공유)
 *
 * 필터:
 *   - 거래소 선택 (All + 연동된 거래소 목록)
 *   - 기간: 시작일 ~ 종료일 date picker
 *   - 초기화 버튼
 *
 * 스펙:
 *   - 가로 flex, gap-3
 *   - 각 인풋 높이 36px
 *   - 날짜 범위 최대: 90일 (초과 시 에러 메시지)
 */
export function HistoryFiltersBar({ value, onChange }: HistoryFiltersBarProps) {
  const handleExchangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, exchangeId: e.target.value });
  };

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, startDate: e.target.value });
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, endDate: e.target.value });
  };

  const handleReset = () => {
    onChange({ exchangeId: "all" });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 거래소 필터 */}
      <select
        value={value.exchangeId ?? "all"}
        onChange={handleExchangeChange}
        aria-label="거래소 선택"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus:outline focus:outline-2 focus:outline-primary"
      >
        <option value="all">All Exchanges</option>
        {/* TODO: 연동된 거래소 목록 동적 렌더링 */}
      </select>

      {/* 시작일 */}
      <input
        type="date"
        value={value.startDate ?? ""}
        onChange={handleStartDate}
        aria-label="시작일"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus:outline focus:outline-2 focus:outline-primary"
      />

      <span className="text-text-tertiary">~</span>

      {/* 종료일 */}
      <input
        type="date"
        value={value.endDate ?? ""}
        onChange={handleEndDate}
        aria-label="종료일"
        className="h-9 rounded-lg border border-border-subtle bg-surface-1 px-3 text-sm text-text-primary
          focus:outline focus:outline-2 focus:outline-primary"
      />

      {/* 초기화 */}
      <button
        onClick={handleReset}
        className="h-9 rounded-lg border border-border-subtle px-3 text-sm text-text-secondary
          hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        초기화
      </button>
    </div>
  );
}
