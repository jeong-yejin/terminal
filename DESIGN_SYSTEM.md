---
version: alpha
name: ReboundX
description: |
  ReboundX is a multi-exchange trading terminal that runs in a single dark
  mode anchored on `background/normal-normal` (`#0a0a0a`). The system uses
  path-style token namespaces (e.g. `label/strong`, `background/normal-
  alternative`, `primary/normal`) sourced from `Color-semantic.json`,
  `Color-atomic.json`, `Space.json`, `Size.json`, `Radius.json`, and
  `Text.json`. Every UI label and display title is set in **Manrope** at
  -2% letter-spacing on display sizes; the surface ladder steps in
  luminance from `background/normal-normal` (`#0a0a0a`) →
  `background/normal-alternative` (`#171717`) →
  `background/elevated-normal` (`#262626`) →
  `background/elevated-alternative` (`#404040`). The brand stamp is
  `primary/normal` (`#CAFF5D`) — a saturated lime — used on CTAs, focus
  rings, live indicators, and active states. Cards use `radius/2xl` (16px)
  with a 1px `line/normal-normal` (20%-white) border; shadow is never used
  as elevation.

colors:
  "color-semantic/static/white": "#FFFFFF"
  "color-semantic/static/black": "#0A0A0A"
  "label/strong": "#FFFFFF"
  "label/normal": "#F5F5F5"
  "label/neutral": "#D4D4D4"
  "label/assistive": "#A3A3A3"
  "label/alternative": "#737373"
  "label/disable": "#525252"
  "label/inverse": "#0A0A0A"
  "background/normal-normal": "#0A0A0A"
  "background/normal-alternative": "#171717"
  "background/elevated-normal": "#262626"
  "background/elevated-alternative": "#404040"
  "background/inverse": "#F5F5F5"
  "background/brand": "#CAFF5D"
  "line/normal-normal": "rgba(255,255,255,0.20)"
  "line/normal-neutral": "rgba(255,255,255,0.09)"
  "line/normal-alternative": "rgba(255,255,255,0.06)"
  "line/solid-normal": "#E5E5E5"
  "line/solid-neutral": "#D4D4D4"
  "line/solid-alternative": "#A3A3A3"
  "status/positive": "#22C55E"
  "status/cautionary": "#FBBF24"
  "status/negative": "#EF4444"
  "status/info": "#60A5FA"
  "primary/normal": "#CAFF5D"
  "primary/strong": "#B3E84E"
  "primary/heavy": "#96C941"
  "interaction/default": "#FAFAFA"
  "interaction/inactive": "#737373"
  "interaction/disable": "#525252"
  "outline/default": "rgba(255,255,255,0.48)"
  "outline/hover": "#B3E84E"
  "outline/selected": "#CAFF5D"
  "accent/background-primary": "rgba(202,255,93,0.10)"
  "accent/background-green": "#F0FDF4"
  "accent/background-amber": "#FFFBEB"
  "accent/background-red": "#FEF2F2"
  "accent/background-blue": "#EFF6FF"
  "accent/foreground-primary": "#B3E84E"
  "accent/foreground-green": "#22C55E"
  "accent/foreground-amber": "#F59E0B"
  "accent/foreground-red": "#EF4444"
  "accent/foreground-blue": "#3B82F6"
  "fill/normal": "rgba(26,26,26,0.06)"
  "fill/strong": "rgba(26,26,26,0.09)"
  "fill/alternative": "rgba(26,26,26,0.20)"
  "fill/heavy": "rgba(26,26,26,0.28)"
  "inverse/primary": "#CAFF5D"
  "inverse/background": "#0A0A0A"
  "inverse/label": "#F5F5F5"
  "material/dimmer": "rgba(255,255,255,0.48)"

typography:
  "Desktop/titles/h1/bold":
    fontFamily: Manrope
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  "Desktop/titles/h2/bold":
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  "Desktop/titles/h3/bold":
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  "Desktop/titles/h4/bold":
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  "Desktop/titles/h5/bold":
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  "Desktop/Body/1/regular":
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.5
  "Desktop/Body/1/medium":
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.5
  "Desktop/Body/1/bold":
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.5
  "Desktop/Body/2/regular":
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  "Desktop/Body/3/regular":
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  "Desktop/Body/3/bold":
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
  "Desktop/Label/1/bold":
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
  "Desktop/Label/1/medium":
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  "Desktop/Label/1/regular":
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  "Desktop/Label/2/medium":
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  "Desktop/Caption/regular":
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4

rounded:
  "radius/none": 0px
  "radius/sm": 2px
  "radius/md": 4px
  "radius/lg": 8px
  "radius/xl": 12px
  "radius/2xl": 16px
  "radius/3xl": 24px
  "radius/4xl": 32px
  "radius/5xl": 48px
  "radius/full": 9999px

spacing:
  "space/zero": 0px
  "space/px": 1px
  "space/xxs": 2px
  "space/xs2": 4px
  "space/xs": 8px
  "space/sm": 12px
  "space/base": 16px
  "space/md": 20px
  "space/lg": 24px
  "space/xl": 28px
  "space/xl2": 32px
  "space/xl3": 40px
  "space/xl4": 48px
  "space/xl5": 60px
  "space/xl6": 72px

sizes:
  "size/zero": 0px
  "size/xxs": 2px
  "size/xs": 4px
  "size/sm": 8px
  "size/base": 12px
  "size/lg": 16px
  "size/xl": 20px
  "size/2xl": 24px
  "size/3xl": 32px
  "size/4xl": 40px
  "size/5xl": 48px

