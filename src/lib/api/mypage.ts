import type { OverviewData } from "@/types/mypage";

export async function fetchOverview(): Promise<OverviewData> {
  const res = await fetch("/api/mypage/overview");
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}
