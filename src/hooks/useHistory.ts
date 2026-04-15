import useSWR from "swr";
import type {
  HistoryFilters,
  OrderHistoryItem,
  TradeHistoryItem,
  PositionHistoryItem,
  DepositHistoryItem,
} from "@/types/mypage";
import {
  fetchOrderHistory,
  fetchTradeHistory,
  fetchPositionHistory,
  fetchDepositHistory,
} from "@/lib/api/history";

// 히스토리는 실시간 불필요 — 포커스 리패치 비활성화, 30s 중복 제거
const HISTORY_SWR_CONFIG = {
  revalidateOnFocus: false,
  dedupingInterval: 30_000,
} as const;

export function useOrderHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<OrderHistoryItem[]>(
    ["/api/history/orders", filters],
    () => fetchOrderHistory(filters),
    HISTORY_SWR_CONFIG
  );
  return { data, isLoading, error };
}

export function useTradeHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<TradeHistoryItem[]>(
    ["/api/history/trades", filters],
    () => fetchTradeHistory(filters),
    HISTORY_SWR_CONFIG
  );
  return { data, isLoading, error };
}

export function usePositionHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<PositionHistoryItem[]>(
    ["/api/history/positions", filters],
    () => fetchPositionHistory(filters),
    HISTORY_SWR_CONFIG
  );
  return { data, isLoading, error };
}

export function useDepositHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<DepositHistoryItem[]>(
    ["/api/history/deposits", filters],
    () => fetchDepositHistory(filters),
    HISTORY_SWR_CONFIG
  );
  return { data, isLoading, error };
}
