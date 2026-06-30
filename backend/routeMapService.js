/**
 * MilePilot Route Map Service — modular static maps from GPS coordinates.
 * Future-ready for enlarge, replay, heatmaps, and per-journey strips.
 */
import { createHash } from "crypto";

export const MAP_STYLE_VERSION = "2";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const svgCache = new Map();

const EMAIL_MAP_W = 440;
const EMAIL_MAP_H = 272;

export function downsampleRoute(points, max = 200) {
  const pts = (points || []).filter((p) => p && p.lat != null && p.lon != null);
  if (pts.length <= max) return pts;
  const step = Math.ceil(pts.length / max);
  return pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
}

export function extractRoutePoints(shift) {
  return (shift?.route || shift?.routePoints || []).filter((p) => p && p.lat != null && p.lon != null);
}

export function routeSectionTitle(period, periodLabel) {
  const map = {
    Daily: "Today's Business Route",
    Weekly: "This Week's Business Routes",
    Monthly: "This Month's Business Routes",
    WeeklySummary: "Weekly Route Summary",
    MonthlySummary: "Monthly Route Summary",
    Custom: periodLabel ? `${periodLabel} — Business Routes` : "Business Routes",
    Annual: "Annual Business Routes",
  };
  return map[period] || "Business Route";
}

function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of svgCache.entries()) {
    if (entry.expiresAt < now) svgCache.delete(key);
  }
}

function cacheKey(parts) {
  return createHash("sha256").update(`${MAP_STYLE_VERSION}|${parts.join("|")}`).digest("hex");
}

function getCachedSvg(key) {
  const entry = svgCache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    if (entry) svgCache.delete(key);
    return null;
  }
  return entry.svg;
}

function setCachedSvg(key, svg) {
  svgCache.set(key, { svg, expiresAt: Date.now() + CACHE_TTL_MS });
  pruneCache();
}

function projectJourneys(journeys, width, height, padding = 18) {
  const allPts = journeys.flatMap((j) => j.points);
  if (allPts.length < 2) return null;

  const lats = allPts.map((p) => p.lat);
  const lons = allPts.map((p) => p.lon);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLon = Math.min(...lons);
  let maxLon = Math.max(...lons);

  const midLat = (minLat + maxLat) / 2;
  const lonScale = Math.cos((midLat * Math.PI) / 180) || 1;
  const latSpan = Math.max(maxLat - minLat, 1e-5);
  const lonSpan = Math.max((maxLon - minLon) * lonScale, 1e-5);
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const scale = Math.min(innerW / lonSpan, innerH / latSpan);

  const project = (p) => [
    padding + ((p.lon - minLon) * lonScale) * scale + (innerW - (maxLon - minLon) * lonScale * scale) / 2,
    padding + (maxLat - p.lat) * scale + (innerH - latSpan * scale) / 2,
  ];

  return journeys.map((j) => ({
    ...j,
    mapped: j.points.map(project),
  }));
}

function buildGridLines(width, height, padding) {
  const lines = [];
  const cols = 6;
  const rows = 4;
  for (let i = 1; i < cols; i++) {
    const x = padding + ((width - padding * 2) * i) / cols;
    lines.push(`<line x1="${x.toFixed(1)}" y1="${padding}" x2="${x.toFixed(1)}" y2="${height - padding}" stroke="rgba(110,180,255,.08)" stroke-width="1"/>`);
  }
  for (let i = 1; i < rows; i++) {
    const y = padding + ((height - padding * 2) * i) / rows;
    lines.push(`<line x1="${padding}" y1="${y.toFixed(1)}" x2="${width - padding}" y2="${y.toFixed(1)}" stroke="rgba(110,180,255,.08)" stroke-width="1"/>`);
  }
  return lines.join("");
}

function markerSvg(x, y, color, label) {
  return `<g>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${color}" opacity="0.2"/>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${color}" stroke="#FFFFFF" stroke-width="2"/>
    <text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="700" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${label}</text>
  </g>`;
}

