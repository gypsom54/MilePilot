/**
 * Page layout — background, header, footer, section titles.
 */
import { TOTAL_PAGES, PDF_FOOTER_TAGLINE } from "../theme.js";

export function drawPageBackground(doc, theme) {
  const w = doc.page.width;
  const h = doc.page.height;
  const grad = doc.linearGradient(0, 0, 0, h);
  grad.stop(0, theme.bgGradientTop).stop(0.55, theme.bgGradientMid).stop(1, theme.bg);
  doc.rect(0, 0, w, h).fill(grad);
}

export function drawPageHeader(doc, a, margin, contentW, theme) {
  let y = 44;
  doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(22);
  doc.text("Mile ", margin, y, { continued: true, lineBreak: false });
  doc.fillColor(theme.blue).text("Pilot", { continued: false });

  const pulseY = y + 28;
  const pulseW = Math.min(contentW * 0.42, 200);
  doc.save();
  doc.roundedRect(margin - 2, pulseY - 3, pulseW + 4, 8, 4).fill(theme.blueGlow || theme.cardBorder);
  doc.restore();
  const pulseGrad = doc.linearGradient(margin, pulseY, margin + pulseW, pulseY);
  pulseGrad.stop(0, "#020B1B").stop(0.2, theme.blueSoft).stop(0.5, theme.blue).stop(0.8, theme.blueSoft).stop(1, "#020B1B");
  doc.rect(margin, pulseY, pulseW, 2).fill(pulseGrad);

  y += 38;
  if (a.driver) {
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(9).text(a.driver, margin, y);
    y += 14;
  }
  doc.fillColor(theme.blueSoft).font("Helvetica-Bold").fontSize(8).text(PDF_FOOTER_TAGLINE, margin, y, { characterSpacing: 1 });
  y += 16;

  doc.fillColor(theme.textMuted).font("Helvetica").fontSize(8);
  doc.text(`${a.generatedAt} · ${a.reportId}`, margin, y);
  const metaRight = `${a.period} Report`;
  doc.text(metaRight, margin, y, { width: contentW, align: "right" });
  y += 18;

  doc.moveTo(margin, y).lineTo(margin + contentW, y).strokeColor(theme.cardBorder).lineWidth(0.8).stroke();
  doc.moveTo(margin, y + 1).lineTo(margin + contentW, y + 1).strokeColor(theme.blueSoft).lineWidth(0.3).opacity(0.35).stroke();
  doc.opacity(1);
  return y + 22;
}

export function drawSectionTitle(doc, margin, y, overline, title, subtitle, theme) {
  const glowW = Math.min(120, doc.page.width - margin * 2);
  const glowGrad = doc.linearGradient(margin, y + 2, margin + glowW, y + 2);
  glowGrad.stop(0, theme.bg).stop(0.5, theme.blue).stop(1, theme.bg);
  doc.rect(margin, y + 2, glowW, 3).fill(glowGrad);

  doc.fillColor(theme.blue).font("Helvetica-Bold").fontSize(7.5).text(overline.toUpperCase(), margin, y, { characterSpacing: 1.4 });
  y += 16;
  doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(18).text(title, margin, y);
  y += 22;
  if (subtitle) {
    doc.fillColor(theme.textMuted).font("Helvetica").fontSize(10).text(subtitle, margin, y, { width: doc.page.width - margin * 2 });
    y += 18;
  }
  return y;
}

export function drawPageFooter(doc, pageNum, margin, contentW, theme) {
  const footY = doc.page.height - 42;
  doc.fillColor(theme.textSoft).font("Helvetica").fontSize(8);
  doc.text(`— ${pageNum} of ${TOTAL_PAGES} —`, margin, footY, { width: contentW, align: "center" });
  doc.text("milepilot.uk", margin, footY + 12, { width: contentW, align: "center" });
}

export function addPremiumPage(doc, a, margin, contentW, pageNum, theme, drawContent) {
  doc.addPage({ margin: 0, size: "A4" });
  drawPageBackground(doc, theme);
  let y = drawPageHeader(doc, a, margin, contentW, theme);
  y = drawContent(doc, a, margin, contentW, y, theme) || y;
  drawPageFooter(doc, pageNum, margin, contentW, theme);
}
