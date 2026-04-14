import type { ExchangeAsset } from "@/types/mypage";

export async function fetchAssets(exchangeId: string): Promise<ExchangeAsset[]> {
  const params = exchangeId !== "all" ? `?exchangeId=${exchangeId}` : "";
  const res = await fetch(`/api/mypage/assets${params}`);
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
}
