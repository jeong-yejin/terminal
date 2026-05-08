"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Compass, ChevronDown } from "lucide-react";

/* ─── Keyframes injected once ───────────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes starFloat {
    0%,100% { transform: translateY(0)   rotate(0deg);  opacity:.35; }
    50%      { transform: translateY(-7px) rotate(10deg); opacity:.8;  }
  }
  @keyframes starTwinkle {
    0%,100% { transform: scale(1);   opacity:.25; }
    50%      { transform: scale(1.15); opacity:.75; }
  }
`;

/* ─── Asset URLs ─────────────────────────────────────────────────────────────
   Figma MCP assets expire in 7 days.
   Replace EXCHANGE_* with /public/guide/logo-*.svg once available.
   Step screenshots: /public/guide/step-1.png … step-4.png (auto-fallback below)
─────────────────────────────────────────────────────────────────────────────── */
const EXCHANGE_BYBIT =
  "https://www.figma.com/api/mcp/asset/b1441352-506c-4df9-9410-9a8e2c59e38f";
const EXCHANGE_OKX =
  "https://www.figma.com/api/mcp/asset/3dab9d31-f381-446f-968a-9272e0a628f3";
const EXCHANGE_BINANCE =
  "https://www.figma.com/api/mcp/asset/afd5048e-3692-4e08-a24a-ac8723108243";
const GLOW_A =
  "https://www.figma.com/api/mcp/asset/c2bf5f07-9231-4d09-ab72-4a0a0660e3b1";
const GLOW_B =
  "https://www.figma.com/api/mcp/asset/8645dce9-9933-4a51-ab07-1d0d9816f207";

/* ─── Step data ─────────────────────────────────────────────────────────────── */
type ListStyle = "check" | "numbered";
interface Step {
  num: number;
  title: string;
  listStyle: ListStyle;
  items: string[];
}
const STEPS: Step[] = [
  {
    num: 1,
    title: "Trade in one workspace",
    listStyle: "check",
    items: [
      "Select pairs and exchanges",
      "Place orders and manage open positions",
      "View orders and trade history",
    ],
  },
  {
    num: 2,
    title: "Funding Rate",
    listStyle: "check",
    items: [
      "Compare funding rates by exchange",
      "Check funding before trading",
    ],
  },
  {
    num: 3,
    title: "View your activity",
    listStyle: "check",
    items: [
      "View asset, deposit status",
      "Check funding history",
      "See trading activity summary",
    ],
  },
  {
    num: 4,
    title: "Exchange Connection",
    listStyle: "numbered",
    items: [
      "Select an exchange",
      "Use connected exchanges in Trade",
      "Confirm your connection to ReboundX",
    ],
  },
];

