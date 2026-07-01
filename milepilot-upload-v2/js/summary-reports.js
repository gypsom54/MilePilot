/**
 * VITAL — BUSINESS CRITICAL (MP-044) — Cloudflare deploy mirror
 * See frontend/js/summary-reports.js and docs/CRITICAL_FILES.md
 */
(function (global) {
  'use strict';

  const SENT_PREFIX = 'mp_auto_report_sent_';

  const SCHEDULE = {
    dailyAfterShiftHours: 1,
    weeklyPrimary: { day: 0, hour: 18, minute: 0, windowMin: 45 },
    weeklySummary: { day: 0, hour: 23, minute: 59, windowMin: 35 },
    monthlyPrimary: { hour: 23, minute: 59, windowMin: 35 },
    monthlySummary: { hour: 23, minute: 59, windowMin: 35 },
  };

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function weekKey(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x.toISOString().slice(0, 10);
  }

  function monthKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1);
  }

  function dayKey(d) {
    return d.toISOString().slice(0, 10);
  }

  function wasSent(type, key) {
    try {
      return global.localStorage.getItem(SENT_PREFIX + type + '_' + key) === '1';
    } catch (e) {
      return false;
    }
  }

  function markSent(type, key) {
    try {
      global.localStorage.setItem(SENT_PREFIX + type + '_' + key, '1');
    } catch (e) {}
  }

  function isLastDayOfMonth(d) {
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return d.getDate() === last.getDate();
  }

  function minutesOfDay(d) {
    return d.getHours() * 60 + d.getMinutes();
  }

  function inTimeWindow(now, hour, minute, windowMin) {
    const target = hour * 60 + minute;
    const current = minutesOfDay(now);
    return current >= target - windowMin && current <= target + 15;
  }

  function isSundaySlot(now, slot) {
    if (now.getDay() !== slot.day) {
      if (now.getDay() === (slot.day + 1) % 7 && minutesOfDay(now) < 30) return true;
      return false;
    }
    return inTimeWindow(now, slot.hour, slot.minute, slot.windowMin);
  }

  function isMonthlySlot(now, slot) {
    if (isLastDayOfMonth(now) && inTimeWindow(now, slot.hour, slot.minute, slot.windowMin)) return true;
    if (now.getDate() === 1 && minutesOfDay(now) < 30) return true;
    return false;
  }

  function getDueReportTypes(frequency, now) {
    const due = [];
    if (!frequency || frequency === 'off') return due;

    if (frequency === 'daily') {
      if (isSundaySlot(now, SCHEDULE.weeklySummary)) due.push('WeeklySummary');
      if (isMonthlySlot(now, SCHEDULE.monthlySummary)) due.push('MonthlySummary');
    } else if (frequency === 'weekly') {
      if (isSundaySlot(now, SCHEDULE.weeklyPrimary)) due.push('Weekly');
      if (isMonthlySlot(now, SCHEDULE.monthlySummary)) due.push('MonthlySummary');
    } else if (frequency === 'monthly') {
      if (isMonthlySlot(now, SCHEDULE.monthlyPrimary)) due.push('Monthly');
    }
    return due;
  }

  function dedupeKey(type, now) {
    if (type === 'Daily') return dayKey(now);
    if (type === 'Weekly' || type === 'WeeklySummary') return weekKey(now);
    if (type === 'Monthly' || type === 'MonthlySummary') return monthKey(now);
    return dayKey(now);
  }

  function tripToShiftRow(trip) {
    return {
      miles: trip.miles,
      seconds: trip.seconds,
      hmrc: trip.hmrc,
      vehicle: trip.vehicle,
      startISO: trip.startISO,
      endISO: trip.endISO,
      route: trip.route || trip.routePoints || [],
      waitingSeconds: trip.waitingSeconds || 0,
    };
  }

  function collectBusinessJourneys(deps) {
    const trips = typeof deps.getTrips === 'function' ? deps.getTrips() : [];
    const business = trips.filter(function (t) {
      return t.status === 'business';
    });
    const pending = trips.filter(function (t) {
      return t.status === 'pending';
    });

    if (business.length) {
      return {
        list: business.map(tripToShiftRow),
        excludedPending: pending.length,
        pendingNotice:
          pending.length > 0
            ? pending.length +
              ' pending journey' +
              (pending.length > 1 ? 's' : '') +
              ' excluded from this report.'
            : null,
      };
    }

    const shifts = typeof deps.getShifts === 'function' ? deps.getShifts() : [];
    return {
      list: shifts.slice(),
      excludedPending: 0,
      pendingNotice: null,
    };
  }

  function journeysInRange(list, start, end) {
    const s = start.getTime();
    const e = end.getTime();
    return list.filter(function (j) {
      const t = new Date(j.startISO).getTime();
      return t >= s && t < e;
    });
  }

  function sumJourneys(list) {
    return {
      mi: list.reduce(function (a, b) {
        return a + Number(b.miles || 0);
      }, 0),
      sec: list.reduce(function (a, b) {
        return a + Number(b.seconds || 0);
      }, 0),
      hmrc: list.reduce(function (a, b) {
        return a + Number(b.hmrc || 0);
      }, 0),
      journeys: list.length,
      list: list,
    };
  }

  function weekRangeContaining(refDate) {
    const end = new Date(refDate);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const rangeEnd = new Date(start);
    rangeEnd.setDate(rangeEnd.getDate() + 7);
    return { start: start, end: rangeEnd };
  }

  function previousWeekRange(refDate) {
    const cur = weekRangeContaining(refDate);
    const end = new Date(cur.start);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return { start: start, end: end };
  }

  function monthRangeContaining(refDate) {
    const d = refDate || new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    return { start: start, end: end };
  }

  function previousMonthRange(refDate) {
    const d = refDate || new Date();
    const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    const end = new Date(d.getFullYear(), d.getMonth(), 1);
    return { start: start, end: end };
  }

  function buildDailyBreakdown(list) {
    const map = {};
    list.forEach(function (j) {
      const d = new Date(j.startISO);
      const key = d.toISOString().slice(0, 10);
      if (!map[key]) {
        map[key] = {
          date: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          iso: key,
          miles: 0,
          seconds: 0,
          journeys: 0,
        };
      }
      map[key].miles += Number(j.miles || 0);
      map[key].seconds += Number(j.seconds || 0);
      map[key].journeys += 1;
    });
    return Object.keys(map)
      .sort()
      .map(function (k) {
        return map[k];
      });
  }

  function buildWeeklyBreakdown(list, monthStart) {
    const weeks = {};
    list.forEach(function (j) {
      const d = new Date(j.startISO);
      const wk = weekKey(d);
      if (!weeks[wk]) {
        weeks[wk] = { week: 'Week of ' + new Date(wk).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), label: '', miles: 0, seconds: 0, journeys: 0 };
      }
      weeks[wk].miles += Number(j.miles || 0);
      weeks[wk].seconds += Number(j.seconds || 0);
      weeks[wk].journeys += 1;
    });
    return Object.keys(weeks)
      .sort()
      .map(function (k) {
        const row = weeks[k];
        row.label = row.week;
        return row;
      });
  }

  function busiestDayLabel(list) {
    const map = {};
    list.forEach(function (j) {
      const k = new Date(j.startISO).toLocaleDateString('en-GB', { weekday: 'long' });
      map[k] = (map[k] || 0) + Number(j.miles || 0);
    });
    let best = null;
    let bestMi = 0;
    Object.keys(map).forEach(function (k) {
      if (map[k] > bestMi) {
        bestMi = map[k];
        best = k;
      }
    });
    return best;
  }

  function longestJourney(list) {
    if (!list.length) return null;
    return list.reduce(function (a, b) {
      return Number(b.miles || 0) > Number(a.miles || 0) ? b : a;
    });
  }

  function buildWeeklySummaryPayload(deps, now) {
    const collected = collectBusinessJourneys(deps);
    const range = weekRangeContaining(now || new Date());
    const prev = previousWeekRange(now || new Date());
    const list = journeysInRange(collected.list, range.start, range.end);
    const prevList = journeysInRange(collected.list, prev.start, prev.end);
    const totals = sumJourneys(list);
    const prevTotals = sumJourneys(prevList);
    const label =
      'Week ending ' +
      new Date(range.end.getTime() - 86400000).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

    return {
      email: deps.getEmail(),
      driver: deps.getDriver(),
      period: 'WeeklySummary',
      periodLabel: label,
      totals: { miles: totals.mi, time: deps.fmt(totals.sec), hmrc: totals.hmrc },
      previousWeek: {
        miles: prevTotals.mi,
        seconds: prevTotals.sec,
        hmrc: prevTotals.hmrc,
        journeys: prevTotals.journeys,
      },
      shifts: list,
      dailyBreakdown: buildDailyBreakdown(list),
      hmrcRate: deps.getHmrcRate(),
      excludedPending: collected.excludedPending,
      pendingNotice: collected.pendingNotice,
      reportKind: 'summary',
    };
  }

  function buildMonthlySummaryPayload(deps, now) {
    const collected = collectBusinessJourneys(deps);
    const range = monthRangeContaining(now);
    const prev = previousMonthRange(now);
    const list = journeysInRange(collected.list, range.start, range.end);
    const prevList = journeysInRange(collected.list, prev.start, prev.end);
    const totals = sumJourneys(list);
    const prevTotals = sumJourneys(prevList);
    const workingDays = new Set(
      list.map(function (j) {
        return new Date(j.startISO).toDateString();
      })
    ).size;
    const longest = longestJourney(list);
    const label = range.start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    return {
      email: deps.getEmail(),
      driver: deps.getDriver(),
      period: 'MonthlySummary',
      periodLabel: label,
      totals: { miles: totals.mi, time: deps.fmt(totals.sec), hmrc: totals.hmrc },
      previousPeriod: {
        miles: prevTotals.mi,
        seconds: prevTotals.sec,
        hmrc: prevTotals.hmrc,
        journeys: prevTotals.journeys,
      },
      shifts: list,
      weeklyBreakdown: buildWeeklyBreakdown(list, range.start),
      avgMilesPerDay: workingDays ? totals.mi / workingDays : 0,
      mostActiveDay: busiestDayLabel(list),
      hmrcRate: deps.getHmrcRate(),
      excludedPending: collected.excludedPending,
      pendingNotice: collected.pendingNotice,
      reportKind: 'summary',
    };
  }

  function buildStandardPayload(deps, periodType, now) {
    const collected = collectBusinessJourneys(deps);
    let range;
    let prevRange;
    let apiPeriod;
    if (periodType === 'Weekly') {
      range = weekRangeContaining(now);
      prevRange = previousWeekRange(now);
      apiPeriod = 'Weekly';
    } else if (periodType === 'Monthly') {
      range = monthRangeContaining(now);
      prevRange = previousMonthRange(now);
      apiPeriod = 'Monthly';
    } else {
      range = { start: new Date(now), end: new Date(now) };
      range.start.setHours(0, 0, 0, 0);
      range.end = new Date(range.start);
      range.end.setDate(range.end.getDate() + 1);
      prevRange = { start: new Date(range.start), end: new Date(range.start) };
      prevRange.start.setDate(prevRange.start.getDate() - 1);
      apiPeriod = 'Daily';
    }
    const list = journeysInRange(collected.list, range.start, range.end);
    const prevList = journeysInRange(collected.list, prevRange.start, prevRange.end);
    const totals = sumJourneys(list);
    const prevTotals = sumJourneys(prevList);

    return {
      email: deps.getEmail(),
      driver: deps.getDriver(),
      period: apiPeriod,
      totals: { miles: totals.mi, time: deps.fmt(totals.sec), hmrc: totals.hmrc },
      previousPeriod: { miles: prevTotals.mi, seconds: prevTotals.sec, hmrc: prevTotals.hmrc, journeys: prevTotals.journeys },
      previousWeek: { miles: prevTotals.mi, seconds: prevTotals.sec, hmrc: prevTotals.hmrc, journeys: prevTotals.journeys },
      weekShifts: list,
      shifts: list,
      hmrcRate: deps.getHmrcRate(),
      excludedPending: collected.excludedPending,
      pendingNotice: collected.pendingNotice,
    };
  }

  function buildPayload(deps, type, now) {
    if (type === 'WeeklySummary') return buildWeeklySummaryPayload(deps, now);
    if (type === 'MonthlySummary') return buildMonthlySummaryPayload(deps, now);
    return buildStandardPayload(deps, type, now);
  }

  async function sendAutomaticReport(deps, type, now) {
    const key = dedupeKey(type, now || new Date());
    if (wasSent(type, key)) return { skipped: true, reason: 'already_sent' };

    const email = deps.getEmail();
    if (!email) return { skipped: true, reason: 'no_email' };

    const payload = buildPayload(deps, type, now);
    if (!payload.shifts.length && type !== 'WeeklySummary' && type !== 'MonthlySummary') {
      return { skipped: true, reason: 'no_data' };
    }

    try {
      const result = await deps.apiPost('/reports/send', payload);
      if (result && result.res && result.res.ok && result.data && result.data.sent) {
        markSent(type, key);
        if (typeof deps.onSent === 'function') deps.onSent(type, payload);
        return { sent: true, type: type };
      }
      return { skipped: true, reason: 'send_failed', detail: result };
    } catch (e) {
      return { skipped: true, reason: 'error', detail: e };
    }
  }

  async function checkScheduledReports(deps) {
    const frequency = deps.getFrequency();
    if (!frequency || frequency === 'off') return [];
    if (!deps.getEmail()) return [];

    const now = new Date();
    const types = getDueReportTypes(frequency, now);
    const results = [];
    for (let i = 0; i < types.length; i++) {
      results.push(await sendAutomaticReport(deps, types[i], now));
    }
    return results;
  }

  function scheduleDailyAfterShift(deps, shiftEndedAt) {
    const frequency = deps.getFrequency();
    if (frequency !== 'daily') return null;
    const email = deps.getEmail();
    if (!email) return null;

    const delayMs = SCHEDULE.dailyAfterShiftHours * 60 * 60 * 1000;
    const fireAt = new Date(shiftEndedAt).getTime() + delayMs;
    const wait = Math.max(0, fireAt - Date.now());

    return setTimeout(async function () {
      const now = new Date();
      const key = dedupeKey('Daily', now);
      if (wasSent('Daily', key)) return;
      await sendAutomaticReport(deps, 'Daily', now);
    }, wait);
  }

  function getScheduleDescription(frequency) {
    if (frequency === 'daily') {
      return "Daily reports after each shift, plus a Weekly Summary every Sunday at 11:59pm and a Monthly Summary on the last day of each month.";
    }
    if (frequency === 'weekly') {
      return "Weekly report every Sunday, plus a Monthly Summary on the last day of each month at 11:59pm.";
    }
    if (frequency === 'monthly') {
      return "Monthly report on the last day of each month at 11:59pm.";
    }
    return '';
  }

  let deps = null;

  function init(dependencies) {
    deps = dependencies;
  }

  function requireDeps() {
    if (!deps) throw new Error('MPSummaryReports.init() must be called first');
    return deps;
  }

  global.MPSummaryReports = {
    SCHEDULE: SCHEDULE,
    init: init,
    getDueReportTypes: getDueReportTypes,
    getScheduleDescription: getScheduleDescription,
    buildWeeklySummaryPayload: function (now) {
      return buildWeeklySummaryPayload(requireDeps(), now);
    },
    buildMonthlySummaryPayload: function (now) {
      return buildMonthlySummaryPayload(requireDeps(), now);
    },
    buildPayload: function (type, now) {
      return buildPayload(requireDeps(), type, now);
    },
    sendAutomaticReport: function (type, now) {
      return sendAutomaticReport(requireDeps(), type, now);
    },
    checkScheduledReports: function () {
      return checkScheduledReports(requireDeps());
    },
    scheduleDailyAfterShift: function (shiftEndedAt) {
      return scheduleDailyAfterShift(requireDeps(), shiftEndedAt);
    },
    wasSent: wasSent,
    markSent: markSent,
  };
})(typeof window !== 'undefined' ? window : globalThis);
