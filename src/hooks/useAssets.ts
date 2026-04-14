import useSWR from "swr";
import type { ExchangeAsset } from "@/types/mypage";
import { fetchAssets } from "@/lib/api/assets";

export function useAssets(exchangeId: string) {
  const { data, error, isLoading } = useSWR<ExchangeAsset[]>(
    ["/api/mypage/assets", exchangeId],
    () => fetchAssets(exchangeId),
    { revalidateOnFocus: false }
  );

  return { data, isLoading, error };
}
