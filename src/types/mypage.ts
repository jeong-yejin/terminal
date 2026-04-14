// ─── 공통 타입 ────────────────────────────────────────────────────────────────

export type ExchangeId = "binance" | "bybit" | "okx" | "bitget" | string;

export type ExchangeStatus = "connected" | "disconnected" | "error";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

// ─── Overview ─────────────────────────────────────────────────────────────────

export interface AssetSummary {
  totalAssetUsd: number;
  availableBalanceUsd: number;
  usedMarginUsd: number;
  pnl24hUsd: number;
  pnl24hPct: number;
  openPositionsCount: number;
  fundingTotalUsd: number;
  tradingTotalUsd: number;
}

export interface ConnectedExchange {
  id: ExchangeId;
  name: string;
  logoUrl: string;
  status: ExchangeStatus;
  totalUsd: number;
}

export interface OverviewData {
  summary: AssetSummary;
  connectedExchanges: ConnectedExchange[];
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export interface AssetPair {
  symbol: string;
  quantity: number;
  valueUsd: number;
}

export interface ExchangeAsset {
  exchangeId: ExchangeId;
  exchangeName: string;
  fundingAccount: AssetPair[];
  tradingAccount: AssetPair[];
  fundingTotalUsd: number;
  tradingTotalUsd: number;
}

// ─── History ──────────────────────────────────────────────────────────────────

export type OrderSide = "buy" | "sell";
export type OrderStatus = "filled" | "cancelled" | "partial";
export type PositionSide = "long" | "short";

export interface OrderHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  status: OrderStatus;
  createdAt: string; // ISO 8601
}

export interface TradeHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  fee: number;
  executedAt: string;
}

export interface PositionHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  realizedPnlUsd: number;
  estRebateUsd: number;
  closedAt: string;
}

export type DepositStatus = "pending" | "completed" | "failed";

export interface DepositHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  asset: string;
  amount: number;
  status: DepositStatus;
  txHash?: string;
  createdAt: string;
}

export interface HistoryFilters {
  exchangeId?: ExchangeId | "all";
  startDate?: string;
  endDate?: string;
}

// ─── Performance ──────────────────────────────────────────────────────────────

export interface PnlDataPoint {
  date: string;
  pnlUsd: number;
}

export interface ExchangePnlBreakdown {
  exchangeId: ExchangeId;
  exchangeName: string;
  pnlUsd: number;
  pnlPct: number;
}

export interface PerformanceData {
  pnlChart: PnlDataPoint[];
  exchangePnlBreakdown: ExchangePnlBreakdown[];
  totalFeePaidUsd: number;
  totalRebateReceivedUsd: number;
  estRebateUsd: number;
}

// ─── Exchanges ────────────────────────────────────────────────────────────────

export interface ExchangeConnection {
  id: ExchangeId;
  name: string;
  logoUrl: string;
  status: ExchangeStatus;
  connectedAt: string;
  apiKeyMasked: string;
}
