export type ExchangeKey = "BINANCE" | "BYBIT" | "OKX" | "BITGET";

export interface ExchangeMeta {
  id: ExchangeKey;
  label: string;
  color: string;
}

export const EXCHANGES: ExchangeMeta[] = [
  { id: "BINANCE", label: "Binance", color: "#F0B90B" },
  { id: "BYBIT",   label: "Bybit",   color: "#CAFF5D" },
  { id: "OKX",     label: "OKX",     color: "#A855F7" },
  { id: "BITGET",  label: "Bitget",  color: "#00C9A7" },
];

export interface SymbolMeta {
  base: string;
  quote: string;
  label: string;
  tv: string; // TradingView symbol suffix, e.g. "BTCUSDT"
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  vol24h: number;
  fundingRate: number;
}

export const SYMBOLS: SymbolMeta[] = [
  {
    base: "BTC", quote: "USDT", label: "BTC/USDT", tv: "BTCUSDT",
    price: 69_234.50, change24h: 2.34, high24h: 70_120.00, low24h: 67_890.00,
    vol24h: 1_248_700_000, fundingRate: 0.0100,
  },
  {
    base: "ETH", quote: "USDT", label: "ETH/USDT", tv: "ETHUSDT",
    price: 3_782.20, change24h: -1.12, high24h: 3_850.00, low24h: 3_710.00,
    vol24h: 642_000_000, fundingRate: 0.0082,
  },
  {
    base: "SOL", quote: "USDT", label: "SOL/USDT", tv: "SOLUSDT",
    price: 178.44, change24h: 4.21, high24h: 181.00, low24h: 170.50,
    vol24h: 198_000_000, fundingRate: 0.0125,
  },
  {
    base: "BNB", quote: "USDT", label: "BNB/USDT", tv: "BNBUSDT",
    price: 594.80, change24h: 1.05, high24h: 601.00, low24h: 586.00,
    vol24h: 87_000_000, fundingRate: 0.0098,
  },
  {
    base: "XRP", quote: "USDT", label: "XRP/USDT", tv: "XRPUSDT",
    price: 0.5842, change24h: -0.73, high24h: 0.5980, low24h: 0.5720,
    vol24h: 312_000_000, fundingRate: 0.0075,
  },
];

export const INTERVALS = [
  { label: "1m",  value: "1"  },
  { label: "5m",  value: "5"  },
  { label: "15m", value: "15" },
  { label: "1H",  value: "60" },
  { label: "4H",  value: "240"},
  { label: "1D",  value: "D"  },
] as const;

export type IntervalValue = (typeof INTERVALS)[number]["value"];
