import useSWR from "swr";
import type {
  HistoryFilters,
  OrderHistoryItem,
  TradeHistoryItem,
  PositionHistoryItem,
  DepositHistoryItem,
  TransferHistoryItem,
  WithdrawHistoryItem,
} from "@/types/mypage";
import {
  fetchOrderHistory,
  fetchTradeHistory,
  fetchPositionHistory,
  fetchDepositHistory,
  fetchTransferHistory,
  fetchWithdrawHistory,
} from "@/lib/api/history";

// History does not need real-time updates — disable revalidate on focus, 30s dedup
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

export function useTransferHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<TransferHistoryItem[]>(
    ["/api/history/transfers", filters],
    () => fetchTransferHistory(filters),
    HISTORY_SWR_CONFIG
  );
  return { data, isLoading, error };
}

export function useWithdrawHistory(filters: HistoryFilters) {
  const { data, isLoading, error } = useSWR<WithdrawHistoryItem[]>(
    ["/api/history/withdrawals", filters],
    () => fetchWithdrawHistory(filters),
    HISTORY_SWR_CONFIG
  );
  return { data, isLoading, error };
}
