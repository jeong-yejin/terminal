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

export function useOrderHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<OrderHistoryItem[]>(
    ["/api/history/orders", filters],
    () => fetchOrderHistory(filters)
  );
  return { data, isLoading, error };
}

export function useTradeHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<TradeHistoryItem[]>(
    ["/api/history/trades", filters],
    () => fetchTradeHistory(filters)
  );
  return { data, isLoading, error };
}

export function usePositionHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<PositionHistoryItem[]>(
    ["/api/history/positions", filters],
    () => fetchPositionHistory(filters)
  );
  return { data, isLoading, error };
}

export function useDepositHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<DepositHistoryItem[]>(
    ["/api/history/deposits", filters],
    () => fetchDepositHistory(filters)
  );
  return { data, isLoading, error };
}
