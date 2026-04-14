import { NextResponse } from "next/server";
import type { TradeHistoryItem } from "@/types/mypage";

export async function GET() {
  const data: TradeHistoryItem[] = [
    { id: "t1", exchangeId: "binance", symbol: "BTC/USDT", side: "buy",  price: 62_450.00, quantity: 0.05, fee: 3.12,  executedAt: "2025-04-14T10:22:05Z" },
    { id: "t2", exchangeId: "bybit",   symbol: "ETH/USDT", side: "sell", price: 1_825.30,  quantity: 1.2,  fee: 2.19,  executedAt: "2025-04-14T09:15:10Z" },
    { id: "t3", exchangeId: "okx",     symbol: "BNB/USDT", side: "sell", price: 548.20,    quantity: 5,    fee: 2.74,  executedAt: "2025-04-13T14:10:08Z" },
    { id: "t4", exchangeId: "binance", symbol: "ETH/USDT", side: "buy",  price: 1_820.00,  quantity: 2.5,  fee: 4.55,  executedAt: "2025-04-12T11:30:12Z" },
    { id: "t5", exchangeId: "bybit",   symbol: "BTC/USDT", side: "sell", price: 63_100.00, quantity: 0.08, fee: 5.05,  executedAt: "2025-04-11T16:44:20Z" },
  ];
  return NextResponse.json(data);
}
