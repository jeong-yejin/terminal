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

export interface BalanceDataPoint {
  date: string;  // ISO date "YYYY-MM-DD"
  totalUsd: number;
}

export interface OverviewData {
  summary: AssetSummary;
  connectedExchanges: ConnectedExchange[];
  /** 최근 14일 잔고 히스토리 (sparkline용) */
  balanceHistory?: BalanceDataPoint[];
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export interface AssetPair {
  symbol: string;
  quantity: number;
  valueUsd: number;
  /** 24시간 가격 변동률 (%) — API가 지원하는 경우에만 존재 */
  changePct24h?: number;
}

export interface ExchangeAsset {
  exchangeId: ExchangeId;
  exchangeName: string;
  fundingAccount: AssetPair[];
  tradingAccount: AssetPair[];
  fundingTotalUsd: number;
  tradingTotalUsd: number;
  /** 거래소 API 연결 상태 */
  status?: ExchangeStatus;
  /** 마지막 동기화 시각 (ISO 8601) */
  lastSyncedAt?: string;
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

export type TransactionStatus = "pending" | "completed" | "failed";
export type DepositStatus = TransactionStatus;

export interface DepositHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  asset: string;
  amount: number;
  status: TransactionStatus;
  txHash?: string;
  createdAt: string;
}

/** Funding ↔ Trading 계좌 간 내부 이체 내역 */
export interface TransferHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  asset: string;
  amount: number;
  fromAccount: "funding" | "trading";
  toAccount: "funding" | "trading";
  status: TransactionStatus;
  createdAt: string;
}

/**
 * 출금 내역 — 터미널에서 출금 기능은 제공하지 않으며, 거래소에서 실행된 내역만 열람 가능
 */
export interface WithdrawHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  asset: string;
  amount: number;
  toAddress: string;
  network?: string;
  status: TransactionStatus;
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
  /** 거래소 계정 UID */
  uid?: string;
}
