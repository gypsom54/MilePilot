/**
 * Verification certificate — final page with QR placeholder and badge.
 */
import { fmtDateLong } from "../format.js";

export function drawVerificationCertificate(doc, a, margin, y, contentW, theme) {
  const boxH = 320;
  doc.roundedRect(margin, y, contentW, boxH, 20).fillAndStroke(theme.card, theme.cardBorder);

  const accent = doc.linearGradient(margin, y, margin + contentW, y);
  accent.stop(0, theme.blue).stop(0.5, theme.blueSoft).stop(1, theme.blue);
  doc.roundedRect(margin + 1, y + 1, contentW - 2, 4, 2).fill(accent);

  let innerY = y + 24;
  doc.fillColor(theme.blue).font("Helvetica-Bold").fontSize(8).text("VERIFICATION CERTIFICATE", margin + 22, innerY, { characterSpacing: 1.4 });
  innerY += 22;
  doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(20).text("Digitally Verified Report", margin + 22, innerY);
  innerY += 32;

  const qrSize = 88;
  const qrX = margin + contentW - qrSize - 22;
  doc.roundedRect(qrX, innerY, qrSize, qrSize, 10).fillAndStroke(theme.panelSoft, theme.cardBorder);
  doc.fillColor(theme.textMuted).font("Helvetica-Bold").fontSize(10).text("QR", qrX + qrSize / 2 - 10, innerY + qrSize / 2 - 6);
  doc.fillColor(theme.textSoft).font("Helvetica").fontSize(7).text("Scan to verify", qrX, innerY + qrSize + 6, { width: qrSize, align: "center" });

  const meta = [
    ["Report ID", a.reportId],
    ["Generated", `${fmtDateLong()} at ${a.generatedAtTime}`],
    ["Tracking Mode", a.trackingMode || "AutoPilot"],
    ["GPS Confidence", a.gpsConfidence || `${a.gpsConfidencePct || 92}%`],
    ["Reporting Period", a.periodLabel || a.period],
  ];

  meta.forEach(([label, val]) => {
    doc.fillColor(theme.textMuted).font("Helvetica-Bold").fontSize(8).text(label.toUpperCase(), margin + 22, innerY);
    doc.fillColor(theme.text).font("Helvetica").fontSize(10).text(val, margin + 22, innerY + 12);
    innerY += 32;
  });

  innerY = y + boxH - 56;
  doc.roundedRect(margin + 22, innerY, contentW - 44, 36, 10).fill(theme.green);
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(11).text(
    "✓  MilePilot Verified — Authentic business mileage report",
    margin + 22,
    innerY + 12,
    { width: contentW - 44, align: "center" }
  );

  return y + boxH + 16;
}
