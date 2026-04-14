"use client";

import { useState } from "react";
import { HistoryTabs, type HistoryTab } from "./HistoryTabs";
import { HistoryFiltersBar } from "./HistoryFiltersBar";
import { OrderHistoryTable } from "./OrderHistoryTable";
import { TradeHistoryTable } from "./TradeHistoryTable";
import { PositionHistoryTable } from "./PositionHistoryTable";
import { DepositHistoryTable } from "./DepositHistoryTable";
import type { HistoryFilters } from "@/types/mypage";

/**
 * History 페이지
 *
 * 탭 구성:
 *   - Order History
 *   - Trade History
 *   - Position History (Realized P&L + Est. Rebate 표시)
 *   - Deposit History
 *
 * 공통 필터: 거래소, 기간 (startDate ~ endDate)
 *
 * 개발 확인 필요:
 *   - 거래소 전체 내역 통합 조회 범위 (페이지네이션 처리 방식)
 */
export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryTab>("order");
  const [filters, setFilters] = useState<HistoryFilters>({
    exchangeId: "all",
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-text-primary">History</h1>

      <HistoryTabs value={activeTab} onChange={setActiveTab} />

      <HistoryFiltersBar value={filters} onChange={setFilters} />

      {activeTab === "order" && <OrderHistoryTable filters={filters} />}
      {activeTab === "trade" && <TradeHistoryTable filters={filters} />}
      {activeTab === "position" && <PositionHistoryTable filters={filters} />}
      {activeTab === "deposit" && <DepositHistoryTable filters={filters} />}
    </div>
  );
}