components:
  button-primary:
    backgroundColor: "{colors.primary/normal}"
    textColor: "{colors.label/inverse}"
    typography: "{typography.Desktop/Label/1/bold}"
    rounded: "{rounded.radius/md}"
    padding: 8px 16px
    height: 36px
  button-primary-hover:
    backgroundColor: "{colors.primary/strong}"
    textColor: "{colors.label/inverse}"
    rounded: "{rounded.radius/md}"
  button-primary-pressed:
    backgroundColor: "{colors.primary/heavy}"
    textColor: "{colors.label/inverse}"
    rounded: "{rounded.radius/md}"
  button-secondary:
    backgroundColor: "{colors.background/elevated-normal}"
    textColor: "{colors.label/normal}"
    typography: "{typography.Desktop/Label/1/bold}"
    rounded: "{rounded.radius/md}"
    padding: 8px 16px
    height: 36px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.label/neutral}"
    typography: "{typography.Desktop/Label/1/medium}"
    rounded: "{rounded.radius/md}"
    padding: 8px 16px
    height: 36px
  card:
    backgroundColor: "{colors.background/normal-alternative}"
    textColor: "{colors.label/normal}"
    typography: "{typography.Desktop/Body/3/regular}"
    rounded: "{rounded.radius/2xl}"
    padding: 20px
  card-elevated:
    backgroundColor: "{colors.background/elevated-normal}"
    textColor: "{colors.label/normal}"
    typography: "{typography.Desktop/Body/3/regular}"
    rounded: "{rounded.radius/2xl}"
    padding: 20px
  table-header:
    backgroundColor: "{colors.background/elevated-normal}"
    textColor: "{colors.label/assistive}"
    typography: "{typography.Desktop/Caption/regular}"
    rounded: "{rounded.radius/none}"
    padding: 10px 16px
    height: 38px
  table-row:
    backgroundColor: transparent
    textColor: "{colors.label/neutral}"
    typography: "{typography.Desktop/Label/2/medium}"
    rounded: "{rounded.radius/none}"
    padding: 14px 16px
  text-input:
    backgroundColor: "{colors.background/normal-alternative}"
    textColor: "{colors.label/strong}"
    typography: "{typography.Desktop/Body/3/regular}"
    rounded: "{rounded.radius/lg}"
    padding: 12px 12px
    height: 44px
  select-dropdown:
    backgroundColor: "{colors.background/normal-alternative}"
    textColor: "{colors.label/strong}"
    typography: "{typography.Desktop/Body/3/regular}"
    rounded: "{rounded.radius/lg}"
    padding: 12px 12px
    height: 48px
  select-menu:
    backgroundColor: "{colors.background/elevated-normal}"
    textColor: "{colors.label/normal}"
    typography: "{typography.Desktop/Label/1/medium}"
    rounded: "{rounded.radius/lg}"
    padding: 4px
  badge-positive:
    backgroundColor: "{colors.accent/background-green}"
    textColor: "{colors.status/positive}"
    typography: "{typography.Desktop/Label/2/medium}"
    rounded: "{rounded.radius/full}"
    padding: 2px 10px
  badge-negative:
    backgroundColor: "{colors.accent/background-red}"
    textColor: "{colors.status/negative}"
    typography: "{typography.Desktop/Label/2/medium}"
    rounded: "{rounded.radius/full}"
    padding: 2px 10px
  badge-cautionary:
    backgroundColor: "{colors.accent/background-amber}"
    textColor: "{colors.status/cautionary}"
    typography: "{typography.Desktop/Label/2/medium}"
    rounded: "{rounded.radius/full}"
    padding: 2px 10px
  badge-info:
    backgroundColor: "{colors.accent/background-blue}"
    textColor: "{colors.status/info}"
    typography: "{typography.Desktop/Label/2/medium}"
    rounded: "{rounded.radius/full}"
    padding: 2px 10px
  nav-bar:
    backgroundColor: "{colors.background/normal-normal}"
    textColor: "{colors.label/normal}"
    typography: "{typography.Desktop/Label/1/bold}"
    rounded: "{rounded.radius/none}"
    height: 56px
  sidebar:
    backgroundColor: "{colors.background/elevated-normal}"
    textColor: "{colors.label/normal}"
    typography: "{typography.Desktop/Label/1/medium}"
    rounded: "{rounded.radius/2xl}"
    padding: 16px 0
  sidebar-nav-item:
    backgroundColor: transparent
    textColor: "{colors.label/neutral}"
    typography: "{typography.Desktop/Label/1/medium}"
    rounded: "{rounded.radius/none}"
    padding: 0 16px
    height: 56px
  sidebar-nav-item-active:
    backgroundColor: "{colors.accent/background-primary}"
    textColor: "{colors.primary/normal}"
    typography: "{typography.Desktop/Label/1/medium}"
    rounded: "{rounded.radius/none}"
    padding: 0 16px
    height: 56px
  live-dot:
    backgroundColor: "{colors.primary/normal}"
    rounded: "{rounded.radius/full}"
    height: 6px
  focus-ring:
    backgroundColor: transparent
    textColor: inherit
    rounded: inherit
    padding: 0
---

## Overview

ReboundX operates on a **single-mode dark canvas** anchored at
`{colors.background/normal-normal}` (`#0a0a0a`) — never near-black, never
warm. The surface ladder steps in luminance through four levels:
`{colors.background/normal-normal}` → `{colors.background/normal-alternative}`
(`#171717`) → `{colors.background/elevated-normal}` (`#262626`) →
`{colors.background/elevated-alternative}` (`#404040`). Cards register
depth through this ladder and through 20%-white hairlines
(`{colors.line/normal-normal}`); shadow is not used as an elevation
language anywhere in the system.

The display typography is **Manrope at weight 700** for titles and **weight
500 for UI labels**, used at sizes from 12px to 64px with -2% letter-
spacing on display sizes. Body type sits at weight 400; emphatic body
steps to weight 700. The single-family stack means every label, value, and
heading shares the same humanist sans-serif character.

The brand accent is `{colors.primary/normal}` (`#CAFF5D`) — a saturated
lime — and it is the **only colour** used to mark active state, primary
CTA, focus ring, live-data indicators, and chart strokes. Status rows
(long/short, connected/disconnected, success/error) use
`{colors.status/positive}` / `{colors.status/negative}` /
`{colors.status/cautionary}` / `{colors.status/info}` over their
respective tinted backgrounds (`{colors.accent/background-green}`,
`{colors.accent/background-red}`, `{colors.accent/background-amber}`,
`{colors.accent/background-blue}`).

