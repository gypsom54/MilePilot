/**
 * MP-036 — PWA install prompt, test mode panel, real-device helpers
 */
(function (global) {
  'use strict';

  var VERSION = '1.0.0';
  var INSTALL_DISMISS_KEY = 'mp_install_dismissed';
  var TEST_MODE_KEY = 'mp_test_mode';
  var PWA_NOTE_DISMISS_KEY = 'mp_pwa_note_dismissed';
  var deferredPrompt = null;

  function q(id) {
    return document.getElementById(id);
  }

  function isStandalone() {
    return (
      (global.matchMedia && global.matchMedia('(display-mode: standalone)').matches) ||
      global.navigator.standalone === true ||
      (document.referrer && document.referrer.indexOf('android-app://') === 0)
    );
  }

  function isTestMode() {
    try {
      if (localStorage.getItem(TEST_MODE_KEY) === '1') return true;
    } catch (e) {}
    return new URLSearchParams(global.location.search).get('testmode') === '1';
  }

  function initTestMode() {
    if (new URLSearchParams(global.location.search).get('testmode') === '1') {
      try {
        localStorage.setItem(TEST_MODE_KEY, '1');
      } catch (e) {}
    }
  }

  function canShowInstallPrompt() {
    if (isStandalone()) return false;
    try {
      if (localStorage.getItem(INSTALL_DISMISS_KEY) === '1') return false;
    } catch (e) {}
    return !!deferredPrompt;
  }

  function hideInstallOverlay() {
    var overlay = q('pwaInstallOverlay');
    if (overlay) overlay.hidden = true;
  }

  function dismissInstallPrompt() {
    try {
      localStorage.setItem(INSTALL_DISMISS_KEY, '1');
    } catch (e) {}
    deferredPrompt = null;
    hideInstallOverlay();
  }

  function maybeShowInstallPrompt() {
    if (!canShowInstallPrompt()) return;
    if (typeof global.hasCompletedInitialSetup === 'function' && !global.hasCompletedInitialSetup()) return;
    var overlay = q('pwaInstallOverlay');
    if (overlay) overlay.hidden = false;
  }

  function initInstallPrompt() {
    if (isStandalone()) return;
    global.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(maybeShowInstallPrompt, 1200);
    });
    global.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      hideInstallOverlay();
    });
  }

  function installApp() {
    if (!deferredPrompt) {
      hideInstallOverlay();
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice
      .then(function (choice) {
        if (choice.outcome === 'dismissed') dismissInstallPrompt();
        deferredPrompt = null;
        hideInstallOverlay();
      })
      .catch(function () {
        hideInstallOverlay();
      });
  }

  function dismissPwaBackgroundNote() {
    try {
      localStorage.setItem(PWA_NOTE_DISMISS_KEY, '1');
    } catch (e) {}
    var note = q('pwaBackgroundNote');
    if (note) note.hidden = true;
  }

  function renderPwaBackgroundNote() {
    var note = q('pwaBackgroundNote');
    if (!note) return;
    try {
      if (localStorage.getItem(PWA_NOTE_DISMISS_KEY) === '1') {
        note.hidden = true;
        return;
      }
    } catch (e) {}
    note.hidden = isStandalone() ? true : false;
  }

  function fmtTime(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '—';
    }
  }

  function getLastSavedShiftTime() {
    try {
      var raw = localStorage.getItem('mp_active_shift');
      if (raw) {
        var active = JSON.parse(raw);
        if (active && active.startedAt) return fmtTime(active.startedAt) + ' (active)';
        if (active && active.savedAt) return fmtTime(active.savedAt);
      }
    } catch (e) {}
    try {
      var shiftsRaw = localStorage.getItem('mp_shifts');
      if (shiftsRaw) {
        var shifts = JSON.parse(shiftsRaw);
        if (Array.isArray(shifts) && shifts.length) {
          var last = shifts[shifts.length - 1];
          if (last && last.endISO) return fmtTime(last.endISO);
          if (last && last.startISO) return fmtTime(last.startISO);
        }
      }
    } catch (e) {}
    return '—';
  }

  function getReportScheduleText() {
    if (typeof global.getReportFrequency !== 'function') return '—';
    var freq = global.getReportFrequency();
    if (!freq || freq === 'off') return 'Not scheduled';
    if (typeof global.getFrequencyScheduleCopy === 'function') return global.getFrequencyScheduleCopy(freq);
    return freq;
  }

  function getEmailStatusText() {
    var email = '';
    try {
      email = (localStorage.getItem('mp_email') || '').trim();
    } catch (e) {}
    if (!email) return 'No email set';
    var auto =
      typeof global.hasReportAutomation === 'function' ? global.hasReportAutomation() : false;
    var prefs = typeof global.getReportPrefs === 'function' ? global.getReportPrefs() : {};
    if (auto && prefs.emailReports !== false) return email + ' · auto reports on';
    return email + ' · manual only';
  }

  function getGpsAccuracyText() {
    if (typeof global.lastGpsAccuracy !== 'undefined' && global.lastGpsAccuracy != null) {
      return Math.round(global.lastGpsAccuracy) + ' m';
    }
    return '—';
  }

  function getRoutePointCount() {
    if (typeof global.routePoints !== 'undefined' && global.routePoints) {
      return String(global.routePoints.length);
    }
    if (typeof global.MPTracking !== 'undefined' && global.MPTracking.getState) {
      var s = global.MPTracking.getState();
      return String((s.routePoints && s.routePoints.length) || 0);
    }
    return '0';
  }

  function getTrackingStateText() {
    if (typeof global.getShiftStatus === 'function') return global.getShiftStatus();
    return '—';
  }

  function getAppVersionText() {
    if (typeof global.APP_VERSION !== 'undefined') return 'v' + global.APP_VERSION;
    if (typeof global.MPPioneer !== 'undefined' && global.MPPioneer.getAppVersion) {
      return global.MPPioneer.getAppVersion();
    }
    return '—';
  }

  function renderTestPanelRow(label, value) {
    return (
      '<div class="pioneer-metric-row"><span>' +
      label +
      '</span><strong>' +
      (value || '—') +
      '</strong></div>'
    );
  }

  function renderTestPanel() {
    var card = q('testModeCard');
    var body = q('testModeBody');
    if (!card || !body) return;
    card.hidden = !isTestMode();
    if (!isTestMode()) return;

    var permPromise =
      typeof global.queryGeoPermission === 'function'
        ? global.queryGeoPermission()
        : Promise.resolve('unknown');

    permPromise.then(function (perm) {
      body.innerHTML =
        renderTestPanelRow('App version', getAppVersionText()) +
        renderTestPanelRow('Display mode', isStandalone() ? 'standalone' : 'browser') +
        renderTestPanelRow('Location permission', perm || 'unknown') +
        renderTestPanelRow('GPS accuracy', getGpsAccuracyText()) +
        renderTestPanelRow('Tracking state', getTrackingStateText()) +
        renderTestPanelRow('Route points', getRoutePointCount()) +
        renderTestPanelRow('Last saved shift', getLastSavedShiftTime()) +
        renderTestPanelRow('Report schedule', getReportScheduleText()) +
        renderTestPanelRow('Email status', getEmailStatusText());
    });
  }

  function init() {
    initTestMode();
    initInstallPrompt();
    renderPwaBackgroundNote();
    document.addEventListener('focusin', function (e) {
      var t = e.target;
      if (!t || !t.matches) return;
      if (t.matches('input, textarea, select')) {
        setTimeout(function () {
          try {
            t.scrollIntoView({ block: 'center', behavior: 'smooth' });
          } catch (err) {}
        }, 320);
      }
    });
  }

  function onDashboardReady() {
    renderPwaBackgroundNote();
    maybeShowInstallPrompt();
  }

  global.MPPwaDevice = {
    VERSION: VERSION,
    isStandalone: isStandalone,
    isTestMode: isTestMode,
    init: init,
    onDashboardReady: onDashboardReady,
    maybeShowInstallPrompt: maybeShowInstallPrompt,
    installApp: installApp,
    dismissInstallPrompt: dismissInstallPrompt,
    dismissPwaBackgroundNote: dismissPwaBackgroundNote,
    renderTestPanel: renderTestPanel,
    renderPwaBackgroundNote: renderPwaBackgroundNote,
  };

  global.installMilePilotApp = installApp;
  global.dismissMilePilotInstall = dismissInstallPrompt;
  global.dismissPwaBackgroundNote = dismissPwaBackgroundNote;
})(typeof window !== 'undefined' ? window : global);
