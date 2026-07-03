/**
 * Approved snapshot fixtures — Daily, Weekly, Monthly, Annual reports.
 * Fixed dates and IDs for reproducible layout fingerprints.
 */

const BASE_SHIFT = {
  id: "shift_locked_fixture",
  startISO: "2026-07-01T08:00:00.000Z",
  endISO: "2026-07-01T10:30:00.000Z",
  miles: 42.6,
  seconds: 9000,
  hmrc: 23.43,
  vehicle: "car",
  route: [
    { lat: 51.5074, lon: -0.1278 },
    { lat: 51.515, lon: -0.12 },
    { lat: 51.52, lon: -0.1 },
  ],
};

const WEEK_SHIFTS = [
  { ...BASE_SHIFT, id: "shift_w1", startISO: "2026-06-30T08:00:00.000Z", endISO: "2026-06-30T09:30:00.000Z", miles: 18.2, seconds: 5400, hmrc: 10.01 },
  { ...BASE_SHIFT, id: "shift_w2", startISO: "2026-07-01T08:00:00.000Z", endISO: "2026-07-01T10:00:00.000Z", miles: 24.5, seconds: 7200, hmrc: 13.48 },
  { ...BASE_SHIFT, id: "shift_w3", startISO: "2026-07-02T09:00:00.000Z", endISO: "2026-07-02T11:00:00.000Z", miles: 31.0, seconds: 7200, hmrc: 17.05 },
];

export const PERIOD_FIXTURES = Object.freeze({
  Daily: {
    driver: "Jonathan",
    email: "fixture@example.com",
    period: "Daily",
    periodLabel: "1 July 2026",
    hmrcRate: 0.55,
    shifts: [BASE_SHIFT],
  },
  Weekly: {
    driver: "Jonathan",
    email: "fixture@example.com",
    period: "Weekly",
    periodLabel: "Week ending 5 July 2026",
    hmrcRate: 0.55,
    shifts: WEEK_SHIFTS,
  },
  Monthly: {
    driver: "Jonathan",
    email: "fixture@example.com",
    period: "Monthly",
    periodLabel: "July 2026",
    hmrcRate: 0.55,
    shifts: WEEK_SHIFTS.concat([
      { ...BASE_SHIFT, id: "shift_m1", startISO: "2026-07-10T08:00:00.000Z", endISO: "2026-07-10T09:00:00.000Z", miles: 12.0, seconds: 3600, hmrc: 6.6 },
    ]),
  },
  Annual: {
    driver: "Jonathan",
    email: "fixture@example.com",
    period: "Annual",
    periodLabel: "Tax year 2025/26",
    hmrcRate: 0.55,
    annualRunningTotal: 1240.5,
    shifts: WEEK_SHIFTS,
  },
});

export function buildFixtureReport(period) {
  const fixture = PERIOD_FIXTURES[period];
  if (!fixture) throw new Error(`Unknown fixture period: ${period}`);
  return structuredClone(fixture);
}
