/**
 * MilePilot Report Engine — MP-013 Magazine Reports
 * Email = 30-second preview · PDF = 2–3 page premium experience
 */

import PDFDocument from "pdfkit";
import { createHash } from "crypto";

export const BRAND = {
  navy: "#031126",
  panel: "#0B2348",
  blue: "#0D6BFF",
  muted: "#64748B",
  soft: "#B9C8DD",
  light: "#F8FBFF",
  border: "#DDE6F2",
  text: "#06112A",
  green: "#10B981",
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

export const REPORT_VERSION = "MP-013-magazine-v4";
const APP_URL = "https://app.milepilot.uk";

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
    Daily: "Daily Driving Report",
    Weekly: "Weekly Driving Report",
    Monthly: "Monthly Driving Report",
    Annual: "Annual Driving Report",
  };
  return map[period] || `${period} Driving Report`;
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
    weekEnding: getWeekEndingDate(),
    generatedAt,
    generatedAtTime,
  };

  analysis.reportId = generateReportId(report, analysis);
  return analysis;
}

export function buildIntelligence(a) {
  const { totals, shifts, longestJ, productiveHour, prevTotals, miDiff, period } = a;

  if (!shifts.length) {
    const quiet = period === "Daily" ? "Today was a quiet day." : `This ${period.toLowerCase()} was quiet on the road.`;
    return {
      empty: true,
      intro: quiet,
      sub: "No business journeys were recorded.",
      footer: "When you're back on the road, MilePilot will automatically keep tracking every business mile.",
      cards: [],
    };
  }

  const cards = [];

  if (prevTotals.mi > 0 && Math.abs(miDiff) >= 0.1) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 1) {
      cards.push({
        icon: "📈",
        label: "Compared to yesterday",
        value: `You drove ${Math.abs(pct)}% ${pct > 0 ? "more" : "less"}`,
        detail: `${Math.abs(miDiff).toFixed(1)} miles ${pct > 0 ? "further" : "less"} than the previous ${period === "Daily" ? "day" : "period"}.`,
      });
    }
  }

  if (longestJ) {
    cards.push({
      icon: "🏆",
      label: "Longest journey",
      value: `${Number(longestJ.miles).toFixed(1)} miles`,
      detail: `${fmtClock(longestJ.startISO)} – ${fmtClock(longestJ.endISO)}`,
    });
  }

  if (productiveHour) {
    cards.push({
      icon: "⏰",
      label: "Most productive hour",
      value: productiveHour.label,
      detail: `${productiveHour.miles.toFixed(1)} business miles recorded.`,
    });
  }

  if (totals.hmrc > 0) {
    cards.push({
      icon: "💰",
      label: period === "Daily" ? "Today's mileage allowance" : "Period mileage allowance",
      value: money(totals.hmrc),
      detail: `${totals.mi.toFixed(1)} business miles at ${Math.round(a.hmrcRate * 100)}p per mile.`,
    });
  }

  if (a.avgMilesShift > 0 && shifts.length >= 2) {
    cards.push({
      icon: "🚗",
      label: "Average journey",
      value: `${a.avgMilesShift.toFixed(1)} miles`,
      detail: `Typical duration ${fmtDurationShort(a.avgShiftSec)}.`,
    });
  }

  return { empty: false, intro: null, sub: null, footer: null, cards: cards.slice(0, 4) };
}

function drawFooter(doc, a, margin, contentW) {
  const footY = doc.page.height - 64;
  doc.moveTo(margin, footY - 14).lineTo(margin + contentW, footY - 14).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(9).text("Drive • Track • Claim", margin, footY, { width: contentW, align: "center" });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text("Generated by MilePilot", margin, footY + 14, { width: contentW, align: "center" });
  doc.text(`${a.generatedAt} at ${a.generatedAtTime}  ·  Report ID ${a.reportId}  ·  ${REPORT_VERSION}`, margin, footY + 26, { width: contentW, align: "center" });
}

function drawPageHeader(doc, a, margin, contentW, pageW) {
  doc.rect(0, 0, pageW, 108).fill(BRAND.navy);
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(28).text("Mile ", margin, 32, { continued: true });
  doc.fillColor(BRAND.blue).text("Pilot");
  doc.rect(margin, 68, 120, 2).fill(BRAND.blue);
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(8).text("Drive • Track • Claim", margin, 78);
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10).text(periodReportTitle(a.period).toUpperCase(), pageW - margin - 220, 36, { width: 220, align: "right", characterSpacing: 0.8 });
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(9).text(a.generatedAt, pageW - margin - 220, 56, { width: 220, align: "right" });
  if (a.driver) {
    doc.text(`Prepared for ${a.driver}`, pageW - margin - 220, 72, { width: 220, align: "right" });
  }
  return 128;
}

