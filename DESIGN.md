# Design System: ReboundX Terminal

> Synthesized from: **Stitch Design Taste** (DESIGN_VARIANCE=Asymmetric/modern, MOTION_INTENSITY=Magnetic/scroll-triggered, VISUAL_DENSITY=Dense) + **UI/UX Pro Max** (Fintech/Crypto OLED Dark, Spring Physics, Dense Dashboard)

---

## 1. Visual Theme & Atmosphere

**Density: 9/10 — Cockpit Dense.** Every pixel earns its space. Data is the UI. No padding is decorative — it is structural.

**Variance: 7/10 — Offset Asymmetric.** Cards break the grid deliberately. The Balance card bleeds wider than its siblings. The header is left-weighted; the status cluster sits in the far right. No 3-column equal grids exist in this system.

**Motion: 8/10 — Magnetic & Scroll-Choreographed.** Cards snap upward on scroll entry with spring easing. Number columns tick when data lands. Hover states pull elements magnetically toward the cursor with subtle translate. Nothing loops unless it is a live data indicator.

**Atmosphere:** A trading terminal crossed with a Bloomberg-era financial instrument. Clinical precision, high-contrast readability under bright ambient light. Purposely austere — the data speaks; the UI recedes.

---

## 2. Color Palette & Roles

| Token | Hex | Role |
|---|---|---|
| **Void Black** | `#0A0A0A` | Root canvas — absolute base |
| **Cockpit Dark** | `#171717` | Card/panel primary surface |
| **Elevation Mid** | `#262626` | Header bands, table heads, badge fills |
| **Graphite Rail** | `#404040` | Hover states, active surfaces |
| **Rebound Lime** | `#CAFF5D` | Single accent — CTAs, active states, live indicators, chart strokes |
| **Lime Strong** | `#B3E84E` | Hover accent, pressed state |
| **Text Absolute** | `#FFFFFF` | Primary data — numbers, symbols, critical labels |
| **Text Secondary** | `#D4D4D4` | Supporting labels, column headers |
| **Text Muted** | `#A3A3A3` | Timestamps, metadata, captions |
| **Text Ghost** | `#737373` | Disabled state, empty markers |
| **Positive Signal** | `#22C55E` | Long / Buy / Profit |
| **Negative Signal** | `#EF4444` | Short / Sell / Loss / Liquidation |
| **Caution Signal** | `#FBBF24` | Warning, not-connected state |
| **Info Signal** | `#60A5FA` | Info tags, informational data |
| **Bybit Accent** | `#CAFF5D` | Exchange-specific identity |
| **OKX Accent** | `#A855F7` | Exchange-specific identity |
| **Binance Accent** | `#22D3EE` | Exchange-specific identity |
| **Border Subtle** | `rgba(255,255,255,0.20)` | Card borders, table dividers |
| **Border Ghost** | `rgba(255,255,255,0.06)` | Inner section dividers |

**Bans:** No pure `#000000`. No neon outer glows. No purple/blue gradient CTAs. No warm-gray fluctuation — all neutrals are Zinc/Neutral family. Single accent only.

---

## 3. Typography Rules

### Font Stack
- **Display / UI Labels:** `Manrope` — tight tracking, weight-driven hierarchy. Semibold for labels, Bold for primary values.
- **Financial Data / Numbers:** `JetBrains Mono` — all USD values, percentages, quantities, timestamps, IDs. `font-variant-numeric: tabular-nums` always. `letter-spacing: -0.01em` at display scale.
- **Banned:** `Inter` (too generic), serif of any kind in dashboard contexts, pure system-default stacks without explicit fallback.

### Scale (Desktop)
| Use | Size | Weight | Font |
|---|---|---|---|
| Hero Balance | 32–40px | 700 | Manrope |
| Card Title | 14px | 600 | Manrope |
| Table Header | 12px | 500 | Manrope |
| Data Value | 13–14px | 600 | JetBrains Mono |
| Caption / Meta | 11–12px | 400 | Manrope |
| Ticker / ID | 11px | 400 | JetBrains Mono |

**High-Density Override:** Any number displayed in a table, card stat, or ticker MUST use `JetBrains Mono`. No exceptions.

---

## 4. Component Stylings

### Cards
- `border-radius: 16px` (`rounded-2xl`). No softer — this is a cockpit.
- `border: 1px solid rgba(255,255,255,0.20)` — subtle structural edge.
- Background: `#171717`. No glass. No blur. No gradient fills on card backgrounds.
- **Elevation via border, not shadow.** Tinted box-shadow only when a card is actively hovered: `0 0 0 1px rgba(202,255,93,0.15)` — a ghost-lime outline, never a glow.
- Hover: `transform: translateY(-1px)` + lime ghost border. Duration: 200ms, ease-out.
- **Asymmetric padding:** Header strip `px-5 py-4`, content zone `px-5 pb-5`. Not uniform.

### Buttons
- Primary: `bg-primary (#CAFF5D)`, text `#0A0A0A`, `font-weight: 700`, `border-radius: 8px`.
- Active: `transform: translateY(1px)` — tactile press. No spring on buttons — snap.
- Ghost: `border: 1px solid rgba(255,255,255,0.20)`, transparent fill, text `#D4D4D4`.
- No outer glow. No gradient. No `box-shadow: 0 0 20px lime`.
- Period selector pills: `border-radius: 9999px`, `bg-surface-3` when active, `text-[11px]`.

