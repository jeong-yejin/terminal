import type { PerformanceData } from "@/types/mypage";

export async function fetchPerformance(): Promise<PerformanceData> {
  const res = await fetch("/api/mypage/performance");
  if (!res.ok) throw new Error("Failed to fetch performance");
  return res.json();
}
