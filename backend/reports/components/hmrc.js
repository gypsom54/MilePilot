/**
 * HMRC summary panel with compliance disclaimer.
 */
import { money, ukTaxYear } from "../format.js";

export function drawHmrcSummary(doc, a, margin, y, contentW, theme) {
  const taxYear = ukTaxYear();
  const annualTotal = Number(a.annualRunningTotal ?? a.totals.hmrc);

  doc.roundedRect(margin, y, contentW, 148, 16).fillAndStroke(theme.card, theme.cardBorder);
  const accent = doc.linearGradient(margin, y, margin + contentW, y);
  accent.stop(0, theme.blue).stop(1, theme.blueSoft);
  doc.roundedRect(margin + 1, y + 1, contentW - 2, 4, 2).fill(accent);

  let innerY = y + 18;
  doc.fillColor(theme.blue).font("Helvetica-Bold").fontSize(8).text("HMRC SUMMARY", margin + 18, innerY, { characterSpacing: 1.2 });
  innerY += 20;

  const rows = [
    ["Business Miles", `${a.totals.mi.toFixed(1)} mi`],
    ["Current HMRC Rate", `${Math.round(a.hmrcRate * 100)}p per mile`],
    ["Estimated Tax Deduction", money(a.totals.hmrc)],
    ["Annual Running Total", money(annualTotal)],
    ["Tax Year", taxYear.label],
  ];

  rows.forEach(([label, val]) => {
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(9).text(label, margin + 18, innerY);
    doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(10).text(val, margin + contentW / 2, innerY, {
      width: contentW / 2 - 24,
      align: "right",
    });
    innerY += 18;
  });

  innerY += 4;
  doc.fillColor(theme.textSoft).font("Helvetica").fontSize(7.5).text(
    "Compliance notice: Figures shown are estimates for record keeping only. MilePilot does not provide tax advice. Verify all amounts against official HMRC guidance and your accountant before filing.",
    margin + 18,
    innerY,
    { width: contentW - 36, lineGap: 1.5 }
  );

  return y + 160;
}
