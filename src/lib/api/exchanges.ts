import type { ExchangeConnection } from "@/types/mypage";

export async function fetchExchanges(): Promise<ExchangeConnection[]> {
  const res = await fetch("/api/mypage/exchanges");
  if (!res.ok) throw new Error("Failed to fetch exchanges");
  return res.json();
}

export async function disconnectExchange(exchangeId: string): Promise<void> {
  const res = await fetch(`/api/mypage/exchanges/${exchangeId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to disconnect exchange");
}

export async function connectExchange(exchangeId: string): Promise<void> {
  const res = await fetch("/api/mypage/exchanges/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exchangeId }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? "Failed to connect exchange");
  }
}
