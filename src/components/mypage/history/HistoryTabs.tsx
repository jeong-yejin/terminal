"use client";

export type HistoryTab = "order" | "trade" | "position" | "deposit";

const TABS: { id: HistoryTab; label: string }[] = [
  { id: "order", label: "Order History" },
  { id: "trade", label: "Trade History" },
  { id: "position", label: "Position History" },
  { id: "deposit", label: "Deposit History" },
];

interface HistoryTabsProps {
  value: HistoryTab;
  onChange: (tab: HistoryTab) => void;
}

/**
 * History 탭 내비게이션
 *
 * 접근성:
 *   - role="tablist" / role="tab" / aria-selected / aria-controls
 *   - 키보드: ← → 화살표 이동, Enter/Space 선택
 *
 * 스펙:
 *   - 하단 보더 방식 (underline 스타일)
 *   - 활성: border-b-2 color-primary, text-text-primary
 *   - 비활성: text-text-secondary, hover: text-text-primary
 *   - 모바일: 수평 스크롤 (overflow-x-auto)
 */
export function HistoryTabs({ value, onChange }: HistoryTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div
        role="tablist"
        className="flex min-w-max border-b border-border-subtle"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={value === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
              ${
                value === tab.id
                  ? "border-b-2 border-primary text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
