/**
 * External action URLs by exchange
 *
 * Withdraw is handled outside the platform (on the exchange),
 * so we link directly to each exchange's withdrawal page.
 */

const WITHDRAW_URLS: Record<string, string> = {
  binance: "https://www.binance.com/en/my/wallet/account/main/withdrawal",
  bybit:   "https://www.bybit.com/user/assets/withdraw",
  okx:     "https://www.okx.com/balance/withdrawal",
  bitget:  "https://www.bitget.com/en/wallet/withdrawal",
};

/**
 * Returns the withdrawal page URL for an exchange.
 * Falls back to `https://{id}.com` for unknown exchangeIds.
 */
export function getWithdrawUrl(exchangeId: string): string {
  return WITHDRAW_URLS[exchangeId.toLowerCase()] ?? `https://${exchangeId}.com`;
}
