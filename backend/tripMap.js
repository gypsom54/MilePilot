/**
 * Server-side trip route map evidence — on-demand generation only.
 * Store GPS polylines + coordinates; generate thumbnails when building PDFs/emails.
 * Swap generateTripMapImage() for Google Static Maps / Mapbox Static Images later.
 */

export function routePoints(tripOrShift) {
  const pts = tripOrShift?.route || tripOrShift?.routePoints || [];
  if (!Array.isArray(pts)) return [];
  return pts.filter((p) => p && p.lat != null && p.lon != null && isFinite(p.lat) && isFinite(p.lon));
}

export function formatTripLocation(tripOrShift, which = "start") {
  const lat = which === "start" ? tripOrShift?.startLat : tripOrShift?.endLat;
  const lon = which === "start" ? tripOrShift?.startLon : tripOrShift?.endLon;
  if (lat != null && lon != null) return `${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)}`;
  const pts = routePoints(tripOrShift);
  if (!pts.length) return "—";
  const p = which === "start" ? pts[0] : pts[pts.length - 1];
  return `${Number(p.lat).toFixed(4)}, ${Number(p.lon).toFixed(4)}`;
}

/**
 * Placeholder static map image descriptor (SVG). PDF renderer draws inline.
 */
export function generateTripMapImage(tripOrShift, options = {}) {
  const width = options.width || 280;
  const height = options.height || 120;
  const pts = routePoints(tripOrShift);
  if (pts.length < 2) {
    return { format: "svg", svg: null, width, height, placeholder: true };
  }

  const lats = pts.map((p) => p.lat);
  const lons = pts.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latR = maxLat - minLat || 0.001;
  const lonR = maxLon - minLon || 0.001;
  const pad = 12;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const norm = (p) => ({
    x: pad + ((p.lon - minLon) / lonR) * innerW,
    y: pad + innerH - ((p.lat - minLat) / latR) * innerH,
  });

  const normalized = pts.map(norm);
  const line = normalized.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" rx="8" fill="#EEF2F8"/>` +
    `<polyline fill="none" stroke="#0D6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${line}"/>` +
    `<circle cx="${normalized[0].x.toFixed(1)}" cy="${normalized[0].y.toFixed(1)}" r="4" fill="#10B981"/>` +
    `<circle cx="${normalized[normalized.length - 1].x.toFixed(1)}" cy="${normalized[normalized.length - 1].y.toFixed(1)}" r="4" fill="#0D6BFF"/>` +
    `</svg>`;

  return { format: "svg", svg, width, height, placeholder: false, points: normalized };
}

export function drawTripMapThumbnail(doc, tripOrShift, x, y, w, h, colors = {}) {
  const blue = colors.blue || "#0D6BFF";
  const green = colors.green || "#10B981";
  const pts = routePoints(tripOrShift);
  doc.roundedRect(x, y, w, h, 4).fill("#EEF2F8").strokeColor("#DDE6F2").lineWidth(0.4).stroke();
  if (pts.length < 2) {
    doc.fillColor("#64748B").font("Helvetica").fontSize(7).text("No route", x, y + h / 2 - 4, { width: w, align: "center" });
    return;
  }

  const lats = pts.map((p) => p.lat);
  const lons = pts.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latR = maxLat - minLat || 0.001;
  const lonR = maxLon - minLon || 0.001;
  const pad = 6;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const norm = (p) => ({
    x: x + pad + ((p.lon - minLon) / lonR) * innerW,
    y: y + pad + innerH - ((p.lat - minLat) / latR) * innerH,
  });

  const npts = pts.map(norm);
  doc.moveTo(npts[0].x, npts[0].y);
  npts.slice(1).forEach((p) => doc.lineTo(p.x, p.y));
  doc.strokeColor(blue).lineWidth(1.2).stroke();
  doc.circle(npts[0].x, npts[0].y, 2.2).fill(green);
  doc.circle(npts[npts.length - 1].x, npts[npts.length - 1].y, 2.2).fill(blue);
}
