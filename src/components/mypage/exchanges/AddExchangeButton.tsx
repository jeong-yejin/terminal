"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const SUPPORTED_EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "bybit",   name: "Bybit" },
  { id: "okx",     name: "OKX" },
  { id: "bitget",  name: "Bitget" },
];

interface AddExchangeButtonProps {
  onSuccess?: () => void;
}

/**
 * Add Exchange button — opens an inline dialog for API key / Secret entry,
 * then POSTs to /api/mypage/exchanges.
 */
export function AddExchangeButton({ onSuccess }: AddExchangeButtonProps) {
  const [open, setOpen] = useState(false);
  const [exchangeId, setExchangeId] = useState("binance");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setApiKey("");
    setApiSecret("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/mypage/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeId, apiKey, apiSecret }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "Failed to connect exchange");
      }
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2
          text-sm font-semibold text-text-inverse
          hover:bg-primary-strong focus-ring"
        aria-label="Add a new exchange connection"
      >
        <Plus size={16} aria-hidden="true" />
        Add Exchange
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-exchange-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Dialog panel */}
          <div className="relative w-full max-w-md rounded-2xl border border-border-subtle bg-surface-2 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="add-exchange-title"
                className="text-base font-semibold text-text-primary"
              >
                Connect Exchange
              </h2>
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                className="rounded-md p-1 text-text-tertiary hover:text-text-primary focus-ring transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Exchange selector */}
              <div>
                <label
                  htmlFor="add-exchange-select"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  Exchange
                </label>
                <select
                  id="add-exchange-select"
                  value={exchangeId}
                  onChange={(e) => setExchangeId(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface-1
                    px-3 py-2 text-sm text-text-primary focus-ring cursor-pointer"
                >
                  {SUPPORTED_EXCHANGES.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              <div>
                <label
                  htmlFor="add-exchange-key"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  API Key
                </label>
                <input
                  id="add-exchange-key"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="Enter your API key"
                  className="w-full rounded-lg border border-border-subtle bg-surface-1
                    px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-ring"
                />
              </div>

              {/* API Secret */}
              <div>
                <label
                  htmlFor="add-exchange-secret"
                  className="mb-1.5 block text-xs font-medium text-text-secondary"
                >
                  API Secret
                </label>
                <input
                  id="add-exchange-secret"
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your API secret"
                  className="w-full rounded-lg border border-border-subtle bg-surface-1
                    px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-ring"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs text-negative">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-border-subtle py-2 text-sm
                    text-text-secondary hover:text-text-primary focus-ring transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold
                    text-text-inverse hover:bg-primary-strong focus-ring
                    disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Connecting…" : "Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
