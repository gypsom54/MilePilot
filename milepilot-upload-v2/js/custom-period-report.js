/**
 * MilePilot Custom Date Range Reports
 * Manual date picker now · natural-language hooks for future AI (parseNaturalLanguageRequest).
 */
(function (global) {
  'use strict';

  const DEFAULT_CYCLE_DAY = 23;
  const STORAGE_KEY = 'mp_job_centre_cycle_day';
  const PRESET_JOB_CENTRE = 'job-centre';

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

  /** Job Centre preset: 23rd of previous month → 23rd of current month (inclusive). */
  function jobCentrePresetPeriod(refDate, cycleDay) {
    const ref = refDate || new Date();
    const day = cycleDay || getCycleDay();
    const start = new Date(ref.getFullYear(), ref.getMonth() - 1, day);
    const endIncl = new Date(ref.getFullYear(), ref.getMonth(), day);
    const end = endExclusiveFromInclusiveEnd(endIncl);
    return {
      start,
      end,
      label: formatPeriodLabel(start, end),
      preset: PRESET_JOB_CENTRE,
    };
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
      const d = parseInt(verbal[1], 10);
      const mon = MONTHS[verbal[2].toLowerCase()];
      if (mon !== undefined) {
        const y = verbal[3] ? parseInt(verbal[3], 10) : new Date().getFullYear();
        return startOfDay(new Date(y, mon, d));
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

  /**
   * Future AI entry point — same generator as manual date picker.
   * Returns { ok, start, end, label, source } or { ok: false, error }.
   */
  function parseNaturalLanguageRequest(text, cycleDay) {
    const cycle = cycleDay || getCycleDay();
    const t = (text || '').trim().toLowerCase();
    if (!t) return { ok: false, error: 'Say which dates you need.' };

    if (/job\s*cent|benefit|claim\s*period|reporting\s*month/.test(t)) {
      const p = jobCentrePresetPeriod(new Date(), cycle);
      return { ok: true, ...p, source: 'nl-job-centre' };
    }

    if (/23\s*(?:rd)?\s*(?:to|–|-|—)\s*23/.test(t)) {
      const p = cyclePeriodContaining(new Date(), cycle);
      return { ok: true, ...p, source: 'nl-23rd-cycle' };
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
        source: 'nl-dates',
      };
    }

    if (/add up|total|sum|mileage|generate|report|show/.test(t)) {
      const p = jobCentrePresetPeriod(new Date(), cycle);
      return { ok: true, ...p, source: 'nl-default-job-centre' };
    }

    return { ok: false, error: 'Try “Generate report from 23 May to 23 June”.' };
  }

  /** Manual picker — primary path for v1. */
  function parseDateRangeRequest(startInput, endInput) {
    if (!startInput || !endInput) {
      return { ok: false, error: 'Choose a start and end date.' };
    }
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

  function sumStopSeconds(stops) {
    return (stops || []).reduce(function (acc, stop) {
      const a = new Date(stop.startISO || 0).getTime();
      const b = new Date(stop.endISO || stop.startISO || 0).getTime();
      if (!a || !b || b <= a) return acc;
      return acc + Math.round((b - a) / 1000);
    }, 0);
  }

  function waitingSecondsForJourney(j) {
    const stopWait = sumStopSeconds(j.stops);
    if (stopWait > 0) return stopWait;
    const sec = Number(j.seconds) || 0;
    const mov = Number(j.movingSeconds) || 0;
    return Math.max(0, sec - mov);
  }

  function loadTripsFromStore(vehicle, claimFn) {
    if (typeof global.MPTrips === 'undefined') {
      try {
        return JSON.parse(global.localStorage?.getItem('mp_trips') || '[]');
      } catch (e) {
        return [];
      }
    }
    return global.MPTrips.loadTrips(vehicle, claimFn);
  }

  function shiftsInRange(shifts, start, endExclusive) {
    return (shifts || []).filter(function (s) {
      const d = new Date(s.startISO);
      return d >= start && d < endExclusive;
    });
  }

  function journeyInRange(j, start, endExclusive) {
    const d = new Date(j.startISO);
    return d >= start && d < endExclusive;
  }

  /**
   * Collect reportable journeys: business + reviewed only.
   * Legacy shifts (no trip store) count as reviewed business.
   */
  function collectReportJourneys(opts) {
    const shifts = opts.shifts || [];
    const trips = opts.trips || loadTripsFromStore(opts.vehicle, opts.claimFn);
    const start = opts.start;
    const end = opts.end;
    const claimFn = opts.claimFn;
    const vehicle = opts.vehicle || 'car';

    let included = [];
    let pendingInRange = [];
    let personalInRange = [];
    let unreviewedInRange = [];

    const hasTripData = trips.length > 0 && typeof global.MPTrips !== 'undefined';

    if (hasTripData) {
      const startMs = start.getTime();
      const endMs = end.getTime();
      const inRange = global.MPTrips.tripsInRange(trips, startMs, endMs);
      pendingInRange = inRange.filter(function (t) {
        return t.status === global.MPTrips.TRIP_STATUS.PENDING;
      });
      personalInRange = inRange.filter(function (t) {
        return t.status === global.MPTrips.TRIP_STATUS.PERSONAL;
      });
      unreviewedInRange = inRange.filter(function (t) {
        return t.status !== global.MPTrips.TRIP_STATUS.BUSINESS;
      });
      included = inRange
        .filter(function (t) {
          return t.status === global.MPTrips.TRIP_STATUS.BUSINESS;
        })
        .map(function (t) {
          return journeyToReportRow(t);
        });
    } else if (trips.length) {
      trips.forEach(function (t) {
        if (!journeyInRange(t, start, end)) return;
        if (t.status === 'pending') pendingInRange.push(t);
        else if (t.status === 'personal') personalInRange.push(t);
        else if (t.status === 'business') included.push(journeyToReportRow(t));
        else unreviewedInRange.push(t);
      });
    } else {
      included = shiftsInRange(shifts, start, end).map(function (s) {
        return shiftToReportRow(s, claimFn, vehicle);
      });
    }

    const mi = included.reduce(function (a, j) {
      return a + Number(j.miles || 0);
    }, 0);
    const sec = included.reduce(function (a, j) {
      return a + Number(j.seconds || 0);
    }, 0);
    const hmrc = included.reduce(function (a, j) {
      return a + Number(j.hmrc || 0);
    }, 0);
    const waitingSec = included.reduce(function (a, j) {
      return a + Number(j.waitingSeconds || 0);
    }, 0);

    const pendingCount = pendingInRange.length;
    const pendingNotice =
      pendingCount > 0
        ? pendingCount +
          ' journey' +
          (pendingCount === 1 ? '' : 's') +
          ' in this period ' +
          (pendingCount === 1 ? 'is' : 'are') +
          ' awaiting review and ' +
          (pendingCount === 1 ? 'is' : 'are') +
          ' not included.'
        : null;

    return {
      included: included,
      mi: mi,
      sec: sec,
      hmrc: hmrc,
      waitingSec: waitingSec,
      pendingCount: pendingCount,
      personalCount: personalInRange.length,
      excludedCount: personalInRange.length + pendingCount,
      pendingNotice: pendingNotice,
      dailyBreakdown: buildDailyBreakdown(included, start, end),
    };
  }

  function shiftToReportRow(shift, claimFn, vehicle) {
    const v = shift.vehicle || vehicle || 'car';
    const mi = Number(shift.miles) || 0;
    const route = shift.route || shift.routePoints || [];
    const hmrc =
      Number(shift.hmrc) ||
      Number((typeof claimFn === 'function' ? claimFn(mi, v) : mi * 0.55).toFixed(2));
    return {
      id: shift.id,
      miles: mi,
      seconds: Number(shift.seconds) || 0,
      movingSeconds: Number(shift.movingSeconds) || 0,
      waitingSeconds: waitingSecondsForJourney(shift),
      vehicle: v,
      hmrc: hmrc,
      date: shift.date || new Date(shift.startISO).toLocaleDateString('en-GB'),
      startISO: shift.startISO,
      endISO: shift.endISO,
      route: route,
      routePoints: route,
      stops: shift.stops || [],
      classification: 'Business',
      status: 'business',
      hasRoute: route.length >= 2,
    };
  }

  function journeyToReportRow(trip) {
    const route = trip.route || trip.routePoints || [];
    return {
      id: trip.id,
      miles: Number(trip.miles) || 0,
      seconds: Number(trip.seconds) || 0,
      movingSeconds: Number(trip.movingSeconds) || 0,
      waitingSeconds: waitingSecondsForJourney(trip),
      vehicle: trip.vehicle,
      hmrc: Number(trip.hmrc) || 0,
      date: trip.date,
      startISO: trip.startISO,
      endISO: trip.endISO,
      route: route,
      routePoints: route,
      stops: trip.stops || [],
      classification: 'Business',
      status: 'business',
      startLat: trip.startLat,
      startLon: trip.startLon,
      endLat: trip.endLat,
      endLon: trip.endLon,
      hasRoute: route.length >= 2,
    };
  }

  function buildDailyBreakdown(journeys, start, endExclusive) {
    const days = [];
    const cursor = startOfDay(start);
    const end = startOfDay(endExclusive);
    while (cursor < end) {
      const key = cursor.toDateString();
      const dayList = journeys.filter(function (j) {
        return new Date(j.startISO).toDateString() === key;
      });
      days.push({
        date: cursor.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        iso: cursor.toISOString().slice(0, 10),
        miles: dayList.reduce(function (a, j) {
          return a + Number(j.miles || 0);
        }, 0),
        seconds: dayList.reduce(function (a, j) {
          return a + Number(j.seconds || 0);
        }, 0),
        waitingSeconds: dayList.reduce(function (a, j) {
          return a + Number(j.waitingSeconds || 0);
        }, 0),
        journeys: dayList.length,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  function buildPayload(opts) {
    const fmt = opts.fmt;
    const range = opts.range;
    const data = collectReportJourneys({
      shifts: opts.shifts,
      trips: opts.trips,
      start: range.start,
      end: range.end,
      claimFn: opts.claimFn,
      vehicle: opts.vehicle,
    });

    const periodLabel = 'Custom Date Range · ' + range.label;

    return {
      driver: opts.driver || '',
      period: 'Custom',
      periodLabel: periodLabel,
      periodStart: range.start.toISOString(),
      periodEnd: range.end.toISOString(),
      totals: {
        miles: data.mi,
        time: fmt(data.sec),
        waitingTime: fmt(data.waitingSec),
        hmrc: data.hmrc,
        journeys: data.included.length,
      },
      waitingSeconds: data.waitingSec,
      dailyBreakdown: data.dailyBreakdown,
      excludedPending: data.pendingCount,
      pendingNotice: data.pendingNotice,
      previousPeriod: { miles: 0, seconds: 0, hmrc: 0, journeys: 0 },
      previousWeek: { miles: 0, seconds: 0, hmrc: 0, journeys: 0 },
      weekShifts: [],
      hmrcRate: opts.hmrcRate || 0.55,
      shifts: data.included,
      generatedAt: new Date().toISOString(),
    };
  }

  function pdfFilename(label) {
    const safe = (label || 'custom').replace(/[^\w\-]+/g, '-').slice(0, 40);
    return 'MilePilot-custom-date-report-' + safe + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
  }

  global.MPCustomReport = {
    getCycleDay: getCycleDay,
    setCycleDay: setCycleDay,
    jobCentrePresetPeriod: jobCentrePresetPeriod,
    cyclePeriodContaining: cyclePeriodContaining,
    previousCyclePeriod: previousCyclePeriod,
    parseUkDate: parseUkDate,
    parseDateRangeRequest: parseDateRangeRequest,
    parseNaturalLanguageRequest: parseNaturalLanguageRequest,
    collectReportJourneys: collectReportJourneys,
    buildPayload: buildPayload,
    formatPeriodLabel: formatPeriodLabel,
    pdfFilename: pdfFilename,
    PRESET_JOB_CENTRE: PRESET_JOB_CENTRE,
    DEFAULT_CYCLE_DAY: DEFAULT_CYCLE_DAY,
  };
})(typeof window !== 'undefined' ? window : globalThis);
