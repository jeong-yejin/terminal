import { NextResponse } from "next/server";
import type { OverviewData } from "@/types/mypage";

export async function GET() {
  const data: OverviewData = {
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
  };
  return NextResponse.json(data);
}
