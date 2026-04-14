import useSWR from "swr";
import type { PerformanceData } from "@/types/mypage";
import { fetchPerformance } from "@/lib/api/performance";

export function usePerformance() {
  const { data, isLoading, error } = useSWR<PerformanceData>(
    "/api/mypage/performance",
    fetchPerformance,
    { revalidateOnFocus: false }
  );
  return { data, isLoading, error };
}