**Key Characteristics:**
- Single-mode dark canvas — `{colors.background/normal-normal}` is the root
  and is true `#0a0a0a`, not warm-black or near-black. Surface elevation
  is colour-blocking through the `background/*` ladder, never shadow.
- Single-family typography stack — **Manrope** for every label, value, and
  heading. Display sizes ride at weight 700 with -2% letter-spacing;
  UI labels at weight 500.
- Single accent — `{colors.primary/normal}` (`#CAFF5D`) is the only loud
  colour on the canvas and stamps every primary CTA, active state, focus
  ring, live indicator, and chart stroke. Status colours
  (`{colors.status/positive}` / `-negative` / `-cautionary` / `-info`)
  carry semantic role, not decoration.
- All buttons use `{rounded.radius/md}` (4px) for tactile precision; cards
  use `{rounded.radius/2xl}` (16px); pills, avatars, and the live dot use
  `{rounded.radius/full}`.
- Token namespace is path-style — `label/strong`, `background/normal-
  alternative`, `primary/normal`, `accent/background-primary` — sourced
  from `Color-semantic.json` and friends. Code references the semantic
  token, never the atomic palette directly.
- Variance is asymmetric — top-row layouts deliberately use `[3fr_2fr]` or
  `[1fr_auto]`, never 3-equal columns. Cards break the grid; the Balance
  card is intentionally wider than its sibling.

## Colors

### Static

- **White** (`{colors.color-semantic/static/white}` — `#FFFFFF`): a
  permanently white token, theme-independent.
- **Black** (`{colors.color-semantic/static/black}` — `#0A0A0A`): the
  permanently void-black token, theme-independent.

### Brand & Primary

- **Primary Normal** (`{colors.primary/normal}` — `#CAFF5D`): the brand
  accent. Used on `{component.button-primary}`, focus rings, the live
  indicator, active sidebar items
  (`{component.sidebar-nav-item-active}`), and chart strokes.
- **Primary Strong** (`{colors.primary/strong}` — `#B3E84E`): hover state
  of any lime element; also `{colors.outline/hover}` and
  `{colors.accent/foreground-primary}`.
- **Primary Heavy** (`{colors.primary/heavy}` — `#96C941`): pressed state
  of `{component.button-primary}`.

### Background (Surface Ladder)

- **Background Normal-Normal** (`{colors.background/normal-normal}` —
  `#0A0A0A`, L0): the page root — true black, never `#000000` and never
  near-black.
- **Background Normal-Alternative** (`{colors.background/normal-
  alternative}` — `#171717`, L1): primary card and panel surface; used by
  `{component.card}`, modal panels, and the active `{component.text-input}`.
- **Background Elevated-Normal** (`{colors.background/elevated-normal}` —
  `#262626`, L2): table header band, hover-row tint, the sidebar, and
  `{component.button-secondary}`.
- **Background Elevated-Alternative** (`{colors.background/elevated-
  alternative}` — `#404040`, L3): graphite rail — used for skeletons, the
  highest hover surface, and active period-pill backgrounds.
- **Background Inverse** (`{colors.background/inverse}` — `#F5F5F5`):
  inverse surface for printed exports and screenshots.
- **Background Brand** (`{colors.background/brand}` — `#CAFF5D`): a
  branded surface fill — same value as `{colors.primary/normal}`, used
  when an entire panel needs to invert into the brand stamp.

### Line (Hairlines & Dividers)

- **Line Normal-Normal** (`{colors.line/normal-normal}` —
  `rgba(255,255,255,0.20)`): the default 1px card border and section
  divider — the structural edge of every `{component.card}`.
- **Line Normal-Neutral** (`{colors.line/normal-neutral}` —
  `rgba(255,255,255,0.09)`): internal section divider inside cards.
- **Line Normal-Alternative** (`{colors.line/normal-alternative}` —
  `rgba(255,255,255,0.06)`): ghost divider between table rows — barely-
  there separation.
- **Line Solid-Normal** (`{colors.line/solid-normal}` — `#E5E5E5`):
  light-mode default divider.
- **Line Solid-Neutral** (`{colors.line/solid-neutral}` — `#D4D4D4`):
  light-mode sub divider.
- **Line Solid-Alternative** (`{colors.line/solid-alternative}` —
  `#A3A3A3`): light-mode auxiliary divider.

### Label (Text)

- **Label Strong** (`{colors.label/strong}` — `#FFFFFF`): the strongest
  text — primary headings, critical values, the active sidebar item.
- **Label Normal** (`{colors.label/normal}` — `#F5F5F5`): default body
  type for prose-style content.
- **Label Neutral** (`{colors.label/neutral}` — `#D4D4D4`): supporting
  labels, column headers, secondary metadata in cards.
- **Label Assistive** (`{colors.label/assistive}` — `#A3A3A3`): captions,
  timestamps, placeholder text, helper copy.
- **Label Alternative** (`{colors.label/alternative}` — `#737373`):
  placeholder, inactive hint text.
- **Label Disable** (`{colors.label/disable}` — `#525252`): hard-disabled
  foreground.
- **Label Inverse** (`{colors.label/inverse}` — `#0A0A0A`): label colour
  on `{colors.primary/normal}` and `{colors.background/inverse}` surfaces.

### Status (Semantic)

- **Status Positive** (`{colors.status/positive}` — `#22C55E`): Long,
  Buy, Profit, Connected. Pair with `{colors.accent/background-green}`
  for badge fills.
- **Status Negative** (`{colors.status/negative}` — `#EF4444`): Short,
  Sell, Loss, Liquidation, Disconnect. Pair with
  `{colors.accent/background-red}`.
- **Status Cautionary** (`{colors.status/cautionary}` — `#FBBF24`):
  Warning, Not Connected, Pending. Pair with
  `{colors.accent/background-amber}`.
