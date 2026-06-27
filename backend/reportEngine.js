/**
 * MilePilot Report Engine — MP-012 Premium Experience
 * PDF generation, email preview, MilePilot Insights, Driving Score
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

export const REPORT_VERSION = "MP-012-premium-v3";

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

function periodSubtitle(period) {
  const map = {
    Daily: "Another day complete.<br>Here's today's driving summary.",
    Weekly: "Another week in the books.<br>Here's your driving summary.",
    Monthly: "Another month complete.<br>Here's your business on the road.",
    Annual: "What a year on the road.<br>Here's your driving story.",
  };
  return map[period] || "Here's your driving summary.";
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

function getWeekEndingDate() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
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
  return order.filter((k) => map[k]).map((k) => ({ day: k, ...map[k] }));
}

function longestShift(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.seconds || 0) > Number(a.seconds || 0) ? b : a));
}

function busiestDay(shifts) {
  const days = groupByDay(shifts);
  if (!days.length) return null;
  return days.reduce((a, b) => (b.miles > a.miles ? b : a));
}

function generateReportId(report, a) {
  const raw = `${a.period}|${a.driver}|${new Date().toISOString().slice(0, 10)}|${a.totals.mi}`;
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 8).toUpperCase();
  const prefix = { Daily: "DY", Weekly: "WK", Monthly: "MO", Annual: "YR" }[a.period] || "RP";
  return `MP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${prefix}-${hash}`;
}

function weekGoalMiles(a, report) {
  if (Number(report.weekGoal) > 0) return Number(report.weekGoal);
  if (a.prevTotals.mi > 0) return Math.ceil(a.prevTotals.mi * 1.15);
  return Math.max(Math.ceil(a.totals.mi * 1.5), 100);
}

function computeDrivingScore(a, report) {
  const { shifts, totals, workingDays, period } = a;
  const expectedDays = period === "Daily" ? 1 : period === "Weekly" ? 5 : period === "Monthly" ? 20 : 250;
  const consistency = Math.min(workingDays / expectedDays, 1) * 25;
  const goal = period === "Weekly" ? weekGoalMiles(a, report) : Math.max(totals.mi * 1.2, 10);
  const mileage = Math.min(totals.mi / goal, 1) * 25;
  const withRoute = shifts.filter((s) => (s.route || s.routePoints || []).length > 1).length;
  const tracking = shifts.length ? (withRoute / shifts.length) * 25 : 0;
  const complete = shifts.filter((s) => Number(s.miles) > 0 && s.endISO).length;
  const completion = shifts.length ? (complete / shifts.length) * 25 : 0;
  const score = Math.round(consistency + mileage + tracking + completion);
  const label = score >= 90 ? "Excellent" : score >= 75 ? "Great" : score >= 60 ? "Good" : "Building";
  return {
    score: Math.min(score, 100),
    label,
    factors: [
      { name: "Consistency", pts: Math.round(consistency) },
      { name: "Mileage", pts: Math.round(mileage) },
      { name: "Tracking", pts: Math.round(tracking) },
      { name: "Shift completion", pts: Math.round(completion) },
    ],
  };
}

export function analyseReport(report) {
  const shifts = (report.shifts || []).slice().sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
  const prev = report.previousPeriod || {};
  const totals = sumShifts(shifts);
  const prevTotals = {
    mi: Number(prev.miles ?? prev.mi ?? 0),
    sec: Number(prev.seconds ?? prev.sec ?? 0),
    hmrc: Number(prev.hmrc ?? 0),
    journeys: Number(prev.journeys ?? 0),
  };

  const longest = longestShift(shifts);
  const busiest = busiestDay(shifts);
  const workingDays = new Set(shifts.map((s) => new Date(s.startISO).toDateString())).size;
  const avgShiftSec = shifts.length ? totals.sec / shifts.length : 0;
  const avgMilesDay = workingDays ? totals.mi / workingDays : 0;
  const avgMilesShift = shifts.length ? totals.mi / shifts.length : 0;
  const hmrcRate = Number(report.hmrcRate) || hmrcRateForShifts(shifts);

  let weekComparePct = null;
  if (prevTotals.mi > 0 && totals.mi > 0) {
    weekComparePct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
  }

  const miDiff = totals.mi - prevTotals.mi;
  const hmrcDiff = totals.hmrc - prevTotals.hmrc;
  const avgShiftPrev = prevTotals.journeys ? prevTotals.sec / prevTotals.journeys : 0;
  const avgShiftDeltaMin = avgShiftPrev > 0 ? Math.round((avgShiftSec - avgShiftPrev) / 60) : 0;
  const avgSpeedMph = totals.sec > 0 ? totals.mi / (totals.sec / 3600) : 0;

  const now = new Date();
  const generatedAt = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const generatedAtTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const analysis = {
    totals,
    prevTotals,
    shifts,
    driver: (report.driver || "").trim(),
    period: report.period || "Daily",
    dailyActivity: groupByDay(shifts),
    longest,
    busiest,
    workingDays,
    avgShiftSec,
    avgMilesDay,
    avgMilesShift,
    hmrcRate,
    weekComparePct,
    miDiff,
    hmrcDiff,
    avgShiftDeltaMin,
    avgSpeedMph,
    weekEnding: getWeekEndingDate(),
    generatedAt,
    generatedAtTime,
    weekGoal: weekGoalMiles({ prevTotals, totals, period: report.period || "Daily" }, report),
  };

  analysis.reportId = generateReportId(report, analysis);
  analysis.drivingScore = computeDrivingScore(analysis, report);

  return analysis;
}

export function buildIntelligence(a) {
  const items = [];
  const { totals, shifts, busiest, longest, weekComparePct, miDiff, hmrcDiff, avgMilesShift, avgSpeedMph, period, prevTotals } = a;

  if (longest && shifts.length) {
    const day = new Date(longest.startISO).toLocaleDateString("en-GB", { weekday: "long" });
    if (period === "Daily") {
      items.push({ icon: "🏆", text: `Your longest shift today was ${fmtShiftTime(longest.seconds)}.` });
    } else {
      items.push({ icon: "🏆", text: `${day} was your longest shift this ${period === "Weekly" ? "week" : "period"} (${fmtShiftTime(longest.seconds)}).` });
    }
  }

  if (prevTotals.mi > 0 && Math.abs(miDiff) >= 0.5) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 5) {
      items.push({
        icon: "📈",
        text: `You drove ${Math.abs(pct)}% ${pct > 0 ? "further" : "less"} than the previous ${period === "Daily" ? "day" : "period"}.`,
      });
    } else {
      items.push({
        icon: "📈",
        text: `You drove ${Math.abs(miDiff).toFixed(1)} ${miDiff > 0 ? "more" : "fewer"} business miles than the previous ${period === "Daily" ? "day" : "period"}.`,
      });
    }
  }

  if (avgMilesShift > 0 && shifts.length >= 2) {
    items.push({ icon: "🚗", text: `Average journey: ${avgMilesShift.toFixed(1)} miles · ${fmtDurationShort(avgMilesShift > 0 ? a.avgShiftSec : 0)}.` });
  }

  if (avgSpeedMph > 2 && totals.sec > 300) {
    items.push({ icon: "🚗", text: `Average speed: ${avgSpeedMph.toFixed(0)} mph across your business journeys.` });
  }

  if (busiest && totals.mi > 0 && period !== "Daily") {
    const pct = Math.round((busiest.miles / totals.mi) * 100);
    items.push({ icon: "📅", text: `${busiest.day} was your best driving day (${pct}% of mileage).` });
  }

  if (hmrcDiff > 0.5 && prevTotals.hmrc > 0) {
    items.push({ icon: "💰", text: `Estimated mileage claim increased by ${money(hmrcDiff)} vs the previous period.` });
  } else if (weekComparePct !== null && weekComparePct > 10) {
    items.push({ icon: "💰", text: `Strong ${period.toLowerCase()} — ${weekComparePct}% more business miles recorded.` });
  }

  if (longest && totals.hmrc > 0 && period !== "Daily") {
    items.push({ icon: "💰", text: `Highest claim shift: ${money(longest.hmrc)} on ${new Date(longest.startISO).toLocaleDateString("en-GB", { weekday: "long" })}.` });
  }

  return items.slice(0, 5).map(({ icon, text }) => ({ icon, text }));
}

function ensureSpace(doc, y, need, margin) {
  const foot = 72;
  if (y + need > doc.page.height - foot) {
    doc.addPage({ margin: 0 });
    return margin + 20;
  }
  return y;
}

function drawFooter(doc, a, margin, contentW) {
  const footY = doc.page.height - 58;
  doc.moveTo(margin, footY - 12).lineTo(margin + contentW, footY - 12).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(9).text("Drive • Track • Claim", margin, footY, { width: contentW, align: "center" });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text(
    `Generated automatically by MilePilot  ·  ${a.generatedAt} at ${a.generatedAtTime}`,
    margin,
    footY + 12,
    { width: contentW, align: "center" }
  );
  doc.text(`Report ID ${a.reportId}  ·  ${REPORT_VERSION}`, margin, footY + 24, { width: contentW, align: "center" });
}

function drawProgressBar(doc, x, y, w, h, pct, fillColor = BRAND.blue) {
  doc.roundedRect(x, y, w, h, h / 2).fill(BRAND.light);
  const fillW = Math.max(h, w * Math.min(Math.max(pct, 0), 1));
  doc.roundedRect(x, y, fillW, h, h / 2).fill(fillColor);
}

function drawSectionTitle(doc, title, x, y) {
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13).text(title, x, y);
  return y + 22;
}

export function buildPdfBuffer(report) {
  return new Promise((resolve, reject) => {
    const a = analyseReport(report);
    const intelligence = buildIntelligence(a);
    const doc = new PDFDocument({ margin: 0, size: "A4" });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const margin = 52;
    const contentW = pageW - margin * 2;
    let y = 48;

    // Minimal header
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(26).text("Mile ", margin, y, { continued: true });
    doc.fillColor(BRAND.blue).text("Pilot");
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(periodReportTitle(a.period), pageW - margin - 200, y + 4, { width: 200, align: "right" });
    if (a.driver) {
      doc.fontSize(9).text(`Prepared for ${a.driver}`, pageW - margin - 200, y + 20, { width: 200, align: "right" });
    }
    if (a.period === "Weekly") {
      doc.text(`Week ending ${a.weekEnding}`, pageW - margin - 200, y + 34, { width: 200, align: "right" });
    } else {
      doc.text(a.generatedAt, pageW - margin - 200, y + 34, { width: 200, align: "right" });
    }

    y += 56;

    // Hero — Business Miles dominates
    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(9).text("BUSINESS MILES", margin, y, { characterSpacing: 1.2 });
    y += 20;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(92).text(a.totals.mi.toFixed(1), margin, y, { lineBreak: false });
    y += 98;

    // Supporting stats — lighter hierarchy, not equal cards
    const supportY = y;
    const colW = contentW / 3;
    const support = [
      { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
      { label: "Business Journeys", value: String(a.totals.journeys) },
      { label: "Estimated HMRC Claim", value: money(a.totals.hmrc) },
    ];
    support.forEach((s, i) => {
      const x = margin + i * colW;
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(s.label.toUpperCase(), x, supportY, { width: colW - 8 });
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(18).text(s.value, x, supportY + 14, { width: colW - 8 });
    });
    y += 52;

    // Driving Score
    if (a.totals.journeys > 0) {
      y += 16;
      doc.roundedRect(margin, y, contentW, 72, 14).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8).text("YOUR DRIVING SCORE", margin + 20, y + 14);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(36).text(String(a.drivingScore.score), margin + 20, y + 28);
      doc.fillColor(BRAND.green).font("Helvetica-Bold").fontSize(12).text(a.drivingScore.label, margin + 68, y + 42);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5);
      const factorText = a.drivingScore.factors.map((f) => `${f.name} ${f.pts}`).join("  ·  ");
      doc.text(factorText, margin + 20, y + 54, { width: contentW - 40 });
      y += 88;
    }

    // Week progress
    if (a.period === "Weekly" && a.totals.mi > 0) {
      y = ensureSpace(doc, y, 70, margin);
      y = drawSectionTitle(doc, "Week Progress", margin, y);
      const pct = Math.min(a.totals.mi / a.weekGoal, 1);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(`${a.totals.mi.toFixed(0)} of ${a.weekGoal} miles`, margin, y);
      y += 16;
      drawProgressBar(doc, margin, y, contentW, 10, pct);
      y += 24;

      if (a.dailyActivity.length) {
        const maxMi = Math.max(...a.dailyActivity.map((d) => d.miles), 1);
        a.dailyActivity.forEach((d) => {
          const barPct = d.miles / maxMi;
          doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(d.day.slice(0, 3), margin, y + 2, { width: 28 });
          drawProgressBar(doc, margin + 32, y, contentW - 100, 8, barPct, "#3B82F6");
          doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(8).text(`${d.miles.toFixed(1)} mi`, margin + contentW - 58, y + 1, { width: 58, align: "right" });
          y += 16;
        });
        y += 8;
      }
    }

    // MilePilot Insights
    if (intelligence.length) {
      y = ensureSpace(doc, y, 40 + intelligence.length * 28, margin);
      y += 8;
      y = drawSectionTitle(doc, "MilePilot Insights", margin, y);
      intelligence.forEach((ins) => {
        y = ensureSpace(doc, y, 30, margin);
        doc.roundedRect(margin, y, contentW, 28, 8).fill("#F8FBFF");
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(9.5).text(`${ins.icon}  ${ins.text}`, margin + 14, y + 9, { width: contentW - 28 });
        y += 36;
      });
      y += 4;
    }

    // Journey Breakdown
    y = ensureSpace(doc, y, 80, margin);
    y += 8;
    y = drawSectionTitle(doc, "Journey Breakdown", margin, y);
    const jCols = [margin + 8, margin + 58, margin + 108, margin + 168, margin + 228, margin + 300];
    doc.roundedRect(margin, y, contentW, 22, 4).fill(BRAND.navy);
    ["Start", "Finish", "Miles", "Duration", "Type"].forEach((h, i) => {
      doc.fillColor("#FFF").font("Helvetica-Bold").fontSize(7).text(h.toUpperCase(), jCols[i], y + 7);
    });
    y += 22;

    if (!a.shifts.length) {
      doc.roundedRect(margin, y, contentW, 36, 8).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text("No journeys recorded in this period.", margin + 14, y + 13);
      y += 48;
    } else {
      a.shifts.forEach((s, idx) => {
        y = ensureSpace(doc, y, 24, margin);
        doc.rect(margin, y, contentW, 22).fill(idx % 2 === 0 ? "#FFFFFF" : BRAND.light);
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(8.5);
        doc.text(fmtClock(s.startISO), jCols[0], y + 7);
        doc.text(fmtClock(s.endISO), jCols[1], y + 7);
        doc.text(Number(s.miles || 0).toFixed(1), jCols[2], y + 7);
        doc.text(fmtDurationShort(s.seconds), jCols[3], y + 7);
        doc.fillColor(BRAND.blue).font("Helvetica-Bold").text("Business", jCols[4], y + 7);
        doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7).text(vehicleLabel(s.vehicle), jCols[5], y + 7);
        y += 22;
      });
      y += 12;
    }

    // HMRC Summary
    y = ensureSpace(doc, y, 100, margin);
    y += 8;
    doc.roundedRect(margin, y, contentW, 88, 14).fillAndStroke("#EEF4FF", BRAND.blue);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13).text("HMRC Summary", margin + 20, y + 16);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(`Current HMRC rate: ${Math.round(a.hmrcRate * 100)}p per mile`, margin + 20, y + 36);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(`Business miles: ${a.totals.mi.toFixed(1)}`, margin + 20, y + 50);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(11).text("Estimated mileage allowance", margin + contentW / 2, y + 36);
    doc.fontSize(28).text(money(a.totals.hmrc), margin + contentW / 2, y + 50);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text(
      "Estimates for record keeping only. Verify against official HMRC guidance before filing.",
      margin + 20,
      y + 72,
      { width: contentW - 40 }
    );
    y += 104;

    drawFooter(doc, a, margin, contentW);
    doc.end();
  });
}

export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const greeting = timeGreeting();
  const title = periodReportTitle(a.period);
  const subtitle = periodSubtitle(a.period);

  const metric = (label, value) =>
    `<tr><td style="padding:0 0 14px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(110,180,255,0.14);border-radius:16px;">
        <tr><td style="padding:20px 22px;">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#93A8C4;margin-bottom:10px;">${label}</div>
          <div style="font-size:26px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;">${value}</div>
        </td></tr>
      </table>
    </td></tr>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#031126;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0A2854 0%,#031126 100%);padding:48px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
<tr><td style="padding:0 8px 36px;text-align:center;">
  <div style="font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;">Mile <span style="color:#0D6BFF;">Pilot</span></div>
  <div style="height:2px;width:120px;margin:16px auto;background:linear-gradient(90deg,transparent,#6EB4FF,#0D6BFF,#6EB4FF,transparent);border-radius:999px;"></div>
</td></tr>
<tr><td style="padding:0 16px;">
  <p style="margin:0 0 20px;font-size:17px;color:#EAF2FF;line-height:1.5;">${greeting} ${name} 👋</p>
  <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.25;">Your ${a.period} Driving Report</p>
  <p style="margin:0 0 36px;font-size:15px;color:#B9C8DD;line-height:1.6;">${subtitle.replace(/<br>/g, "<br>")}</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
    ${metric("Business Miles", a.totals.mi.toFixed(1) + " miles")}
    ${metric("Driving Time", fmtShiftTime(a.totals.sec))}
    ${metric("Business Journeys", String(a.totals.journeys))}
    ${metric("Estimated HMRC Claim", money(a.totals.hmrc))}
  </table>
  <p style="margin:0 0 40px;font-size:15px;color:#B9C8DD;line-height:1.6;text-align:center;">Your beautifully formatted PDF report is attached.</p>
  <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.14em;color:#0D6BFF;text-align:center;">Drive • Track • Claim</p>
</td></tr>
<tr><td style="padding:32px 16px 0;font-size:10px;color:#64748B;line-height:1.6;text-align:center;">MilePilot · HMRC figures are estimates for record keeping.</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function buildReportEmailText(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  return `${timeGreeting()} ${name} 👋

Your ${a.period} Driving Report

${periodSubtitle(a.period).replace(/<br>/g, "\n")}

Business Miles: ${a.totals.mi.toFixed(1)} miles
Driving Time: ${fmtShiftTime(a.totals.sec)}
Business Journeys: ${a.totals.journeys}
Estimated HMRC Claim: ${money(a.totals.hmrc)}

Your beautifully formatted PDF report is attached.

Drive • Track • Claim
— MilePilot`;
}

export function buildReportSubject(report) {
  const period = report.period || "Daily";
  const emoji = period === "Weekly" ? "📊 " : period === "Daily" ? "🚗 " : "";
  return `${emoji}Your MilePilot ${periodReportTitle(period)}`;
}
