/**
 * Journey map panel — blue route with start/finish markers.
 */
import { buildRouteMapContext } from "../../../routeMapService.js";
import { drawPdfRouteHero } from "../../../routeMapService.js";
import { fmtShiftTime, money } from "../format.js";

export function drawJourneyMapPage(doc, a, margin, y, contentW, theme) {
  const ctx = buildRouteMapContext(a.shifts, a);
  const helpers = { fmtShiftTime, money };

  y = drawPdfRouteHero(doc, ctx, a, margin, y, contentW, {
    navy: theme.tableHead,
    blue: theme.blue,
    muted: theme.textMuted,
    text: theme.text,
    light: theme.panel,
    border: theme.cardBorder,
    green: theme.green,
  }, helpers);

  const stats = ctx.stats || {};
  const cardW = (contentW - 24) / 3;
  const statsY = y + 8;
  [
    ["Trip distance", `${Number(stats.miles || a.totals.mi).toFixed(1)} mi`],
    ["Duration", fmtShiftTime(stats.sec || a.totals.sec)],
    ["Avg. speed", a.avgSpeedMph > 0 ? `${a.avgSpeedMph.toFixed(0)} mph` : "—"],
  ].forEach(([label, val], i) => {
    const x = margin + i * (cardW + 12);
    doc.roundedRect(x, statsY, cardW, 48, 10).fillAndStroke(theme.card, theme.cardBorder);
    doc.fillColor(theme.textMuted).font("Helvetica-Bold").fontSize(7).text(label.toUpperCase(), x + 12, statsY + 12);
    doc.fillColor(theme.text).font("Helvetica-Bold").fontSize(12).text(val, x + 12, statsY + 26);
  });

  return statsY + 60;
}
