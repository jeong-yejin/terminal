import useSWR from "swr";
import type { OverviewData } from "@/types/mypage";
import { fetchOverview } from "@/lib/api/mypage";

export function useOverview() {
  const { data, error, isLoading, mutate } = useSWR<OverviewData>(
    "/api/mypage/overview",
    fetchOverview,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    error,
    refetch: mutate,
  };
}
