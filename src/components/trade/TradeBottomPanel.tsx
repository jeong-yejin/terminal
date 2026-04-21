"use client";

import { useState } from "react";
import { Settings2, Share2 } from "lucide-react";
import type { SharedPosition } from "@/components/trade/CommunityChat";

type TabKey = "positions" | "open-orders" | "order-history" | "position-history" | "asset";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_POSITIONS = [
  { id: "1", symbol: "SOLUSD",  exchange: "binance", side: "Buy/Long",  qty: 666.0, entryPrice: 191.57, marketPrice: 1149.42, liqPrice: 191.57, unrealizedPnl: 1149.42, unrealizedPct: 0.08, unrealizedUsd: 100, realizedPnl: 1149.42, maintMargin: 1149.42 },
  { id: "2", symbol: "SOLUSD",  exchange: "bybit",   side: "Buy/Long",  qty: 666.0, entryPrice: 191.57, marketPrice: 1149.42, liqPrice: 191.57, unrealizedPnl: 1149.42, unrealizedPct: 0.08, unrealizedUsd: 100, realizedPnl: 1149.42, maintMargin: 1149.42 },
];

const MOCK_OPEN_ORDERS = [
  { id: "1", symbol: "BTCUSDT", exchange: "binance", type: "Limit", side: "Buy",  amount: 0.05, price: 88000, filled: 0,   fillPct: 0,   status: "Open", time: "2026-04-21 10:23" },
  { id: "2", symbol: "ETHUSDT", exchange: "bybit",   type: "Limit", side: "Sell", amount: 1.5,  price: 3200,  filled: 0,   fillPct: 0,   status: "Open", time: "2026-04-21 09:15" },
];

const MOCK_ORDER_HISTORY = [
  { id: "1", symbol: "BTCUSDT", exchange: "binance", type: "Market", side: "Buy",  amount: 0.1,  avgPrice: 92006.83, filled: 0.1,  fillPct: 100, status: "Filled", time: "2026-04-21 08:00" },
  { id: "2", symbol: "SOLUSD",  exchange: "bybit",   type: "Limit",  side: "Buy",  amount: 666,  avgPrice: 191.57,   filled: 666,  fillPct: 100, status: "Filled", time: "2026-04-20 15:42" },
  { id: "3", symbol: "ETHUSDT", exchange: "okx",     type: "Limit",  side: "Sell", amount: 2.0,  avgPrice: 3350,     filled: 2.0,  fillPct: 100, status: "Filled", time: "2026-04-20 12:30" },
  { id: "4", symbol: "BTCUSDT", exchange: "binance", type: "Limit",  side: "Sell", amount: 0.05, avgPrice: 93100,    filled: 0.05, fillPct: 100, status: "Filled", time: "2026-04-19 21:07" },
];

const MOCK_POSITION_HISTORY = [
  { id: "1", symbol: "BTCUSDT", exchange: "binance", side: "Buy/Long",   qty: 0.2,  entryPrice: 87500, closePrice: 92000, realizedPnl: 900,  realizedPct: 5.14,  closeTime: "2026-04-21 09:00" },
  { id: "2", symbol: "ETHUSDT", exchange: "bybit",   side: "Sell/Short", qty: 2.0,  entryPrice: 3350,  closePrice: 3100,  realizedPnl: 500,  realizedPct: 7.46,  closeTime: "2026-04-20 18:30" },
  { id: "3", symbol: "SOLUSD",  exchange: "okx",     side: "Buy/Long",   qty: 100,  entryPrice: 145.0, closePrice: 180.0, realizedPnl: 3500, realizedPct: 24.14, closeTime: "2026-04-19 14:20" },
  { id: "4", symbol: "BTCUSDT", exchange: "bybit",   side: "Buy/Long",   qty: 0.1,  entryPrice: 85000, closePrice: 88000, realizedPnl: 300,  realizedPct: 3.53,  closeTime: "2026-04-18 11:45" },
];

const MOCK_ASSETS = [
  { exchange: "binance", label: "Binance", color: "#F0B90B", marginBalance: 12450.30, availableBalance: 10240.50, unrealizedPnl: 1249.42 },
  { exchange: "bybit",   label: "Bybit",   color: "#CAFF5D", marginBalance: 8320.75,  availableBalance: 7100.25,  unrealizedPnl:  832.07 },
  { exchange: "okx",     label: "OKX",     color: "#A855F7", marginBalance: 3200.00,  availableBalance: 2950.00,  unrealizedPnl:    0.00 },
  { exchange: "bitget",  label: "Bitget",  color: "#00E5CC", marginBalance:    0.00,  availableBalance:    0.00,  unrealizedPnl:    0.00 },
];

