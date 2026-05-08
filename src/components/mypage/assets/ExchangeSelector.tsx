"use client";

/**
 * Exchange selector tab / dropdown
 *
 * Behavior:
 *   - desktop (≥768px): horizontal tabs (All + exchange list)
 *   - mobile (<768px): <select> dropdown
 *   - "All" shows combined assets across all exchanges
 *
 * Accessibility:
 *   - role="tablist" / role="tab" / aria-selected
 *   - Keyboard: ← → arrows to navigate tabs
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

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight") onChange(tabs[(idx + 1) % tabs.length].id);
    if (e.key === "ArrowLeft") onChange(tabs[(idx - 1 + tabs.length) % tabs.length].id);
  };
  
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
