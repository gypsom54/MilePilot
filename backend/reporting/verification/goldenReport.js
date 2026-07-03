/**
 * Golden Report — permanent reference standard (LOCKED)
 *
 * Jonathan O'Neill · 487.4 mi · 38 trips · 31h 48m · £219.33
 * Regenerate and compare on every reporting engine change.
 * @see docs/REPORTING_SYSTEM_LOCK.md · tests/golden-report.test.js
 */

/** Approved KPI values — must appear in every golden generation */
export const GOLDEN_KPI = Object.freeze({
  driver: "Jonathan O'Neill",
  miles: "487.4",
  milesRaw: 487.4,
  trips: 38,
  tripsDisplay: "38",
  drivingSeconds: 114480,
  drivingTime: "31h 48m",
  hmrc: "£219.33",
  hmrcRaw: 219.33,
  hmrcRate: 0.45,
  period: "Monthly",
  periodLabel: "July 2026",
});

const FIXED_ROUTE = [
  { lat: 51.5074, lon: -0.1278 },
  { lat: 51.515, lon: -0.12 },
  { lat: 51.52, lon: -0.1 },
];

/** Build 38 shifts that sum exactly to golden totals */
export function buildGoldenShifts() {
  const { trips, milesRaw, drivingSeconds, hmrcRaw, hmrcRate } = GOLDEN_KPI;
  const shifts = [];
  let milesSum = 0;
  let secSum = 0;
  let hmrcSum = 0;

  const baseMiles = 12.8;
  const baseSec = 3012;

  for (let i = 0; i < trips; i++) {
    const isLast = i === trips - 1;
    const day = 1 + Math.floor(i / 2);
    const hour = 8 + (i % 2) * 3;
    const start = new Date(Date.UTC(2026, 5, day, hour, 0, 0));
    const miles = isLast ? Math.round((milesRaw - milesSum) * 10) / 10 : baseMiles;
    const seconds = isLast ? drivingSeconds - secSum : baseSec;
    const hmrc = isLast ? Math.round((hmrcRaw - hmrcSum) * 100) / 100 : Math.round(miles * hmrcRate * 100) / 100;
    const end = new Date(start.getTime() + seconds * 1000);

    shifts.push({
      id: `golden_shift_${String(i + 1).padStart(2, "0")}`,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      miles,
      seconds,
      hmrc,
      vehicle: "car",
      route: FIXED_ROUTE.map((p) => ({ ...p })),
    });

    milesSum += miles;
    secSum += seconds;
    hmrcSum += hmrc;
  }

  return shifts;
}

/** Full golden report payload — deterministic metadata for reproducible output */
export function buildGoldenReport() {
  return {
    driver: GOLDEN_KPI.driver,
    email: "jonathan.oneill@example.com",
    period: GOLDEN_KPI.period,
    periodLabel: GOLDEN_KPI.periodLabel,
    hmrcRate: GOLDEN_KPI.hmrcRate,
    generatedAtISO: "2026-07-01T12:00:00.000Z",
    generatedAtTime: "12:00",
    reportId: "MP-20260701-MO-GOLDEN01",
    greeting: "Good afternoon",
    isGolden: true,
    shifts: buildGoldenShifts(),
  };
}

export function verifyGoldenTotals(analysis) {
  const t = analysis.totals;
  const errors = [];
  if (Math.abs(t.mi - GOLDEN_KPI.milesRaw) > 0.05) errors.push(`miles: ${t.mi} !== ${GOLDEN_KPI.milesRaw}`);
  if (t.journeys !== GOLDEN_KPI.trips) errors.push(`trips: ${t.journeys} !== ${GOLDEN_KPI.trips}`);
  if (t.sec !== GOLDEN_KPI.drivingSeconds) errors.push(`seconds: ${t.sec} !== ${GOLDEN_KPI.drivingSeconds}`);
  if (Math.abs(t.hmrc - GOLDEN_KPI.hmrcRaw) > 0.01) errors.push(`hmrc: ${t.hmrc} !== ${GOLDEN_KPI.hmrcRaw}`);
  return errors;
}
