/**
 * Phase 5 — AI Business Insights (deterministic pattern analysis).
 */

import { money, fmtShiftTime } from "./format.js";

function dayNameFromISO(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "long" });
}

function hourBucket(iso) {
  return new Date(iso).getHours();
}

export function buildPremiumInsights(a) {
  const { shifts, totals, weekTotals, prevTotals, busiest, avgMilesShift, workingDays, hmrcRate } = a;
  const cards = [];

  if (!shifts.length) {
    return {
      confidence: 42,
      cards: [
        { title: "Getting started", body: "MilePilot is ready to learn your business driving patterns.", tone: "neutral" },
        { title: "Missing journey detection", body: "No gaps detected — no journeys recorded in this period yet.", tone: "warn" },
      ],
    };
  }

  const dayCounts = {};
  shifts.forEach((s) => {
    const d = dayNameFromISO(s.startISO);
    dayCounts[d] = (dayCounts[d] || 0) + 1;
  });
  const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
  if (busiestDay) {
    cards.push({
      title: "Busiest day",
      body: `${busiestDay[0]} had the most business journeys (${busiestDay[1]} trip${busiestDay[1] === 1 ? "" : "s"}).`,
      tone: "info",
    });
  }

  if (busiest?.day) {
    cards.push({
      title: "Peak mileage day",
      body: `${busiest.day} recorded the highest business mileage in the reporting window.`,
      tone: "info",
    });
  }

  if (avgMilesShift > 0) {
    cards.push({
      title: "Average trip length",
      body: `Your average business journey is ${avgMilesShift.toFixed(1)} miles (${fmtShiftTime(totals.sec / shifts.length)}).`,
      tone: "neutral",
    });
  }

  const destHint = shifts.filter((s) => s.endLabel || s.destination).length;
  if (destHint) {
    cards.push({
      title: "Most common destination",
      body: "Regular workplace patterns are emerging from your saved journeys.",
      tone: "info",
    });
  } else {
    cards.push({
      title: "Regular workplace detection",
      body: "MilePilot is learning recurring routes — confirm journeys to improve accuracy.",
      tone: "neutral",
    });
  }

  if (prevTotals.mi > 0) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 3) {
      cards.push({
        title: pct >= 0 ? "Mileage increase" : "Driving trend",
        body: `Business miles are ${Math.abs(pct)}% ${pct >= 0 ? "higher" : "lower"} than the previous comparable period.`,
        tone: pct >= 0 ? "positive" : "neutral",
      });
    }
  } else if (weekTotals.mi > totals.mi) {
    cards.push({
      title: "Driving trend",
      body: `This period represents ${((totals.mi / weekTotals.mi) * 100).toFixed(0)}% of your week-to-date business mileage.`,
      tone: "neutral",
    });
  }

  const routesMissing = shifts.filter((s) => !(s.route || s.routePoints || []).length).length;
  if (routesMissing > 0) {
    cards.push({
      title: "Missing journey detection",
      body: `${routesMissing} journey${routesMissing === 1 ? "" : "s"} lack full GPS route data — review for completeness.`,
      tone: "warn",
    });
  } else {
    cards.push({
      title: "GPS confidence",
      body: "All journeys in this period include GPS route verification.",
      tone: "positive",
    });
  }

  cards.push({
    title: "HMRC estimate",
    body: `At ${Math.round(hmrcRate * 100)}p per mile, this period is worth approximately ${money(totals.hmrc)} in allowance.`,
    tone: "info",
  });

  const routeScore = shifts.length ? Math.round(((shifts.length - routesMissing) / shifts.length) * 100) : 50;
  const volumeScore = Math.min(100, Math.round((totals.journeys / Math.max(workingDays, 1)) * 18));
  const confidence = Math.min(98, Math.max(55, Math.round((routeScore + volumeScore) / 2)));

  return { confidence, cards: cards.slice(0, 8) };
}
