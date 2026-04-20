import { NextResponse } from "next/server";
import type { PerformanceData } from "@/types/mypage";

export async function GET() {
  const today = new Date();
  const pnlChart = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().split("T")[0],
      pnlUsd: Math.round((Math.random() * 8000 - 2000) * 100) / 100,
    };
  });

  const data: PerformanceData = {
    pnlChart,
    exchangePnlBreakdown: [
      { exchangeId: "binance", exchangeName: "Binance", pnlUsd: 12_480.30, pnlPct: 8.8,  rebateUsd: 621.40 },
      { exchangeId: "bybit",   exchangeName: "Bybit",   pnlUsd: 4_210.90,  pnlPct: 4.4,  rebateUsd: 312.88 },
      { exchangeId: "okx",     exchangeName: "OKX",     pnlUsd: -820.15,   pnlPct: -2.5, rebateUsd: 210.44 },
    ],
    totalFeePaidUsd: 3_812.40,
    totalRebateReceivedUsd: 1_144.72,
    estRebateUsd: 286.18,
  };
  return NextResponse.json(data);
}
