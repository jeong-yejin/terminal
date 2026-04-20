import { NextResponse } from "next/server";
import type { OrderHistoryItem } from "@/types/mypage";

export async function GET() {
  const data: OrderHistoryItem[] = [
    { id: "o1", exchangeId: "binance", symbol: "BTC/USDT", side: "buy",  price: 62_450.00, quantity: 0.05, status: "filled",    marketType: "spot",    createdAt: "2025-04-14T10:22:00Z" },
    { id: "o2", exchangeId: "bybit",   symbol: "ETH/USDT", side: "sell", price: 1_825.30,  quantity: 1.2,  status: "filled",    marketType: "spot",    createdAt: "2025-04-14T09:15:00Z" },
    { id: "o3", exchangeId: "binance", symbol: "SOL/USDT", side: "buy",  price: 150.40,    quantity: 20,   status: "cancelled", marketType: "futures", createdAt: "2025-04-13T18:44:00Z" },
    { id: "o4", exchangeId: "okx",     symbol: "BNB/USDT", side: "sell", price: 548.20,    quantity: 5,    status: "filled",    marketType: "spot",    createdAt: "2025-04-13T14:10:00Z" },
    { id: "o5", exchangeId: "bybit",   symbol: "BTC/USDT", side: "buy",  price: 62_100.00, quantity: 0.03, status: "partial",   marketType: "futures", createdAt: "2025-04-12T22:05:00Z" },
    { id: "o6", exchangeId: "binance", symbol: "ETH/USDT", side: "buy",  price: 1_820.00,  quantity: 2.5,  status: "filled",    marketType: "futures", createdAt: "2025-04-12T11:30:00Z" },
  ];
  return NextResponse.json(data);
}
