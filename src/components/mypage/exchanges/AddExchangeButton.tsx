"use client";

import { Plus } from "lucide-react";

interface AddExchangeButtonProps {
  onSuccess?: () => void;
}

/**
 * Add Exchange button — initiates API key / OAuth connection flow
 */
export function AddExchangeButton({ onSuccess }: AddExchangeButtonProps) {
  const handleAdd = () => {
    // TODO: start OAuth / API-key connection flow
    // e.g. window.location.href = `/api/exchanges/oauth/start`
    onSuccess?.();
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2
        text-sm font-semibold text-text-inverse
        hover:bg-primary-strong focus-ring"
      aria-label="Add a new exchange connection"
    >
      <Plus size={16} aria-hidden="true" />
      Add Exchange
    </button>
  );
}
