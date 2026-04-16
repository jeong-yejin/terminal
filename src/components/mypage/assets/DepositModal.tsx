"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, AlertTriangle } from "lucide-react";

interface DepositModalProps {
  exchangeId: string;
  exchangeName: string;
  open: boolean;
  onClose: () => void;
}

interface AddressData {
  address: string;
  asset: string;
  network: string;
  minDeposit: string;
  confirmations: number;
}

const ASSETS = ["USDT", "USDC", "BTC", "ETH"] as const;
type Asset = (typeof ASSETS)[number];

const NETWORKS: Record<Asset, string[]> = {
  USDT: ["TRC20", "ERC20", "BEP20"],
  USDC: ["ERC20", "BEP20"],
  BTC:  ["BTC"],
  ETH:  ["ETH", "ARB", "OP"],
};

export function DepositModal({ exchangeId, exchangeName, open, onClose }: DepositModalProps) {
  const [asset, setAsset] = useState<Asset>("USDT");
  const [network, setNetwork] = useState<string>("TRC20");
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [copied, setCopied] = useState(false);

  // 네트워크가 선택된 asset에 유효한지 확인하고 조정
  useEffect(() => {
    const available = NETWORKS[asset];
    if (!available.includes(network)) {
      setNetwork(available[0]);
    }
  }, [asset, network]);

  const fetchAddress = useCallback(async () => {
    setIsFetching(true);
    setAddressData(null);
    try {
      const res = await fetch(
        `/api/mypage/deposits/address?exchangeId=${exchangeId}&asset=${asset}&network=${network}`
      );
      if (!res.ok) throw new Error("Failed to fetch address");
      const data = await res.json() as AddressData;
      setAddressData(data);
    } finally {
      setIsFetching(false);
    }
  }, [exchangeId, asset, network]);

  useEffect(() => {
    if (open) fetchAddress();
  }, [open, fetchAddress]);

  const handleCopy = async () => {
    if (!addressData?.address) return;
    await navigator.clipboard.writeText(addressData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  const networks = NETWORKS[asset];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deposit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 패널 */}
      <div className="relative w-full max-w-md rounded-2xl border border-border-subtle bg-surface-2 shadow-2xl">

        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h2 id="deposit-modal-title" className="text-base font-semibold text-text-primary">
              Deposit
            </h2>
            <p className="text-xs text-text-tertiary">{exchangeName} · Funding Account</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-text-tertiary hover:text-text-primary focus-ring transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">

          {/* Asset 선택 */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Coin</p>
            <div className="flex gap-2" role="group" aria-label="Select coin">
              {ASSETS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAsset(a)}
                  aria-pressed={asset === a}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                    asset === a
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-subtle text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Network 선택 */}
          <div>
            <label htmlFor="deposit-network" className="mb-2 block text-xs font-medium text-text-secondary">
              Network
            </label>
            <select
              id="deposit-network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-surface-1
                px-3 py-2 text-sm text-text-primary focus-ring cursor-pointer"
            >
              {networks.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* 입금 주소 */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Deposit Address</p>

            {isFetching ? (
              <div className="h-[68px] animate-pulse rounded-xl bg-surface-3" />
            ) : addressData ? (
              <div className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                <p className="break-all font-mono text-[13px] leading-relaxed text-text-primary">
                  {addressData.address}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-text-tertiary">
                    Min. deposit: <span className="text-text-secondary">{addressData.minDeposit}</span>
                    &nbsp;·&nbsp;
                    {addressData.confirmations} confirmations required
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-md px-2.5 py-1.5
                      text-xs font-medium transition-colors focus-ring
                      bg-surface-2 text-text-secondary hover:text-text-primary"
                    aria-label="Copy deposit address"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-positive" />
                        <span className="text-positive">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border-subtle bg-surface-1 p-4 text-center text-xs text-text-tertiary">
                Failed to load address. Please try again.
              </div>
            )}
          </div>

          {/* 경고 */}
          <div className="flex gap-2.5 rounded-xl border border-cautionary/20 bg-cautionary/5 px-4 py-3">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-cautionary" aria-hidden />
            <p className="text-xs leading-relaxed text-text-secondary">
              Only send{" "}
              <span className="font-semibold text-text-primary">{asset}</span> via the{" "}
              <span className="font-semibold text-text-primary">{network}</span> network to this
              address. Sending any other asset or using a different network will result in
              permanent loss of funds.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
