// ─── Common Types ─────────────────────────────────────────────────────────────

export type ExchangeId = "binance" | "bybit" | "okx" | "bitget" | string;

export type ExchangeStatus = "connected" | "disconnected" | "error";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpForNext: number;
  rank: number | null;
  followers: number;
  following: number;
  posts: number;
  isReferral: boolean;
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

export interface OpenPosition {
  id: string;
  exchangeId: ExchangeId;
  symbol: string;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  marketPrice: number;
  liqPrice: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPct: number;
  unrealizedBaseUsd: number;
  realizedPnlUsd: number;
}

export interface OverviewData {
  summary: AssetSummary;
  connectedExchanges: ConnectedExchange[];
  /** Last 14 days balance history (for sparkline) */
  balanceHistory?: BalanceDataPoint[];
  openPositions?: OpenPosition[];
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export type MarketType = "spot" | "futures";

export interface AssetPair {
  symbol: string;
  quantity: number;
  valueUsd: number;
  /** 24-hour price change rate (%) — only present if API supports it */
  changePct24h?: number;
}

/** Futures account only — margin + unrealized P&L */
export interface FuturesAssetPair extends AssetPair {
  /** Unrealized P&L (USD) */
  unrealizedPnlUsd?: number;
  /** Margin type */
  marginType?: "cross" | "isolated";
}

export interface ExchangeAsset {
  exchangeId: ExchangeId;
  exchangeName: string;
  /** Funding account balance */
  fundingAccount: AssetPair[];
  fundingTotalUsd: number;
  /** Spot trading balance — may not exist depending on exchange */
  spotAccount?: AssetPair[];
  spotTotalUsd?: number;
  /** Futures (Perp) margin balance — may not exist depending on exchange */
  futuresAccount?: FuturesAssetPair[];
  futuresTotalUsd?: number;
  /** Exchange API connection status */
  status?: ExchangeStatus;
  /** Last sync time (ISO 8601) */
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
  marketType: MarketType;
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
  marketType: MarketType;
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

export type AccountType = "funding" | "spot" | "futures";

/** Internal transfer history between accounts (Funding ↔ Spot ↔ Futures) */
export interface TransferHistoryItem {
  id: string;
  exchangeId: ExchangeId;
  asset: string;
  amount: number;
  fromAccount: AccountType;
  toAccount: AccountType;
  status: TransactionStatus;
  createdAt: string;
}

/**
 * Withdrawal history — Terminal does not provide withdrawal functionality;
 * only records executed on the exchange can be viewed
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
  /** Trade History only — spot / futures / all */
  marketType?: MarketType | "all";
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
  /** Estimated fee rebate earned on this exchange (USD) */
  rebateUsd?: number;
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
  /** Exchange account UID */
  uid?: string;
}
