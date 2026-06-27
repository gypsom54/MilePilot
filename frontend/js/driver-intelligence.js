/**
 * MilePilot Driver Intelligence (Phase 2)
 * Modular analytics for dashboard insights, business health, weekly & monthly summaries.
 * Future modules (expenses, receipts, tax, AI) hook into MPDriverIntelligence.future.
 */
(function (global) {
  'use strict';

  const VERSION = 2;

  const future = {
    expenses: null,
    receiptScanner: null,
    profitDashboard: null,
    taxEstimates: null,
    aiInsights: null,
    businessPerformance: null,
    accountantExport: null,
  };

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function periodStart(period, now) {
    now = now || new Date();
    if (period === 'week') {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      return d;
    }
    if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
    if (period === 'year') return new Date(now.getFullYear(), 0, 1);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function shiftsInPeriod(shifts, period, now) {
    const start = periodStart(period, now);
    return shifts.filter((s) => new Date(s.startISO) >= start);
  }

  function prevWeekShifts(shifts, now) {
    const ws = periodStart('week', now);
    const prevStart = new Date(ws);
    prevStart.setDate(prevStart.getDate() - 7);
    return shifts.filter((s) => {
      const d = new Date(s.startISO);
      return d >= prevStart && d < ws;
    });
  }

  function prevMonthShifts(shifts, now) {
    const ms = periodStart('month', now);
    const prevStart = new Date(ms.getFullYear(), ms.getMonth() - 1, 1);
    return shifts.filter((s) => {
      const d = new Date(s.startISO);
      return d >= prevStart && d < ms;
    });
  }

  function sumShifts(list) {
    const mi = list.reduce((a, b) => a + (Number(b.miles) || 0), 0);
    const sec = list.reduce((a, b) => a + (Number(b.seconds) || 0), 0);
    const hmrc = list.reduce((a, b) => a + (Number(b.hmrc) || 0), 0);
    const journeys = list.reduce((a, b) => a + (Number(b.journeyCount) || 1), 0);
    return { mi, sec, hmrc, journeys, list, shiftCount: list.length };
  }

  function dayTotals(shifts, date) {
    const list = shifts.filter((s) => sameDay(new Date(s.startISO), date));
    return sumShifts(list);
  }

  function groupByDay(shifts) {
    const map = {};
    shifts.forEach((s) => {
      const key = new Date(s.startISO).toDateString();
      if (!map[key]) map[key] = { date: key, day: weekdayLabel(new Date(s.startISO)), miles: 0, sec: 0, hmrc: 0, journeys: 0, shifts: 0 };
      map[key].miles += Number(s.miles) || 0;
      map[key].sec += Number(s.seconds) || 0;
      map[key].hmrc += Number(s.hmrc) || 0;
      map[key].journeys += Number(s.journeyCount) || 1;
      map[key].shifts += 1;
    });
    return Object.values(map);
  }

  function weekdayLabel(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'long' });
  }

  function routePoints(shift) {
    return shift?.route || shift?.routePoints || shift?.gpsPoints || [];
  }

  function longestJourneyInShift(shift) {
    const total = Number(shift.miles) || 0;
    const stops = shift.stops || [];
    const route = routePoints(shift);
    if (!stops.length || route.length < 2) return total;
    const bounds = [route[0].t, ...stops.map((s) => new Date(s.endISO).getTime()), route[route.length - 1].t];
    let max = 0;
    for (let i = 0; i < bounds.length - 1; i++) {
      const t0 = bounds[i];
      const t1 = bounds[i + 1];
      let seg = 0;
      let prev = null;
      route.forEach((p) => {
        if (p.t >= t0 && p.t <= t1) {
          if (prev && global.MPTracking) seg += global.MPTracking.distance(prev, p);
          else if (prev) {
            const R = 6371000;
            const rad = Math.PI / 180;
            const dLat = (p.lat - prev.lat) * rad;
            const dLon = (p.lon - prev.lon) * rad;
            const x =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(prev.lat * rad) * Math.cos(p.lat * rad) * Math.sin(dLon / 2) ** 2;
            seg += R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
          }
          prev = p;
        }
      });
      max = Math.max(max, seg / 1609.344);
    }
    return max || total;
  }

  function longestJourneyInList(shifts) {
    let max = 0;
    shifts.forEach((s) => {
      max = Math.max(max, longestJourneyInShift(s));
    });
    return max;
  }

  function busiestDay(shifts) {
    const days = groupByDay(shifts).filter((d) => d.miles > 0);
    if (!days.length) return null;
    return days.reduce((a, b) => (b.miles > a.miles ? b : a));
  }

  function quietestDayThisWeek(shifts, now) {
    const weekList = shiftsInPeriod(shifts, 'week', now);
    const ws = periodStart('week', now);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(ws);
      d.setDate(d.getDate() + i);
      const t = dayTotals(weekList, d);
      days.push({ day: weekdayLabel(d), miles: t.mi, date: d.toDateString() });
    }
    const withData = days.filter((d) => d.miles > 0);
    if (!withData.length) return null;
    return withData.reduce((a, b) => (b.miles < a.miles ? b : a));
  }

  function computeStreak(shifts, includeToday) {
    const days = new Set(shifts.map((s) => new Date(s.startISO).toDateString()));
    if (includeToday) days.add(new Date().toDateString());
    let streak = 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (!days.has(d.toDateString()) && !includeToday) d.setDate(d.getDate() - 1);
    while (days.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  function weekComparePct(current, previous) {
    if (!previous.mi || !current.mi) return null;
    return Math.round((current.mi / previous.mi - 1) * 100);
  }

  function buildDailyHealth(ctx) {
    const { shifts, today, active } = ctx;
    const todayData = today || { mi: 0, sec: 0, hmrc: 0, journeys: 0, list: [] };
    const todayList = todayData.list || [];
    const avgJourney =
      todayData.journeys > 0 ? todayData.mi / todayData.journeys : active?.currentJourneyMiles > 0 ? todayData.mi / Math.max(todayData.journeys, 1) : 0;
    let longest = longestJourneyInList(todayList);
    if (active && active.currentJourneyMiles > longest) longest = active.currentJourneyMiles;
    if (active && active.miles > 0 && todayList.length === 0) {
      longest = Math.max(longest, active.miles);
    }
    const streak = computeStreak(shifts, !!(active || todayList.length));
    return {
      miles: todayData.mi,
      seconds: todayData.sec,
      hmrc: todayData.hmrc,
      journeys: todayData.journeys,
      averageJourney: avgJourney,
      longestJourney: longest,
      streak,
      hasData: todayData.mi > 0 || todayData.journeys > 0 || !!active,
    };
  }

  function buildWeeklyHealth(ctx) {
    const { shifts, now, active } = ctx;
    now = now || new Date();
    const weekList = shiftsInPeriod(shifts, 'week', now);
    let week = sumShifts(weekList);
    if (active) {
      week = {
        mi: week.mi + (Number(active.miles) || 0),
        sec: week.sec + (Number(active.elapsed) || 0),
        hmrc: week.hmrc + (Number(active.hmrc) || 0),
        journeys: week.journeys + (Number(active.journeyCount) || 1),
        list: week.list,
        shiftCount: week.shiftCount + 1,
      };
    }
    const prev = sumShifts(prevWeekShifts(shifts, now));
    const avgJourney = week.journeys > 0 ? week.mi / week.journeys : 0;
    const longest = longestJourneyInList(week.list.concat(active ? [{ miles: active.miles, stops: [], route: [] }] : []));
    const streak = computeStreak(shifts, !!active);
    return {
      miles: week.mi,
      seconds: week.sec,
      hmrc: week.hmrc,
      journeys: week.journeys,
      shiftCount: week.shiftCount,
      averageJourney: avgJourney,
      longestJourney: longest,
      streak,
      busiestDay: busiestDay(week.list),
      quietestDay: quietestDayThisWeek(shifts, now),
      compareLastWeek: weekComparePct(week, prev),
      prevWeek: prev,
      hasData: week.mi > 0 || week.journeys > 0 || week.list.length > 0,
    };
  }

  function buildWeeklySummary(ctx) {
    const health = buildWeeklyHealth(ctx);
    if (!health.hasData) return null;
    const bestDay = health.busiestDay;
    return {
      label: 'This Week',
      miles: health.miles,
      seconds: health.seconds,
      hmrc: health.hmrc,
      journeys: health.journeys,
      longestJourney: health.longestJourney,
      bestDrivingDay: bestDay ? bestDay.day : null,
      compareLastWeek: health.compareLastWeek,
      hasData: true,
    };
  }

  function buildMonthlyOverview(ctx) {
    const { shifts, now, active } = ctx;
    now = now || new Date();
    const monthList = shiftsInPeriod(shifts, 'month', now);
    let month = sumShifts(monthList);
    if (active) {
      month = {
        mi: month.mi + (Number(active.miles) || 0),
        sec: month.sec + (Number(active.elapsed) || 0),
        hmrc: month.hmrc + (Number(active.hmrc) || 0),
        journeys: month.journeys + (Number(active.journeyCount) || 1),
        list: month.list,
        shiftCount: month.shiftCount + 1,
      };
    }
    const prev = sumShifts(prevMonthShifts(shifts, now));
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const workingDays = new Set(month.list.map((s) => new Date(s.startISO).toDateString())).size;
    const avgDailyMiles = workingDays > 0 ? month.mi / workingDays : dayOfMonth > 0 ? month.mi / dayOfMonth : 0;
    return {
      miles: month.mi,
      seconds: month.sec,
      hmrc: month.hmrc,
      shiftCount: month.shiftCount,
      journeys: month.journeys,
      averageDailyMiles: avgDailyMiles,
      compareLastMonth: weekComparePct(month, prev),
      prevMonth: prev,
      dayOfMonth,
      daysInMonth,
      hasData: month.mi > 0 || month.list.length > 0,
    };
  }

  function generateInsights(ctx, mode) {
    const { shifts, today, now, fmtMoney, fmtShort } = ctx;
    now = now || new Date();
    const insights = [];
    const todayData = today || { mi: 0, sec: 0, hmrc: 0, journeys: 0, list: [] };
    const week = buildWeeklyHealth(ctx);
    const month = buildMonthlyOverview(ctx);

    const longestToday = buildDailyHealth(ctx).longestJourney;
    if (longestToday >= 0.5) {
      insights.push({ text: 'Longest journey today: ' + longestToday.toFixed(1) + ' miles.', priority: 10 });
    }

    if (week.busiestDay && week.busiestDay.miles > 0 && (mode === 'evening' || mode === 'day_off' || mode === 'today_done')) {
      insights.push({
        text: 'Busiest day this week: ' + week.busiestDay.day + ' (' + week.busiestDay.miles.toFixed(1) + ' mi).',
        priority: 8,
      });
    }

    if (week.quietestDay && week.quietestDay.miles > 0 && week.busiestDay && week.quietestDay.miles < week.busiestDay.miles) {
      insights.push({
        text: 'Quietest day this week: ' + week.quietestDay.day + ' (' + week.quietestDay.miles.toFixed(1) + ' mi).',
        priority: 7,
      });
    }

    if (todayData.journeys > 0 && todayData.mi > 0) {
      const avg = todayData.mi / todayData.journeys;
      insights.push({ text: 'Average journey length today: ' + avg.toFixed(1) + ' miles.', priority: 6 });
    }

    if (todayData.sec >= 60) {
      insights.push({ text: 'Total driving time today: ' + fmtShort(todayData.sec) + '.', priority: 5 });
    }

    if (week.hmrc >= 0.01 && (mode === 'evening' || mode === 'day_off' || mode === 'today_done')) {
      insights.push({ text: 'Estimated HMRC allowance this week: ' + fmtMoney(week.hmrc) + '.', priority: 9 });
    }

    if (week.streak >= 2) {
      insights.push({
        text: 'Current mileage streak: ' + week.streak + ' day' + (week.streak === 1 ? '' : 's') + '.',
        priority: 4,
      });
    }

    const yesterday = dayTotals(shifts, (() => { const y = new Date(now); y.setDate(y.getDate() - 1); return y; })());
    if (todayData.mi > yesterday.mi && yesterday.mi > 0) {
      insights.push({ text: 'You\'ve driven further than yesterday.', priority: 11 });
    } else if (todayData.mi > 0 && yesterday.mi === 0) {
      insights.push({ text: 'More business miles today than yesterday.', priority: 3 });
    }

    if (week.compareLastWeek != null && Math.abs(week.compareLastWeek) >= 5) {
      insights.push({
        text:
          'This week you\'ve driven ' +
          Math.abs(week.compareLastWeek) +
          '% ' +
          (week.compareLastWeek > 0 ? 'more' : 'fewer') +
          ' miles than last week.',
        priority: 8,
      });
    }

    if (month.hasData && month.mi > 0 && (mode === 'evening' || mode === 'day_off')) {
      insights.push({ text: month.mi.toFixed(1) + ' business miles so far this month.', priority: 2 });
    }

    insights.sort((a, b) => b.priority - a.priority);
    return insights.slice(0, 3).map((i) => i.text);
  }

  function defaultInsight(mode, hasShifts) {
    if (!hasShifts) return ['Start your first shift — MilePilot handles the rest.'];
    if (mode === 'day_off') return ['Take a well-earned break — your business data will be here when you\'re ready.'];
    return ['Keep tracking — insights improve as you drive more business miles.'];
  }

  function generateFeaturedInsight(ctx, mode) {
    const { shifts, today, now, fmtShort } = ctx;
    now = now || new Date();
    const todayData = today || { mi: 0, sec: 0, hmrc: 0, journeys: 0, list: [] };
    if (!todayData.mi || todayData.mi < 0.05) return null;
    if (mode !== 'today_done' && mode !== 'evening') return null;

    const candidates = [];
    const wd = weekdayLabel(now);
    const monthList = shiftsInPeriod(shifts, 'month', now);
    const sameWdDays = groupByDay(monthList).filter((d) => new Date(d.date).getDay() === now.getDay());
    if (sameWdDays.length >= 2) {
      const todayKey = now.toDateString();
      const todayDay = sameWdDays.find((d) => d.date === todayKey);
      const maxOther = sameWdDays.reduce((a, b) => (b.miles > a.miles ? b : a));
      if (todayDay && todayDay.miles >= maxOther.miles && todayDay.miles > 0) {
        candidates.push({
          text: 'Today was your busiest ' + wd + ' this month.',
          priority: 12,
        });
      }
    }

    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastSame = dayTotals(shifts, lastWeek);
    if (lastSame.mi > 0 && todayData.mi > 0) {
      const pct = Math.round((todayData.mi / lastSame.mi - 1) * 100);
      if (Math.abs(pct) >= 5) {
        candidates.push({
          text:
            'You drove ' +
            Math.abs(pct) +
            '% ' +
            (pct > 0 ? 'more' : 'fewer') +
            ' than last ' +
            wd +
            '.',
          priority: 11,
        });
      }
    }

    const peak = peakDrivingWindow(todayData.list);
    if (peak) {
      candidates.push({ text: 'Most of today\'s mileage came between ' + peak + '.', priority: 10 });
    }

    const month = buildMonthlyOverview(ctx);
    if (month.hasData && month.prevMonth.mi > 0 && month.mi > month.prevMonth.mi) {
      candidates.push({
        text: 'You\'ve already claimed more business miles this month than last month.',
        priority: 9,
      });
    }

    const week = buildWeeklyHealth(ctx);
    if (week.compareLastWeek != null && Math.abs(week.compareLastWeek) >= 8) {
      candidates.push({
        text:
          'This week you\'ve driven ' +
          Math.abs(week.compareLastWeek) +
          '% ' +
          (week.compareLastWeek > 0 ? 'more' : 'fewer') +
          ' miles than last week.',
        priority: 7,
      });
    }

    candidates.sort((a, b) => b.priority - a.priority);
    return candidates.length ? candidates[0].text : null;
  }

  function peakDrivingWindow(shiftList) {
    if (!shiftList || !shiftList.length) return null;
    const buckets = new Array(24).fill(0);
    shiftList.forEach((s) => {
      const start = new Date(s.startISO);
      const end = new Date(s.endISO || s.startISO);
      const mi = Number(s.miles) || 0;
      const startH = start.getHours();
      buckets[startH] += mi;
      if (end.getHours() !== startH && mi > 0) {
        buckets[end.getHours()] += mi * 0.25;
      }
    });
    let bestStart = 0;
    let bestSum = 0;
    for (let h = 0; h < 22; h++) {
      const sum = buckets[h] + buckets[h + 1] + buckets[h + 2];
      if (sum > bestSum) {
        bestSum = sum;
        bestStart = h;
      }
    }
    if (bestSum < 0.05) return null;
    const fmtH = (h) => {
      const suffix = h >= 12 ? 'pm' : 'am';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return hour12 + suffix;
    };
    const endH = bestStart + 3;
    return fmtH(bestStart) + ' and ' + fmtH(endH);
  }

  function buildDayRecap(ctx) {
    const today = ctx.today || { mi: 0, sec: 0, hmrc: 0, journeys: 0 };
    const hasData = today.journeys > 0 && today.mi >= 0.05;
    return {
      miles: today.mi,
      hmrc: today.hmrc,
      journeys: today.journeys,
      seconds: today.sec,
      hasData,
    };
  }

  function shouldShowDayRecap(mode, recap) {
    return mode === 'today_done' && recap.hasData;
  }

  function analyse(ctx, mode) {
    const daily = buildDailyHealth(ctx);
    const weekly = buildWeeklyHealth(ctx);
    const weeklySummary = buildWeeklySummary(ctx);
    const monthly = buildMonthlyOverview(ctx);
    const dayRecap = buildDayRecap(ctx);
    let insights = generateInsights(ctx, mode);
    if (!insights.length) insights = defaultInsight(mode, (ctx.shifts || []).length > 0);
    const featuredInsight = generateFeaturedInsight(ctx, mode) || insights[0] || null;
    return {
      daily,
      weekly,
      weeklySummary,
      monthly,
      dayRecap,
      featuredInsight,
      insights,
      mode,
      showDayRecap: shouldShowDayRecap(mode, dayRecap),
    };
  }

  global.MPDriverIntelligence = {
    VERSION,
    future,
    analyse,
    buildDailyHealth,
    buildWeeklyHealth,
    buildWeeklySummary,
    buildMonthlyOverview,
    buildDayRecap,
    generateInsights,
    generateFeaturedInsight,
    peakDrivingWindow,
    computeStreak,
    busiestDay,
    quietestDayThisWeek,
    longestJourneyInShift,
    longestJourneyInList,
    sumShifts,
    dayTotals,
    shiftsInPeriod,
    periodStart,
    shouldShowDayRecap,
  };
})(typeof window !== 'undefined' ? window : global);
