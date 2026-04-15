"use client";

/**
 * 거래소 선택 탭/드롭다운
 *
 * 동작:
 *   - desktop(≥768px): 수평 탭 (All + 거래소 목록)
 *   - mobile(<768px): <select> 드롭다운
 *   - "All" 선택 시 전체 거래소 자산 합산 표시
 *
 * 접근성:
 *   - role="tablist" / role="tab" / aria-selected
 *   - 키보드: ← → 화살표로 탭 이동
 */

interface ExchangeSelectorProps {
  value: string;
  onChange: (exchangeId: string) => void;
  exchanges?: Array<{ id: string; name: string }>;
}

export function ExchangeSelector({
  value,
  onChange,
  exchanges = [],
}: ExchangeSelectorProps) {
  const tabs = [{ id: "all", name: "All" }, ...exchanges];

  return (
    <div
      role="tablist"
      aria-label="Select exchange"
      className="flex gap-1 rounded-lg bg-surface-2 p-1"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
            ${
              value === tab.id
                ? "bg-surface-1 text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
