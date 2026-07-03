/**
 * MilePilot Reporting System — Central Design Tokens (LOCKED v1.0)
 *
 * Single source of truth for colours, typography, spacing, radii, glow, and layout.
 * Do NOT hardcode styling in components — import from this file.
 *
 * Status: LOCKED — changes require explicit product approval.
 */

export const REPORTING_SYSTEM_VERSION = "1.0";
export const REPORTING_SYSTEM_STATUS = "LOCKED";

/** A4 PDF layout — frozen margins, page size, content width */
export const PDF_LAYOUT = Object.freeze({
  size: "A4",
  margin: 48,
  pageWidth: 595.28,
  pageHeight: 841.89,
  headerY: 44,
  sectionTitleSize: 18,
  bodyFontSize: 9,
  cardRadius: 14,
  footerTaglineSpacing: 16,
});

/** Email layout — frozen card grid and container dimensions */
export const EMAIL_LAYOUT = Object.freeze({
  containerWidth: 560,
  outerPadding: "32px 16px 48px",
  cardRadius: 20,
  kpiCardHeight: 108,
  kpiCardPadding: "24px 22px",
  kpiGutter: 8,
  greetingNameSize: 34,
  ctaMaxWidth: 320,
  ctaRadius: 14,
});

/** Typography scale — frozen hierarchy */
export const TYPOGRAPHY = Object.freeze({
  brandLogo: { size: 32, weight: 700 },
  greetingHead: { size: 16, weight: 500 },
  greetingName: { size: 34, weight: 800 },
  periodTitle: { size: 17, weight: 600 },
  kpiLabel: { size: 10, weight: 600, letterSpacing: "0.1em" },
  kpiValue: { size: 36, weight: 700 },
  pdfHeader: { size: 22, weight: "Helvetica-Bold" },
  pdfSection: { size: 18, weight: "Helvetica-Bold" },
});

export const DARK = Object.freeze({
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
});

export const LIGHT = Object.freeze({
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
});

/** @deprecated Use DARK — kept for backward compatibility */
export const theme = DARK;

export function resolveTheme(mode) {
  return mode === "light" ? LIGHT : DARK;
}

export const TOTAL_PAGES = 7;
export const PDF_FOOTER_TAGLINE = "Drive • Track • Claim";
