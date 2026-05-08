"use client";

import { useState } from "react";
import {
  HistoryTabs,
  type HistorySection,
  type HistoryTab,
} from "./HistoryTabs";
import { HistoryFiltersBar } from "./HistoryFiltersBar";
import { OrderHistoryTable } from "./OrderHistoryTable";
import { TradeHistoryTable } from "./TradeHistoryTable";
import { PositionHistoryTable } from "./PositionHistoryTable";
import { DepositHistoryTable } from "./DepositHistoryTable";
import { TransferHistoryTable } from "./TransferHistoryTable";
import { WithdrawHistoryTable } from "./WithdrawHistoryTable";
import { PnlChart } from "@/components/mypage/performance/PnlChart";
import { usePerformance } from "@/hooks/usePerformance";
import type { HistoryFilters } from "@/types/mypage";

/**
 * History page
 *
 * Tier 1 — Section:
 *   - Trade History    → trade records (order / trade / position)
 *   - Transaction History → asset records (deposit / transfer / withdraw)
 *
 * Tier 2 — Tab:
 *   Trade:       Order History | Trade History | Position History
 *   Transaction: Deposit History | Transfer History | Withdraw History
 *                (Withdraw is read-only — actual withdrawals are executed on the exchange)
 *
 * Shared filters: exchange, date range (startDate ~ endDate)
 */
export function HistoryPage() {
  const [activeSection, setActiveSection] = useState<HistorySection>("trade");
  const [activeTab, setActiveTab] = useState<HistoryTab>("order");
  const [filters, setFilters] = useState<HistoryFilters>({
    exchangeId: "all",
  });
  const { data: perfData, isLoading: perfLoading } = usePerformance();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-text-primary">History</h1>

      <HistoryTabs
        section={activeSection}
        tab={activeTab}
        onSectionChange={(s) => {
          setActiveSection(s);
          // reset marketType filter on section change
          setFilters((prev) => ({ ...prev, marketType: "all" }));
        }}
        onTabChange={setActiveTab}
      />

      <HistoryFiltersBar section={activeSection} value={filters} onChange={setFilters} />

      {/* ── Trade section only: P&L chart ── */}
      {activeSection === "trade" && (
        <PnlChart data={perfData?.pnlChart} isLoading={perfLoading} />
      )}

      {/* ── Trade History tab panels ── */}
      {activeTab === "order" && (
        <OrderHistoryTable filters={filters} />
      )}
      {activeTab === "trade" && (
        <TradeHistoryTable filters={filters} />
      )}
      {activeTab === "position" && (
        <PositionHistoryTable filters={filters} />
      )}

      {/* ── Transaction History tab panels ── */}
      {activeTab === "deposit" && (
        <DepositHistoryTable filters={filters} />
      )}
      {activeTab === "transfer" && (
        <TransferHistoryTable filters={filters} />
      )}
      {activeTab === "withdraw" && (
        <WithdrawHistoryTable filters={filters} />
      )}
    </div>
  );
}
