import { NextResponse } from "next/server";
import type { ExchangeConnection } from "@/types/mypage";

export async function GET() {
  const data: ExchangeConnection[] = [
    {
      id: "binance",
      name: "Binance",
      logoUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
      status: "connected",
      connectedAt: "2024-11-10T08:30:00Z",
      apiKeyMasked: "****xK9m",
    },
    {
      id: "bybit",
      name: "Bybit",
      logoUrl: "https://cryptologos.cc/logos/bybit-logo.png",
      status: "connected",
      connectedAt: "2025-01-05T14:15:00Z",
      apiKeyMasked: "****rT2p",
    },
    {
      id: "okx",
      name: "OKX",
      logoUrl: "https://cryptologos.cc/logos/okb-okb-logo.png",
      status: "error",
      connectedAt: "2025-02-18T09:00:00Z",
      apiKeyMasked: "****vB7n",
    },
  ];
  return NextResponse.json(data);
}
