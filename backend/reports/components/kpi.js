/**
 * Reusable KPI metric cards.
 */
import { money, fmtShiftTime } from "../format.js";

export function drawKpiGrid(doc, margin, y, contentW, cards, theme, cols = 2) {
  const gap = 12;
  const cardW = (contentW - gap * (cols - 1)) / cols;
  const cardH = 68;

  cards.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + col * (cardW + gap);
    const cy = y + row * (cardH + gap);

    doc.roundedRect(x, cy, cardW, cardH, 14).fillAndStroke(theme.card, theme.cardBorder);
    const accent = doc.linearGradient(x, cy, x + cardW, cy);
    accent.stop(0, theme.blue).stop(1, theme.blueSoft);
    doc.roundedRect(x + 1, cy + 1, cardW - 2, 3, 2).fill(accent);

    doc.fillColor(theme.textMuted).font("Helvetica-Bold").fontSize(7).text(card.label.toUpperCase(), x + 14, cy + 16, {
      width: cardW - 28,
      characterSpacing: 0.8,
    });
    doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(card.hero ? 22 : 14).text(card.value, x + 14, cy + 30, {
      width: cardW - 28,
    });
    if (card.hint) {
      doc.fillColor(theme.textSoft).font("Helvetica").fontSize(8).text(card.hint, x + 14, cy + cardH - 18, { width: cardW - 28 });
    }
  });

  const rows = Math.ceil(cards.length / cols);
  return y + rows * (cardH + gap);
}

export function executiveKpis(a, periodRangeLabel) {
  const avgTrip = a.avgMilesShift > 0 ? `${a.avgMilesShift.toFixed(1)} mi` : "—";
  const longest = a.longestJ ? `${Number(a.longestJ.miles || 0).toFixed(1)} mi` : "—";
  return [
    { label: "Business Miles", value: a.totals.mi.toFixed(1), hero: true },
    { label: "Estimated HMRC Claim", value: money(a.totals.hmrc) },
    { label: "Trips Completed", value: String(a.totals.journeys) },
    { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
    { label: "Average Trip", value: avgTrip },
    { label: "Longest Journey", value: longest },
    { label: "Working Days", value: String(a.workingDays) },
    { label: "Reporting Period", value: periodRangeLabel, hint: a.reportId },
  ];
}