- **Status Info** (`{colors.status/info}` — `#60A5FA`): Info banners,
  informational tags. Pair with `{colors.accent/background-blue}`.

### Accent (Tinted Backgrounds & Foregrounds)

- **Accent Background-Primary** (`{colors.accent/background-primary}` —
  `rgba(202,255,93,0.10)`): tinted lime fill behind the active sidebar
  item and selected period-pill.
- **Accent Background-Green** (`{colors.accent/background-green}` —
  `#F0FDF4`): tinted green fill behind `{component.badge-positive}`.
- **Accent Background-Amber** (`{colors.accent/background-amber}` —
  `#FFFBEB`): tinted amber fill behind `{component.badge-cautionary}`.
- **Accent Background-Red** (`{colors.accent/background-red}` —
  `#FEF2F2`): tinted red fill behind `{component.badge-negative}`.
- **Accent Background-Blue** (`{colors.accent/background-blue}` —
  `#EFF6FF`): tinted blue fill behind `{component.badge-info}`.
- **Accent Foreground-Primary** (`{colors.accent/foreground-primary}` —
  `#B3E84E`): tinted lime foreground.
- **Accent Foreground-Green** / **-Amber** / **-Red** / **-Blue**: status
  foregrounds for tinted badges.

### Interaction

- **Interaction Default** (`{colors.interaction/default}` — `#FAFAFA`):
  base interactive surface.
- **Interaction Inactive** (`{colors.interaction/inactive}` — `#737373`):
  inactive interactive surface.
- **Interaction Disable** (`{colors.interaction/disable}` — `#525252`):
  fully disabled interactive surface.

### Outline

- **Outline Default** (`{colors.outline/default}` — `rgba(255,255,255,0.48)`):
  default focus aura before lime promotion.
- **Outline Hover** (`{colors.outline/hover}` — `#B3E84E`): hover
  outline.
- **Outline Selected** (`{colors.outline/selected}` — `#CAFF5D`): focus
  ring colour — same as `{colors.primary/normal}`. Always 2px, with 2px
  offset.

### Fill

- **Fill Normal** (`{colors.fill/normal}` — `rgba(26,26,26,0.06)`):
  baseline fill.
- **Fill Strong** (`{colors.fill/strong}` — `rgba(26,26,26,0.09)`):
  emphatic fill.
- **Fill Alternative** (`{colors.fill/alternative}` —
  `rgba(26,26,26,0.20)`): alternative fill.
- **Fill Heavy** (`{colors.fill/heavy}` — `rgba(26,26,26,0.28)`): heavy
  fill.

### Inverse

- **Inverse Primary** (`{colors.inverse/primary}` — `#CAFF5D`): primary
  on inverse surface.
- **Inverse Background** (`{colors.inverse/background}` — `#0A0A0A`):
  inverse-mode background.
- **Inverse Label** (`{colors.inverse/label}` — `#F5F5F5`): label colour
  on inverse-mode surface.

### Material

- **Material Dimmer** (`{colors.material/dimmer}` —
  `rgba(255,255,255,0.48)`): dim overlay used behind modals and command
  palettes.

### Atomic Palettes

The atomic palettes back the semantic tokens above. **Code never
references these directly** — always go through the semantic layer
(`{colors.label/strong}`, `{colors.primary/normal}`, etc.).

| Palette | 100 | 300 | 500 (key) | 700 | 900 |
|---|---|---|---|---|---|
| Primary | `#F9FFE9` | `#E3FF8A` | **`#CAFF5D`** | `#96C941` | `#2E4A1F` |
| Neutral | `#F5F5F5` | `#D4D4D4` | **`#737373`** | `#404040` | `#171717` |
| Green | `#DCFCE7` | `#86EFAC` | **`#22C55E`** | `#15803D` | `#14532D` |
| Red | `#FEE2E2` | `#FCA5A5` | **`#EF4444`** | `#B91C1C` | `#7F1D1D` |
| Amber | `#FEF3C7` | `#FCD34D` | `#F59E0B` | `#B45309` | `#78350F` |
| Blue | `#DBEAFE` | `#93C5FD` | `#3B82F6` | `#1D4ED8` | `#1E3A8A` |

Neutral 950 (`#0A0A0A`) seats the canvas; Amber 400 (`#FBBF24`) is the
canonical cautionary key; Blue 400 (`#60A5FA`) is the canonical info key.

## Typography

### Font Family

ReboundX ships a strict single-family stack:

- **Manrope** — open-source humanist sans-serif used across every UI
  surface. Tightens at -2% letter-spacing on display sizes; weight 400 for
  body, 500 for menu items and ghost-buttons, 700 for hero values, primary
  buttons, and titles.

