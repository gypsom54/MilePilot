/**
 * MilePilot Report Engine — MP-012 Premium Document v4
 * PDF = premium business record · Email = concise preview
 */

import PDFDocument from "pdfkit";
import { createHash } from "crypto";

export const BRAND = {
  navy: "#031126",
  panel: "#0B2348",
  blue: "#0D6BFF",
  blueDark: "#0A52D4",
  muted: "#64748B",
  soft: "#B9C8DD",
  light: "#F8FBFF",
  pageBg: "#E8EEF6",
  border: "#DDE6F2",
  text: "#06112A",
  green: "#10B981",
  white: "#FFFFFF",
};

export const VEHICLE_RATES = {
  car: 0.55,
  van: 0.55,
  bicycle: 0.2,
  motorcycle: 0.24,
};

export const VEHICLE_LABELS = {
  car: "Car",
  van: "Van",
  bicycle: "Bicycle",
  motorcycle: "Motorcycle",
};

export const REPORT_VERSION = "MP-012-pdf-v4";
const APP_URL = "https://app.milepilot.uk";
const SITE_URL = "www.milepilot.uk";

/** Locked brand lockup — must match app `.brand-bar` exactly */
export const BRAND_TAGLINE = "Drive • Track • Claim";
export const BRAND_WORDMARK_SIZE = 34;
export const BRAND_PULSE_WIDTH = 200;

export function buildReportDeepLink(report, download = false) {
  const map = { Daily: "day", Weekly: "week", Monthly: "month", Annual: "year" };
  const p = map[report.period || "Daily"] || "day";
  return `${APP_URL}/?reports=${p}${download ? "&download=1" : ""}`;
}

export function buildBrandEmailHeader() {
  return `<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 8px 28px;text-align:center;">
  <div style="font-size:34px;font-weight:700;color:#FFFFFF;letter-spacing:-0.04em;line-height:1;-webkit-font-smoothing:antialiased;">Mile <span style="color:#0D6BFF;">Pilot</span></div>
  <div style="height:2px;width:200px;max-width:100%;margin:12px auto 0;border-radius:999px;background:linear-gradient(90deg,rgba(13,107,255,.5) 0%,rgba(110,180,255,.92) 50%,rgba(13,107,255,.5) 100%);box-shadow:0 0 22px rgba(13,107,255,.28),0 0 10px rgba(13,107,255,.16);"></div>
  <p style="margin:10px 0 0;font-size:11px;font-weight:600;letter-spacing:0.12em;color:rgba(110,180,255,.82);">${BRAND_TAGLINE}</p>
</td></tr></table>`;
}

const ALLOWANCE_LABELS = [
  "Estimated Tax Allowance",
  "Mileage Allowance",
  "Business Mileage Value",
  "Estimated Mileage Relief",
];

function money(v) {
  return "£" + Number(v || 0).toFixed(2);
}

function vehicleLabel(v) {
  return VEHICLE_LABELS[v] || v || "—";
}

function fmtShiftTime(sec) {
  sec = Number(sec) || 0;
  if (sec < 60) return "0h 00m";
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}

function fmtDurationShort(sec) {
  sec = Number(sec) || 0;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}