/* ─── FAQ data ───────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Q. Does ReboundX execute real trades?",
    a: (
      <>
        A. Yes. ReboundX executes real orders through your connected exchange.{" "}
        <strong className="text-text-primary underline decoration-primary underline-offset-2">
          Orders are placed in ReboundX and executed on the exchange.
        </strong>
      </>
    ),
  },
  {
    q: "Q. My Google account on ReboundX is different from my exchange account.",
    a: (
      <>
        {"A. That's fine. "}
        <strong className="text-text-primary underline decoration-primary underline-offset-2">
          As long as your exchange account was created through ReboundX
        </strong>
        {" (using the ReboundX referral code), you'll receive rebates on every trade."}
      </>
    ),
  },
  {
    q: "Q. Can I connect more than one exchange?",
    a: (
      <>
        {"A. Yes. You can "}
        <strong className="text-text-primary underline decoration-primary underline-offset-2">
          connect multiple exchanges
        </strong>
        {" and choose where to place each order."}
      </>
    ),
  },
  {
    q: "Q. Do I deposit or withdraw funds on ReboundX?",
    a: (
      <>
        <span className="block">A. No. ReboundX does not hold assets.</span>
        <strong className="text-text-primary underline decoration-primary underline-offset-2">
          Funds come from your exchange account. Withdrawals must be done on the exchange.
        </strong>
      </>
    ),
  },
  {
    q: "Q. What happens if I leave the page or refresh during a trade?",
    a: (
      <>
        {"A. Nothing changes. Orders and positions "}
        <strong className="text-text-primary underline decoration-primary underline-offset-2">
          remain active on the exchange.
        </strong>
      </>
    ),
  },
];

/* ─── Benefits data ──────────────────────────────────────────────────────────── */
const BENEFITS = [
  {
    title: "One trading flow",
    body: "Trade, orders, and positions stay in one workspace without switching screens.",
  },
  {
    title: "Trade with rebates",
    body: "Trade through ReboundX and receive fee rebates as you trade.",
  },
  {
    title: "Better decisions\nwith funding",
    body: "Check funding rates before you trade and choose the right exchange.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */

/* ── Decorative star ──────────────────────────────────────────────────────── */
function Star({
  size,
  style,
}: {
  size: number;
  style?: React.CSSProperties;
}) {
  return (
    <span className="absolute pointer-events-none select-none" style={style} aria-hidden>
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path
          d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z"
          fill="white"
          opacity="0.7"
        />
      </svg>
    </span>
  );
}

/* ── Step number badge ────────────────────────────────────────────────────── */
function StepBadge({ num }: { num: number }) {
  return (
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#EEFFB9] to-[#B3E84E] text-base font-bold text-text-inverse leading-none">
      {num}
    </span>
  );
}

/* ── Step screenshot (falls back to Figma asset then placeholder) ─────────── */
function StepScreenshot({ stepNum, title }: { stepNum: number; title: string }) {
  return (
    <div className="relative flex-1 min-w-0 min-h-0 rounded-[18px] border border-white/[0.08] bg-[#07080A] overflow-hidden shadow-[0_0_40px_20px_rgba(255,255,255,0.02)]">
      <img
        src={`/guide/Asset/Step-${stepNum}.webp`}
        alt={`${title} screenshot`}
        className="absolute inset-0 w-full h-full object-cover object-left-top"
      />
      {/* Glass edge refraction */}
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0.5px_0_1px_rgba(255,255,255,0.08)] pointer-events-none" />
    </div>
  );
}

/* ── Single step card ─────────────────────────────────────────────────────── */
function StepCard({
  step,
  isActive,
  onActivate,
}: {
  step: Step;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      onMouseEnter={onActivate}
      className={[
        "relative overflow-hidden h-[368px] flex-shrink-0",
        "rounded-[32px] border",
        "transition-[border-color,box-shadow] duration-300",
        isActive
          ? "border-primary/20 bg-surface-1 shadow-[0_0_48px_rgba(202,255,93,0.06)]"
          : "border-white/[0.12] bg-surface-1 group",
      ].join(" ")}
    >
      {/* ── Active content ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex gap-6 p-8"
        style={{
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
          transition: "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: isActive ? "180ms" : "0ms",
        }}
      >
        {/* Left panel */}
        <div className="flex flex-col justify-between py-4 flex-shrink-0 w-[232px]">
          {/* Badge + title */}
          <div
            className="flex items-center gap-3"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateX(0)" : "translateX(-10px)",
              transition: "opacity 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: isActive ? "220ms" : "0ms",
            }}
          >
            <StepBadge num={step.num} />
            <span className="text-body-1 font-bold text-text-primary leading-snug">
              {step.title}
            </span>
          </div>

          {/* Feature list — staggered */}
          <ul className="flex flex-col gap-2.5">
            {step.items.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-2"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: isActive ? `${260 + i * 65}ms` : "0ms",
                }}
              >
                {step.listStyle === "check" ? (
                  <Check
                    size={15}
                    className="mt-0.5 flex-shrink-0 text-primary"
                    strokeWidth={2.5}
                  />
                ) : (
                  <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-primary/50 text-[10px] font-bold text-primary leading-none">
                    {i + 1}
                  </span>
                )}
                <span className="text-body-3 text-text-secondary leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Screenshot */}
        <StepScreenshot stepNum={step.num} title={step.title} />
      </div>

      {/* ── Folded content ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col items-center py-6"
        style={{
          opacity: isActive ? 0 : 1,
          pointerEvents: isActive ? "none" : "auto",
          transition: "opacity 0.2s cubic-bezier(0.16,1,0.3,1)",
          transitionDelay: isActive ? "0ms" : "60ms",
        }}
      >
        <StepBadge num={step.num} />
        <div className="flex flex-1 items-center justify-center overflow-hidden w-full">
          <span
            className="text-body-1 font-bold text-text-primary whitespace-nowrap transition-transform duration-200 group-hover:scale-[1.04]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {step.title}
          </span>
        </div>
      </div>

      {/* Hover shimmer overlay (folded only) */}
      {!isActive && (
        <div
          className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 55%)",
            transition: "opacity 0.3s",
          }}
        />
      )}
    </div>
  );
}

