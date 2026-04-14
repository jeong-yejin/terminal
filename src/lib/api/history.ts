import type {
  HistoryFilters,
  OrderHistoryItem,
  TradeHistoryItem,
  PositionHistoryItem,
  DepositHistoryItem,
} from "@/types/mypage";

function buildQuery(filters: HistoryFilters): string {
  const params = new URLSearchParams();
  if (filters.exchangeId && filters.exchangeId !== "all") params.set("exchangeId", filters.exchangeId);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchOrderHistory(filters: HistoryFilters): Promise<OrderHistoryItem[]> {
  const res = await fetch(`/api/history/orders${buildQuery(filters)}`);
  if (!res.ok) throw new Error("Failed to fetch order history");
  return res.json();
}

export async function fetchTradeHistory(filters: HistoryFilters): Promise<TradeHistoryItem[]> {
  const res = await fetch(`/api/history/trades${buildQuery(filters)}`);
  if (!res.ok) throw new Error("Failed to fetch trade history");
  return res.json();
}

export async function fetchPositionHistory(filters: HistoryFilters): Promise<PositionHistoryItem[]> {
  const res = await fetch(`/api/history/positions${buildQuery(filters)}`);
  if (!res.ok) throw new Error("Failed to fetch position history");
  return res.json();
}

export async function fetchDepositHistory(filters: HistoryFilters): Promise<DepositHistoryItem[]> {
  const res = await fetch(`/api/history/deposits${buildQuery(filters)}`);
  if (!res.ok) throw new Error("Failed to fetch deposit history");
  return res.json();
}
