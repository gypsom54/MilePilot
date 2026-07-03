/**
 * MilePilot Phase 5 — Premium Report Design Tokens
 * Dark theme matches the app dashboard; light theme for print-friendly exports.
 */

export const DARK = {
  id: "dark",
  bg: "#020B1B",
  bgGradientTop: "#050F22",
  bgGradientMid: "#020B1B",
  panel: "#0B2348",
  panelSoft: "#0A1E3A",
  card: "#0B2348",
  cardBorder: "#1E4A8C",
  text: "#EAF2FF",
  textMuted: "#9FB4D0",
  textSoft: "#64748B",
  blue: "#0D6BFF",
  blueGlow: "#0A2040",
  blueSoft: "#6EB4FF",
  green: "#20D781",
  amber: "#EFB450",
  red: "#EF4444",
  tableHead: "#061A38",
  tableRow: "#081528",
  tableRowAlt: "#0A1A32",
};

export const LIGHT = {
  id: "light",
  bg: "#FFFFFF",
  bgGradientTop: "#F8FBFF",
  bgGradientMid: "#FFFFFF",
  panel: "#F7F9FC",
  panelSoft: "#F8FBFF",
  card: "#FFFFFF",
  cardBorder: "#DDE6F2",
  text: "#06112A",
  textMuted: "#64748B",
  textSoft: "#94A3B8",
  blue: "#0D6BFF",
  blueGlow: "rgba(13,107,255,0.18)",
  blueSoft: "#6EB4FF",
  green: "#10B981",
  amber: "#D97706",
  red: "#EF4444",
  tableHead: "#031126",
  tableRow: "#FFFFFF",
  tableRowAlt: "#F7F9FC",
};

export function resolveTheme(mode) {
  return mode === "light" ? LIGHT : DARK;
}

export const TOTAL_PAGES = 7;
export const PDF_FOOTER_TAGLINE = "Drive • Track • Claim";