function fmtClock(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtDateLong(d = new Date()) {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function firstName(full) {
  const n = (full || "").trim();
  if (!n) return "";
  return n.split(/\s+/)[0];
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function periodReadyLine(period) {
  const map = {
    Daily: "Your driving summary for today is ready.",
    Weekly: "Your driving summary for this week is ready.",
    Monthly: "Your driving summary for this month is ready.",
    Annual: "Your annual driving summary is ready.",
  };
  return map[period] || "Your driving summary is ready.";
}

function periodReportTitle(period) {
  const map = {
    Daily: "Daily Business Mileage Report",
    Weekly: "Weekly Business Mileage Report",
    Monthly: "Monthly Business Mileage Summary",
    Annual: "Annual Business Mileage Summary",
  };
  return map[period] || `${period} Business Mileage Report`;
}

function periodDocTitle(period) {
  const map = {
    Daily: "Daily Business Summary",
    Weekly: "Weekly Business Summary",
    Monthly: "Monthly Business Summary",
    Annual: "Annual Business Summary",
  };
  return map[period] || "Business Mileage Summary";
}

function periodEmailHeadline(period) {
  const map = {
    Daily: "Your Daily Business Mileage Report is Ready",
    Weekly: "Your Weekly Business Mileage Report is Ready",
    Monthly: "Your Monthly Business Mileage Report is Ready",
    Annual: "Your Annual Business Mileage Report is Ready",
  };
  return map[period] || "Your Business Mileage Report is Ready";
}

function periodEmailBody(period) {
  const map = {
    Daily: "We've finished preparing today's mileage report.",
    Weekly: "We've finished preparing this week's mileage report.",
    Monthly: "We've finished preparing this month's mileage report.",
    Annual: "We've finished preparing your annual mileage report.",
  };
  return map[period] || "We've finished preparing your mileage report.";
}

function fmtDateShort(d = new Date()) {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function pickAllowanceLabel(report) {
  const seed = createHash("md5").update(`${report.period}|${report.driver}|${new Date().toISOString().slice(0, 10)}`).digest("hex");
  return ALLOWANCE_LABELS[parseInt(seed.slice(0, 2), 16) % ALLOWANCE_LABELS.length];
}

function getWeekEndingDate() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function weekStartDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function primaryVehicle(shifts) {
  if (!shifts.length) return "car";
  const counts = {};
  shifts.forEach((s) => {
    const v = s.vehicle || "car";
    counts[v] = (counts[v] || 0) + 1;
  });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
}

function hmrcRateForShifts(shifts) {
  return VEHICLE_RATES[primaryVehicle(shifts)] || 0.55;
}

function sumShifts(list) {
  return {
    mi: list.reduce((a, b) => a + Number(b.miles || 0), 0),
    sec: list.reduce((a, b) => a + Number(b.seconds || 0), 0),
    hmrc: list.reduce((a, b) => a + Number(b.hmrc || 0), 0),
    journeys: list.length,
  };
}

function groupByDay(shifts) {
  const map = {};
  shifts.forEach((s) => {
    const d = new Date(s.startISO || Date.now());
    const key = d.toLocaleDateString("en-GB", { weekday: "long" });
    if (!map[key]) map[key] = { miles: 0, seconds: 0, trips: 0 };
    map[key].miles += Number(s.miles || 0);
    map[key].seconds += Number(s.seconds || 0);
    map[key].trips += 1;
  });
  const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return order.map((k) => ({ day: k, miles: map[k]?.miles || 0, seconds: map[k]?.seconds || 0, trips: map[k]?.trips || 0 }));
}

function longestShift(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.seconds || 0) > Number(a.seconds || 0) ? b : a));
}

function longestJourney(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.miles || 0) > Number(a.miles || 0) ? b : a));
}

function busiestDay(shifts) {
  const days = groupByDay(shifts).filter((d) => d.miles > 0);
  if (!days.length) return null;
  return days.reduce((a, b) => (b.miles > a.miles ? b : a));
}

function mostProductiveHour(shifts) {
  const buckets = {};
  shifts.forEach((s) => {
    const h = new Date(s.startISO).getHours();
    buckets[h] = (buckets[h] || 0) + Number(s.miles || 0);
  });
  let best = null;
  let bestMi = 0;
  Object.keys(buckets).forEach((h) => {
    if (buckets[h] > bestMi) {
      bestMi = buckets[h];
      best = Number(h);
    }
  });
  if (best === null) return null;
  const end = (best + 1) % 24;
  return {
    label: `${String(best).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`,
    miles: bestMi,
  };
}


function longestShiftInList(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.seconds || 0) > Number(a.seconds || 0) ? b : a));
}

function monthProgressFromWeek(weekTotals) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  if (dayOfMonth <= 0 || weekTotals.mi <= 0) return null;
  const dailyRate = weekTotals.mi / Math.min(dayOfMonth, 7);
  const projectedMi = dailyRate * daysInMonth;
  const projectedHmrc = (weekTotals.hmrc / Math.max(weekTotals.mi, 0.001)) * projectedMi;
  return { projectedMi, projectedHmrc, dayOfMonth, daysInMonth };
}

function adminHoursSaved(monthlyJourneys) {
  // ~12 min admin per journey manually logged
  return Math.round((monthlyJourneys * 12) / 60 * 10) / 10;
}

function collectRoutePoints(shifts) {
  const points = [];
  shifts.forEach((s) => {
    const route = s.route || s.routePoints || [];
    route.forEach((p) => {
      const lat = p.lat ?? p.latitude;
      const lon = p.lon ?? p.longitude ?? p.lng;
      if (lat != null && lon != null) points.push({ lat: Number(lat), lon: Number(lon) });
    });
  });
  return points;
}
function generateReportId(report, a) {
  const raw = `${a.period}|${a.driver}|${new Date().toISOString().slice(0, 10)}|${a.totals.mi}`;
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 8).toUpperCase();
  const prefix = { Daily: "DY", Weekly: "WK", Monthly: "MO", Annual: "YR" }[a.period] || "RP";
  return `MP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${prefix}-${hash}`;
}