The font is loaded from Google Fonts via
`@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap")`.
When Manrope cannot be loaded, **Inter** or **Söhne** are credible
substitutes — apply -2% letter-spacing on display sizes to match.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.Desktop/titles/h1/bold}` | 64px | 700 | 1.2 | -0.02em | One per page maximum — landing hero titles. |
| `{typography.Desktop/titles/h2/bold}` | 48px | 700 | 1.2 | -0.02em | Section openers. |
| `{typography.Desktop/titles/h3/bold}` | 40px | 700 | 1.2 | -0.02em | Sub-section titles. |
| `{typography.Desktop/titles/h4/bold}` | 32px | 700 | 1.2 | -0.02em | Card group titles. |
| `{typography.Desktop/titles/h5/bold}` | 24px | 700 | 1.2 | -0.02em | Page titles inside cards (e.g. "Deposit", "Asset"). |
| `{typography.Desktop/Body/1/bold}` | 20px | 700 | 1.5 | 0 | Strongly emphatic body. |
| `{typography.Desktop/Body/1/medium}` | 20px | 500 | 1.5 | 0 | Major value highlight. |
| `{typography.Desktop/Body/1/regular}` | 20px | 400 | 1.5 | 0 | Default body large. |
| `{typography.Desktop/Body/2/regular}` | 18px | 400 | 1.5 | 0 | Secondary headings, prominent labels. |
| `{typography.Desktop/Body/3/regular}` | 16px | 400 | 1.5 | 0 | Default body. |
| `{typography.Desktop/Body/3/bold}` | 16px | 700 | 1.5 | 0 | Emphatic body small. |
| `{typography.Desktop/Label/1/bold}` | 14px | 700 | 1.4 | 0 | Button labels, tags. |
| `{typography.Desktop/Label/1/medium}` | 14px | 500 | 1.4 | 0 | Menu items, filter chips, section labels. |
| `{typography.Desktop/Label/1/regular}` | 14px | 400 | 1.4 | 0 | Generic label. |
| `{typography.Desktop/Label/2/medium}` | 13px | 500 | 1.4 | 0 | Sub-labels, badge text. |
| `{typography.Desktop/Caption/regular}` | 12px | 400 | 1.4 | 0 | Date, metadata, footnote. |

The full token table — `Desktop/titles/h1` through `Desktop/Caption`,
each with `bold`/`medium`/`regular` variants — is enumerated in
`Text.json`. The list above captures the variants in active use; new
weight variants must be added as separate tokens, never inferred.

### Principles

- Display sizes (`Desktop/titles/h1`–`h5`) always run at weight 700 with
  `lineHeight: 1.2` and -0.02em letter-spacing. The negative tracking is
  structural — it is what keeps "Total Balance / Open Positions" sitting
  compactly inside dense cards.
- UI labels (`Desktop/Label/1/medium`, `Desktop/Label/2/medium`) sit at
  weight 500 — between body and bold — so menu items have presence
  without competing with display titles.
- Hero values and primary CTAs use weight 700 (`Desktop/titles/*` and
  `Desktop/Label/1/bold`). The system has no weight-400 display use
  anywhere.
- Body type defaults to `Desktop/Body/3/regular` (16px / 400 / 1.5).
  Reach for `Desktop/Body/3/bold` only on emphasis.

### Note on Font Substitutes

When Manrope cannot be loaded, clamp display `lineHeight` to 1.2
explicitly and apply -2% letter-spacing on display sizes. Inter or Söhne
will read closest to the original.

## Layout

### Spacing System

- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.space/zero}` 0px · `{spacing.space/px}` 1px ·
  `{spacing.space/xxs}` 2px · `{spacing.space/xs2}` 4px ·
  `{spacing.space/xs}` 8px · `{spacing.space/sm}` 12px ·
  `{spacing.space/base}` 16px · `{spacing.space/md}` 20px ·
  `{spacing.space/lg}` 24px · `{spacing.space/xl}` 28px ·
  `{spacing.space/xl2}` 32px · `{spacing.space/xl3}` 40px ·
  `{spacing.space/xl4}` 48px · `{spacing.space/xl5}` 60px ·
  `{spacing.space/xl6}` 72px.
- Card-to-card gap: `{spacing.space/base}` (16px).
- Card internal padding (header strip): `{spacing.space/md}` (20px)
  horizontal, `{spacing.space/base}` (16px) vertical.
- Card content padding: `{spacing.space/md}` (20px) all sides.
- Page outer padding: `{spacing.space/base}` (16px) on the mypage shell;
  `{spacing.space/lg}` / `{spacing.space/xl2}` (24/32px) inside scrollable
  main columns.
- Table cell padding: `{spacing.space/base}` (16px) horizontal,
  `{spacing.space/sm}` (12px) vertical; first cell `{spacing.space/md}`
  (20px) left.

### Size Scale

Component dimensions (icons, avatars, hit-target heights) come from the
parallel `size/*` scale.

| Token | Value | Use |
|---|---|---|
| `{sizes.size/zero}` | 0px | — |
| `{sizes.size/xxs}` | 2px | Divider thickness. |
| `{sizes.size/xs}` | 4px | Icon badges. |
| `{sizes.size/sm}` | 8px | Small icons. |
| `{sizes.size/base}` | 12px | Inline marker. |
| `{sizes.size/lg}` | 16px | Default icon size. |
| `{sizes.size/xl}` | 20px | Icon inside button. |
| `{sizes.size/2xl}` | 24px | Standalone icon. |
| `{sizes.size/3xl}` | 32px | Avatar small. |
| `{sizes.size/4xl}` | 40px | Avatar medium. |
| `{sizes.size/5xl}` | 48px | Avatar large. |

### Grid & Container

- **Root layout**: CSS Grid, never percent-math Flexbox.
- **Top row asymmetric split**: `grid-cols-[3fr_2fr]` at xl, `[1fr_auto]`
  at lg, single column below md. **Three-equal columns are banned.**
- **Mypage shell**: 240px sidebar + flex-1 main column with
  `{spacing.space/base}` gap. Sidebar collapses to a bottom tab-bar below md.
- **Max content width**: `max-w-screen-2xl` with `mx-auto`. Inner padding
  `px-6 lg:px-8`.
- **Tables**: `overflow-x-auto` with `min-w-[820px]` — horizontal scroll,
  no row wrap, sticky symbol column on mobile.

### Whitespace Philosophy

- Whitespace earns its place. The dashboard is intentionally dense (9/10);
  card padding stays at 20px (`{spacing.space/md}`) and table-row padding
  at 12–14px so dozens of data points fit in a viewport without scroll
  fatigue.
- Hairline `{colors.line/normal-normal}` replaces shadow as the elevation
  cue on every card. Inside cards, `{colors.line/normal-alternative}`
  separates table rows.
- The sidebar and the main column are both `{rounded.radius/2xl}` cards —
  the outer page background `{colors.background/normal-normal}` shows
  through the `{spacing.space/base}` gap between them, which is what
  creates the cockpit feel.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — canvas | `{colors.background/normal-normal}` | Page root, GNB band, the gap between sidebar and main. |
| 1 — card | `{colors.background/normal-alternative}` + 1px `{colors.line/normal-normal}` | Default `{component.card}` and panel. |
| 2 — elevated | `{colors.background/elevated-normal}` | Sidebar, table header, hover row, active sub-tab. |
| 3 — graphite | `{colors.background/elevated-alternative}` | Skeleton band, top-of-hover ring. |
| 4 — accent | `{colors.accent/background-primary}` over level 1 or 2 | Active sidebar item, active period-pill, selected exchange tab. |

The system has **no traditional drop-shadow language**. Cards register
depth via the surface ladder and a single 1px `{colors.line/normal-
normal}` border. The sole exception is the **lime ghost ring** on hover —
`box-shadow: 0 0 0 1px rgba(202,255,93,0.15)` — applied only on card-hover
and never on idle surfaces.

### Decorative Depth

- **Magnetic hover** — cards translate toward the cursor on `mousemove`
  with a 0.022 multiplier; on `mouseleave` they spring back over 400ms
  with `cubic-bezier(0.34,1.56,0.64,1)`.
- **Live indicator** — a 6px lime dot (`{component.live-dot}`) with a
  pulsing ring keyframe (1.6s loop, scale 1 → 2.4, opacity 0.8 → 0). The
  **only perpetual animation** in the system; everything else is
  one-shot.
- **Number tick on data arrival** — values fade in from `translateY(5px)`
  over 280ms with the spring easing.
- **Chart-line trace** — chart strokes draw in via `stroke-dashoffset`
  going 1000 → 0 over 1.2s with `cubic-bezier(0.16,1,0.3,1)`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.radius/none}` | 0px | Page bands, GNB, table cells. |
| `{rounded.radius/sm}` | 2px | Inline tags, micro-chips. |
| `{rounded.radius/md}` | 4px | `{component.button-primary}`, `{component.button-secondary}`, side badges. |
| `{rounded.radius/lg}` | 8px | `{component.text-input}`, `{component.select-dropdown}`, sub-nav tabs. |
| `{rounded.radius/xl}` | 12px | Exchange tab buttons, modal panels. |
| `{rounded.radius/2xl}` | 16px | Cards, sidebar, mypage main column, modals. |
| `{rounded.radius/3xl}` | 24px | Coin chips, large pill containers. |
| `{rounded.radius/4xl}` | 32px | Oversized rounded media. |
| `{rounded.radius/5xl}` | 48px | Brand banners (rare). |
| `{rounded.radius/full}` | 9999px | Avatars, live dot, period-pills, status badges. |

### Surface Geometry

- Cards are 16px (`{rounded.radius/2xl}`) — no softer, this is a cockpit.
- Buttons sit at 4px (`{rounded.radius/md}`) — sharper than cards,
  deliberately tactile. Pill-shaped buttons (period selectors, status
  badges) use `{rounded.radius/full}`.
- Inputs and dropdowns at 8px (`{rounded.radius/lg}`) — slightly softer
  than buttons to read as receptive surfaces.
- Avatars and the live indicator are `{rounded.radius/full}`. The exchange
  logo badge is `{rounded.radius/full}` with a 28px diameter.

## Components

### Buttons

**`button-primary`** — lime CTA on dark
- Background `{colors.primary/normal}`, label `{colors.label/inverse}`,
  type `{typography.Desktop/Label/1/bold}`, padding
  `{spacing.space/xs} {spacing.space/base}` (8px 16px), `rounded:
  {rounded.radius/md}`, height 36px.
- The brand's primary CTA — Deposit, Connect, Save, Confirm.
- Hover: background `{colors.primary/strong}`. Pressed: background
  `{colors.primary/heavy}` with `transform: translateY(1px)`.
- No outer glow. No gradient. No `box-shadow: 0 0 20px lime`.

**`button-secondary`** — surface CTA on dark
- Background `{colors.background/elevated-normal}`, label
  `{colors.label/normal}`, type `{typography.Desktop/Label/1/bold}`,
  `rounded: {rounded.radius/md}`, height 36px.
- Used when paired with `{component.button-primary}` (e.g. Cancel /
  Confirm rows).

**`button-ghost`** — outlined CTA
- Background transparent, 1px solid `{colors.line/normal-normal}`, label
  `{colors.label/neutral}`, type `{typography.Desktop/Label/1/medium}`,
  `rounded: {rounded.radius/md}`.
- Tertiary action — destructive confirmations, dismissals.

### Cards & Containers

**`card`** — default card
- Background `{colors.background/normal-alternative}`, text
  `{colors.label/normal}`, 1px solid `{colors.line/normal-normal}`, type
  `{typography.Desktop/Body/3/regular}`, `rounded:
  {rounded.radius/2xl}`, padding `{spacing.space/md}` (20px).
- The base unit of the dashboard.
- Hover: `transform: translateY(-1px)` + lime ghost ring `box-shadow:
  0 0 0 1px rgba(202,255,93,0.15)`. Duration 200ms ease-out.

**`card-elevated`** — high-luminance card
- Background `{colors.background/elevated-normal}`, text
  `{colors.label/normal}`, `rounded: {rounded.radius/2xl}`, padding
  `{spacing.space/md}`.
- Used for the sidebar shell and any card that must visually rise above
  a sibling `{component.card}`.

**`table-header`** — table header band
- Background `{colors.background/elevated-normal}`, text
  `{colors.label/assistive}`, type `{typography.Desktop/Caption/regular}`
  uppercase, padding 10px 16px, height 38px.
- Sits above table body with a 1px `{colors.line/normal-alternative}`
  divider.

**`table-row`** — table row
- Background transparent, text `{colors.label/neutral}`, type
  `{typography.Desktop/Label/2/medium}`, padding `{spacing.space/sm}
  {spacing.space/base}` (12px 16px). Hover: background
  `rgba(38,38,38,0.30)`, first-cell `translateX(2px)`.
- 1px `{colors.line/normal-alternative}` `border-top`. **No alternating
  zebra stripes** — too dated for fintech.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.background/normal-alternative}`, text
  `{colors.label/strong}`, type `{typography.Desktop/Body/3/regular}`,
  1px solid `{colors.line/normal-normal}`, `rounded: {rounded.radius/lg}`,
  padding 12px, height 44px.
- Focus: border `{colors.outline/selected}`. Used for the deposit
  search, search bars, and form fields.

**`select-dropdown`** — closed dropdown trigger
- Background `{colors.background/normal-alternative}`, text
  `{colors.label/strong}` (or `{colors.label/assistive}` for placeholder),
  1px solid `{colors.line/normal-normal}`, `rounded: {rounded.radius/lg}`,
  padding 12px, height 48px, chevron-down trailing.
- Used for network selection, exchange selection, and any closed list.

**`select-menu`** — opened dropdown panel
- Background `{colors.background/elevated-normal}`, 1px solid
  `{colors.line/normal-normal}`, `rounded: {rounded.radius/lg}`, padding
  4px.
- Items use `{typography.Desktop/Label/1/medium}` with hover background
  `{colors.background/elevated-alternative}` and active state
  `{colors.accent/background-primary}` / `{colors.primary/normal}` text.

### Navigation

**`nav-bar`** — top GNB
- Background `{colors.background/normal-normal}`, text
  `{colors.label/normal}`, type `{typography.Desktop/Label/1/bold}`,
  height 56px, bottom border 1px `{colors.line/normal-normal}`.
- Left: REBOUNDX wordmark + Terminal toggle. Centre: top-level nav
  ("Trade", "Funding Rate", "Guide", "Community", "Event"). Right:
  "Today +$" badge, primary `{component.button-primary}` Deposit CTA,
  notification bell, language switcher.

**`sidebar`** — mypage left rail
- Background `{colors.background/elevated-normal}`, `rounded:
  {rounded.radius/2xl}`, padding 16px 0, width 240px (md+) collapses to
  bottom tab bar below md.
- Hosts the user profile block, three nav groups (Trading / Community /
  Account), and a "Back to ReboundX" footer.

**`sidebar-nav-item`** — nav row
- Background transparent → `{colors.accent/background-primary}` when
  active, text `{colors.label/neutral}` → `{colors.primary/normal}` when
  active, type `{typography.Desktop/Label/1/medium}`, padding 0 16px,
  height 56px.
- The active row has `aria-current="page"` and lime tint background. No
  left border bar — the lime fill alone marks selection.

### Signature Components

**`badge-positive` / `badge-negative` / `badge-cautionary` / `badge-info`** — status pills
- Background `{colors.accent/background-green}` /
  `{colors.accent/background-red}` /
  `{colors.accent/background-amber}` /
  `{colors.accent/background-blue}`, text `{colors.status/positive}` /
  `{colors.status/negative}` / `{colors.status/cautionary}` /
  `{colors.status/info}`, type `{typography.Desktop/Label/2/medium}`,
  `rounded: {rounded.radius/full}`, padding 2px 10px.
- Marks API-key connection state, position side, and informational tags.

**`live-dot`** — live data indicator
- 6×6, `{colors.primary/normal}`, `rounded: {rounded.radius/full}`.
  Wrapped in a pulsing ring (`live-ring` keyframe, 1.6s loop, scale
  1 → 2.4, opacity 0.8 → 0).
- The **only perpetual loop in the entire system**. Present on the live
  balance value and on any streaming-data label.

**`focus-ring`** — accessible focus aura
- 2px outline `{colors.outline/selected}` with 2px offset. Applied via
  `.focus-ring` utility class on every interactive element.
- The ring is the same lime as `{colors.primary/normal}` — focus is the
  same visual weight as primary CTA, which is intentional for keyboard
  navigation.

## Do's and Don'ts

### Do

- Use `{colors.background/normal-normal}` (`#0a0a0a`) as the only page
  root. Never `#000000`, never near-black.
- Use `{component.button-primary}` (lime pill on dark) as the primary CTA
  on every surface. Lime is the brand stamp.
- Reserve `{colors.primary/normal}` for primary CTA, active state, focus
  ring, live indicator, and chart strokes. Status uses
  `{colors.status/*}`, not lime.
- Set every interactive label in `{typography.Desktop/Label/1/bold}` (14px
  / 700 / 1.4) — non-negotiable for buttons and tags.
- Use `{rounded.radius/md}` (4px) on buttons, `{rounded.radius/2xl}`
  (16px) on cards, `{rounded.radius/full}` on avatars and pills. Each
  radius signals a different surface affordance.
- Apply elevation via the surface ladder
  (`{colors.background/normal-normal}` →
  `{colors.background/normal-alternative}` →
  `{colors.background/elevated-normal}` →
  `{colors.background/elevated-alternative}`). Hairlines, not shadows.
- Reference semantic tokens (`{colors.label/strong}`,
  `{colors.primary/normal}`) — never the atomic palette directly
  (`Primary 500`, `Neutral 950`).
- Use the asymmetric layout split — top-row `[3fr_2fr]` at xl,
  `[1fr_auto]` at lg.
- Animate only `transform` and `opacity`. Magnetic hover and scroll-
  reveal use `will-change: transform`, applied on hover-start and removed
  on hover-end.
- Use `prefers-reduced-motion: reduce` to collapse all motion to
  `duration: 0` for accessibility.

### Don't

- Don't use accent or status colours as button surfaces —
  `{colors.status/positive}` is for badges, never for
  `{component.button-primary}`.
- Don't use a near-black canvas. The brand is `#0a0a0a`, not `#171717`
  and not `#000000`.
- Don't pair white text with `{colors.primary/normal}` inside body
  content — lime text on dark is reserved for active state and CTAs,
  never long prose.
- Don't add drop shadows on cards. Elevation is canvas + surface
  luminance + 1px `{colors.line/normal-normal}` only.
- Don't introduce a secondary brand colour. Lime is the only brand
  stamp; new accents must come from the existing status palette.
- Don't loosen Manrope `lineHeight` past 1.2 on display sizes. Tight
  stacking is structural for the cockpit feel.
- Don't use animated spinner circles for loading. The skeleton block
  always.
- Don't stack `{colors.background/normal-normal}` against another dark
  surface beyond `{colors.background/normal-alternative}` and
  `{colors.background/elevated-normal}`. The ladder has only four steps.
- Don't introduce 3-equal-column layouts. Use the asymmetric split.
- Don't use `position: absolute` to overlap data zones — every element
  has its own spatial cell.
- Don't use `h-screen` — use `min-h-[100dvh]` to respect mobile chrome.
- Don't reference atomic palette tokens (`Primary 500`, `Neutral 950`)
  in code; always go through the semantic layer.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | 3-up + 1-up cockpit grid, full sidebar 240px, table sticky header. |
| Desktop | 1280–1439px | Container shrinks; Balance card narrows; sidebar 240px. |
| Tablet Large | 1024–1279px | Top row `[1fr_auto]`; Balance card and Ratio card stack horizontally. |
| Tablet | 768–1023px | Cards collapse to single column; sidebar still 240px. |
| Mobile Large | 426–767px | Sidebar collapses to bottom tab bar; tables go horizontal-scroll with `min-w-[820px]`; period-pills convert to scroll-rail. |
| Mobile | ≤ 425px | All grids 1-up; hero values clamp to 24px; section padding `{spacing.space/lg}` collapses to `{spacing.space/base}`. |

### Touch Targets

- All interactive elements ship at minimum 44px tap target — comfortably
  exceeds WCAG AAA. Default `{component.button-primary}` is 36px desktop;
  hit-area is padded to 44px on touch via outer wrapper.
- `{component.text-input}` is 44px tall — fintech-grade accessibility.
- `{component.sidebar-nav-item}` is 56px — full-width edge-to-edge so the
  entire row is hit-able on touch.

### Collapsing Strategy

- The mypage sidebar collapses to a fixed bottom tab bar at < 768px,
  showing only the Trading group icons; secondary groups move into a
  hamburger overflow.
- Top GNB collapses centre nav into a hamburger at < 1024px; the wordmark
  and `{component.button-primary}` stay anchored.
- Tables maintain `overflow-x-auto` with `min-w-[820px]` at every
  breakpoint — the symbol cell stays sticky to the left edge.
- Period-pill rows convert from a wrap row to a horizontal scroll-rail
  at < 768px.
- The two-column Deposit step layout (stepper + content) stacks
  vertically below lg — the stepper hides via `hidden lg:flex`.

### Image Behavior

- Donut and balance charts are SVG and re-flow with the container; no
  responsive variants needed.
- Exchange badge and avatar diameters scale 28→24→20 across breakpoints
  via Tailwind `size-*` classes (`{sizes.size/3xl}` →
  `{sizes.size/2xl}` → `{sizes.size/xl}`), never CSS `width: %`.
- Hero balance clamps via `clamp()`: 36px → 28px → 24px across the
  breakpoint ladder.

## Iteration Guide

1. Focus on ONE component at a time. Most surfaces share the
   `{colors.background/normal-normal}` /
   `{colors.background/normal-alternative}` pair with
   `{rounded.radius/2xl}` for cards and `{rounded.radius/md}` for buttons.
2. Reference component names and tokens directly
   (`{colors.primary/normal}`, `{component.button-primary}`,
   `{rounded.radius/2xl}`) — do not paraphrase or substitute hex values.
3. Run `npx tsc --noEmit` and `npx next build` after token changes;
   Tailwind purge will catch unused tokens automatically.
4. Add new variants as separate entries (`-hover`, `-pressed`, `-active`,
   `-disabled`) — do not bury them in prose.
5. Default body type to `{typography.Desktop/Body/3/regular}` (Manrope
   400). Reach for `{typography.Desktop/Label/1/medium}` (500) for UI
   labels, `{typography.Desktop/Label/1/bold}` (700) for buttons.
6. Keep `{colors.primary/normal}` scarce — if more than ~5 lime elements
   appear per viewport (CTA, focus ring, live dot, active sidebar item,
   active period-pill is the typical max), demote one to
   `{colors.status/positive}` or `{colors.background/elevated-normal}`.
7. When in doubt, drop a `{colors.line/normal-normal}` hairline before
   reaching for a shadow. The system has no shadow language by design.
8. Source of truth lives in `Color-semantic.json`, `Color-atomic.json`,
   `Space.json`, `Size.json`, `Radius.json`, `Text.json`. Update those
   first; the markdown body documents the system, it does not define it.

## Known Gaps

- Pressed/active visual states are documented for `button-primary-pressed`
  and the active period-pill; other components rely on the shared
  `{component.focus-ring}` for keyboard interaction feedback.
- Light-mode (`{colors.background/inverse}`, `{colors.line/solid-normal}`)
  surfaces are reserved for exports, screenshots, and printed reports —
  the live app shell is dark-mode only and there is no documented light
  theme parity.
- The atomic palette includes Orange, Yellow, Indigo, Violet, and Purple
  500 keys, but they are unused at the semantic layer; future iteration
  may introduce per-exchange identity tokens for venues beyond the
  primary trio.
- Mobile-app screenshot art direction (chart bezels, status bars) is not
  standardised as design tokens — it lives inside the Trade page
  components and should be lifted to this document when stable.
- Motion timings (`live-ring`, magnetic-hover spring, scroll-reveal
  stagger) are documented in prose under "Decorative Depth" rather than
  as first-class tokens; future iteration should add a `motion.*` block
  alongside `{typography}` and `{spacing}`.
- The `Desktop/Body/2/{bold,medium}`, `Desktop/Body/3/medium`,
  `Desktop/titles/h1-h5/{medium,regular}`, `Desktop/Label/2/{bold,
  regular}`, and `Desktop/Caption/{bold,medium}` weight variants exist
  in `Text.json` but are not enumerated in the YAML frontmatter above —
  reach into `Text.json` directly when those are needed.
