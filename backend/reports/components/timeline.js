/**
 * Journey timeline — visual cards instead of spreadsheet rows.
 */
import { fmtClock, fmtDurationShort, fmtDateShort } from "../format.js";

function journeyStatus(shift) {
  if (shift.status) return shift.status;
  if (shift.tripType === "personal") return "Personal";
  const route = shift.route || shift.routePoints || [];
  if (route.length >= 2) return "Verified";
  return "Recorded";
}

function statusColor(status, theme) {
  if (status === "Verified") return theme.green;
  if (status === "Personal") return theme.textMuted;
  if (status === "Pending") return theme.amber;
  return theme.blueSoft;
}

export function drawJourneyTimeline(doc, a, margin, y, contentW, theme) {
  const shifts = a.shifts || [];
  if (!shifts.length) {
    doc.roundedRect(margin, y, contentW, 56, 12).fillAndStroke(theme.panelSoft, theme.cardBorder);
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(10).text("No journeys recorded in this period.", margin + 18, y + 22);
    return y + 72;
  }

  shifts.forEach((s, idx) => {
    const cardH = 58;
    if (y + cardH > doc.page.height - 90 && idx > 0) return y;

    doc.roundedRect(margin, y, contentW, cardH, 12).fillAndStroke(idx % 2 === 0 ? theme.panelSoft : theme.card, theme.cardBorder);

    const status = journeyStatus(s);
    const sc = statusColor(status, theme);
    doc.circle(margin + 20, y + cardH / 2, 5).fill(sc);

    doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(10).text(fmtDateShort(s.startISO), margin + 34, y + 12);
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(8.5);
    doc.text(`${fmtClock(s.startISO)} → ${fmtClock(s.endISO)}`, margin + 34, y + 26);
    doc.text(`${fmtDurationShort(s.seconds)} · ${Number(s.miles || 0).toFixed(1)} mi`, margin + 34, y + 38);

    doc.fillColor(sc).font("Helvetica-Bold").fontSize(8).text(status.toUpperCase(), margin + contentW - 78, y + 24, { width: 64, align: "right" });

    y += cardH + 8;
  });

  return y + 8;
}