export function analyseReport(report) {
  const shifts = (report.shifts || []).slice().sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
  const weekShifts = (report.weekShifts || shifts).slice().sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
  const prev = report.previousPeriod || {};
  const prevWeek = report.previousWeek || {};
  const totals = sumShifts(shifts);
  const weekTotals = sumShifts(weekShifts);
  const prevTotals = {
    mi: Number(prev.miles ?? prev.mi ?? 0),
    sec: Number(prev.seconds ?? prev.sec ?? 0),
    hmrc: Number(prev.hmrc ?? 0),
    journeys: Number(prev.journeys ?? 0),
  };
  const prevWeekTotals = {
    mi: Number(prevWeek.miles ?? prevWeek.mi ?? 0),
    sec: Number(prevWeek.seconds ?? prevWeek.sec ?? 0),
    hmrc: Number(prevWeek.hmrc ?? 0),
    journeys: Number(prevWeek.journeys ?? 0),
  };

  const longest = longestShift(shifts);
  const longestJ = longestJourney(shifts);
  const busiest = busiestDay(weekShifts.length ? weekShifts : shifts);
  const productiveHour = mostProductiveHour(shifts);
  const workingDays = new Set(shifts.map((s) => new Date(s.startISO).toDateString())).size;
  const weekWorkingDays = new Set(weekShifts.map((s) => new Date(s.startISO).toDateString())).size;
  const avgShiftSec = shifts.length ? totals.sec / shifts.length : 0;
  const weekAvgShiftSec = weekShifts.length ? weekTotals.sec / weekShifts.length : 0;
  const avgMilesShift = shifts.length ? totals.mi / shifts.length : 0;
  const weekAvgMilesDay = weekWorkingDays ? weekTotals.mi / weekWorkingDays : 0;
  const hmrcRate = Number(report.hmrcRate) || hmrcRateForShifts(shifts.length ? shifts : weekShifts);
  const allowanceLabel = pickAllowanceLabel(report);

  let weekComparePct = null;
  if (prevWeekTotals.mi > 0 && weekTotals.mi > 0) {
    weekComparePct = Math.round((weekTotals.mi / prevWeekTotals.mi - 1) * 100);
  } else if (prevTotals.mi > 0 && totals.mi > 0) {
    weekComparePct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
  }

  const miDiff = totals.mi - prevTotals.mi;
  const hmrcDiff = totals.hmrc - prevTotals.hmrc;
  const avgSpeedMph = totals.sec > 0 ? totals.mi / (totals.sec / 3600) : 0;

  const now = new Date();
  const generatedAt = fmtDateLong(now);
  const generatedAtTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const weekLongest = longestShiftInList(weekShifts);
  const monthProgress = monthProgressFromWeek(weekTotals);
  const prevAvgJourney = prevTotals.journeys > 0 ? prevTotals.mi / prevTotals.journeys : 0;
  const journeyLengthChange =
    prevAvgJourney > 0 && avgMilesShift > 0 ? avgMilesShift - prevAvgJourney : null;

  const analysis = {
    totals,
    weekTotals,
    prevTotals,
    prevWeekTotals,
    shifts,
    weekShifts,
    driver: (report.driver || "").trim(),
    period: report.period || "Daily",
    dailyActivity: groupByDay(weekShifts),
    longest,
    longestJ,
    busiest,
    productiveHour,
    workingDays,
    weekWorkingDays,
    avgShiftSec,
    weekAvgShiftSec,
    avgMilesShift,
    weekAvgMilesDay,
    hmrcRate,
    allowanceLabel,
    weekComparePct,
    miDiff,
    hmrcDiff,
    avgSpeedMph,
    weekLongest,
    monthProgress,
    journeyLengthChange,
    prevAvgJourney,
    weekEnding: getWeekEndingDate(),
    generatedAt,
    generatedAtTime,
  };

  analysis.reportId = generateReportId(report, analysis);
  return analysis;
}

