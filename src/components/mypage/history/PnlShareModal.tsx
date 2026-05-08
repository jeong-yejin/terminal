"use client";

import { useState, useCallback } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import type { PositionHistoryItem } from "@/types/mypage";
import { formatUsd } from "@/lib/format";

interface PnlShareModalProps {
  position: PositionHistoryItem;
  open: boolean;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * ROE = realizedPnl / (entryPrice × quantity) × 100
 * approximated based on notional value without leverage information
 */
function calcRoe(p: PositionHistoryItem): number {
  const notional = p.entryPrice * p.quantity;
  if (notional === 0) return 0;
  return (p.realizedPnlUsd / notional) * 100;
}

function fmtSign(v: number): string {
  return v >= 0 ? "+" : "";
}

function buildShareText(p: PositionHistoryItem, roe: number): string {
  const side = p.side.toUpperCase();
  return [
    `Closed ${p.symbol} ${side} on ${p.exchangeId.toUpperCase()}`,
    `PnL: ${fmtSign(p.realizedPnlUsd)}${formatUsd(p.realizedPnlUsd)} (${fmtSign(roe)}${roe.toFixed(2)}% ROE)`,
    `Entry: ${formatUsd(p.entryPrice)} → Exit: ${formatUsd(p.exitPrice)}`,
    ``,
    `Traded on @ReboundX 🚀`,
  ].join("\n");
}

function getExchangeLabel(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

// ─── Canvas image export ───────────────────────────────────────────────────────

function drawShareCanvas(p: PositionHistoryItem, roe: number, isProfit: boolean): HTMLCanvasElement {
  const W = 600;
  const H = 320;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const green = "#CAFF5D";
  const red   = "#EF4444";
  const accent = isProfit ? green : red;

  // Background
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, W, H);

  // Left accent bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 4, H);

  // Top right subtle glow
  const grd = ctx.createRadialGradient(W, 0, 0, W, 0, 240);
  grd.addColorStop(0, isProfit ? "rgba(202,255,93,0.07)" : "rgba(239,68,68,0.07)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // ── Branding ──
  ctx.fillStyle = green;
  ctx.font = "bold 12px monospace";
  ctx.fillText("★ REBOUNDX", 24, 36);

  // Symbol
  ctx.fillStyle = "#A3A3A3";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${p.symbol} · PERP`, W - 24, 36);
  ctx.textAlign = "left";

  // ── Side pill ──
  const sideLabel = p.side === "long" ? "▲  LONG" : "▼  SHORT";
  const pillColor = p.side === "long" ? "rgba(202,255,93,0.15)" : "rgba(239,68,68,0.15)";
  ctx.fillStyle = pillColor;
  const pillW = p.side === "long" ? 72 : 84;
  roundRect(ctx, 24, 50, pillW, 26, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(sideLabel, 36, 68);

  // ── P&L (main) ──
  ctx.fillStyle = accent;
  ctx.font = "bold 52px sans-serif";
  const pnlText = `${fmtSign(p.realizedPnlUsd)}${formatUsd(p.realizedPnlUsd)}`;
  ctx.fillText(pnlText, 24, 158);

  // ROE
  ctx.fillStyle = isProfit ? "#86EFAC" : "#FCA5A5";
  ctx.font = "600 15px sans-serif";
  ctx.fillText(`${fmtSign(roe)}${roe.toFixed(2)}% ROE`, 26, 182);

  // ── Separator ──
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, 200);
  ctx.lineTo(W - 24, 200);
  ctx.stroke();

  // ── Entry / Exit ──
  ctx.fillStyle = "#737373";
  ctx.font = "11px sans-serif";
  ctx.fillText("Entry", 24, 224);
  ctx.fillStyle = "#D4D4D4";
  ctx.font = "14px sans-serif";
  ctx.fillText(formatUsd(p.entryPrice), 24, 244);

  ctx.fillStyle = "#525252";
  ctx.font = "16px sans-serif";
  ctx.fillText("→", 154, 244);

  ctx.fillStyle = "#737373";
  ctx.font = "11px sans-serif";
  ctx.fillText("Exit", 180, 224);
  ctx.fillStyle = "#D4D4D4";
  ctx.font = "14px sans-serif";
  ctx.fillText(formatUsd(p.exitPrice), 180, 244);

  // ── Est. Rebate (right) ──
  if (p.estRebateUsd) {
    ctx.textAlign = "right";
    ctx.fillStyle = "#737373";
    ctx.font = "11px sans-serif";
    ctx.fillText("Est. Rebate", W - 24, 224);
    ctx.fillStyle = "#86EFAC";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`+${formatUsd(p.estRebateUsd)}`, W - 24, 244);
    ctx.textAlign = "left";
  }

  // ── Footer ──
  const date = new Date(p.closedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  ctx.fillStyle = "#525252";
  ctx.font = "11px sans-serif";
  ctx.fillText(`${getExchangeLabel(p.exchangeId)} · ${date}`, 24, 296);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(202,255,93,0.4)";
  ctx.font = "11px sans-serif";
  ctx.fillText("reboundx.com", W - 24, 296);
  ctx.textAlign = "left";

  return canvas;
}

/** Canvas roundRect polyfill */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── PnlShareModal ────────────────────────────────────────────────────────────

export function PnlShareModal({ position, open, onClose }: PnlShareModalProps) {
  const [copied, setCopied] = useState(false);

  const roe       = calcRoe(position);
  const isProfit  = position.realizedPnlUsd >= 0;
  const pnlSign   = fmtSign(position.realizedPnlUsd);
  const roeSign   = fmtSign(roe);
  const closedDate = new Date(position.closedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const handleCopyText = useCallback(async () => {
    await navigator.clipboard.writeText(buildShareText(position, roe));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [position, roe]);

  const handleShareToX = useCallback(() => {
    const text = encodeURIComponent(buildShareText(position, roe));
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank",
      "width=550,height=420,noopener,noreferrer"
    );
  }, [position, roe]);

  const handleDownload = useCallback(() => {
    const canvas = drawShareCanvas(position, roe, isProfit);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reboundx-${position.symbol}-${position.closedAt.slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [position, roe, isProfit]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-2 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 id="share-modal-title" className="text-base font-semibold text-text-primary">
            Share Trade Result
          </h2>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="rounded-md p-1 text-text-tertiary hover:text-text-primary focus-ring transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">

          {/* ── P&L Card Preview ───────────────────────────────────── */}
          <div
            className={`relative overflow-hidden rounded-xl border bg-[#171717] p-6 ${
              isProfit ? "border-positive/25" : "border-negative/25"
            }`}
            aria-label="Trade result card preview"
          >
            {/* Left accent */}
            <div
              className={`absolute inset-y-0 left-0 w-1 ${
                isProfit ? "bg-positive" : "bg-negative"
              }`}
              aria-hidden="true"
            />

            {/* Branding + symbol */}
            <div className="flex items-start justify-between pl-2">
              <span className="text-xs font-bold tracking-widest text-primary">★ REBOUNDX</span>
              <span className="text-xs text-text-tertiary">{position.symbol} · PERP</span>
            </div>

            {/* Side badge */}
            <div className="mt-3 pl-2">
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold ${
                  position.side === "long"
                    ? "bg-positive/10 text-positive"
                    : "bg-negative/10 text-negative"
                }`}
              >
                {position.side === "long" ? "▲ LONG" : "▼ SHORT"}
              </span>
            </div>

            {/* P&L — hero number */}
            <div className="mt-4 pl-2">
              <p
                className={`text-4xl font-bold tabular-nums leading-none ${
                  isProfit ? "text-positive" : "text-negative"
                }`}
                aria-label={`Realized PnL: ${pnlSign}${formatUsd(position.realizedPnlUsd)}`}
              >
                {pnlSign}{formatUsd(position.realizedPnlUsd)}
              </p>
              <p
                className={`mt-1.5 text-sm font-semibold tabular-nums ${
                  isProfit ? "text-positive/70" : "text-negative/70"
                }`}
              >
                {roeSign}{roe.toFixed(2)}% ROE
              </p>
            </div>

            {/* Divider */}
            <div className="my-4 ml-2 border-t border-white/8" />

            {/* Entry / Exit / Rebate */}
            <div className="flex items-start gap-6 pl-2 text-sm">
              <div>
                <p className="text-xs text-text-tertiary">Entry</p>
                <p className="mt-0.5 font-medium tabular-nums text-text-secondary">
                  {formatUsd(position.entryPrice)}
                </p>
              </div>
              <span className="mt-4 text-text-tertiary" aria-hidden>→</span>
              <div>
                <p className="text-xs text-text-tertiary">Exit</p>
                <p className="mt-0.5 font-medium tabular-nums text-text-secondary">
                  {formatUsd(position.exitPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Qty</p>
                <p className="mt-0.5 font-medium tabular-nums text-text-secondary">
                  {position.quantity}
                </p>
              </div>
              {position.estRebateUsd > 0 && (
                <div className="ml-auto text-right">
                  <p className="text-xs text-text-tertiary">Est. Rebate</p>
                  <p className="mt-0.5 font-semibold tabular-nums text-positive">
                    +{formatUsd(position.estRebateUsd)}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between pl-2 text-[11px] text-text-tertiary">
              <span>{getExchangeLabel(position.exchangeId)} · {closedDate}</span>
              <span className="text-primary/50">reboundx.com</span>
            </div>
          </div>

          {/* ── Share Actions ──────────────────────────────────────── */}
          <div className="mt-4 flex gap-2">

            {/* Share to X */}
            <button
              onClick={handleShareToX}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-2.5
                text-sm font-semibold text-white hover:bg-neutral-900 focus-ring transition-colors"
              aria-label="Share to X (Twitter)"
            >
              <span aria-hidden className="font-bold">𝕏</span>
              Share to X
            </button>

            {/* Copy text */}
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-4 py-2.5
                text-sm font-medium text-text-secondary hover:text-text-primary focus-ring transition-colors"
              aria-label="Copy trade result text to clipboard"
            >
              {copied
                ? <><Check size={14} className="text-positive" /><span className="text-positive">Copied!</span></>
                : <><Copy size={14} />Copy</>
              }
            </button>

            {/* Download image */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-4 py-2.5
                text-sm font-medium text-text-secondary hover:text-text-primary focus-ring transition-colors"
              aria-label="Download card as PNG image"
            >
              <Download size={14} aria-hidden />
              Image
            </button>

          </div>

          {/* Share hint */}
          <p className="mt-3 text-center text-xs text-text-tertiary">
            Share your win and earn rebate rewards when friends join via your result card.
          </p>

        </div>
      </div>
    </div>
  );
}
