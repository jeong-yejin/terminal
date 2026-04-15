import { NextResponse } from "next/server";
import type { WithdrawHistoryItem } from "@/types/mypage";

export async function GET() {
  const data: WithdrawHistoryItem[] = [
    {
      id: "w1",
      exchangeId: "binance",
      asset: "USDT",
      amount: 30_000,
      toAddress: "0xabc1...def2",
      network: "TRC20",
      status: "completed",
      txHash: "0x3cc8...a11e",
      createdAt: "2025-04-11T12:00:00Z",
    },
    {
      id: "w2",
      exchangeId: "bybit",
      asset: "BTC",
      amount: 0.1,
      toAddress: "bc1q...xyz9",
      network: "BTC",
      status: "completed",
      txHash: "2a8f...b3d7",
      createdAt: "2025-04-09T08:45:00Z",
    },
    {
      id: "w3",
      exchangeId: "okx",
      asset: "ETH",
      amount: 1.5,
      toAddress: "0x9fe2...7731",
      network: "ERC20",
      status: "pending",
      txHash: undefined,
      createdAt: "2025-04-14T16:20:00Z",
    },
  ];
  return NextResponse.json(data);
}