### Table Rows
- `border-top: 1px solid rgba(255,255,255,0.06)` — ghost divider.
- Row hover: `bg-surface-2/40` + `transform: translateX(2px)` on the symbol cell. 150ms.
- No alternating zebra stripes — too dated.
- Sticky first column on mobile horizontal scroll.

### Exchange Badges
- Circular avatar: `width/height: 28px`, `border-radius: 50%`.
- Fill: `{exchangeColor}22` (14% opacity) — not solid.
- Text: first letter of exchange name, `font-weight: 700`, `color: {exchangeColor}`.

### Status Badges
- Connected: `bg-positive/10`, `text-positive`, `border-radius: 9999px`, `px-2.5 py-0.5`, `text-[12px] font-600`.
- Not Connected: `bg-cautionary/10`, `text-cautionary`.

### Skeleton Loaders
- Match exact layout dimensions of what they replace. Never circular spinners.
- `animate-pulse` with `bg-surface-3` — `#404040`. Rounded to match content shape.

### Empty States
- Centered within the table cell. `text-text-secondary`. Composed sentence — never just "No data."
- Example: `"No open positions at this time."` — informative, calm.

---

## 5. Layout Principles

### Grid Architecture
- **Root layout:** CSS Grid, never Flexbox percentage math.
- **Top row:** Asymmetric split — `grid-cols-[3fr_2fr]` on `xl`, `grid-cols-[1fr_auto]` on `lg`, single column below.
- **No 3-equal-column layouts.** If 3 items must appear: use 2-col + stacked or asymmetric `[2fr_1fr_1fr]`.
- Max-width container: `max-w-screen-2xl` with `mx-auto`. Inner padding `px-6 lg:px-8`.

### Spacing Rhythm
- Card-to-card gap: `gap-4` (16px).
- Inner card content gap: `space-y-4`.
- Label-to-value: `gap-1.5`.
- Table cell padding: `px-4 py-3`, first cell `pl-5`.

### Responsive Rules
- Below `768px`: All multi-column grids collapse to `grid-cols-1`.
- Table: `overflow-x-auto` with `min-w-[780px]` — horizontal scroll, no wrapping.
- All interactive targets: min `44px` tap target.
- Typography: `clamp()` on display values above `h4` size.

---

## 6. Motion & Interaction

### Spring Physics
- Default spring: `transition-duration: 200ms`, `transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoot spring feel.
- Data arrival: number columns animate from `opacity:0 translateY(4px)` → rest over `280ms`.
- Card mount: `opacity:0 translateY(12px)` → rest, staggered by `index * 60ms`.

### Scroll-Triggered Reveals
- Intersection Observer at `threshold: 0.15`.
- Entry class: `data-[revealed=false]:opacity-0 data-[revealed=false]:translate-y-3`.
- On intersect: add `data-revealed=true` → CSS transitions handle the rest.
- Stagger index encoded as `style="--stagger: N"` → `transition-delay: calc(var(--stagger) * 60ms)`.

### Magnetic Hover (Cards)
- On `mousemove`, compute cursor position within card bounds.
- Apply `transform: translate(deltaX * 0.03, deltaY * 0.03)` — subtle magnetic pull.
- On `mouseleave`: spring back with `transition: transform 400ms cubic-bezier(0.34,1.56,0.64,1)`.

### Live Indicator
- Pulsing dot `w-1.5 h-1.5 rounded-full bg-primary` — `animate-ping` at 1.5s interval.
- Present on: live balance value, any streaming data label.
- **Only perpetual loop allowed.** All other animations are one-shot.

### Performance Rules
- Animate ONLY `transform` and `opacity`. Never `width`, `height`, `top`, `left`, `padding`.
- All magnetic/spring effects use CSS `will-change: transform` — applied on hover start, removed on hover end.
- `@media (prefers-reduced-motion: reduce)` → all transitions collapse to `duration-0`.

---

## 7. Anti-Patterns (Banned)

- No emojis anywhere in the UI
- No `Inter` font — `Manrope` for UI, `JetBrains Mono` for data
- No pure `#000000` — use `#0A0A0A` (Void Black)
- No neon outer-glow box-shadows (`box-shadow: 0 0 20px #CAFF5D` is BANNED)
- No gradient fills on card backgrounds
- No `text-gradient` on large headers
- No overlapping elements — every element has its own spatial zone
- No 3-equal-column grid layouts
- No centered hero sections
- No generic AI copywriting: "Elevate", "Seamless", "Next-Gen", "Unleash"
- No animated spinner circles for loading — use skeletal loaders
- No horizontal overflow on any viewport
- No `h-screen` — use `min-h-[100dvh]`
- No placeholder copy "John Doe", "Acme Corp"
- No fake round stat numbers (99.99%, exactly $1,000.00)
- No bouncing scroll arrows or "scroll to explore" filler
- No custom mouse cursors
- No warm/cool gray fluctuation — Zinc/Neutral only
- No `calc()` percentage hacks for layout — use CSS Grid
- No `position: absolute` stacking that causes visual overlap
