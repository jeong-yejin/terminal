import useSWR from "swr";
import type { UserProfile } from "@/types/mypage";

async function fetchUser(): Promise<UserProfile> {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export function useUser() {
  return useSWR<UserProfile>("/api/user", fetchUser, { revalidateOnFocus: false });
}