/* ── Step indicator dots ──────────────────────────────────────────────────── */
function StepDots({
  active,
  count,
  onChange,
}: {
  active: number;
  count: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-label={`Go to step ${n}`}
          className={[
            "rounded-full transition-all duration-400 focus-ring",
            active === n
              ? "w-5 h-[5px] bg-primary"
              : "w-[5px] h-[5px] bg-white/20 hover:bg-white/40",
          ].join(" ")}
          style={{
            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ── Terminal Usage section (owns animation state) ────────────────────────── */
const ACTIVE_W = 700;
const FOLDED_W = 96;
const GAP = 12;

function getGridCols(activeNum: number): string {
  return STEPS.map((s) =>
    s.num === activeNum ? `${ACTIVE_W}px` : `${FOLDED_W}px`
  ).join(" ");
}

function TerminalUsageSection() {
  const [active, setActive] = useState(1);
  const totalW = ACTIVE_W + FOLDED_W * (STEPS.length - 1) + GAP * (STEPS.length - 1);

  return (
    <section className="flex flex-col items-center gap-8 rounded-t-[120px] bg-background px-10 py-[60px]">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-display-h5 font-bold text-text-primary tracking-tight">
          Terminal Usage
        </h2>
        <p className="text-body-3 text-text-tertiary">
          Learn how to navigate the terminal and place trades step by step.
        </p>
      </div>

      {/* ── Animated grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: getGridCols(active),
          gap: `${GAP}px`,
          width: `${totalW}px`,
          transition: "grid-template-columns 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "grid-template-columns",
        }}
      >
        {STEPS.map((step) => (
          <StepCard
            key={step.num}
            step={step}
            isActive={active === step.num}
            onActivate={() => setActive(step.num)}
          />
        ))}
      </div>

      <StepDots active={active} count={STEPS.length} onChange={setActive} />
    </section>
  );
}

/* ── FAQ accordion item ───────────────────────────────────────────────────── */
function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.09]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-6 text-left focus-ring rounded-sm"
      >
        <span className="text-body-2 font-bold text-text-primary leading-snug pr-4">{q}</span>
        <ChevronDown
          size={20}
          className="flex-shrink-0 mt-0.5 text-text-tertiary"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </button>

      {/* CSS grid-rows trick: animates without animating height directly */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden min-h-0">
          <p className="pb-6 text-body-3 text-text-secondary leading-relaxed">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Benefit card ─────────────────────────────────────────────────────────── */
function BenefitCard({ title, body }: { title: string; body: string }) {
  // Matches Figma: circle 64px, 15px margin from card edge
  const BTN = 64;
  const PAD = 15;
  const NOTCH = BTN + PAD; // 79px — area covered by the notch filler

  return (
    <div className="group relative w-[357px] h-[300px] flex-shrink-0">

      {/* ── Concave notch filler ─────────────────────────────────────────────
          Same color as the parent section (bg-background = #0A0A0A).
          Covers the card's rounded TR corner completely — card keeps
          border-radius:32px on ALL corners so NO right angle is ever visible.
          borderBottomLeftRadius = BTN(64px) makes the concave arc start at
          exactly y=PAD(15px) from top and end at x=BTN+PAD(79px) from right,
          tracing precisely around the circle button's bounding corners. ─── */}
      <div
        aria-hidden
        className="absolute top-0 right-0 z-[2] bg-background pointer-events-none"
        style={{
          width: NOTCH + 1,           // 80px — fully covers 32px card TR radius
          height: NOTCH + 1,          // 80px
          borderBottomLeftRadius: BTN, // 64px — arc endpoints align with button edges
        }}
      />

      {/* ── Card surface (all 4 corners rounded, NO right angles) ──────────── */}
      <div
        className="absolute inset-0 z-0 rounded-[32px] p-8 flex flex-col justify-between
                   bg-surface-1 group-hover:bg-primary
                   transition-colors duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <span
          className="text-body-1 font-bold leading-snug whitespace-pre-line
                     text-text-primary group-hover:text-text-inverse
                     transition-colors duration-[380ms]"
        >
          {title}
        </span>
        <p
          className="text-body-3 leading-relaxed
                     text-text-secondary group-hover:text-text-inverse
                     transition-colors duration-[380ms]"
        >
          {body}
        </p>
      </div>

      {/* ── Circular arrow button ─────────────────────────────────────────────
          Default : lime bg  + dark ↗ arrow
          Hover   : dark bg  + lime → arrow  ──────────────────────────────── */}
      <div
        className="absolute z-[3] flex items-center justify-center rounded-full
                   bg-primary group-hover:bg-background
                   transition-colors duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: BTN, height: BTN, top: PAD, right: PAD }}
      >
        {/* ↗ — shown by default, fades out on hover */}
        <svg
          width="32" height="32" viewBox="0 0 32 32" fill="none"
          className="absolute text-text-inverse
                     transition-opacity duration-[220ms]
                     group-hover:opacity-0"
          aria-hidden
        >
          <path
            d="M5 15L15 5M15 5H7M15 5V13"
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        {/* → — hidden by default, fades in on hover */}
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          className="absolute text-primary opacity-0
                     transition-opacity duration-[220ms] delay-100
                     group-hover:opacity-100"
          aria-hidden
        >
          <path
            d="M4 10H16M16 10L10 4M16 10L10 16"
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════════ */
export default function GuidePage() {
  return (
    <>
      {/* Keyframes */}
      <style>{KEYFRAMES}</style>

      <main className="min-h-screen bg-background pt-14 font-sans overflow-x-hidden">

        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-background flex items-center justify-center h-[600px]">
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(202,255,93,0.05) 0%, transparent 70%)",
            }}
          />

          {/* Floating stars */}
          {[
            { size: 14, style: { left: 104, top: 463, animationName: "starFloat", animationDuration: "5.2s", animationDelay: "0s" } },
            { size: 20, style: { left: 273, top: 370, animationName: "starFloat", animationDuration: "4.6s", animationDelay: "1.1s" } },
            { size: 26, style: { left: 362, top: 221, animationName: "starTwinkle", animationDuration: "3.8s", animationDelay: "0.4s" } },
            { size: 15, style: { left: 112, top: 130, animationName: "starTwinkle", animationDuration: "4.1s", animationDelay: "2.3s" } },
            { size: 26, style: { right: 231, top: 276, animationName: "starFloat", animationDuration: "6.0s", animationDelay: "0.9s" } },
            { size: 14, style: { right: 369, top: 85, animationName: "starTwinkle", animationDuration: "3.4s", animationDelay: "1.8s" } },
            { size: 14, style: { right: 103, top: 428, animationName: "starFloat", animationDuration: "4.9s", animationDelay: "3.1s" } },
          ].map(({ size, style: { animationName, animationDuration, animationDelay, ...pos } }, i) => (
            <Star
              key={i}
              size={size}
              style={{
                ...pos,
                animationName,
                animationDuration,
                animationDelay,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-12 text-center px-4">
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-2.5">
                <p className="text-body-3 font-bold text-text-primary tracking-wide">
                  All-in-One Trading Hub
                </p>
                <h1 className="text-display-h1 font-medium text-text-primary leading-[1.15] tracking-[-0.03em] text-center">
                  Trade
                  <br />
                  multiple exchanges
                  <br />
                  from one terminal
                </h1>
              </div>
              <div className="flex flex-col items-center gap-1 text-body-3 text-text-secondary">
                <p>Real-time charts, order books, and execution — all in one focused workspace.</p>
                <p>Connect exchanges only when you trade.</p>
                <p>No clutter, no forced onboarding</p>
              </div>
            </div>

            <Link
              href="/trade"
              className="flex items-center gap-2.5 rounded-full border border-border-subtle bg-background px-6 py-3 text-body-3 font-bold text-primary transition-[border-color,box-shadow,transform] duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(202,255,93,0.12)] hover:-translate-y-0.5 active:translate-y-0 focus-ring"
            >
              Open Terminal
              <Compass size={18} className="text-primary" />
            </Link>
          </div>
        </section>

        {/* ── 2. Exchange strip ────────────────────────────────────────── */}
        <section
          className="flex flex-col items-center gap-3 py-4"
          style={{
            background:
              "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(47,58,26,0.9) 0%, rgba(29,34,18,0.6) 55%, rgba(10,10,10,1) 100%)",
          }}
        >
          <p className="text-body-3 text-text-tertiary text-center">
            Verified futures exchanges integrated with ReboundX Terminal
          </p>
          <div className="flex items-center gap-14">
            <img src={EXCHANGE_BYBIT}   alt="Bybit"   className="h-9 object-contain opacity-70 hover:opacity-100 transition-opacity duration-200" />
            <img src={EXCHANGE_OKX}     alt="OKX"     className="h-[30px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-200" />
            <img src={EXCHANGE_BINANCE} alt="Binance" className="h-9 object-contain opacity-70 hover:opacity-100 transition-opacity duration-200" />
          </div>
        </section>

        {/* ── 3. Terminal Usage (animated step cards) ──────────────────── */}
        <TerminalUsageSection />

        {/* ── 4. Benefits ──────────────────────────────────────────────── */}
        <section className="flex flex-col items-center gap-8 bg-background px-10 py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-display-h5 font-bold text-text-primary tracking-tight">
              Benefits of using the Terminal
            </h2>
            <p className="text-body-3 text-text-tertiary">
              Trade in one flow, make better decisions with funding data, and earn rebates.
            </p>
          </div>
          <div className="flex gap-6">
            {BENEFITS.map((b) => (
              <BenefitCard key={b.title} title={b.title} body={b.body} />
            ))}
          </div>
        </section>

        {/* ── 5. FAQ ───────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center gap-8 bg-background px-10 py-[60px]">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-display-h5 font-bold text-text-primary tracking-tight">FAQ</h2>
            <p className="text-body-3 text-text-tertiary">
              Quick answers to common questions about trading, accounts, and limits.
            </p>
          </div>
          <div className="w-full max-w-[1120px]">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        {/* ── 6. CTA Banner ────────────────────────────────────────────── */}
        <section className="flex items-center justify-center rounded-b-[120px] bg-background px-10 py-[60px]">
          <div className="relative w-full max-w-[1120px] h-[253px] rounded-[40px] bg-[#111] overflow-hidden shadow-[0_2px_6px_rgba(227,255,138,0.1)]">
            <img
              src={GLOW_A}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[172px] top-[calc(-166px)] w-[556px] opacity-50 mix-blend-plus-lighter"
            />
            <img
              src={GLOW_B}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[123px] top-[-209px] w-[655px] opacity-35 mix-blend-plus-lighter"
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 text-center px-16">
              <h2 className="text-display-h5 font-bold text-text-primary tracking-tight">
                Discover Funding Rates Across Exchanges
              </h2>
              <p className="text-body-3 text-text-secondary">
                Compare funding rates in real time and spot opportunities before you trade.
              </p>
              <Link
                href="/funding-rate"
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-label-1 font-bold text-text-inverse transition-[background-color,transform,box-shadow] duration-200 hover:bg-primary-strong hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(202,255,93,0.25)] active:translate-y-0 focus-ring"
              >
                Explore Funding Rates
              </Link>
            </div>
          </div>
        </section>

        {/* ── 7. Footer ────────────────────────────────────────────────── */}
        <footer className="border-t border-border-subtle bg-background px-10 py-9">
          <div className="mx-auto max-w-[1120px] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-6 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="text-body-3 font-bold text-text-primary">REBOUNDX</span>
                <span className="h-5 w-px bg-text-tertiary/30" />
                <span className="text-body-3 font-medium text-primary">Terminal</span>
              </div>
              <div className="flex items-center gap-3">
                {[
                  {
                    label: "Telegram",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.13.57-.46.71-.93.44l-2.6-1.92-1.25 1.21c-.14.14-.26.26-.53.26l.19-2.67 4.84-4.37c.21-.19-.05-.29-.32-.1L7.9 14.27 5.33 13.5c-.56-.17-.57-.56.12-.83l9.29-3.58c.47-.17.88.11.9.71z" />
                      </svg>
                    ),
                  },
                  {
                    label: "X (Twitter)",
                    icon: (
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                        <path d="M8.24 5.93L13.41 0h-1.23L7.69 5.16 4.09 0H0l5.42 7.89L0 14h1.23l4.74-5.51L9.91 14H14L8.24 5.93zm-1.68 1.95-.55-.79-4.37-6.24h1.88l3.53 5.04.55.79 4.59 6.56h-1.88L6.56 7.88z" />
                      </svg>
                    ),
                  },
                ].map(({ label, icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-tertiary transition-[color,border-color] duration-200 hover:text-text-primary hover:border-border-normal focus-ring"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-20 border-b border-border-subtle py-6">
              <div className="flex flex-col gap-3">
                <p className="text-body-1 font-bold text-text-primary">Services</p>
                <div className="flex flex-col gap-3 text-label-1 text-text-secondary">
                  {(
                    [
                      { label: "Guide", href: "/guide" },
                      { label: "Trade", href: "/trade" },
                      { label: "Funding Rate", href: "/funding-rate" },
                      { label: "Community", href: "/community" },
                    ] as const
                  ).map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="hover:text-text-primary transition-colors duration-200 focus-ring rounded-sm w-fit"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-label-1 font-medium text-text-disabled py-1">
              © 2025 ReboundX. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
