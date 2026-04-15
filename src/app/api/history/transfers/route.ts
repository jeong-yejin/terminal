import { NextResponse } from "next/server";
import type { TransferHistoryItem } from "@/types/mypage";

export async function GET() {
  const data: TransferHistoryItem[] = [
    {
      id: "t1",
      exchangeId: "binance",
      asset: "USDT",
      amount: 10_000,
      fromAccount: "funding",
      toAccount: "trading",
      status: "completed",
      createdAt: "2025-04-12T10:00:00Z",
    },
    {
      id: "t2",
      exchangeId: "bybit",
      asset: "USDT",
      amount: 5_000,
      fromAccount: "trading",
      toAccount: "funding",
      status: "completed",
      createdAt: "2025-04-10T15:30:00Z",
    },
    {
      id: "t3",
      exchangeId: "okx",
      asset: "BTC",
      amount: 0.05,
      fromAccount: "funding",
      toAccount: "trading",
      status: "pending",
      createdAt: "2025-04-14T09:00:00Z",
    },
  ];
  return NextResponse.json(data);
}
