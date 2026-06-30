/**
 * MilePilot Report Scheduler — LOCKED (MP-041)
 * Frequency-based summary reports only — never per-trip or per-shift.
 * Daily 6pm · Weekly Sunday 6pm · Monthly 1st. Business trips only; pending excluded.
 */
(function (global) {
  'use strict';

  const SENT_PREFIX = 'mp_report_sent_';

  function sentKey(freq) {
    return SENT_PREFIX + freq;
  }

  /** Monday-start week; returns ISO date string for the Sunday ending that week. */
  function weekEndingKey(now) {
    now = now || new Date();
    const ws = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    ws.setDate(ws.getDate() - ((ws.getDay() + 6) % 7));
    const sun = new Date(ws);
    sun.setDate(sun.getDate() + 6);
    return sun.toISOString().slice(0, 10);
  }

  function periodKeyForFrequency(freq, now) {
    now = now || new Date();
    if (freq === 'daily') return now.toISOString().slice(0, 10);
    if (freq === 'weekly') return weekEndingKey(now);
    if (freq === 'monthly') {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return prev.getFullYear() + '-' + String(prev.getMonth() + 1).padStart(2, '0');
    }
    return '';
  }

  function reportPeriodForFrequency(freq) {
    if (freq === 'daily') return 'day';
    if (freq === 'weekly') return 'week';
    if (freq === 'monthly') return 'month';
    return 'day';
  }

  function wasSentForPeriod(freq, now) {
    return global.localStorage.getItem(sentKey(freq)) === periodKeyForFrequency(freq, now);
  }

  function markReportSent(freq, now) {
    global.localStorage.setItem(sentKey(freq), periodKeyForFrequency(freq, now));
  }

  /**
   * Returns true when a scheduled summary report should be sent now.
   * Daily: from 6pm once per calendar day.
   * Weekly: Sunday from 6pm once per week.
   * Monthly: 1st of month (previous month's data) once per month.
   */
  function isReportDue(freq, now) {
    now = now || new Date();
    if (wasSentForPeriod(freq, now)) return false;
    const h = now.getHours();
    if (freq === 'daily') return h >= 18;
    if (freq === 'weekly') return now.getDay() === 0 && h >= 18;
    if (freq === 'monthly') return now.getDate() === 1;
    return false;
  }

  function nextReportDate(freq, now) {
    now = now || new Date();
    const next = new Date(now);
    if (freq === 'daily') {
      if (now.getHours() >= 18 && wasSentForPeriod('daily', now)) next.setDate(next.getDate() + 1);
      next.setHours(18, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return next;
    }
    if (freq === 'weekly') {
      const daysUntilSun = (7 - now.getDay()) % 7;
      next.setDate(next.getDate() + (daysUntilSun || 7));
      next.setHours(18, 0, 0, 0);
      if (now.getDay() === 0 && now.getHours() < 18) {
        next.setDate(now.getDate());
      }
      return next;
    }
    if (freq === 'monthly') {
      next.setMonth(next.getMonth() + (now.getDate() >= 1 ? 1 : 0), 1);
      next.setHours(8, 0, 0, 0);
      if (now.getDate() === 1 && wasSentForPeriod('monthly', now)) {
        next.setMonth(next.getMonth() + 1, 1);
      }
      return next;
    }
    return next;
  }

  function formatNextReportLabel(freq, now) {
    const next = nextReportDate(freq, now);
    const opts = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
    const when = next.toLocaleString('en-GB', opts);
    const map = { daily: 'Next daily report', weekly: 'Next weekly report', monthly: 'Next monthly report' };
    return (map[freq] || 'Next report') + ': ' + when;
  }

  global.MPReportScheduler = {
    sentKey: sentKey,
    weekEndingKey: weekEndingKey,
    periodKeyForFrequency: periodKeyForFrequency,
    reportPeriodForFrequency: reportPeriodForFrequency,
    wasSentForPeriod: wasSentForPeriod,
    markReportSent: markReportSent,
    isReportDue: isReportDue,
    nextReportDate: nextReportDate,
    formatNextReportLabel: formatNextReportLabel,
  };
})(typeof window !== 'undefined' ? window : global);
