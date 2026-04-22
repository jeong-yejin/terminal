import type { Config } from "tailwindcss";

/**
 * ReboundX Design System — Tailwind Token Mapping
 *
 * 소스: Color-semantic.json, Color-atomic.json, Space.json, Radius.json, Size.json, Text.json
 * 테마: Dark mode (단일 모드)
 * 폰트: Manrope (UI) + JetBrains Mono (financial data)
 *
 * Color Semantic → Tailwind 매핑
 * ─────────────────────────────────────────────────────
 * background.normal-normal        → bg-background           #0A0A0A
 * background.normal-alternative   → bg-surface-1            #171717
 * background.elevated-normal      → bg-surface-2            #262626
 * background.elevated-alternative → bg-surface-3            #404040
 * label.strong                    → text-text-primary        #FFFFFF
 * label.neutral                   → text-text-secondary      #D4D4D4
 * label.assistive                 → text-text-tertiary       #A3A3A3
 * label.alternative               → text-text-disabled       #737373
 * label.alternative               → text-icon-secondary      #737373
 * line.normal-normal              → border-border-subtle     rgba(#FFF,0.20)
 * primary.normal                  → *-primary                #CAFF5D
 * status.positive                 → *-positive               #22C55E
 * status.negative                 → *-negative               #EF4444
 * status.cautionary               → *-cautionary             #FBBF24
 * status.info                     → *-info                   #60A5FA
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ── Colors ──────────────────────────────────────────────────────────────
      colors: {
        background: "rgb(var(--color-bg-base) / <alpha-value>)",

        "surface-1": "rgb(var(--color-surface-1) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--color-surface-3) / <alpha-value>)",

        text: {
          primary:   "rgb(var(--color-label-strong)     / <alpha-value>)",
          secondary: "rgb(var(--color-label-neutral)    / <alpha-value>)",
          tertiary:  "rgb(var(--color-label-assistive)  / <alpha-value>)",
          disabled:  "rgb(var(--color-label-alternative)/ <alpha-value>)",
          inverse:   "rgb(var(--color-label-inverse)    / <alpha-value>)",
        },

        icon: {
          secondary: "rgb(var(--color-label-alternative)/ <alpha-value>)",
          tertiary:  "rgb(var(--color-label-assistive)  / <alpha-value>)",
        },

        "border-subtle": "var(--color-line-normal-normal)",
        "border-normal": "var(--color-line-normal-neutral)",
        "border-ghost":  "var(--color-line-normal-alternative)",

        primary:        "rgb(var(--color-primary-normal) / <alpha-value>)",
        "primary-strong":"rgb(var(--color-primary-strong)/ <alpha-value>)",
        "primary-heavy": "rgb(var(--color-primary-heavy) / <alpha-value>)",

        positive:    "rgb(var(--color-status-positive)   / <alpha-value>)",
        negative:    "rgb(var(--color-status-negative)   / <alpha-value>)",
        cautionary:  "rgb(var(--color-status-cautionary) / <alpha-value>)",
        info:        "rgb(var(--color-status-info)       / <alpha-value>)",

        "accent-primary": "var(--color-accent-bg-primary)",
        "accent-green":   "var(--color-accent-bg-green)",
        "accent-amber":   "var(--color-accent-bg-amber)",
        "accent-red":     "var(--color-accent-bg-red)",
        "accent-blue":    "var(--color-accent-bg-blue)",
      },

      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },

      fontSize: {
        "display-h1": ["64px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        "display-h2": ["48px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        "display-h3": ["40px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        "display-h4": ["32px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        "display-h5": ["24px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        "body-1":  ["20px", { lineHeight: "150%" }],
        "body-2":  ["18px", { lineHeight: "150%" }],
        "body-3":  ["16px", { lineHeight: "150%" }],
        "label-1": ["14px", { lineHeight: "140%" }],
        "label-2": ["13px", { lineHeight: "140%" }],
        caption:   ["12px", { lineHeight: "140%" }],
        ticker:    ["11px", { lineHeight: "140%", letterSpacing: "0" }],
      },

      // ── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        "space-0":    "0px",
        "space-px":   "1px",
        "space-xxs":  "2px",
        "space-xs2":  "4px",
        "space-xs":   "8px",
        "space-sm":   "12px",
        "space-base": "16px",
        "space-md":   "20px",
        "space-lg":   "24px",
        "space-xl":   "28px",
        "space-xl2":  "32px",
        "space-xl3":  "40px",
        "space-xl4":  "48px",
        "space-xl5":  "60px",
        "space-xl6":  "72px",
      },

      // ── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        none: "0px",
        sm:   "2px",
        md:   "4px",
        lg:   "8px",
        xl:   "12px",
        "2xl":"16px",
        "3xl":"24px",
        "4xl":"32px",
        "5xl":"48px",
        full: "9999px",
      },

      // ── Keyframes ────────────────────────────────────────────────────────────
      keyframes: {
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "row-in": {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "num-tick": {
          "0%":   { opacity: "0", transform: "translateY(5px)" },
          "60%":  { opacity: "1", transform: "translateY(-1px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "live-ring": {
          "0%":   { transform: "scale(1)",   opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        shimmer: {
          from: { backgroundPosition: "-400px 0" },
          to:   { backgroundPosition: " 400px 0" },
        },
        "line-trace": {
          from: { strokeDashoffset: "1000" },
          to:   { strokeDashoffset: "0" },
        },
        "pulse-data": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
      },

      // ── Animation ────────────────────────────────────────────────────────────
      animation: {
        "reveal-up":   "reveal-up 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "row-in":      "row-in 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "num-tick":    "num-tick 280ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "live-ring":   "live-ring 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        shimmer:       "shimmer 1.6s ease-in-out infinite",
        "line-trace":  "line-trace 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-data":  "pulse-data 2s ease-in-out infinite",
      },

      // ── Transition Timing Functions ──────────────────────────────────────────
      transitionTimingFunction: {
        spring:     "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-smooth":"cubic-bezier(0.16, 1, 0.3, 1)",
        snap:       "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