export function buildIntelligence(a) {
  const {
    totals,
    weekTotals,
    shifts,
    weekShifts,
    longestJ,
    longest,
    productiveHour,
    prevTotals,
    prevWeekTotals,
    miDiff,
    period,
    weekComparePct,
    busiest,
    avgMilesShift,
    avgShiftSec,
    weekAvgShiftSec,
    weekLongest,
    monthProgress,
    journeyLengthChange,
    hmrcRate,
  } = a;

  const items = [];
  const noPeriodJourneys = !shifts.length;
  const noWeekJourneys = !weekShifts.length;

  if (noPeriodJourneys) {
    if (period === "Daily") {
      items.push("No journeys were recorded today.");
    } else {
      items.push(`No journeys were recorded this ${period.toLowerCase()}.`);
    }
    if (weekTotals.mi > 0) {
      items.push(`Your weekly mileage stands at ${weekTotals.mi.toFixed(1)} miles — still on track.`);
    } else if (!noWeekJourneys) {
      items.push("Your weekly mileage remains on track.");
    }
    items.push("When you start driving, MilePilot will automatically record every business mile.");
    if (monthProgress?.projectedHmrc > 0) {
      items.push(`On track to claim approximately ${money(monthProgress.projectedHmrc)} this month.`);
    }
    return { empty: true, items: items.slice(0, 5) };
  }

  if (weekLongest && weekShifts.length) {
    items.push(`Longest shift this week: ${fmtShiftTime(weekLongest.seconds)}.`);
  } else if (longest) {
    items.push(`Longest shift: ${fmtShiftTime(longest.seconds)}.`);
  }

  if (weekComparePct !== null && Math.abs(weekComparePct) >= 1) {
    items.push(
      `You drove ${Math.abs(weekComparePct)}% ${weekComparePct > 0 ? "more" : "fewer"} business miles this week than last week.`
    );
  } else if (prevTotals.mi > 0 && Math.abs(miDiff) >= 0.1) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 1) {
      const prevLabel = period === "Daily" ? "yesterday" : "the previous period";
      items.push(`You drove ${Math.abs(pct)}% ${pct > 0 ? "more" : "less"} than ${prevLabel}.`);
    }
  }

  if (busiest) {
    items.push(`Your busiest day this week was ${busiest.day} (${busiest.miles.toFixed(1)} miles).`);
  }

  if (productiveHour) {
    items.push(`Busiest hour: ${productiveHour.label} — ${productiveHour.miles.toFixed(1)} business miles.`);
  }

  if (journeyLengthChange !== null && Math.abs(journeyLengthChange) >= 0.2) {
    const prev = a.prevAvgJourney.toFixed(1);
    const curr = avgMilesShift.toFixed(1);
    items.push(`Average journey length ${journeyLengthChange > 0 ? "increased" : "decreased"} from ${prev} to ${curr} miles.`);
  } else if (avgMilesShift > 0 && shifts.length >= 2) {
    items.push(`Average journey: ${avgMilesShift.toFixed(1)} miles · ${fmtDurationShort(avgShiftSec)}.`);
  }

  if (weekAvgShiftSec > 0 && weekShifts.length >= 2) {
    items.push(`Average shift this week: ${fmtShiftTime(weekAvgShiftSec)}.`);
  }

  if (longestJ) {
    items.push(`Longest journey: ${Number(longestJ.miles).toFixed(1)} miles (${fmtClock(longestJ.startISO)} – ${fmtClock(longestJ.endISO)}).`);
  }

  if (monthProgress && monthProgress.projectedHmrc > 0) {
    items.push(`On track to claim approximately ${money(monthProgress.projectedHmrc)} this month.`);
  } else if (weekTotals.hmrc > 0) {
    items.push(`This week's estimated HMRC value: ${money(weekTotals.hmrc)}.`);
  } else if (totals.hmrc > 0) {
    items.push(`Estimated HMRC claim: ${money(totals.hmrc)} (${totals.mi.toFixed(1)} mi at ${Math.round(hmrcRate * 100)}p/mile).`);
  }

  const yearProjection = weekTotals.mi > 0 ? (weekTotals.mi / 7) * 365 : totals.mi * 30;
  if (yearProjection >= 5000) {
    items.push(`At this pace, you're on track for ${Math.round(yearProjection).toLocaleString("en-GB")} business miles this year.`);
  }

  return { empty: false, items: items.slice(0, 6) };
}

const PDF = {
  margin: 56,
  headerH: 88,
  footerH: 88,
  unit: 8,
  sectionGap: 24,
  rowH: 32,
  panelRadius: 2,
};

function pageContentW(pageW) {
  return pageW - PDF.margin * 2;
}

function footerTop(pageH) {
  return pageH - PDF.footerH;
}

function fitFontSize(doc, text, maxW, startSize, minSize, font = "Helvetica-Bold") {
  let size = startSize;
  doc.font(font);
  while (size > minSize && doc.widthOfString(text) > maxW) size -= 1;
  return size;
}

function drawDivider(doc, margin, y, contentW, accent = true) {
  doc.moveTo(margin, y).lineTo(margin + contentW, y).strokeColor(accent ? BRAND.blue : BRAND.border).lineWidth(accent ? 0.75 : 0.5).stroke();
  return y + PDF.unit * 2;
}

