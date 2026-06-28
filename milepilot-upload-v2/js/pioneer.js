/**
 * MP-032 — Pioneer Program (observability, feedback, internal metrics)
 */
(function (global) {
  'use strict';

  const VERSION = 1;
  const STORAGE_METRICS = 'mp_pioneer_metrics';
  const STORAGE_ERRORS = 'mp_pioneer_errors';
  const STORAGE_FEEDBACK = 'mp_pioneer_feedback_log';
  const STORAGE_SHIFT_COUNT = 'mp_pioneer_completed_shifts';
  const STORAGE_FEEDBACK_DISMISSED = 'mp_pioneer_feedback_dismissed';
  const MAX_ERRORS = 50;
  const FEEDBACK_SHIFT_THRESHOLD = 5;
  const SUPPORT_EMAIL = 'hello@milepilot.uk';

  function getAppVersion() {
    return global.APP_VERSION || 'unknown';
  }

  function getBuildNumber() {
    return global.BUILD_NUMBER || 'MP-032';
  }

  function isPioneerBuild() {
    try {
      if (localStorage.getItem('mp_pioneer_program') === '1') return true;
      if (new URLSearchParams(location.search).get('pioneer') === '1') {
        localStorage.setItem('mp_pioneer_program', '1');
        return true;
      }
    } catch (e) {}
    return false;
  }

  function canShowInternalMetrics() {
    if (typeof global.isDevMode === 'function' && global.isDevMode()) return true;
    try {
      return isPioneerBuild() && new URLSearchParams(location.search).get('metrics') === '1';
    } catch (e) {
      return false;
    }
  }

  function loadMetrics() {
    try {
      const raw = localStorage.getItem(STORAGE_METRICS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      completedShifts: 0,
      reportsGenerated: 0,
      reportsEmailed: 0,
      totalShiftSeconds: 0,
      gpsGranted: null,
      setupCompleted: false,
      appVersion: getAppVersion(),
    };
  }

  function saveMetrics(m) {
    m.appVersion = getAppVersion();
    m.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_METRICS, JSON.stringify(m));
    } catch (e) {}
    syncMetricsToServer(m);
  }

  function updateMetrics(patch) {
    const m = loadMetrics();
    Object.assign(m, patch);
    saveMetrics(m);
    return m;
  }

  function getCompletedShiftCount() {
    try {
      const n = parseInt(localStorage.getItem(STORAGE_SHIFT_COUNT) || '0', 10);
      return Number.isFinite(n) ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function incrementCompletedShifts(shiftSeconds) {
    const count = getCompletedShiftCount() + 1;
    try {
      localStorage.setItem(STORAGE_SHIFT_COUNT, String(count));
    } catch (e) {}
    const m = loadMetrics();
    m.completedShifts = count;
    m.totalShiftSeconds = (m.totalShiftSeconds || 0) + (Number(shiftSeconds) || 0);
    saveMetrics(m);
    return count;
  }

  function recordReportGenerated() {
    const m = loadMetrics();
    m.reportsGenerated = (m.reportsGenerated || 0) + 1;
    saveMetrics(m);
  }

  function recordReportEmailed() {
    const m = loadMetrics();
    m.reportsEmailed = (m.reportsEmailed || 0) + 1;
    saveMetrics(m);
  }

  function recordGpsOutcome(granted) {
    updateMetrics({ gpsGranted: !!granted });
  }

  function recordSetupComplete() {
    updateMetrics({ setupCompleted: true });
  }

  function averageShiftDuration() {
    const m = loadMetrics();
    if (!m.completedShifts) return 0;
    return Math.round((m.totalShiftSeconds || 0) / m.completedShifts);
  }

  function loadErrors() {
    try {
      const raw = localStorage.getItem(STORAGE_ERRORS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function logError(message, context) {
    const entry = {
      id: 'err_' + Date.now(),
      at: new Date().toISOString(),
      message: String(message || 'Unknown error').slice(0, 500),
      context: context || {},
      appVersion: getAppVersion(),
      build: getBuildNumber(),
      url: location.pathname,
    };
    const list = loadErrors();
    list.unshift(entry);
    while (list.length > MAX_ERRORS) list.pop();
    try {
      localStorage.setItem(STORAGE_ERRORS, JSON.stringify(list));
    } catch (e) {}
    postToServer('/pioneer/errors', entry).catch(function () {});
    return entry;
  }

  function installErrorHandlers() {
    if (global.__mpPioneerErrorsInstalled) return;
    global.__mpPioneerErrorsInstalled = true;
    global.addEventListener('error', function (ev) {
      logError(ev.message || 'Unexpected error', {
        source: ev.filename,
        line: ev.lineno,
        col: ev.colno,
      });
    });
    global.addEventListener('unhandledrejection', function (ev) {
      const msg = ev.reason && (ev.reason.message || String(ev.reason));
      logError(msg || 'Something went wrong', { type: 'unhandledrejection' });
    });
  }

  function postToServer(path, payload) {
    if (typeof global.apiPost !== 'function') return Promise.resolve();
    return global.apiPost(path, payload).catch(function () {});
  }

  function syncMetricsToServer(m) {
    if (!isPioneerBuild()) return;
    postToServer('/pioneer/telemetry', {
      metrics: m,
      pioneer: true,
      at: new Date().toISOString(),
    });
  }

  function submitFeedback(data) {
    const entry = {
      id: 'fb_' + Date.now(),
      at: new Date().toISOString(),
      ease: Number(data.ease) || 0,
      confused: (data.confused || '').trim(),
      timeSaving: (data.timeSaving || '').trim(),
      bugs: (data.bugs || '').trim(),
      appVersion: getAppVersion(),
      build: getBuildNumber(),
      pioneer: isPioneerBuild(),
    };
    try {
      const log = JSON.parse(localStorage.getItem(STORAGE_FEEDBACK) || '[]');
      log.unshift(entry);
      localStorage.setItem(STORAGE_FEEDBACK, JSON.stringify(log.slice(0, 20)));
    } catch (e) {}
    return postToServer('/pioneer/feedback', entry);
  }

  function isFeedbackReminderDismissed() {
    return localStorage.getItem(STORAGE_FEEDBACK_DISMISSED) === 'true';
  }

  function dismissFeedbackReminderPermanent() {
    try {
      localStorage.setItem(STORAGE_FEEDBACK_DISMISSED, 'true');
    } catch (e) {}
  }

  function shouldShowFeedbackReminder() {
    if (isFeedbackReminderDismissed()) return false;
    return getCompletedShiftCount() >= FEEDBACK_SHIFT_THRESHOLD;
  }

  function renderPioneerBanner() {
    const el = document.getElementById('pioneerBanner');
    if (!el) return;
    el.hidden = !isPioneerBuild();
  }

  function renderMetricsPanel() {
    const card = document.getElementById('pioneerMetricsCard');
    if (!card) return;
    if (!canShowInternalMetrics()) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    const m = loadMetrics();
    const avg = averageShiftDuration();
    const avgLabel = avg >= 3600
      ? Math.floor(avg / 3600) + 'h ' + Math.floor((avg % 3600) / 60) + 'm'
      : avg >= 60
        ? Math.floor(avg / 60) + 'm'
        : avg + 's';
    const rows = [
      ['Completed shifts', String(m.completedShifts || 0)],
      ['Reports generated', String(m.reportsGenerated || 0)],
      ['Reports emailed', String(m.reportsEmailed || 0)],
      ['Average shift duration', avgLabel],
      ['GPS permission granted', m.gpsGranted === null ? '—' : m.gpsGranted ? 'Yes' : 'No'],
      ['Setup completed', m.setupCompleted ? 'Yes' : 'No'],
      ['App version', getAppVersion()],
    ];
    const body = document.getElementById('pioneerMetricsBody');
    if (body) {
      body.innerHTML = rows
        .map(function (r) {
          return (
            '<div class="pioneer-metric-row"><span>' +
            r[0] +
            '</span><strong>' +
            r[1] +
            '</strong></div>'
          );
        })
        .join('');
    }
  }

  function renderAboutScreen() {
    const set = function (id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set('aboutVersion', 'MilePilot v' + getAppVersion());
    set('aboutBuild', 'Build ' + getBuildNumber());
    set('aboutSupportEmail', SUPPORT_EMAIL);
  }

  function init() {
    installErrorHandlers();
    try {
      if (localStorage.getItem('mp_onboard_complete') === 'true' || localStorage.getItem('mp_email') || localStorage.getItem('mp_report_frequency') || localStorage.getItem('mp_shifts')) {
        const m = loadMetrics();
        if (!m.setupCompleted) updateMetrics({ setupCompleted: true });
      }
    } catch (e) {}
    renderPioneerBanner();
    renderMetricsPanel();
    renderAboutScreen();
    if (isPioneerBuild()) {
      const m = loadMetrics();
      m.appVersion = getAppVersion();
      saveMetrics(m);
    }
  }

  global.MPPioneer = {
    VERSION,
    SUPPORT_EMAIL,
    isPioneerBuild,
    canShowInternalMetrics,
    init,
    logError,
    submitFeedback,
    incrementCompletedShifts,
    recordReportGenerated,
    recordReportEmailed,
    recordGpsOutcome,
    recordSetupComplete,
    shouldShowFeedbackReminder,
    dismissFeedbackReminderPermanent,
    renderPioneerBanner,
    renderMetricsPanel,
    renderAboutScreen,
    loadMetrics,
    averageShiftDuration,
    getCompletedShiftCount,
    getReleaseNotes: function () {
      return [
        'v8.9.7 — Unified input design across all screens (MP-043)',
        '• Same bright input boxes on welcome, email, settings, reports',
        '• Email onboarding headline fits properly; no browser autofill yellow flash',
      ].join('\n');
    },
  };
})(typeof window !== 'undefined' ? window : global);