function drawMetricCard(doc, x, y, w, h, label, value) {
  doc.roundedRect(x, y, w, h, 12).fillAndStroke(BRAND.light, BRAND.border);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text(label.toUpperCase(), x + 14, y + 12, { width: w - 28, characterSpacing: 0.6 });
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text(value, x + 14, y + 28, { width: w - 28 });
}

function drawProgressBar(doc, x, y, w, h, pct) {
  doc.roundedRect(x, y, w, h, h / 2).fill("#EEF2F8");
  const fillW = Math.max(h, w * Math.min(Math.max(pct, 0), 1));
  if (fillW > h) doc.roundedRect(x, y, fillW, h, h / 2).fill(BRAND.blue);
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
    const margin = 52;
    const contentW = pageW - margin * 2;

    // ── PAGE 1: Hero + Intelligence ──
    let y = drawPageHeader(doc, a, margin, contentW, pageW);

    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(9).text("BUSINESS MILES", margin, y, { characterSpacing: 1.4 });
    y += 22;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(100).text(a.totals.mi.toFixed(1), margin, y, { lineBreak: false });
    y += 108;
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(11).text("Business Miles", margin, y);
    y += 36;

    const cardW = (contentW - 14) / 2;
    const cardH = 58;
    const cards = [
      { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
      { label: "Business Journeys", value: String(a.totals.journeys) },
      { label: a.allowanceLabel, value: money(a.totals.hmrc) },
      { label: "Average Journey", value: a.avgMilesShift > 0 ? `${a.avgMilesShift.toFixed(1)} mi` : "—" },
    ];
    cards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      drawMetricCard(doc, margin + col * (cardW + 14), y + row * (cardH + 14), cardW, cardH, c.label, c.value);
    });
    y += 2 * (cardH + 14) + 28;

    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("MilePilot Intelligence", margin, y);
    y += 24;

    if (intel.empty) {
      doc.roundedRect(margin, y, contentW, 88, 14).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(intel.intro, margin + 20, y + 18, { width: contentW - 40 });
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(intel.sub, margin + 20, y + 38, { width: contentW - 40 });
      doc.text(intel.footer, margin + 20, y + 58, { width: contentW - 40, lineGap: 2 });
      y += 104;
    } else {
      intel.cards.forEach((card) => {
        doc.roundedRect(margin, y, contentW, 52, 10).fillAndStroke("#F8FBFF", BRAND.border);
        doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(`${card.icon}  ${card.label}`, margin + 16, y + 12);
        doc.fontSize(14).text(card.value, margin + 16, y + 28);
        if (card.detail) {
          doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8.5).text(card.detail, margin + contentW / 2, y + 20, { width: contentW / 2 - 20, align: "right" });
        }
        y += 60;
      });
    }

    drawFooter(doc, a, margin, contentW);

    // ── PAGE 2: Journey table ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text("Journey Breakdown", margin, y);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text("Professional record for your accountant", margin, y + 20);
    y += 44;

    const tCols = [margin + 8, margin + 52, margin + 102, margin + 162, margin + 222, margin + 292];
    doc.roundedRect(margin, y, contentW, 24, 4).fill(BRAND.navy);
    ["Time", "Start", "Finish", "Miles", "Duration"].forEach((h, i) => {
      doc.fillColor("#FFF").font("Helvetica-Bold").fontSize(7.5).text(h.toUpperCase(), tCols[i], y + 8);
    });
    y += 24;

    if (!a.shifts.length) {
      doc.roundedRect(margin, y, contentW, 40, 8).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text("No journeys recorded in this period.", margin + 16, y + 14);
    } else {
      a.shifts.forEach((s, idx) => {
        const rowH = 24;
        if (y + rowH > doc.page.height - 80) {
          drawFooter(doc, a, margin, contentW);
          doc.addPage({ margin: 0 });
          y = drawPageHeader(doc, a, margin, contentW, pageW) + 20;
        }
        doc.rect(margin, y, contentW, rowH).fill(idx % 2 === 0 ? "#FFFFFF" : BRAND.light);
        const d = new Date(s.startISO);
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(8.5);
        doc.text(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), tCols[0], y + 8);
        doc.text(fmtClock(s.startISO), tCols[1], y + 8);
        doc.text(fmtClock(s.endISO), tCols[2], y + 8);
        doc.font("Helvetica-Bold").text(Number(s.miles || 0).toFixed(1), tCols[3], y + 8);
        doc.font("Helvetica").text(fmtDurationShort(s.seconds), tCols[4], y + 8);
        y += rowH;
      });
    }

    drawFooter(doc, a, margin, contentW);

    // ── PAGE 3: Weekly performance ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text("Weekly Performance", margin, y);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(`Week ending ${a.weekEnding}`, margin, y + 20);
    y += 44;

    const maxDayMi = Math.max(...a.dailyActivity.map((d) => d.miles), 1);
    a.dailyActivity.slice(0, 7).forEach((d) => {
      doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(d.day, margin, y + 3, { width: 72 });
      drawProgressBar(doc, margin + 78, y + 4, contentW - 130, 8, d.miles / maxDayMi);
      doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8).text(d.miles > 0 ? `${d.miles.toFixed(1)} mi` : "—", margin + contentW - 44, y + 2, { width: 44, align: "right" });
      y += 22;
    });
    y += 20;

    const stats = [
      ["Average miles / day", a.weekAvgMilesDay > 0 ? `${a.weekAvgMilesDay.toFixed(1)} mi` : "—"],
      ["Average shift length", a.weekAvgShiftSec > 0 ? fmtShiftTime(a.weekAvgShiftSec) : "—"],
      ["Longest day", a.busiest ? `${a.busiest.day} · ${a.busiest.miles.toFixed(1)} mi` : "—"],
      ["Total mileage allowance", money(a.weekTotals.hmrc)],
      [
        "Trend vs last week",
        a.weekComparePct !== null ? `${a.weekComparePct > 0 ? "+" : ""}${a.weekComparePct}% business miles` : "—",
      ],
    ];

    doc.roundedRect(margin, y, contentW, stats.length * 28 + 24, 14).fillAndStroke(BRAND.light, BRAND.border);
    let sy = y + 16;
    stats.forEach(([label, val]) => {
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(label, margin + 18, sy);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(val, margin + contentW / 2, sy, { width: contentW / 2 - 24, align: "right" });
      sy += 28;
    });

    drawFooter(doc, a, margin, contentW);
    doc.end();
  });
}

