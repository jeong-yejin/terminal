/**
 * 거래소별 외부 액션 URL
 *
 * Withdraw는 플랫폼 외부(거래소)에서 처리되므로
 * 각 거래소의 출금 페이지로 직접 링크.
 */

const WITHDRAW_URLS: Record<string, string> = {
  binance: "https://www.binance.com/en/my/wallet/account/main/withdrawal",
  bybit:   "https://www.bybit.com/user/assets/withdraw",
  okx:     "https://www.okx.com/balance/withdrawal",
  bitget:  "https://www.bitget.com/en/wallet/withdrawal",
};

/**
 * 거래소 출금 페이지 URL 반환.
 * 알 수 없는 exchangeId는 `https://{id}.com` 폴백.
 */
export function getWithdrawUrl(exchangeId: string): string {
  return WITHDRAW_URLS[exchangeId.toLowerCase()] ?? `https://${exchangeId}.com`;
}
