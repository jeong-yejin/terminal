import useSWR from "swr";
import type { ExchangeConnection } from "@/types/mypage";
import { fetchExchanges } from "@/lib/api/exchanges";

export function useExchanges() {
  const { data, isLoading, error, mutate } = useSWR<ExchangeConnection[]>(
    "/api/mypage/exchanges",
    fetchExchanges,
    { revalidateOnFocus: false }
  );
  return { data, isLoading, error, refetch: mutate };
}