export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const greeting = timeGreeting();
  const ready = periodReadyLine(a.period);

  const metric = (label, value) =>
    `<tr><td style="padding:0 0 12px;">
      <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#93A8C4;margin-bottom:6px;">${label}</div>
      <div style="font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;line-height:1.1;">${value}</div>
    </td></tr>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#031126;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0A2854 0%,#031126 100%);padding:44px 20px 52px;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
<tr><td style="padding:0 8px 32px;text-align:center;">
  <div style="font-size:26px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;">Mile <span style="color:#0D6BFF;">Pilot</span></div>
</td></tr>
<tr><td style="padding:0 20px;">
  <p style="margin:0 0 12px;font-size:17px;color:#EAF2FF;line-height:1.5;">${greeting} ${name} 👋</p>
  <p style="margin:0 0 32px;font-size:16px;color:#B9C8DD;line-height:1.55;">${ready}</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    ${metric("Business Miles", a.totals.mi.toFixed(1))}
    ${metric("Driving Time", fmtShiftTime(a.totals.sec))}
    ${metric("Journeys", String(a.totals.journeys))}
    ${metric("Estimated HMRC", money(a.totals.hmrc))}
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr><td align="center">
      <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(180deg,#1E88FF,#0D6BFF);color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:16px 32px;border-radius:14px;letter-spacing:-0.01em;">View Full Report</a>
    </td></tr>
  </table>
  <p style="margin:0 0 36px;font-size:14px;color:#93A8C4;line-height:1.6;text-align:center;">Your professional PDF report is attached.</p>
  <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.14em;color:#0D6BFF;text-align:center;">Drive • Track • Claim</p>
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
  return `${timeGreeting()} ${name} 👋

${periodReadyLine(a.period)}

Business Miles: ${a.totals.mi.toFixed(1)}
Driving Time: ${fmtShiftTime(a.totals.sec)}
Journeys: ${a.totals.journeys}
Estimated HMRC: ${money(a.totals.hmrc)}

View your full report: ${APP_URL}

Your professional PDF report is attached.

Drive • Track • Claim
Thank you for choosing MilePilot.
Every mile matters.`;
}

export function buildReportSubject(report) {
  const period = report.period || "Daily";
  const emoji = period === "Weekly" ? "📊 " : period === "Daily" ? "🚗 " : "";
  return `${emoji}Your MilePilot ${periodReportTitle(period)}`;
}
