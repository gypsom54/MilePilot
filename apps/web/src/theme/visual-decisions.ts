/**
 * Provisional visual decisions — Sprint D1
 *
 * Direction: calm, premium, adviser-like. Soft ink on warm off-white.
 * Avoid neon, purple SaaS defaults, and dashboard chrome.
 *
 * Typography: Source Serif 4 (display) + Source Sans 3 (UI/body)
 * loaded from Google Fonts in global.css — provisional until brand kit exists.
 *
 * Motions: soft page fade-in on Home, mobile menu slide, CTA hover lift.
 * All respect prefers-reduced-motion.
 */
export const visualNotes = {
  brandMark: "Text wordmark only — no invented logo asset",
  palette: {
    canvas: "#F7F5F1",
    ink: "#1C1B19",
    muted: "#5C5954",
    accent: "#1F4D3A",
    accentSoft: "#E8F0EB",
    line: "#E4E0D8",
    surface: "#FFFFFF",
  },
  layout: {
    contentWidth: "42rem",
    pageWidth: "68rem",
    generousWhitespace: true,
  },
} as const;
