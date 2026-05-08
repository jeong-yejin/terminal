"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

// ─── Section ──────────────────────────────────────────────────────────────────
export type HistorySection = "trade" | "transaction";

// ─── Tab (tabs belonging to each section) ────────────────────────────────────
export type TradeTab = "order" | "trade" | "position";
export type TransactionTab = "deposit" | "transfer" | "withdraw";
export type HistoryTab = TradeTab | TransactionTab;

const SECTIONS: { id: HistorySection; label: string }[] = [
  { id: "trade", label: "Trade History" },
  { id: "transaction", label: "Transaction History" },
];

const TRADE_TABS: { id: TradeTab; label: string; badge?: string }[] = [
  { id: "order",    label: "Order History" },
  { id: "trade",    label: "Trade History" },
  { id: "position", label: "Position History", badge: "FUTURES" },
];

const TRANSACTION_TABS: { id: TransactionTab; label: string }[] = [
  { id: "deposit", label: "Deposit History" },
  { id: "transfer", label: "Transfer History" },
  { id: "withdraw", label: "Withdraw History" },
];

interface HistoryTabsProps {
  section: HistorySection;
  tab: HistoryTab;
  onSectionChange: (s: HistorySection) => void;
  onTabChange: (t: HistoryTab) => void;
}

/**
 * 2-tier History navigation
 *
 * Tier 1 — Section toggle: Trade History | Transaction History
 * Tier 2 — Tab strip: detail tabs for the selected section
 *
 * Accessibility:
 *   - Section toggle: role="tablist" / role="tab" / aria-selected
 *   - Tab strip: role="tablist" / role="tab" / aria-selected / aria-controls
 *   - Keyboard: ← → arrow navigation (each tablist independent)
 */
export function HistoryTabs({ section, tab, onSectionChange, onTabChange }: HistoryTabsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  const tabs = section === "trade" ? TRADE_TABS : TRANSACTION_TABS;

  function handleSectionKey(e: React.KeyboardEvent, idx: number) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (idx + 1) % SECTIONS.length : (idx - 1 + SECTIONS.length) % SECTIONS.length;
    onSectionChange(SECTIONS[next].id);
    // move focus
    const btns = sectionRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    btns?.[next]?.focus();
  }

  function handleTabKey(e: React.KeyboardEvent, idx: number) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    onTabChange(tabs[next].id);
    const btns = tabRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    btns?.[next]?.focus();
  }

  return (
    <div className="space-y-0">
      {/* ── Tier 1: Section toggle ── */}
      <div
        ref={sectionRef}
        role="tablist"
        aria-label="History section"
        className="flex gap-1 rounded-xl bg-surface-2 p-1"
      >
        {SECTIONS.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            id={`section-tab-${s.id}`}
            aria-selected={section === s.id}
            aria-controls={`section-panel-${s.id}`}
            onClick={() => {
              onSectionChange(s.id);
              // reset to first tab of the selected section
              onTabChange(s.id === "trade" ? "order" : "deposit");
            }}
            onKeyDown={(e) => handleSectionKey(e, idx)}
            tabIndex={section === s.id ? 0 : -1}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
              section === s.id
                ? "bg-surface-1 text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Tier 2: Tab strip ── */}

      <div className="overflow-x-auto border-b border-border-subtle">
        <div
          ref={tabRef}
          role="tablist"
          aria-label={section === "trade" ? "Trade History tabs" : "Transaction History tabs"}
          className="flex min-w-max"
        >
          {tabs.map((t, idx) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`tabpanel-${t.id}`}
              onClick={() => onTabChange(t.id)}
              onKeyDown={(e) => handleTabKey(e, idx)}
              tabIndex={tab === t.id ? 0 : -1}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]",
                tab === t.id
                  ? "border-b-2 border-primary text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t.label}
              {"badge" in t && t.badge && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
