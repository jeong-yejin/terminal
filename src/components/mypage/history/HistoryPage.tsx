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
import type { HistoryFilters } from "@/types/mypage";

/**
 * History 페이지
 *
 * Tier 1 — Section:
 *   - Trade History    → 거래 내역 (order / trade / position)
 *   - Transaction History → 에셋 내역 (deposit / transfer / withdraw)
 *
 * Tier 2 — Tab:
 *   Trade:       Order History | Trade History | Position History
 *   Transaction: Deposit History | Transfer History | Withdraw History
 *                (Withdraw는 읽기 전용 — 실제 출금은 거래소에서 실행)
 *
 * 공통 필터: 거래소, 기간 (startDate ~ endDate)
 */
export function HistoryPage() {
  const [activeSection, setActiveSection] = useState<HistorySection>("trade");
  const [activeTab, setActiveTab] = useState<HistoryTab>("order");
  const [filters, setFilters] = useState<HistoryFilters>({
    exchangeId: "all",
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-text-primary">History</h1>

      <HistoryTabs
        section={activeSection}
        tab={activeTab}
        onSectionChange={setActiveSection}
        onTabChange={setActiveTab}
      />

      <HistoryFiltersBar value={filters} onChange={setFilters} />

      {/* ── Trade History 탭패널 ── */}
      {activeTab === "order" && (
        <OrderHistoryTable filters={filters} />
      )}
      {activeTab === "trade" && (
        <TradeHistoryTable filters={filters} />
      )}
      {activeTab === "position" && (
        <PositionHistoryTable filters={filters} />
      )}

      {/* ── Transaction History 탭패널 ── */}
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
