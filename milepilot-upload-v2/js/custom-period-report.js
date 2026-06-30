/**
 * MilePilot Custom Period Reports — job-centre style 23rd–23rd cycles + natural-language dates.
 */
(function (global) {
  'use strict';

  const DEFAULT_CYCLE_DAY = 23;
  const STORAGE_KEY = 'mp_job_centre_cycle_day';

  const MONTHS = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
    may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
    sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10,
    dec: 11, december: 11,
  };

  function getCycleDay() {
    try {
      const stored = global.localStorage?.getItem(STORAGE_KEY);
      const n = stored ? parseInt(stored, 10) : DEFAULT_CYCLE_DAY;
      return n >= 1 && n <= 28 ? n : DEFAULT_CYCLE_DAY;
    } catch (e) {
      return DEFAULT_CYCLE_DAY;
    }
  }

  function setCycleDay(day) {
    if (day >= 1 && day <= 28) global.localStorage?.setItem(STORAGE_KEY, String(day));
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function endExclusiveFromInclusiveEnd(endInclusive) {
    const d = startOfDay(endInclusive);
    d.setDate(d.getDate() + 1);
    return d;
  }

  function formatPeriodLabel(start, endExclusive) {
    const endInclusive = new Date(endExclusive);
    endInclusive.setDate(endInclusive.getDate() - 1);
    const sameYear = start.getFullYear() === endInclusive.getFullYear();
    const startStr = start.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: sameYear ? undefined : 'numeric',
    });
    const endStr = endInclusive.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return startStr + ' – ' + endStr;
  }

  function cyclePeriodContaining(refDate, cycleDay) {
    const ref = startOfDay(refDate || new Date());
    const day = cycleDay || getCycleDay();
    let startYear;
    let startMonth;
    if (ref.getDate() >= day) {
      startYear = ref.getFullYear();
      startMonth = ref.getMonth();
    } else {
      const prev = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
      startYear = prev.getFullYear();
      startMonth = prev.getMonth();
    }
    const start = new Date(startYear, startMonth, day);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, day);
    return { start, end, label: formatPeriodLabel(start, end) };
  }

  function previousCyclePeriod(refDate, cycleDay) {
    const current = cyclePeriodContaining(refDate, cycleDay);
    const start = new Date(current.start.getFullYear(), current.start.getMonth() - 1, current.start.getDate());
    const end = new Date(current.start);
    return { start, end, label: formatPeriodLabel(start, end) };
  }

  function parseUkDate(str) {
    if (!str) return null;
    const raw = String(str).trim();
    if (!raw) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const parts = raw.split('-').map(Number);
      return startOfDay(new Date(parts[0], parts[1] - 1, parts[2]));
    }

    const slash = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
    if (slash) {
      let y = parseInt(slash[3], 10);
      if (y < 100) y += 2000;
      return startOfDay(new Date(y, parseInt(slash[2], 10) - 1, parseInt(slash[1], 10)));
    }

    const verbal = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:\s+(\d{4}))?/i);
    if (verbal) {
      const day = parseInt(verbal[1], 10);
      const mon = MONTHS[verbal[2].toLowerCase()];
      if (mon !== undefined) {
        const y = verbal[3] ? parseInt(verbal[3], 10) : new Date().getFullYear();
        return startOfDay(new Date(y, mon, day));
      }
    }

    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return startOfDay(parsed);
    return null;
  }

  function extractTwoDates(text) {
    const between = text.match(
      /(?:between|from)\s+(\d{1,2}(?:st|nd|rd|th)?(?:\s+\w+){0,2}(?:\s+\d{4})?|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\s+(?:and|to)\s+(\d{1,2}(?:st|nd|rd|th)?(?:\s+\w+){0,2}(?:\s+\d{4})?|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i
    );
    if (between) {
      const a = parseUkDate(between[1]);
      const b = parseUkDate(between[2]);
      if (a && b) return [a, b];
    }

    const chunks = [];
    const dateRe = /\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+\d{4})?|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}/gi;
    let m;
    while ((m = dateRe.exec(text)) !== null) chunks.push(m[0]);
    if (chunks.length >= 2) {
      const a = parseUkDate(chunks[0]);
      const b = parseUkDate(chunks[1]);
      if (a && b) return [a, b];
    }
    return null;
  }

  function parseRequest(text, startInput, endInput, cycleDay) {
    const cycle = cycleDay || getCycleDay();
    const t = (text || '').trim().toLowerCase();

    if (startInput && endInput) {
      const start = parseUkDate(startInput);
      const endIncl = parseUkDate(endInput);
      if (!start || !endIncl) {
        return { ok: false, error: 'Check your start and end dates.' };
      }
      if (endIncl < start) {
        return { ok: false, error: 'End date must be on or after the start date.' };
      }
      const end = endExclusiveFromInclusiveEnd(endIncl);
      return {
        ok: true,
        start,
        end,
        label: formatPeriodLabel(start, end),
        source: 'picker',
      };
    }

    if (/last|previous/.test(t) && (/job\s*cent|benefit|23/.test(t) || /period|cycle|month/.test(t))) {
      const p = previousCyclePeriod(new Date(), cycle);
      return { ok: true, ...p, source: 'preset-last-cycle' };
    }

    if (/job\s*cent|benefit|23\s*(?:rd)?\s*(?:to|–|-|—)\s*23|reporting\s*period|claim\s*period/.test(t)) {
      const p = cyclePeriodContaining(new Date(), cycle);
      return { ok: true, ...p, source: 'preset-current-cycle' };
    }

    const pair = extractTwoDates(text);
    if (pair) {
      const [a, b] = pair[0] <= pair[1] ? pair : [pair[1], pair[0]];
      const end = endExclusiveFromInclusiveEnd(b);
      return {
        ok: true,
        start: a,
        end,
        label: formatPeriodLabel(a, end),
        source: 'text-dates',
      };
    }

    if (/add up|total|sum|mileage|generate|report/.test(t)) {
      const p = cyclePeriodContaining(new Date(), cycle);
      return {
        ok: true,
        ...p,
        source: 'default-cycle',
        hint: 'Using your ' + cycle + ordinal(cycle) + '–' + cycle + ordinal(cycle) + ' reporting period.',
      };
    }

    return {
      ok: false,
      error: 'Try “Add up mileage 23rd to 23rd” or pick start and end dates below.',
    };
  }

  function ordinal(n) {
    if (n >= 11 && n <= 13) return 'th';
    const r = n % 10;
    if (r === 1) return 'st';
    if (r === 2) return 'nd';
    if (r === 3) return 'rd';
    return 'th';
  }

  function shiftsInRange(shifts, start, endExclusive) {
    return (shifts || []).filter((s) => {
      const d = new Date(s.startISO);
      return d >= start && d < endExclusive;
    });
  }

  function totalsForRange(shifts, start, endExclusive) {
    const list = shiftsInRange(shifts, start, endExclusive);
    return {
      mi: list.reduce((a, b) => a + Number(b.miles || 0), 0),
      sec: list.reduce((a, b) => a + Number(b.seconds || 0), 0),
      hmrc: list.reduce((a, b) => a + Number(b.hmrc || 0), 0),
      list,
    };
  }

  function buildPayload(opts) {
    const {
      shifts,
      start,
      end,
      label,
      driver,
      hmrcRate,
      fmt,
    } = opts;
    const t = totalsForRange(shifts, start, end);
    const periodLabel = 'Custom Period · ' + label;
    return {
      driver: driver || '',
      period: 'Custom',
      periodLabel,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      totals: { miles: t.mi, time: fmt(t.sec), hmrc: t.hmrc },
      previousPeriod: { miles: 0, seconds: 0, hmrc: 0, journeys: 0 },
      previousWeek: { miles: 0, seconds: 0, hmrc: 0, journeys: 0 },
      weekShifts: [],
      hmrcRate: hmrcRate || 0.55,
      shifts: t.list,
    };
  }

  function pdfFilename(label) {
    const safe = (label || 'custom').replace(/[^\w\-]+/g, '-').slice(0, 40);
    return 'MilePilot-custom-report-' + safe + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
  }

  global.MPCustomReport = {
    getCycleDay,
    setCycleDay,
    cyclePeriodContaining,
    previousCyclePeriod,
    parseUkDate,
    parseRequest,
    totalsForRange,
    buildPayload,
    formatPeriodLabel,
    pdfFilename,
    DEFAULT_CYCLE_DAY,
  };
})(typeof window !== 'undefined' ? window : globalThis);
