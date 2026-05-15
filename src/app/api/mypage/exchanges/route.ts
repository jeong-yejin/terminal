import { NextResponse } from "next/server";
import type { ExchangeConnection } from "@/types/mypage";

export async function GET() {
  const data: ExchangeConnection[] = [
    {
      id: "binance",
      name: "Binance",
      logoUrl: "/logos/binance.svg",
      status: "connected",
      connectedAt: "2024-11-10T08:30:00Z",
      apiKeyMasked: "****xK9m",
      uid: "382940571",
    },
    {
      id: "bybit",
      name: "Bybit",
      logoUrl: "/logos/bybit.svg",
      status: "connected",
      connectedAt: "2025-01-05T14:15:00Z",
      apiKeyMasked: "****rT2p",
      uid: "910284736",
    },
    {
      id: "okx",
      name: "OKX",
      logoUrl: "/logos/okx.svg",
      status: "error",
      connectedAt: "2025-02-18T09:00:00Z",
      apiKeyMasked: "****vB7n",
      uid: "74820193",
    },
  ];
  return NextResponse.json(data);
}

const EXCHANGE_META: Record<string, { name: string; logoUrl: string }> = {
  binance: { name: "Binance", logoUrl: "/logos/binance.svg" },
  bybit:   { name: "Bybit",   logoUrl: "/logos/bybit.svg" },
  okx:     { name: "OKX",     logoUrl: "/logos/okx.svg" },
  bitget:  { name: "Bitget",  logoUrl: "https://cryptologos.cc/logos/bitget-token-bgb-logo.png" },
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { exchangeId, apiKey, apiSecret } = body as Record<string, string>;

  if (!exchangeId || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "exchangeId, apiKey, and apiSecret are required" },
      { status: 400 }
    );
  }

  const meta = EXCHANGE_META[exchangeId] ?? {
    name: exchangeId,
    logoUrl: "",
  };

  const newExchange: ExchangeConnection = {
    id: exchangeId,
    name: meta.name,
    logoUrl: meta.logoUrl,
    status: "connected",
    connectedAt: new Date().toISOString(),
    apiKeyMasked: `****${apiKey.slice(-4)}`,
  };

  return NextResponse.json(newExchange, { status: 201 });
}
