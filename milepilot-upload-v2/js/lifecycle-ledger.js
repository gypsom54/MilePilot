/**
 * MP-HF-005 — JavaScript lifecycle ledger (merged with native on export).
 * No coordinates stored in export payloads.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_lifecycle_ledger_js';
  const MAX_ENTRIES = 400;
  const REDACT_KEYS = ['latitude', 'longitude', 'lat', 'lon', 'coords', 'route'];

  let hooked = false;

  function isoNow() {
    return new Date().toISOString();
  }

  function sanitizeDetail(detail) {
    if (!detail || typeof detail !== 'object') return detail || null;
    const out = {};
    Object.keys(detail).forEach(function (key) {
      if (REDACT_KEYS.indexOf(key) >= 0) return;
      const val = detail[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        out[key] = sanitizeDetail(val);
      } else {
        out[key] = val;
      }
    });
    return out;
  }

  function loadEntries() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    try {
      while (entries.length > MAX_ENTRIES) entries.shift();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {}
  }

  function record(type, detail) {
    if (!type) return;
    const entries = loadEntries();
    entries.push({
      t: isoNow(),
      layer: 'js',
      type: type,
      detail: sanitizeDetail(detail || {}),
    });
    saveEntries(entries);
    if (global.MPExpoBridge && global.MPExpoBridge.post) {
      try {
        global.MPExpoBridge.post({
          type: 'expo:ledger:record',
          payload: { type: type, detail: sanitizeDetail(detail || {}) },
        });
      } catch (e) {}
    }
  }

  function getJsProvenance() {
    return {
      marketingVersion: global.APP_VERSION || null,
      jsBundleVersion: global.APP_VERSION || null,
      webBuildNumber: global.__MILEPILOT_BUILD__ || null,
      webAppUrl: global.location ? global.location.href.split('#')[0] : null,
      onboardComplete: localStorage.getItem('mp_onboard_complete') === 'true',
      trackingMode: localStorage.getItem('mp_tracking_mode') || null,
      locationChoice: localStorage.getItem('mp_location_choice') || null,
      diagnosticBuild: 'MP-HF-005',
    };
  }

  function readPreferenceSnapshot() {
    record('autopilot_preference_read', {
      onboardComplete: localStorage.getItem('mp_onboard_complete') === 'true',
      trackingMode: localStorage.getItem('mp_tracking_mode') || null,
      locationChoice: localStorage.getItem('mp_location_choice') || null,
      notificationsChoice: localStorage.getItem('mp_notifications_choice') || null,
    });
  }

  function patchBridgeReceive() {
    const prev = global.__expoBridgeReceive;
    if (prev && prev.__mpLedgerWrapped) return;
    global.__expoBridgeReceive = function (msg) {
      if (msg) {
        if (msg.type === 'expo:appstate') {
          record(msg.state === 'active' ? 'foreground' : 'background', { state: msg.state });
        }
        if (msg.type === 'expo:autopilot:location' || msg.type === 'expo:location') {
          record('native_event_delivered', {
            bridgeType: msg.type,
            accuracy: msg.coords && msg.coords.accuracy != null ? Math.round(msg.coords.accuracy) : null,
          });
        }
        if (msg.type === 'expo:trip:sync') {
          record('native_event_delivered', {
            bridgeType: msg.type,
            tripActive: !!msg.active,
            gpsPointCount: msg.gpsPointCount || null,
          });
        }
      }
      if (typeof prev === 'function') return prev(msg);
    };
    global.__expoBridgeReceive.__mpLedgerWrapped = true;
    record('bridge_ready', { wrapped: true });
  }

  function patchHooks() {
    if (hooked) return;
    hooked = true;

    wrapAsync('finishOnboarding', 'onboarding_completed', function () {
      return {
        trackingMode: localStorage.getItem('mp_tracking_mode'),
        locationChoice: localStorage.getItem('mp_location_choice'),
      };
    });

    wrapAsync('ensureAutopilotArmed', 'autopilot_armed', function () {
      const dbg =
        global.MPAutoPilotMotion && global.MPAutoPilotMotion.getDebugState
          ? global.MPAutoPilotMotion.getDebugState()
          : {};
      return { motionState: dbg.state || null };
    });

    wrapFn('startShiftCommandCentre', 'trip_start_requested', function () {
      return { manual: !global.autopilotStartedShift };
    });

    wrapFn('endShiftCommandCentre', 'trip_end_requested', function () {
      return { reason: arguments[0] || 'manual' };
    });

    wrapFn('initTrackingEngine', 'js_tracking_engine_ready');

    if (global.MPAutoPilotMotion && global.MPAutoPilotMotion.init) {
      const origInit = global.MPAutoPilotMotion.init;
      global.MPAutoPilotMotion.init = function (deps) {
        const wrapped = deps || {};
        const origOnState = wrapped.onStateChange;
        wrapped.onStateChange = function (prev, next, reason) {
          record('autopilot_motion_state', { prev: prev, next: next, reason: reason || null });
          if (next === 'MOVING_CANDIDATE') {
            record('native_motion_detected', { source: 'js_gps_fsm', note: 'not CoreMotion' });
          }
          if (typeof origOnState === 'function') origOnState(prev, next, reason);
        };
        const origAutoStart = wrapped.onAutoStart;
        wrapped.onAutoStart = function (meta) {
          record('trip_created', { source: 'autopilot_auto_start' });
          return typeof origAutoStart === 'function' ? origAutoStart(meta) : false;
        };
        return origInit(wrapped);
      };
    }
  }

  function wrapFn(name, eventType, detailFn) {
    const orig = global[name];
    if (typeof orig !== 'function') return;
    global[name] = function () {
      record(eventType, typeof detailFn === 'function' ? detailFn.apply(null, arguments) : null);
      return orig.apply(this, arguments);
    };
  }

  function wrapAsync(name, eventType, detailFn) {
    const orig = global[name];
    if (typeof orig !== 'function') return;
    global[name] = function () {
      const args = arguments;
      const detail = typeof detailFn === 'function' ? detailFn.apply(null, args) : null;
      const result = orig.apply(this, args);
      if (result && typeof result.then === 'function') {
        return result.then(function (res) {
          record(eventType, detail);
          return res;
        });
      }
      record(eventType, detail);
      return result;
    };
  }

  function init() {
    record('js_app_boot', {
      visibility: document.visibilityState,
      onboardComplete: localStorage.getItem('mp_onboard_complete') === 'true',
    });
    readPreferenceSnapshot();
    patchBridgeReceive();
    patchHooks();

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        record('background', { visibility: 'hidden' });
      } else if (document.visibilityState === 'visible') {
        record('foreground', { visibility: 'visible' });
      }
    });

    global.addEventListener('pagehide', function () {
      record('suspension', { event: 'pagehide' });
    });

    global.addEventListener('pageshow', function (ev) {
      record('foreground', { event: 'pageshow', persisted: !!ev.persisted });
    });
  }

  async function exportLedger() {
    const jsEntries = loadEntries();
    const jsProvenance = getJsProvenance();
    if (global.MPExpoBridge && global.MPExpoBridge.request) {
      try {
        const res = await global.MPExpoBridge.request('expo:ledger:export', {
          jsEntries: jsEntries,
          jsProvenance: jsProvenance,
          appVersion: global.APP_VERSION,
          buildNumber: global.__MILEPILOT_BUILD__,
          webAppUrl: global.location ? global.location.href : null,
        });
        if (res && res.ledger) return res.ledger;
      } catch (e) {
        record('ledger_export_failed', { error: e.message || String(e) });
      }
    }
    return {
      exportedAt: isoNow(),
      schema: 'mp-lifecycle-ledger-v1-js-only',
      provenance: jsProvenance,
      entryCount: jsEntries.length,
      entries: jsEntries,
      note: 'Native merge unavailable — WebView-only export',
    };
  }

  function formatLedgerText(ledger) {
    const lines = [
      '=== MilePilot Lifecycle Ledger (MP-HF-005) ===',
      'Exported: ' + (ledger.exportedAt || isoNow()),
      'Diagnostic: MP-HF-005',
      '',
      '--- Provenance ---',
    ];
    const prov = ledger.provenance || {};
    Object.keys(prov).forEach(function (k) {
      lines.push(k + ': ' + prov[k]);
    });
    lines.push('', '--- Events (' + (ledger.entryCount || ledger.entries.length) + ') ---');
    (ledger.entries || []).forEach(function (e) {
      lines.push(
        (e.t || '?') +
          ' [' +
          (e.layer || '?') +
          '] ' +
          e.type +
          (e.detail ? ' ' + JSON.stringify(e.detail) : '')
      );
    });
    return lines.join('\n');
  }

  async function copyExport() {
    const ledger = await exportLedger();
    const text = formatLedgerText(ledger);
    try {
      if (global.navigator && global.navigator.clipboard) {
        await global.navigator.clipboard.writeText(text);
        if (typeof global.toast === 'function') global.toast('Lifecycle ledger copied');
      }
    } catch (e) {}
    return { ledger: ledger, text: text };
  }

  async function shareExport() {
    const pack = await copyExport();
    if (global.navigator && global.navigator.share) {
      try {
        await global.navigator.share({
          title: 'MilePilot Lifecycle Ledger',
          text: pack.text.slice(0, 50000),
        });
      } catch (e) {}
    }
    return pack;
  }

  function clearJsLedger() {
    localStorage.removeItem(STORAGE_KEY);
    record('ledger_cleared', { layer: 'js' });
  }

  global.MPLifecycleLedger = {
    init: init,
    record: record,
    exportLedger: exportLedger,
    formatLedgerText: formatLedgerText,
    copyExport: copyExport,
    shareExport: shareExport,
    clearJsLedger: clearJsLedger,
    getJsProvenance: getJsProvenance,
  };
})(typeof window !== 'undefined' ? window : global);
