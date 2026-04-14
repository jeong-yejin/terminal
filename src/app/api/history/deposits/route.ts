import { NextResponse } from "next/server";
import type { DepositHistoryItem } from "@/types/mypage";

export async function GET() {
  const data: DepositHistoryItem[] = [
    { id: "d1", exchangeId: "binance", asset: "USDT", amount: 50_000, status: "completed", txHash: "0x4fa2...c81b", createdAt: "2025-04-10T08:00:00Z" },
    { id: "d2", exchangeId: "bybit",   asset: "USDT", amount: 20_000, status: "completed", txHash: "0x8bc1...3a2f", createdAt: "2025-04-08T14:22:00Z" },
    { id: "d3", exchangeId: "okx",     asset: "BTC",  amount: 0.15,   status: "completed", txHash: "0x1de9...77fa", createdAt: "2025-04-05T11:10:00Z" },
    { id: "d4", exchangeId: "binance", asset: "ETH",  amount: 2.0,    status: "pending",   txHash: "0x9af4...02cc", createdAt: "2025-04-14T07:55:00Z" },
    { id: "d5", exchangeId: "bybit",   asset: "USDT", amount: 5_000,  status: "failed",    txHash: undefined,       createdAt: "2025-04-13T19:30:00Z" },
  ];
  return NextResponse.json(data);
}