const EXCHANGE_COLORS: Record<string, string> = {
  binance: "#F0B90B",
  bybit:   "#CAFF5D",
  okx:     "#A855F7",
  bitget:  "#00E5CC",
};

const EXCHANGE_LABELS: Record<string, string> = {
  binance: "Binance",
  bybit:   "Bybit",
  okx:     "OKX",
  bitget:  "Bitget",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CoinBadge({ exchange }: { exchange: string }) {
  const color = EXCHANGE_COLORS[exchange] ?? "#888";
  const letter = (EXCHANGE_LABELS[exchange] ?? exchange)[0].toUpperCase();
  return (
    <span
      className="inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-black"
      style={{ background: color }}
    >
      {letter}
    </span>
  );
}

function fmt(v: number, dec = 2) {
  return v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// TH: left-align by default; add text-right for number cols
const THL = "px-3 py-2 text-left   text-[11px] font-medium text-text-disabled whitespace-nowrap";
const THR = "px-3 py-2 text-right  text-[11px] font-medium text-text-disabled whitespace-nowrap";
// TD: match alignment
const TDL = "px-3 py-0 text-left   text-[11px] h-9 align-middle";
const TDR = "px-3 py-0 text-right  text-[11px] h-9 align-middle tabular-nums";

// ─── Tables ───────────────────────────────────────────────────────────────────

function PositionsTable({ onSharePosition }: { onSharePosition?: (pos: SharedPosition) => void }) {
  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-surface-1">
        <tr className="border-b border-border-subtle">
          <th className={`${THL} pl-4`}>Symbol</th>
          <th className={THL}>Side</th>
          <th className={THR}>Qty</th>
          <th className={THR}>Entry Price</th>
          <th className={THR}>Market Price</th>
          <th className={THR}>Liq. Price</th>
          <th className={THR}>Unrealized P&L(ROI)</th>
          <th className={THR}>Realized P&L(ROI)</th>
          <th className={`${THR} pr-4`}>Maint. Margin</th>
          {onSharePosition && <th className={`${THL} pr-3`}>Share</th>}
        </tr>
      </thead>
      <tbody>
        {MOCK_POSITIONS.map((p) => {
          const isLong = p.side.includes("Long") || p.side.includes("Buy");
          return (
            <tr key={p.id} className="border-b border-border-subtle/40 transition-colors hover:bg-surface-2/60">
              <td className={`${TDL} pl-4`}>
                <div className="flex items-center gap-2">
                  <CoinBadge exchange={p.exchange} />
                  <span className="font-semibold text-text-primary">{p.symbol}</span>
                </div>
              </td>
              <td className={`${TDL} font-medium text-positive`}>{p.side}</td>
              <td className={TDR + " text-text-secondary"}>{fmt(p.qty, 1)}</td>
              <td className={TDR + " text-text-secondary"}>{fmt(p.entryPrice)}</td>
              <td className={TDR + " text-text-secondary"}>{fmt(p.marketPrice)}</td>
              <td className={TDR + " text-cautionary"}>{fmt(p.liqPrice)}</td>
              <td className={TDR}>
                <div className="text-positive">{fmt(p.unrealizedPnl)}({p.unrealizedPct.toFixed(2)}%)</div>
                <div className="text-[10px] text-positive/80">+{fmt(p.unrealizedUsd, 0)} USD</div>
              </td>
              <td className={TDR + " text-text-secondary"}>{fmt(p.realizedPnl)}</td>
              <td className={`${TDR} pr-4 text-text-secondary`}>{fmt(p.maintMargin)}</td>
              {onSharePosition && (
                <td className={`${TDL} pr-3`}>
                  <button
                    onClick={() =>
                      onSharePosition({
                        symbol: p.symbol,
                        side: isLong ? "Long" : "Short",
                        leverage: 10,
                        entryPrice: p.entryPrice,
                        currentPrice: p.marketPrice,
                        unrealizedPnl: p.unrealizedUsd,
                        unrealizedPct: p.unrealizedPct,
                      })
                    }
                    className="flex items-center gap-1 rounded border border-border-subtle bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-secondary transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    <Share2 size={10} />
                    Chat
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function OpenOrdersTable() {
  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-surface-1">
        <tr className="border-b border-border-subtle">
          <th className={`${THL} pl-4`}>Symbol</th>
          <th className={THL}>Type</th>
          <th className={THL}>Side</th>
          <th className={THR}>Amount</th>
          <th className={THR}>Price</th>
          <th className={THR}>Filled</th>
          <th className={THR}>Fill %</th>
          <th className={THL}>Status</th>
          <th className={THL}>Time</th>
          <th className={`${THL} pr-4`}>Action</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_OPEN_ORDERS.map((o) => (
          <tr key={o.id} className="border-b border-border-subtle/40 transition-colors hover:bg-surface-2/60">
            <td className={`${TDL} pl-4`}>
              <div className="flex items-center gap-2">
                <CoinBadge exchange={o.exchange} />
                <span className="font-semibold text-text-primary">{o.symbol}</span>
              </div>
            </td>
            <td className={TDL + " text-text-secondary"}>{o.type}</td>
            <td className={`${TDL} font-medium ${o.side === "Buy" ? "text-positive" : "text-negative"}`}>{o.side}</td>
            <td className={TDR + " text-text-secondary"}>{o.amount}</td>
            <td className={TDR + " text-text-secondary"}>{fmt(o.price)}</td>
            <td className={TDR + " text-text-secondary"}>{o.filled}</td>
            <td className={TDR + " text-text-secondary"}>{o.fillPct}%</td>
            <td className={TDL}>
              <span className="rounded bg-cautionary/10 px-1.5 py-0.5 text-[10px] font-medium text-cautionary">{o.status}</span>
            </td>
            <td className={TDL + " text-text-disabled"}>{o.time}</td>
            <td className={`${TDL} pr-4`}>
              <button className="rounded px-2 py-0.5 text-[10px] font-medium text-negative transition-colors hover:bg-negative/10">
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrderHistoryTable() {
  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-surface-1">
        <tr className="border-b border-border-subtle">
          <th className={`${THL} pl-4`}>Symbol</th>
          <th className={THL}>Type</th>
          <th className={THL}>Side</th>
          <th className={THR}>Amount</th>
          <th className={THR}>Avg Price</th>
          <th className={THR}>Filled</th>
          <th className={THR}>Fill %</th>
          <th className={THL}>Status</th>
          <th className={`${THL} pr-4`}>Time</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_ORDER_HISTORY.map((o) => (
          <tr key={o.id} className="border-b border-border-subtle/40 transition-colors hover:bg-surface-2/60">
            <td className={`${TDL} pl-4`}>
              <div className="flex items-center gap-2">
                <CoinBadge exchange={o.exchange} />
                <span className="font-semibold text-text-primary">{o.symbol}</span>
              </div>
            </td>
            <td className={TDL + " text-text-secondary"}>{o.type}</td>
            <td className={`${TDL} font-medium ${o.side === "Buy" ? "text-positive" : "text-negative"}`}>{o.side}</td>
            <td className={TDR + " text-text-secondary"}>{o.amount}</td>
            <td className={TDR + " text-text-secondary"}>{fmt(o.avgPrice)}</td>
            <td className={TDR + " text-text-secondary"}>{o.filled}</td>
            <td className={TDR + " text-text-secondary"}>{o.fillPct}%</td>
            <td className={TDL}>
              <span className="rounded bg-positive/10 px-1.5 py-0.5 text-[10px] font-medium text-positive">{o.status}</span>
            </td>
            <td className={`${TDL} pr-4 text-text-disabled`}>{o.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PositionHistoryTable() {
  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-surface-1">
        <tr className="border-b border-border-subtle">
          <th className={`${THL} pl-4`}>Symbol</th>
          <th className={THL}>Side</th>
          <th className={THR}>Qty</th>
          <th className={THR}>Entry Price</th>
          <th className={THR}>Close Price</th>
          <th className={THR}>Realized P&L</th>
          <th className={THR}>ROI</th>
          <th className={`${THL} pr-4`}>Close Time</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_POSITION_HISTORY.map((p) => (
          <tr key={p.id} className="border-b border-border-subtle/40 transition-colors hover:bg-surface-2/60">
            <td className={`${TDL} pl-4`}>
              <div className="flex items-center gap-2">
                <CoinBadge exchange={p.exchange} />
                <span className="font-semibold text-text-primary">{p.symbol}</span>
              </div>
            </td>
            <td className={`${TDL} font-medium ${p.side.includes("Buy") ? "text-positive" : "text-negative"}`}>{p.side}</td>
            <td className={TDR + " text-text-secondary"}>{p.qty}</td>
            <td className={TDR + " text-text-secondary"}>{fmt(p.entryPrice)}</td>
            <td className={TDR + " text-text-secondary"}>{fmt(p.closePrice)}</td>
            <td className={`${TDR} font-medium ${p.realizedPnl >= 0 ? "text-positive" : "text-negative"}`}>
              {p.realizedPnl >= 0 ? "+" : ""}{fmt(p.realizedPnl)}
            </td>
            <td className={p.realizedPct >= 0 ? TDR + " text-positive" : TDR + " text-negative"}>
              {p.realizedPct >= 0 ? "+" : ""}{p.realizedPct.toFixed(2)}%
            </td>
            <td className={`${TDL} pr-4 text-text-disabled`}>{p.closeTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AssetTable() {
  const total          = MOCK_ASSETS.reduce((s, a) => s + a.marginBalance, 0);
  const totalAvail     = MOCK_ASSETS.reduce((s, a) => s + a.availableBalance, 0);
  const totalUnreal    = MOCK_ASSETS.reduce((s, a) => s + a.unrealizedPnl, 0);

  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-surface-1">
        <tr className="border-b border-border-subtle">
          <th className={`${THL} pl-4`}>Exchange</th>
          <th className={THR}>Margin Balance</th>
          <th className={THR}>Available Balance</th>
          <th className={THR}>Unrealized P&L</th>
          <th className={`${THR} pr-4`}>Total Equity</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_ASSETS.map((a) => (
          <tr key={a.exchange} className="border-b border-border-subtle/40 transition-colors hover:bg-surface-2/60">
            <td className={`${TDL} pl-4`}>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-black"
                  style={{ background: a.color }}
                >
                  {a.label[0]}
                </span>
                <span className="font-semibold text-text-primary">{a.label}</span>
              </div>
            </td>
            <td className={TDR + " text-text-secondary"}>{fmt(a.marginBalance)} USDT</td>
            <td className={TDR + " text-text-secondary"}>{fmt(a.availableBalance)} USDT</td>
            <td className={a.unrealizedPnl >= 0 ? TDR + " text-positive" : TDR + " text-negative"}>
              {a.unrealizedPnl > 0 ? "+" : ""}{fmt(a.unrealizedPnl)} USDT
            </td>
            <td className={`${TDR} pr-4 font-medium text-text-primary`}>
              {fmt(a.marginBalance + a.unrealizedPnl)} USDT
            </td>
          </tr>
        ))}
        <tr className="border-b border-border-subtle/40 bg-surface-2/30">
          <td className={`${TDL} pl-4 font-semibold text-text-primary`}>Total</td>
          <td className={TDR + " font-semibold text-text-primary"}>{fmt(total)} USDT</td>
          <td className={TDR + " font-semibold text-text-primary"}>{fmt(totalAvail)} USDT</td>
          <td className={TDR + " font-semibold text-positive"}>+{fmt(totalUnreal)} USDT</td>
          <td className={`${TDR} pr-4 font-semibold text-text-primary`}>{fmt(total + totalUnreal)} USDT</td>
        </tr>
      </tbody>
    </table>
  );
}

// ─── TradeBottomPanel ─────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; count?: number }[] = [
  { key: "positions",        label: "Positions",        count: MOCK_POSITIONS.length },
  { key: "open-orders",      label: "Open Orders",      count: MOCK_OPEN_ORDERS.length },
  { key: "order-history",    label: "Order History" },
  { key: "position-history", label: "Position history" },
  { key: "asset",            label: "Asset" },
];

export function TradeBottomPanel({ onSharePosition }: { onSharePosition?: (pos: SharedPosition) => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>("positions");

  return (
    <div className="flex h-[220px] flex-shrink-0 flex-col border-t border-border-subtle bg-surface-1">

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div className="flex h-10 flex-shrink-0 items-center gap-3 border-b border-border-subtle px-3">
        {/* Segmented tabs */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-2 p-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-3 py-1 text-[11px] font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-surface-3 text-text-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={activeTab === t.key ? "text-primary" : "text-text-disabled"}>
                  ({t.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {activeTab === "positions" && (
            <button className="h-6 rounded border border-border-subtle bg-surface-2 px-2.5 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
              Close All Position
            </button>
          )}
          {activeTab === "open-orders" && (
            <button className="h-6 rounded border border-border-subtle bg-surface-2 px-2.5 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
              Cancel All Order
            </button>
          )}
          <button className="flex h-6 w-6 items-center justify-center rounded text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary">
            <Settings2 size={13} />
          </button>
        </div>
      </div>

      {/* ── Scrollable table ─────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-auto">
        {activeTab === "positions"        && <PositionsTable onSharePosition={onSharePosition} />}
        {activeTab === "open-orders"      && <OpenOrdersTable />}
        {activeTab === "order-history"    && <OrderHistoryTable />}
        {activeTab === "position-history" && <PositionHistoryTable />}
        {activeTab === "asset"            && <AssetTable />}
      </div>
    </div>
  );
}
