"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Link, Check } from "lucide-react";
import Image from "next/image";
import type { ExchangeConnection } from "@/types/mypage";
import { connectExchange } from "@/lib/api/exchanges";
import { cn } from "@/lib/utils";

const SUPPORTED_EXCHANGES = [
  { id: "binance", name: "Binance", logoUrl: "/logos/binance.svg", symbolUrl: "/logos/symbol/icon=binance.svg" },
  { id: "bybit",   name: "Bybit",   logoUrl: "/logos/bybit.svg",   symbolUrl: "/logos/symbol/icon=bybit.svg"   },
  { id: "okx",     name: "OKX",     logoUrl: "/logos/okx.svg",     symbolUrl: "/logos/symbol/icon=okx.svg"     },
];


interface ConnectExchangeModalProps {
  exchange: ExchangeConnection;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectExchangeModal({
  exchange,
  onClose,
  onSuccess,
}: ConnectExchangeModalProps) {
  const [selectedId, setSelectedId] = useState(exchange.id);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = SUPPORTED_EXCHANGES.find((e) => e.id === selectedId) ?? SUPPORTED_EXCHANGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsOpen(false);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await connectExchange(selectedId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-exchange-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative flex w-full max-w-sm flex-col gap-3 rounded-xl bg-surface-2">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-3">
          <h2
            id="connect-exchange-title"
            className="text-[24px] font-bold leading-[33.6px] text-text-primary"
          >
            Connect Exchanges
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="mt-1 rounded-md p-1 text-text-tertiary transition-colors hover:text-text-primary"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col items-center gap-3 px-6 py-3">

          {/* Exchange selector */}
          <div className="flex w-full flex-col gap-2">
            <label
              id="exchange-select-label"
              className="text-[14px] font-bold leading-[21px] tracking-[0.14px] text-text-tertiary"
            >
              Exchange
            </label>
            <div ref={dropdownRef} className="relative">
              {/* Trigger */}
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby="exchange-select-label"
                onClick={() => setIsOpen((v) => !v)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg bg-surface-1 px-3 py-2",
                  "outline outline-1 transition-[outline-color] duration-150",
                  isOpen ? "outline-primary" : "outline-border-subtle"
                )}
              >
                {/* Exchange logo */}
                <Image
                  src={selected.symbolUrl}
                  alt={selected.name}
                  width={20}
                  height={20}
                  className="flex-shrink-0 object-contain"
                />
                {/* Name */}
                <span className="flex-1 text-left text-[14px] font-bold leading-[21px] tracking-[0.14px] text-text-primary">
                  {selected.name}
                </span>
                {/* Chevron */}
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={cn(
                    "flex-shrink-0 text-text-secondary transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown list */}
              {isOpen && (
                <ul
                  role="listbox"
                  aria-labelledby="exchange-select-label"
                  className={cn(
                    "absolute left-0 right-0 top-[calc(100%+4px)] z-10",
                    "overflow-hidden rounded-xl border border-border-subtle bg-surface-2",
                    "shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
                    "animate-[reveal-up_160ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  )}
                >
                  {SUPPORTED_EXCHANGES.map((ex) => {
                    const isSelected = ex.id === selectedId;
                    return (
                      <li
                        key={ex.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(ex.id)}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 px-3 py-2.5",
                          "text-[14px] font-bold leading-[21px] tracking-[0.14px] transition-colors",
                          "border-b border-border-ghost last:border-0",
                          isSelected
                            ? "text-primary bg-primary/5"
                            : "text-text-primary hover:bg-surface-3"
                        )}
                      >
                        <Image
                          src={ex.symbolUrl}
                          alt={ex.name}
                          width={20}
                          height={20}
                          className="flex-shrink-0 object-contain"
                        />
                        <span className="flex-1">{ex.name}</span>
                        {isSelected && (
                          <Check size={13} className="text-primary" aria-hidden="true" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Logo pair */}
          <div className="relative h-16 w-[122px]">
            {/* Platform (ReboundX) */}
            <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center">
              <Image
                src="/logos/symbol/icon=reboundx_black.svg"
                alt="ReboundX"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            {/* Exchange */}
            <div className="absolute left-[66px] top-0 flex h-16 w-16 items-center justify-center">
              <Image
                src={selected.symbolUrl}
                alt={selected.name}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            {/* Link icon */}
            <div className="absolute left-[52px] top-[19.5px] flex h-6 w-6 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/[0.48]" />
              <Link size={12} className="relative text-white" />
            </div>
          </div>

          {/* Permission text */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <p className="text-[14px] font-normal leading-[21px] tracking-[0.14px] text-text-tertiary">
              ReboundX will access your trading history and balance,
            </p>
            <p className="text-[14px] font-normal leading-[21px] tracking-[0.14px] text-text-tertiary">
              and place orders only as part of your trading activity.
            </p>
          </div>

          {/* Steps */}
          <div className="flex w-full flex-col items-center gap-3 rounded-lg bg-surface-3 py-2">
            <StepRow number="1">Click the &ldquo;Connect&rdquo; button</StepRow>
            <StepRow number="2">
              <span className="text-text-primary">Log in to your </span>
              <span className="text-primary">{selected.name}</span>
              <span className="text-text-primary"> account</span>
            </StepRow>
            <StepRow number="3">Confirm your connection to ReboundX</StepRow>
          </div>

          {error && (
            <p role="alert" className="w-full text-xs text-negative">
              {error}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full rounded-[10px] px-4 py-2 text-[14px] font-bold leading-[21px]
              tracking-[0.14px] text-text-inverse transition-opacity
              disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "linear-gradient(0deg, #A1E53C 0%, #CAFF5D 50%, #EDFF9F 100%)",
            }}
          >
            {isConnecting ? "Connecting…" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepRow({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
        <span className="text-[14px] font-bold leading-[21px] text-primary">
          {number}
        </span>
      </div>
      <p className="text-[14px] font-medium leading-[21px] tracking-[0.14px]">
        {children}
      </p>
    </div>
  );
}
