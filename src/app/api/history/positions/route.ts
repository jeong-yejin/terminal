import { NextResponse } from "next/server";
import type { PositionHistoryItem } from "@/types/mypage";

export async function GET() {
  const data: PositionHistoryItem[] = [
    { id: "p1", exchangeId: "binance", symbol: "BTC/USDT", side: "long",  entryPrice: 60_200, exitPrice: 62_450, quantity: 0.1, realizedPnlUsd:  225.00, estRebateUsd: 1.12, closedAt: "2025-04-14T10:22:00Z" },
    { id: "p2", exchangeId: "bybit",   symbol: "ETH/USDT", side: "short", entryPrice:  1_870, exitPrice:  1_825, quantity: 2.0, realizedPnlUsd:   90.00, estRebateUsd: 0.87, closedAt: "2025-04-13T22:10:00Z" },
    { id: "p3", exchangeId: "binance", symbol: "SOL/USDT", side: "long",  entryPrice:    155, exitPrice:    148, quantity:  30, realizedPnlUsd: -210.00, estRebateUsd: 0.63, closedAt: "2025-04-13T14:05:00Z" },
    { id: "p4", exchangeId: "okx",     symbol: "BNB/USDT", side: "long",  entryPrice:    520, exitPrice:    548, quantity:   8, realizedPnlUsd:  224.00, estRebateUsd: 1.40, closedAt: "2025-04-12T09:30:00Z" },
    { id: "p5", exchangeId: "bybit",   symbol: "BTC/USDT", side: "short", entryPrice: 64_000, exitPrice: 63_100, quantity: 0.05,realizedPnlUsd:   45.00, estRebateUsd: 0.55, closedAt: "2025-04-11T16:44:00Z" },
  ];
  return NextResponse.json(data);
}
