import type { Config } from "tailwindcss";

/**
 * ReboundX Design System — Tailwind Token Mapping
 *
 * 소스: Color-semantic.json, Color-atomic.json, Space.json, Radius.json, Size.json, Text.json
 * 테마: Dark mode (단일 모드)
 * 폰트: Manrope (Google Fonts)
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
        // 페이지 배경 (background.normal-normal)
        background: "rgb(var(--color-bg-base) / <alpha-value>)",

        // 서피스 레이어 (background.normal-alt → elevated-alt)
        "surface-1": "rgb(var(--color-surface-1) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--color-surface-3) / <alpha-value>)",

        // 텍스트 (label.*)
        text: {
          primary: "rgb(var(--color-label-strong) / <alpha-value>)",
          secondary: "rgb(var(--color-label-neutral) / <alpha-value>)",
          tertiary: "rgb(var(--color-label-assistive) / <alpha-value>)",
          disabled: "rgb(var(--color-label-alternative) / <alpha-value>)",
          inverse: "rgb(var(--color-label-inverse) / <alpha-value>)",
        },

        // 아이콘
        icon: {
          secondary: "rgb(var(--color-label-alternative) / <alpha-value>)",
          tertiary: "rgb(var(--color-label-assistive) / <alpha-value>)",
        },

        // 테두리 (line.*)
        "border-subtle": "var(--color-line-normal-normal)",
        "border-normal": "var(--color-line-normal-neutral)",

        // 브랜드 Primary (#CAFF5D)
        primary: "rgb(var(--color-primary-normal) / <alpha-value>)",
        "primary-strong": "rgb(var(--color-primary-strong) / <alpha-value>)",
        "primary-heavy": "rgb(var(--color-primary-heavy) / <alpha-value>)",

        // 상태 색상
        positive: "rgb(var(--color-status-positive) / <alpha-value>)",
        negative: "rgb(var(--color-status-negative) / <alpha-value>)",
        cautionary: "rgb(var(--color-status-cautionary) / <alpha-value>)",
        info: "rgb(var(--color-status-info) / <alpha-value>)",

        // 액센트 배경
        "accent-primary": "var(--color-accent-bg-primary)",
      },

      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },

      fontSize: {
        // Desktop Titles
        "display-h1": ["64px", { lineHeight: "120%", letterSpacing: "-2%" }],
        "display-h2": ["48px", { lineHeight: "120%", letterSpacing: "-2%" }],
        "display-h3": ["40px", { lineHeight: "120%", letterSpacing: "-2%" }],
        "display-h4": ["32px", { lineHeight: "120%", letterSpacing: "-2%" }],
        "display-h5": ["24px", { lineHeight: "120%", letterSpacing: "-2%" }],
        // Desktop Body
        "body-1": ["20px", { lineHeight: "150%" }],
        "body-2": ["18px", { lineHeight: "150%" }],
        "body-3": ["16px", { lineHeight: "150%" }],
        // Desktop Label
        "label-1": ["14px", { lineHeight: "140%" }],
        "label-2": ["13px", { lineHeight: "140%" }],
        // Desktop Caption
        caption: ["12px", { lineHeight: "140%" }],
      },

      // ── Spacing (Space.json) ─────────────────────────────────────────────────
      // zero:0 / px:1 / xxs:2 / xs2:4 / xs:8 / sm:12 / base:16 /
      // md:20 / lg:24 / xl:28 / xl2:32 / xl3:40 / xl4:48 / xl5:60 / xl6:72
      spacing: {
        "space-0": "0px",
        "space-px": "1px",
        "space-xxs": "2px",
        "space-xs2": "4px",
        "space-xs": "8px",
        "space-sm": "12px",
        "space-base": "16px",
        "space-md": "20px",
        "space-lg": "24px",
        "space-xl": "28px",
        "space-xl2": "32px",
        "space-xl3": "40px",
        "space-xl4": "48px",
        "space-xl5": "60px",
        "space-xl6": "72px",
      },

      // ── Border Radius (Radius.json) ──────────────────────────────────────────
      // none:0 / sm:2 / md:4 / lg:8 / xl:12 / 2xl:16 / 3xl:24 / 4xl:32 / 5xl:48 / full:999
      borderRadius: {
        none: "0px",
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "48px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
