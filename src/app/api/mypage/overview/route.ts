import { NextResponse } from "next/server";
import type { OverviewData } from "@/types/mypage";

export async function GET() {
  const data: OverviewData = {
    openPositions: [
      {
        id: "pos-1",
        exchangeId: "bybit",
        symbol: "SOLUSD",
        side: "long",
        quantity: 666.0,
        entryPrice: 191.57,
        marketPrice: 1149.42,
        liqPrice: 191.57,
        unrealizedPnlUsd: 1149.42,
        unrealizedPnlPct: 0.08,
        unrealizedBaseUsd: 100,
        realizedPnlUsd: 1149.42,
      },
      {
        id: "pos-2",
        exchangeId: "binance",
        symbol: "SOLUSD",
        side: "long",
        quantity: 666.0,
        entryPrice: 191.57,
        marketPrice: 1149.42,
        liqPrice: 191.57,
        unrealizedPnlUsd: 1149.42,
        unrealizedPnlPct: 0.08,
        unrealizedBaseUsd: 100,
        realizedPnlUsd: 1149.42,
      },
    ],
    summary: {
      totalAssetUsd: 284_510.42,
      availableBalanceUsd: 91_230.18,
      usedMarginUsd: 47_800.00,
      pnl24hUsd: 3_812.55,
      pnl24hPct: 1.36,
      openPositionsCount: 6,
      fundingTotalUsd: 138_920.10,
      tradingTotalUsd: 145_590.32,
    },
    connectedExchanges: [
      {
        id: "binance",
        name: "Binance",
        logoUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
        status: "connected",
        totalUsd: 154_230.88,
      },
      {
        id: "bybit",
        name: "Bybit",
        logoUrl: "https://cryptologos.cc/logos/bybit-logo.png",
        status: "connected",
        totalUsd: 98_740.20,
      },
      {
        id: "okx",
        name: "OKX",
        logoUrl: "https://cryptologos.cc/logos/okb-okb-logo.png",
        status: "error",
        totalUsd: 31_539.34,
      },
    ],
    balanceHistory: [
      { date: "2025-04-01", totalUsd: 261_000 },
      { date: "2025-04-02", totalUsd: 265_800 },
      { date: "2025-04-03", totalUsd: 259_200 },
      { date: "2025-04-04", totalUsd: 271_500 },
      { date: "2025-04-05", totalUsd: 269_000 },
      { date: "2025-04-06", totalUsd: 274_800 },
      { date: "2025-04-07", totalUsd: 278_200 },
      { date: "2025-04-08", totalUsd: 272_600 },
      { date: "2025-04-09", totalUsd: 265_400 },
      { date: "2025-04-10", totalUsd: 268_900 },
      { date: "2025-04-11", totalUsd: 275_100 },
      { date: "2025-04-12", totalUsd: 279_500 },
      { date: "2025-04-13", totalUsd: 281_200 },
      { date: "2025-04-14", totalUsd: 284_510 },
    ],
  };
  return NextResponse.json(data);
}