function drawFooter(doc, a, margin, contentW, pageW) {
  const footY = footerTop(doc.page.height);
  drawDivider(doc, margin, footY - PDF.unit * 2, contentW, false);
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8.5).text(BRAND_TAGLINE, margin, footY + 4, { width: contentW, align: "center", characterSpacing: 0.8 });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text("Generated automatically by MilePilot", margin, footY + 18, { width: contentW, align: "center" });
  doc.text("Professional mileage reporting for self-employed drivers and couriers.", margin, footY + 30, { width: contentW, align: "center" });
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(7.5).text(SITE_URL, margin, footY + 42, { width: contentW, align: "center", link: `https://${SITE_URL}` });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(6.5).text(`${a.generatedAt}  ·  Report ID ${a.reportId}`, margin, footY + 56, { width: contentW, align: "center" });
  doc.text("Estimates are for record keeping only. Verify against official HMRC guidance or an accountant.", margin, footY + 68, { width: contentW, align: "center", lineGap: 0.6 });
}

function drawBrandPulse(doc, x, y, width = BRAND_PULSE_WIDTH) {
  const h = 1.5;
  doc.rect(x, y, width * 0.28, h).fill(BRAND.blueDark);
  doc.rect(x + width * 0.28, y, width * 0.44, h).fill("#7EC0FF");
  doc.rect(x + width * 0.72, y, width * 0.28, h).fill(BRAND.blueDark);
}

function ensureSpace(doc, y, needed, margin, contentW, pageW, a) {
  if (y + needed <= footerTop(doc.page.height) - PDF.unit * 2) return y;
  drawFooter(doc, a, margin, contentW, pageW);
  doc.addPage({ margin: 0 });
  return drawPageHeader(doc, a, margin, contentW, pageW) + PDF.sectionGap;
}

/** Compact letterhead — logo only, document feel */
function drawPageHeader(doc, a, margin, contentW, pageW) {
  doc.rect(0, 0, pageW, PDF.headerH).fill(BRAND.navy);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(28).text("Mile ", margin, 20, { continued: true, lineBreak: false });
  doc.fillColor(BRAND.blue).text("Pilot", { lineBreak: false });
  drawBrandPulse(doc, margin, 54, 160);
  doc.fillColor("#6EB4FF").font("Helvetica").fontSize(8).text(BRAND_TAGLINE, margin, 64, { characterSpacing: 1 });
  const rightX = pageW - margin - 200;
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(7.5).text(`Report ID ${a.reportId}`, rightX, 24, { width: 200, align: "right" });
  if (a.driver) {
    doc.text(`Prepared for ${a.driver}`, rightX, 38, { width: 200, align: "right" });
  }
  return PDF.headerH + PDF.unit * 2;
}

function drawDocTitleBlock(doc, a, margin, contentW, y) {
  y = drawDivider(doc, margin, y, contentW);
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text(periodDocTitle(a.period).toUpperCase(), margin, y, {
    width: contentW,
    align: "center",
    characterSpacing: 1.6,
  });
  y += PDF.unit * 2;
  doc.fillColor(BRAND.text).font("Helvetica").fontSize(11).text(a.generatedAt, margin, y, { width: contentW, align: "center" });
  y += PDF.unit * 2;
  return drawDivider(doc, margin, y, contentW);
}

