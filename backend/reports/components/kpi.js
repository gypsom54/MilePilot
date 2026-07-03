/**
 * Reusable KPI metric cards — Phase 5 visual polish.
 */
import { money, fmtDrivingTimeCompact } from "../format.js";

const LABEL_COLOR = "#8FA8C8";

export function drawKpiGrid(doc, margin, y, contentW, cards, theme, cols = 2) {
  const gap = 12;
  const cardW = (contentW - gap * (cols - 1)) / cols;
  const cardH = 76;
  const valueSize = (card) => (card.hero ? 25 : 16);
  const padX = 16;
  const padY = 18;

  cards.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + col * (cardW + gap);
    const cy = y + row * (cardH + gap);

    doc.save();
    doc.roundedRect(x - 1, cy - 1, cardW + 2, cardH + 2, 15).fill(theme.blueGlow || theme.cardBorder);
    doc.restore();

    doc.roundedRect(x, cy, cardW, cardH, 14).fillAndStroke(theme.card, theme.cardBorder);
    const accent = doc.linearGradient(x, cy, x + cardW, cy);
    accent.stop(0, theme.blue).stop(1, theme.blueSoft);
    doc.roundedRect(x + 1, cy + 1, cardW - 2, 3, 2).fill(accent);

    const labelText = card.label;
    doc.fillColor(LABEL_COLOR).font("Helvetica-Bold").fontSize(7).text(labelText.toUpperCase(), x + padX, cy + padY - 2, {
      width: cardW - padX * 2,
      characterSpacing: 0.8,
    });

    const displayValue = card.compactTime ? fmtDrivingTimeCompact(card.rawSec ?? 0) : card.value;
    doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(valueSize(card)).text(displayValue, x + padX, cy + padY + 12, {
      width: cardW - padX * 2,
      lineBreak: false,
    });

    if (card.hint) {
      doc.fillColor(theme.textSoft).font("Helvetica").fontSize(8).text(card.hint, x + padX, cy + cardH - 16, { width: cardW - padX * 2 });
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
    { label: "HMRC Estimate", value: money(a.totals.hmrc) },
    { label: "Trips Completed", value: String(a.totals.journeys) },
    { label: "Driving Time", value: fmtDrivingTimeCompact(a.totals.sec), compactTime: true, rawSec: a.totals.sec },
    { label: "Average Trip", value: avgTrip },
    { label: "Longest Journey", value: longest },
    { label: "Working Days", value: String(a.workingDays) },
    { label: "Reporting Period", value: periodRangeLabel, hint: a.reportId },
  ];
}
