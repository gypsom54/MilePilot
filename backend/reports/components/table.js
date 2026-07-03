/**
 * Professional journey breakdown table.
 */
import { fmtClock, fmtDurationShort, fmtDateShort } from "../format.js";

function gpsStatus(shift) {
  const route = shift.route || shift.routePoints || [];
  if (route.length >= 2) return "GPS Verified";
  if (shift.gpsVerified) return "GPS Verified";
  return "Manual";
}

function journeyType(shift) {
  if (shift.tripType === "personal") return "Personal";
  if (shift.tripType === "business") return "Business";
  return shift.business === false ? "Personal" : "Business";
}

export function drawJourneyTable(doc, a, margin, y, contentW, theme, accountantMode = false) {
  const cols = accountantMode
    ? [margin + 6, margin + 52, margin + 92, margin + 132, margin + 168, margin + 208, margin + 252, margin + 302]
    : [margin + 6, margin + 58, margin + 98, margin + 138, margin + 178, margin + 218, margin + 268, margin + 318];
  const headers = accountantMode
    ? ["Date", "Start", "Finish", "Dur.", "Mi.", "Type", "GPS", "£"]
    : ["Date", "Start", "Finish", "Duration", "Distance", "Type", "GPS", "Class"];

  doc.roundedRect(margin, y, contentW, 22, 6).fill(theme.tableHead);
  headers.forEach((h, i) => {
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(7).text(h.toUpperCase(), cols[i], y + 8);
  });
  y += 22;

  const shifts = a.shifts || [];
  if (!shifts.length) {
    doc.rect(margin, y, contentW, 28).fill(theme.tableRow);
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(9).text("No journeys in this period.", margin + 12, y + 10);
    return y + 36;
  }

  shifts.forEach((s, idx) => {
    const rowH = 22;
    if (y + rowH > doc.page.height - 80) return;
    doc.rect(margin, y, contentW, rowH).fill(idx % 2 === 0 ? theme.tableRow : theme.tableRowAlt);
    doc.fillColor(theme.text).font("Helvetica").fontSize(7.5);
    doc.text(fmtDateShort(s.startISO), cols[0], y + 7, { width: 44 });
    doc.text(fmtClock(s.startISO), cols[1], y + 7);
    doc.text(fmtClock(s.endISO), cols[2], y + 7);
    doc.text(fmtDurationShort(s.seconds), cols[3], y + 7);
    doc.font("Helvetica-Bold").text(Number(s.miles || 0).toFixed(1), cols[4], y + 7);
    doc.font("Helvetica").text(journeyType(s), cols[5], y + 7);
    doc.text(gpsStatus(s), cols[6], y + 7);
    if (accountantMode) {
      doc.font("Helvetica-Bold").text("£" + Number(s.hmrc || 0).toFixed(2), cols[7], y + 7);
    } else {
      doc.text(journeyType(s) === "Business" ? "Business" : "Personal", cols[7], y + 7);
    }
    y += rowH;
  });

  return y + 12;
}