/** Financial-statement summary rows — not app cards */
function drawSummaryStatement(doc, a, margin, contentW, y) {
  const rows = [
    { label: "Business Miles", value: a.totals.mi.toFixed(1), emphasis: true },
    { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
    { label: "Journeys", value: String(a.totals.journeys) },
    { label: "Estimated HMRC Claim", value: money(a.totals.hmrc) },
  ];
  const boxH = rows.length * PDF.rowH + PDF.unit * 3;
  doc.rect(margin, y, contentW, boxH).strokeColor(BRAND.border).lineWidth(0.5).stroke();

  let ry = y + PDF.unit;
  rows.forEach((row, i) => {
    if (i > 0) {
      doc.moveTo(margin + PDF.unit * 2, ry).lineTo(margin + contentW - PDF.unit * 2, ry).strokeColor(BRAND.border).lineWidth(0.25).stroke();
    }
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(row.label, margin + PDF.unit * 2, ry + 10, { width: contentW / 2 });
    const valStr = String(row.value);
    const valSize = row.emphasis ? fitFontSize(doc, valStr, contentW / 2 - 16, 22, 16) : 11;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(valSize).text(valStr, margin + contentW / 2, ry + (row.emphasis ? 6 : 10), {
      width: contentW / 2 - PDF.unit * 2,
      align: "right",
    });
    ry += PDF.rowH;
  });
  return y + boxH + PDF.sectionGap;
}

function drawSectionHeadingSimple(doc, title, margin, y) {
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text(title.toUpperCase(), margin, y, { characterSpacing: 1.2 });
  return y + PDF.unit * 2;
}

function drawInsightSection(doc, intel, margin, contentW, y) {
  y = drawSectionHeadingSimple(doc, "MilePilot Intelligence", margin, y);
  y += PDF.unit;

  const items = intel.items.length ? intel.items : ["No additional insights for this period."];
  const boxH = items.length * 28 + PDF.unit * 3;
  doc.rect(margin, y, contentW, boxH).strokeColor(BRAND.border).lineWidth(0.5).stroke();

  let iy = y + PDF.unit * 1.5;
  items.forEach((text) => {
    doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(9).text("✓", margin + PDF.unit * 2, iy + 1);
    doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(text, margin + PDF.unit * 4, iy, { width: contentW - PDF.unit * 6, lineGap: 1.2 });
    iy += 28;
  });
  return y + boxH + PDF.sectionGap;
}

/** Accountant-style journey log entries */
function drawJourneyLog(doc, a, margin, contentW, y, pageW) {
  if (!a.shifts.length) {
    const boxH = 56;
    doc.rect(margin, y, contentW, boxH).strokeColor(BRAND.border).lineWidth(0.5).stroke();
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text("No journeys recorded in this period.", margin + PDF.unit * 2, y + 16, { width: contentW - 32 });
    doc.text("Start a shift and MilePilot will record every business mile automatically.", margin + PDF.unit * 2, y + 32, { width: contentW - 32 });
    return y + boxH + PDF.sectionGap;
  }

  a.shifts.forEach((s) => {
    const entryH = 64;
    if (y + entryH > footerTop(doc.page.height) - PDF.footerH) {
      drawFooter(doc, a, margin, contentW, pageW);
      doc.addPage({ margin: 0 });
      y = drawPageHeader(doc, a, margin, contentW, pageW) + PDF.sectionGap;
      y = drawSectionHeadingSimple(doc, "Journey Log (continued)", margin, y) + PDF.unit;
    }

    doc.rect(margin, y, contentW, entryH).strokeColor(BRAND.border).lineWidth(0.5).stroke();
    const d = new Date(s.startISO);
    const dateStr = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text(dateStr, margin + PDF.unit * 2, y + 10);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(11).text(fmtClock(s.startISO), margin + PDF.unit * 2, y + 24);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(11).text(fmtClock(s.endISO), margin + PDF.unit * 2, y + 38);

    const midX = margin + contentW * 0.38;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(`${Number(s.miles || 0).toFixed(1)} miles`, midX, y + 24);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(fmtDurationShort(s.seconds), midX, y + 40);

    doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text("BUSINESS", margin + contentW - 72, y + 28, { width: 56, align: "right", characterSpacing: 0.6 });

    y += entryH + PDF.unit;
  });
  return y + PDF.unit;
}

/** HMRC summary — document panel, value isolated on right */
function drawHmrcSummaryBox(doc, a, margin, contentW, y) {
  y = drawSectionHeadingSimple(doc, "HMRC Summary", margin, y);
  y += PDF.unit;

  const boxH = 96;
  const leftW = Math.floor(contentW * 0.55);
  const rightW = contentW - leftW - PDF.unit * 2;
  const rightX = margin + leftW + PDF.unit * 2;
  const pad = PDF.unit * 2;
  const hmrcVal = money(a.totals.hmrc);

  doc.rect(margin, y, contentW, boxH).strokeColor(BRAND.border).lineWidth(0.5).stroke();

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8.5);
  doc.text(`Current HMRC rate: ${Math.round(a.hmrcRate * 100)}p per mile`, margin + pad, y + pad);
  doc.text(`Business miles: ${a.totals.mi.toFixed(1)}`, margin + pad, y + pad + 14);
  doc.fontSize(7).text("Estimates for record keeping only. Verify before filing.", margin + pad, y + boxH - pad - 12, { width: leftW - pad, lineGap: 1 });

  doc.rect(rightX, y + pad, rightW, boxH - pad * 2).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(6.5).text("ESTIMATED ALLOWANCE", rightX + 8, y + pad + 8, { width: rightW - 16, align: "center", characterSpacing: 0.4 });
  const valSize = fitFontSize(doc, hmrcVal, rightW - 16, hmrcVal.length > 9 ? 20 : 24, 14);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(valSize).text(hmrcVal, rightX + 8, y + pad + 28, { width: rightW - 16, align: "center" });

  return y + boxH + PDF.sectionGap;
}

