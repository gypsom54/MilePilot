/**
 * Locked email design tokens — must match docs/report-email-preview.html
 */
export const EMAIL = {
  bgDeep: "#031126",
  bgDark: "#020B1B",
  bgNavy: "#0A2854",
  bgMap: "#061A38",
  textPrimary: "#EAF2FF",
  textBody: "#C8D8EF",
  textMuted: "#B9C8DD",
  textSoft: "#93A8C4",
  textLegal: "#64748B",
  textAccent: "#6EB4FF",
  textBrand: "#0D6BFF",
  textWhite: "#FFFFFF",
  textTagline: "rgba(110,180,255,0.82)",
  green: "#20D781",
  amber: "#F0C35A",
  btnGradient: "linear-gradient(180deg,#1E88FF 0%,#0D6BFF 55%,#005FE8 100%)",
  shellGradient: "linear-gradient(180deg,#0A2854 0%,#031126 55%,#020B1B 100%)",
  fontStack:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif",
};

/** Inline colour with Gmail/Outlook dark-mode lock. */
export function c(color) {
  return `color:${color} !important;-webkit-text-fill-color:${color} !important;`;
}