export function generateRouteSvg(journeys, options = {}) {
  const width = options.width || EMAIL_MAP_W;
  const height = options.height || EMAIL_MAP_H;
  const withRoutes = (journeys || []).filter((j) => j.points?.length >= 2);
  if (!withRoutes.length) return null;

  const key = cacheKey([
    "svg",
    width,
    height,
    ...withRoutes.map((j) => j.id + ":" + j.points.length + ":" + j.points[0]?.lat + ":" + j.points[j.points.length - 1]?.lat),
  ]);
  const cached = getCachedSvg(key);
  if (cached) return cached;

  const projected = projectJourneys(withRoutes, width, height);
  if (!projected?.length) return null;

  const paths = projected
    .map((j) => {
      const d = j.mapped.map((m, i) => `${i === 0 ? "M" : "L"}${m[0].toFixed(1)},${m[1].toFixed(1)}`).join(" ");
      return { d, journey: j };
    })
    .filter((p) => p.d.length > 1);

  const glowPaths = paths.map((p) => `<path d="${p.d}" fill="none" stroke="rgba(13,107,255,.28)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  const corePaths = paths.map((p) => `<path d="${p.d}" fill="none" stroke="#5BB0FF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`).join("");

  const markers = projected
    .flatMap((j) => {
      const start = j.mapped[0];
      const end = j.mapped[j.mapped.length - 1];
      const samePoint = start[0] === end[0] && start[1] === end[1];
      const items = [markerSvg(start[0], start[1], "#20D781", "S")];
      if (!samePoint) items.push(markerSvg(end[0], end[1], "#EF4444", "F"));
      return items;
    })
    .join("");

  const svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Business route map">
    <defs>
      <linearGradient id="mpMapBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0A2854"/>
        <stop offset="100%" stop-color="#061A38"/>
      </linearGradient>
      <radialGradient id="mpMapGlow" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="rgba(13,107,255,.16)"/>
        <stop offset="100%" stop-color="rgba(13,107,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="0" fill="url(#mpMapBg)"/>
    <rect width="${width}" height="${height}" fill="url(#mpMapGlow)"/>
    ${buildGridLines(width, height, 18)}
    ${glowPaths}
    ${corePaths}
    ${markers}
  </svg>`;

  setCachedSvg(key, svg);
  return svg;
}

export function generateEmptyStateSvg(options = {}) {
  const width = options.width || EMAIL_MAP_W;
  const height = options.height || EMAIL_MAP_H;
  const message = options.message || "No business journeys were recorded during this period.";
  const key = cacheKey(["empty", width, height, message]);
  const cached = getCachedSvg(key);
  if (cached) return cached;

  const svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="No route data">
    <defs>
      <linearGradient id="mpEmptyBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0A2854"/>
        <stop offset="100%" stop-color="#061A38"/>
      </linearGradient>
      <radialGradient id="mpEmptyGlow" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="rgba(13,107,255,.12)"/>
        <stop offset="100%" stop-color="rgba(13,107,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#mpEmptyBg)"/>
    <rect width="${width}" height="${height}" fill="url(#mpEmptyGlow)"/>
    <circle cx="${width / 2}" cy="${height * 0.38}" r="28" fill="rgba(13,107,255,.08)" stroke="rgba(13,107,255,.22)" stroke-width="1.5"/>
    <path d="M${width / 2 - 10} ${height * 0.38 + 4} l7 7 14-16" fill="none" stroke="rgba(110,180,255,.35)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${width / 2}" y="${height * 0.62}" text-anchor="middle" fill="#93A8C4" font-size="14" font-weight="500" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">${message.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  </svg>`;

  setCachedSvg(key, svg);
  return svg;
}

/** @deprecated Use generateEmptyStateSvg — no fake route lines */
export function generatePlaceholderSvg(options = {}) {
  return generateEmptyStateSvg(options);
}

export function buildJourneyStats(shifts, analysis) {
  const totals = analysis?.totals || { mi: 0, sec: 0, journeys: 0, hmrc: 0 };
  const sorted = (shifts || []).slice().sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
  const longest = sorted.reduce((best, s) => (!best || Number(s.miles) > Number(best.miles) ? s : best), null);
  const avgMi = sorted.length ? totals.mi / sorted.length : 0;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  return {
    miles: totals.mi,
    sec: totals.sec,
    journeys: totals.journeys || sorted.length,
    hmrc: totals.hmrc,
    longestMi: longest ? Number(longest.miles) : 0,
    avgMi,
    startTime: first?.startISO || null,
    finishTime: last?.endISO || null,
  };
}

/** Future-ready journey map context for single/multi map layouts. */
export function buildRouteMapContext(shifts, analysis) {
  const period = analysis?.period || "Daily";
  const journeys = (shifts || []).map((shift, index) => {
    const points = downsampleRoute(extractRoutePoints(shift));
    return {
      id: shift.id || shift.shiftId || `journey_${index}`,
      shift,
      points,
      hasRoute: points.length >= 2,
      miles: Number(shift.miles || 0),
      seconds: Number(shift.seconds || 0),
      startISO: shift.startISO,
      endISO: shift.endISO,
    };
  });

  const hasAnyRoute = journeys.some((j) => j.hasRoute);
  const hasJourneys = journeys.length > 0;
  const layout = !hasJourneys ? "empty" : hasAnyRoute ? (journeys.filter((j) => j.hasRoute).length > 1 ? "multi" : "single") : "placeholder";

  return {
    period,
    title: routeSectionTitle(period, analysis?.periodLabel),
    journeys,
    hasAnyRoute,
    hasJourneys,
    layout,
    stats: buildJourneyStats(shifts, analysis),
  };
}

function fmtShiftTime(sec) {
  const s = Math.max(0, Number(sec) || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function fmtClock(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function money(v) {
  return `£${Number(v || 0).toFixed(2)}`;
}

export function drawPdfMiniRoute(doc, x, y, w, h, points, BRAND) {
  const pts = downsampleRoute(points || []);
  if (pts.length < 2) return false;

  const padding = 6;
  const lats = pts.map((p) => p.lat);
  const lons = pts.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const midLat = (minLat + maxLat) / 2;
  const lonScale = Math.cos((midLat * Math.PI) / 180) || 1;
  const latSpan = Math.max(maxLat - minLat, 1e-5);
  const lonSpan = Math.max((maxLon - minLon) * lonScale, 1e-5);
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const scale = Math.min(innerW / lonSpan, innerH / latSpan);

  doc.roundedRect(x, y, w, h, 6).fillAndStroke("#0B2348", "#1A3A5C");
  const mapped = pts.map((p) => [
    x + padding + ((p.lon - minLon) * lonScale) * scale + (innerW - (maxLon - minLon) * lonScale * scale) / 2,
    y + h - padding - (p.lat - minLat) * scale - (innerH - latSpan * scale) / 2,
  ]);

  doc.save();
  doc.moveTo(mapped[0][0], mapped[0][1]);
  for (let i = 1; i < mapped.length; i++) doc.lineTo(mapped[i][0], mapped[i][1]);
  doc.strokeColor("rgba(13,107,255,0.35)").lineWidth(3).stroke();
  doc.moveTo(mapped[0][0], mapped[0][1]);
  for (let i = 1; i < mapped.length; i++) doc.lineTo(mapped[i][0], mapped[i][1]);
  doc.strokeColor(BRAND.blue).lineWidth(1.4).stroke();

  const start = mapped[0];
  const end = mapped[mapped.length - 1];
  doc.circle(start[0], start[1], 3.2).fill("#20D781");
  doc.circle(start[0], start[1], 3.2).strokeColor("#FFFFFF").lineWidth(0.8).stroke();
  if (start[0] !== end[0] || start[1] !== end[1]) {
    doc.circle(end[0], end[1], 3.2).fill("#EF4444");
    doc.circle(end[0], end[1], 3.2).strokeColor("#FFFFFF").lineWidth(0.8).stroke();
  }
  doc.restore();
  return true;
}

export function drawPdfRouteHero(doc, ctx, analysis, margin, y, contentW, BRAND, helpers = {}) {
  const fmt = helpers.fmtShiftTime || fmtShiftTime;
  const fmtMoney = helpers.money || money;
  const mapH = 76;
  const statsH = 54;
  const panelH = mapH + statsH + 28;
  const title = ctx.title.toUpperCase();

  doc.roundedRect(margin, y, contentW, panelH, 14).fillAndStroke("#0B2348", "#1A3A5C");
  doc.fillColor("#6EB4FF").font("Helvetica-Bold").fontSize(7.5).text(title, margin + 18, y + 14, { characterSpacing: 0.8 });

  const mapX = margin + 14;
  const mapY = y + 28;
  const mapW = contentW - 28;

  if (ctx.hasAnyRoute) {
    const routeJourneys = ctx.journeys.filter((j) => j.hasRoute);
    routeJourneys.forEach((journey, idx) => {
      if (routeJourneys.length === 1) {
        drawPdfMiniRoute(doc, mapX, mapY, mapW, mapH, journey.points, BRAND);
      } else {
        const sliceW = mapW / routeJourneys.length - 4;
        drawPdfMiniRoute(doc, mapX + idx * (sliceW + 4), mapY, sliceW, mapH, journey.points, BRAND);
      }
    });
  } else {
    doc.roundedRect(mapX, mapY, mapW, mapH, 8).fillAndStroke("#061A38", "#1A3A5C");
    const msg = !ctx.hasJourneys
      ? "No business journeys were recorded during this period."
      : "GPS route maps appear once location data is saved.";
    doc.fillColor("#93A8C4").font("Helvetica").fontSize(8.5).text(msg, mapX + 12, mapY + mapH / 2 - 6, {
      width: mapW - 24,
      align: "center",
      lineGap: 1.2,
    });
  }

  const stats = ctx.stats;
  const statY = mapY + mapH + 12;
  const cols = [
    ["Business Miles", stats.miles.toFixed(1)],
    ["Driving Time", fmt(stats.sec)],
    ["Journeys", String(stats.journeys)],
    ["HMRC Est.", fmtMoney(stats.hmrc)],
  ];
  const colW = (contentW - 36) / 4;
  cols.forEach(([label, value], i) => {
    const sx = margin + 18 + i * colW;
    doc.fillColor("#93A8C4").font("Helvetica").fontSize(7).text(label.toUpperCase(), sx, statY, { width: colW - 4, characterSpacing: 0.4 });
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10).text(value, sx, statY + 12, { width: colW - 4 });
  });

  if (stats.longestMi > 0 || stats.startTime) {
    const meta = [
      stats.longestMi > 0 ? `Longest ${stats.longestMi.toFixed(1)} mi` : null,
      stats.avgMi > 0 ? `Avg ${stats.avgMi.toFixed(1)} mi` : null,
      stats.startTime ? `Start ${fmtClock(stats.startTime)}` : null,
      stats.finishTime ? `Finish ${fmtClock(stats.finishTime)}` : null,
    ]
      .filter(Boolean)
      .join("  ·  ");
    doc.fillColor("#93A8C4").font("Helvetica").fontSize(7.5).text(meta, margin + 18, statY + 30, { width: contentW - 36 });
  }

  return y + panelH + 18;
}