function drawProgressBar(doc, x, y, w, h, pct) {
  doc.rect(x, y, w, h).fill("#EEF2F8");
  const fillW = Math.max(2, w * Math.min(Math.max(pct, 0), 1));
  if (fillW > 0) doc.rect(x, y, fillW, h).fill(BRAND.blue);
}

function drawStatementRow(doc, label, value, margin, y, contentW, bold = false) {
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8.5).text(label, margin + PDF.unit * 2, y + 6);
  doc.fillColor(BRAND.text).font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 10 : 9).text(value, margin + contentW / 2, y + 6, {
    width: contentW / 2 - PDF.unit * 2,
    align: "right",
  });
  doc.moveTo(margin + PDF.unit * 2, y + PDF.rowH - 2).lineTo(margin + contentW - PDF.unit * 2, y + PDF.rowH - 2).strokeColor(BRAND.border).lineWidth(0.25).stroke();
  return y + PDF.rowH;
}

/** Page 3 — Weekly Overview document, not weekday list */
function drawWeeklyOverview(doc, a, intel, margin, contentW, y, pageW) {
  y = drawSectionHeadingSimple(doc, "Weekly Overview", margin, y);
  y += PDF.unit;

  const stats = [
    ["Total miles", a.weekTotals.mi > 0 ? `${a.weekTotals.mi.toFixed(1)} mi` : "—"],
    ["Average shift", a.weekAvgShiftSec > 0 ? fmtShiftTime(a.weekAvgShiftSec) : "—"],
    ["Best day", a.busiest ? `${a.busiest.day} · ${a.busiest.miles.toFixed(1)} mi` : "—"],
    ["Longest shift", a.weekLongest ? fmtShiftTime(a.weekLongest.seconds) : "—"],
    ["Mileage value", money(a.weekTotals.hmrc)],
    ["Business journeys", String(a.weekTotals.journeys)],
  ];

  const boxH = stats.length * PDF.rowH + PDF.unit * 2;
  y = ensureSpace(doc, y, boxH + 80, margin, contentW, pageW, a);
  doc.rect(margin, y, contentW, boxH).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  let sy = y + PDF.unit;
  stats.forEach(([label, val], i) => {
    sy = drawStatementRow(doc, label, val, margin, sy, contentW, i === 0 || i === 4);
  });
  y = sy + PDF.unit + PDF.sectionGap;

  // Weekly trend
  y = drawSectionHeadingSimple(doc, "Weekly Trend", margin, y);
  y += PDF.unit;
  const targetMi = Math.max(a.prevWeekTotals.mi, a.weekTotals.mi, 1);
  const pct = a.weekTotals.mi / targetMi;
  const trendH = 48;
  doc.rect(margin, y, contentW, trendH).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  drawProgressBar(doc, margin + PDF.unit * 2, y + 16, contentW - PDF.unit * 4, 8, pct);
  const trendLabel = a.weekComparePct !== null
    ? `${a.weekComparePct > 0 ? "+" : ""}${a.weekComparePct}% vs last week`
    : `${Math.round(pct * 100)}% of weekly target`;
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(trendLabel, margin + PDF.unit * 2, y + 30);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(9).text(`${a.weekTotals.mi.toFixed(1)} miles`, margin + contentW - PDF.unit * 2, y + 30, { width: 80, align: "right" });
  y += trendH + PDF.sectionGap;

  // Business insights from intelligence
  if (intel.items.length) {
    y = ensureSpace(doc, y, 80, margin, contentW, pageW, a);
    y = drawSectionHeadingSimple(doc, "Business Insights", margin, y);
    y += PDF.unit;
    const insightH = Math.min(intel.items.length, 4) * 24 + PDF.unit * 2;
    doc.rect(margin, y, contentW, insightH).strokeColor(BRAND.border).lineWidth(0.5).stroke();
    let iy = y + PDF.unit;
    intel.items.slice(0, 4).forEach((text) => {
      doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text("✓", margin + PDF.unit * 2, iy + 2);
      doc.fillColor(BRAND.text).font("Helvetica").fontSize(8.5).text(text, margin + PDF.unit * 4, iy, { width: contentW - PDF.unit * 6, lineGap: 1 });
      iy += 24;
    });
    y += insightH + PDF.sectionGap;
  }

  return y;
}

