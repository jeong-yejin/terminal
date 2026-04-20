import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import type { ExchangeAsset } from "@/types/mypage";

export async function GET(req: NextRequest) {
  const exchangeId = req.nextUrl.searchParams.get("exchangeId");
  const all: ExchangeAsset[] = [
    {
      exchangeId: "binance",
      exchangeName: "Binance",
      fundingTotalUsd: 78_420.50,
      spotTotalUsd: 55_400.00 + 13_125.00 + 7_285.38,
      futuresTotalUsd: 12_480.00,
      fundingAccount: [
        { symbol: "USDT", quantity: 68_200, valueUsd: 68_200.00 },
        { symbol: "BTC", quantity: 0.125, valueUsd: 7_812.50 },
        { symbol: "ETH", quantity: 1.32, valueUsd: 2_408.00 },
      ],
      spotAccount: [
        { symbol: "USDT", quantity: 55_400, valueUsd: 55_400.00 },
        { symbol: "BTC", quantity: 0.21, valueUsd: 13_125.00 },
        { symbol: "SOL", quantity: 48.5, valueUsd: 7_285.38 },
      ],
      futuresAccount: [
        { symbol: "BTCUSDT", quantity: 0.1, valueUsd: 6_250.00, unrealizedPnlUsd: 320.50, marginType: "cross" },
        { symbol: "ETHUSDT", quantity: 2.0, valueUsd: 6_230.00, unrealizedPnlUsd: -84.20, marginType: "isolated" },
      ],
    },
    {
      exchangeId: "bybit",
      exchangeName: "Bybit",
      fundingTotalUsd: 38_100.00,
      spotTotalUsd: 44_000.00 + 12_980.20 + 3_660.00,
      futuresTotalUsd: 0,
      fundingAccount: [
        { symbol: "USDT", quantity: 32_000, valueUsd: 32_000.00 },
        { symbol: "ETH", quantity: 3.34, valueUsd: 6_100.00 },
      ],
      spotAccount: [
        { symbol: "USDT", quantity: 44_000, valueUsd: 44_000.00 },
        { symbol: "BNB", quantity: 23.6, valueUsd: 12_980.20 },
        { symbol: "SOL", quantity: 25, valueUsd: 3_660.00 },
      ],
      futuresAccount: [],
    },
    {
      exchangeId: "okx",
      exchangeName: "OKX",
      fundingTotalUsd: 22_400.00,
      spotTotalUsd: 5_200.00 + 3_939.34,
      futuresTotalUsd: 0,
      fundingAccount: [
        { symbol: "USDT", quantity: 22_400, valueUsd: 22_400.00 },
      ],
      spotAccount: [
        { symbol: "USDT", quantity: 5_200, valueUsd: 5_200.00 },
        { symbol: "BTC", quantity: 0.062, valueUsd: 3_939.34 },
      ],
      futuresAccount: [],
    },
  ];
  const data = exchangeId ? all.filter((e) => e.exchangeId === exchangeId) : all;
  return NextResponse.json(data);
}
