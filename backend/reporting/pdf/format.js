/**
 * Shared formatters for premium reports.
 */

export function money(v) {
  return "£" + Number(v || 0).toFixed(2);
}

export function fmtShiftTime(sec) {
  sec = Number(sec) || 0;
  if (sec < 60) return "0h 00m";
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}

/** Single-line compact driving time for KPI cards (email + PDF). */
export function fmtDrivingTimeCompact(sec) {
  sec = Number(sec) || 0;
  const totalMin = Math.floor(sec / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `0h ${String(m).padStart(2, "0")}m`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function fmtDurationShort(sec) {
  sec = Number(sec) || 0;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}

export function fmtClock(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function fmtDateShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function fmtDateLong(d = new Date()) {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function periodLabel(period, periodLabelOverride) {
  if (periodLabelOverride) return periodLabelOverride;
  const map = {
    Daily: "Today",
    Weekly: "This Week",
    Monthly: "This Month",
    Quarterly: "This Quarter",
    Annual: "This Year",
    Accountant: "Accountant Export",
    Custom: "Custom Period",
  };
  return map[period] || period;
}

export function ukTaxYear(date = new Date()) {
  const y = date.getFullYear();
  const april6 = new Date(y, 3, 6);
  const start = date >= april6 ? april6 : new Date(y - 1, 3, 6);
  const endYear = start.getFullYear() + 1;
  return {
    start,
    end: new Date(endYear, 3, 5, 23, 59, 59),
    label: `Tax Year ${start.getFullYear()}–${String(endYear).slice(2)}`,
  };
}