export function buildPdfBuffer(report) {
  return new Promise((resolve, reject) => {
    const a = analyseReport(report);
    const intel = buildIntelligence(a);
    const doc = new PDFDocument({ margin: 0, size: "A4", autoFirstPage: true });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const margin = PDF.margin;
    const contentW = pageContentW(pageW);

    // ── PAGE 1: Premium business document ──
    let y = drawPageHeader(doc, a, margin, contentW, pageW);
    y = drawDocTitleBlock(doc, a, margin, contentW, y);
    y += PDF.unit;
    y = drawSummaryStatement(doc, a, margin, contentW, y);
    y = ensureSpace(doc, y, 120, margin, contentW, pageW, a);
    y = drawInsightSection(doc, intel, margin, contentW, y);
    drawFooter(doc, a, margin, contentW, pageW);

    // ── PAGE 2: Journey log + HMRC ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    y = drawSectionHeadingSimple(doc, "Journey Log", margin, y);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("Professional record for your accountant", margin, y + PDF.unit, { width: contentW });
    y += PDF.unit * 3;
    y = drawJourneyLog(doc, a, margin, contentW, y, pageW);
    y = ensureSpace(doc, y, 120, margin, contentW, pageW, a);
    y = drawHmrcSummaryBox(doc, a, margin, contentW, y);
    drawFooter(doc, a, margin, contentW, pageW);

    // ── PAGE 3: Weekly overview ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(`Week ending ${a.weekEnding}`, margin, y, { width: contentW });
    y += PDF.unit * 2;
    y = drawWeeklyOverview(doc, a, intel, margin, contentW, y, pageW);
    drawFooter(doc, a, margin, contentW, pageW);

    doc.end();
  });
}


export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const headline = periodEmailHeadline(a.period);
  const bodyLine = periodEmailBody(a.period);

  const metric = (label, value) =>
    `<tr><td style="padding:0 0 12px;">
      <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#93A8C4;margin-bottom:6px;">${label}</div>
      <div style="font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;line-height:1.1;">${value}</div>
    </td></tr>`;

  const downloadUrl = buildReportDeepLink(report, true);
  const appUrl = `${APP_URL}/`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#031126;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0A2854 0%,#031126 100%);padding:44px 20px 52px;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
<tr><td style="padding:0 20px;">
  ${buildBrandEmailHeader()}
  <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#FFFFFF;line-height:1.4;letter-spacing:-0.02em;">${headline}</p>
  <p style="margin:0 0 8px;font-size:16px;color:#EAF2FF;line-height:1.5;">Hi ${name},</p>
  <p style="margin:0 0 8px;font-size:15px;color:#B9C8DD;line-height:1.55;">${bodyLine}</p>
  <p style="margin:0 0 28px;font-size:15px;color:#B9C8DD;line-height:1.55;">Everything has already been calculated and organised for your records.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    ${metric("Business Miles", a.totals.mi.toFixed(1))}
    ${metric("Driving Time", fmtShiftTime(a.totals.sec))}
    ${metric("Journeys", String(a.totals.journeys))}
    ${metric("Estimated HMRC", money(a.totals.hmrc))}
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td align="center" style="padding-bottom:10px;">
      <a href="${downloadUrl}" style="display:inline-block;width:100%;max-width:320px;background:linear-gradient(180deg,#1E88FF,#0D6BFF);color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:16px 24px;border-radius:14px;letter-spacing:-0.01em;box-sizing:border-box;">📄 Download PDF Report</a>
    </td></tr>
    <tr><td align="center">
      <a href="${appUrl}" style="display:inline-block;color:#93A8C4;font-size:14px;font-weight:600;text-decoration:none;padding:8px 16px;">Open MilePilot</a>
    </td></tr>
  </table>
  <p style="margin:0 0 36px;font-size:14px;color:#93A8C4;line-height:1.6;text-align:center;">Your PDF is attached.</p>
  <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.14em;color:#0D6BFF;text-align:center;">${BRAND_TAGLINE}</p>
  <p style="margin:0;font-size:13px;color:#B9C8DD;line-height:1.6;text-align:center;">Thank you for choosing MilePilot.<br><span style="color:#93A8C4;">Every mile matters.</span></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function buildReportEmailText(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  return `${periodEmailHeadline(a.period)}

Hi ${name},

${periodEmailBody(a.period)}
Everything has already been calculated and organised for your records.

Business Miles: ${a.totals.mi.toFixed(1)}
Driving Time: ${fmtShiftTime(a.totals.sec)}
Journeys: ${a.totals.journeys}
Estimated HMRC: ${money(a.totals.hmrc)}

Your PDF is attached.

View your report in MilePilot: ${buildReportDeepLink(report, true)}

Open MilePilot: ${APP_URL}/

Drive • Track • Claim
Thank you for choosing MilePilot.
Every mile matters.`;
}

export function buildReportSubject(report) {
  const period = report.period || "Daily";
  return periodEmailHeadline(period);
}
