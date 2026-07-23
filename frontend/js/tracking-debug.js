/**
 * MP-043 / MP-HF-005 Tracking Debug — diagnostic screen + lifecycle ledger export.
 */
(function (global) {
  'use strict';

  let lastSync = null;
  let refreshTimer = null;
  let lastLedgerPreview = '';

  function q(id) {
    return document.getElementById(id);
  }

  function isNative() {
    return global.MPPlatform && global.MPPlatform.isExpoNative && global.MPPlatform.isExpoNative();
  }

  function fmtTime(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-GB');
  }

  function fmtAgo(ts) {
    if (!ts) return '—';
    const sec = Math.floor((Date.now() - ts) / 1000);
    if (sec < 60) return sec + 's ago';
    return Math.floor(sec / 60) + 'm ago';
  }

  function getWebDebug() {
    const auto =
      typeof global.MPTripAutoEnd !== 'undefined'
        ? global.MPTripAutoEnd.getDebugState(global.ccState === 'active')
        : {};
    const motion =
      typeof global.MPAutoPilotMotion !== 'undefined'
        ? global.MPAutoPilotMotion.getDebugState()
        : {};
    return {
      tripStatus: global.ccState === 'active' ? 'ACTIVE' : 'idle',
      miles: typeof global.miles === 'number' ? global.miles : null,
      lastGpsAt: global.lastGpsAt || null,
      gpsPoints: global.routePoints?.length || 0,
      lastSave: global.lastActiveShiftSaveAt || null,
      autoEndCountdown: auto.countdownSec,
      autoEndIdle: auto.lastMovementAgoSec,
      nativeAuthoritative: !!global.__nativeEngineAuthoritative,
      nativeBgFallback: !!global.nativeBgFallbackActive,
      lastNativeSync: global.lastNativeSyncAt || null,
      permission:
        typeof global.MPTrackingProvider !== 'undefined'
          ? global.MPTrackingProvider.getPermission()
          : 'n/a',
      trackingMode: isNative() ? 'Native shell + remote PWA' : 'Web/PWA',
      autopilotState: motion.state || 'n/a',
      onboardComplete: localStorage.getItem('mp_onboard_complete') === 'true',
      locationChoice: localStorage.getItem('mp_location_choice') || 'n/a',
    };
  }

  function renderLines(nativeSnap, webDbg) {
    const prov =
      typeof global.MPLifecycleLedger !== 'undefined'
        ? global.MPLifecycleLedger.getJsProvenance()
        : {};
    const lines = [
      '=== MilePilot Tracking Debug (MP-HF-005) ===',
      'Status: CANDIDATE — NOT FIELD VERIFIED',
      'App version: ' + (global.APP_VERSION || '?'),
      'Native build: ' + (global.__MILEPILOT_BUILD__ || '?'),
      'Diagnostic build: MP-HF-005',
      'Web URL: ' + (global.location ? global.location.href.split('#')[0] : '?'),
      'Tracking mode: ' + (nativeSnap?.trackingMode || webDbg.trackingMode),
      '',
      '--- Provenance ---',
      'marketingVersion: ' + (prov.marketingVersion || global.APP_VERSION || '?'),
      'webBuildNumber: ' + (prov.webBuildNumber || global.__MILEPILOT_BUILD__ || '?'),
      'onboardComplete: ' + (webDbg.onboardComplete ? 'YES' : 'NO'),
      'trackingMode pref: ' + (localStorage.getItem('mp_tracking_mode') || '—'),
      'locationChoice: ' + webDbg.locationChoice,
      '',
      '--- Permissions ---',
      'Permission: ' + (nativeSnap?.permissionStatus || webDbg.permission),
      'Background location enabled: ' + (nativeSnap?.backgroundActive ? 'YES' : 'NO'),
      'Background task running: ' + (nativeSnap?.backgroundTaskRunning ? 'YES' : 'NO'),
      '',
      '--- AutoPilot ---',
      'Motion FSM state: ' + webDbg.autopilotState,
      'Autopilot bar visible: ' + (q('ccAutopilotBar') && !q('ccAutopilotBar').hidden ? 'YES' : 'NO'),
      '',
      '--- Trip ---',
      'Trip status (web): ' + webDbg.tripStatus,
      'Trip active (native): ' + (nativeSnap?.active ? 'YES' : 'NO'),
      'Shift id: ' + (nativeSnap?.shiftId || global.shiftId || '—'),
      'Native engine authoritative: ' + (webDbg.nativeAuthoritative ? 'YES' : 'NO'),
      '',
      '--- GPS (no coords in ledger export) ---',
      'Miles (web display): ' + (webDbg.miles != null ? webDbg.miles.toFixed(4) : '—'),
      'Miles (native): ' + (nativeSnap?.miles != null ? Number(nativeSnap.miles).toFixed(4) : '—'),
      'GPS points (web): ' + webDbg.gpsPoints,
      'GPS points (native): ' + (nativeSnap?.gpsPointCount ?? '—'),
      'Last GPS: ' + fmtTime(nativeSnap?.lastGpsAt || webDbg.lastGpsAt),
      'Last accuracy: ' + (nativeSnap?.lastGpsAcc != null ? Math.round(nativeSnap.lastGpsAcc) + 'm' : '—'),
      'Last foreground GPS: ' + fmtAgo(nativeSnap?.lastForegroundUpdateAt),
      'Last background GPS: ' + fmtAgo(nativeSnap?.lastBackgroundUpdateAt),
      '',
      '--- App state ---',
      'Document visibility: ' + (document.visibilityState || '?'),
      'Last GPS source: ' + (nativeSnap?.lastSource || '—'),
      '',
      '--- Errors ---',
      'Last error: ' + (nativeSnap?.lastError || 'none'),
    ];
    if (nativeSnap?.errors?.length) {
      nativeSnap.errors.slice(-5).forEach(function (e) {
        lines.push(e.t + ' ' + e.msg);
      });
    }
    if (lastSync) {
      lines.push('', 'Last sync received: ' + fmtTime(lastSync.timestamp || Date.now()));
    }
    lines.push('', 'Use Export Lifecycle Ledger for timestamped field-test log.');
    return lines.join('\n');
  }

  async function refreshLedgerPreview() {
    const el = q('lifecycleLedgerBody');
    if (!el || typeof global.MPLifecycleLedger === 'undefined') return;
    el.style.display = 'block';
    try {
      const ledger = await global.MPLifecycleLedger.exportLedger();
      lastLedgerPreview = global.MPLifecycleLedger.formatLedgerText(ledger);
      el.textContent = lastLedgerPreview.slice(0, 12000);
    } catch (e) {
      el.textContent = 'Ledger unavailable: ' + (e.message || String(e));
    }
  }

  async function refresh() {
    const el = q('trackingDebugBody');
    if (!el) return;
    const webDbg = getWebDebug();
    let nativeSnap = null;
    if (isNative() && global.MPExpoBridge) {
      try {
        const res = await global.MPExpoBridge.request('expo:debug:query', {
          appVersion: global.APP_VERSION,
          buildNumber: global.__MILEPILOT_BUILD__,
          webAppUrl: location.href.split('?')[0],
        });
        nativeSnap = res && res.snapshot ? res.snapshot : null;
      } catch (e) {
        nativeSnap = { lastError: e.message || String(e) };
      }
    }
    el.textContent = renderLines(nativeSnap, webDbg);
    await refreshLedgerPreview();
  }

  async function exportLedger() {
    if (typeof global.MPLifecycleLedger === 'undefined') {
      if (typeof global.toast === 'function') global.toast('Lifecycle ledger unavailable');
      return null;
    }
    const pack = await global.MPLifecycleLedger.copyExport();
    await refreshLedgerPreview();
    return pack;
  }

  async function shareLedger() {
    if (typeof global.MPLifecycleLedger === 'undefined') return null;
    const pack = await global.MPLifecycleLedger.shareExport();
    await refreshLedgerPreview();
    return pack;
  }

  function open() {
    if (typeof global.showScreen === 'function') global.showScreen('trackingDebug');
    refresh();
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(refresh, 3000);
  }

  function close() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (typeof global.showSettings === 'function') global.showSettings();
  }

  function onSync(msg) {
    lastSync = msg;
    if (typeof global.MPLifecycleLedger !== 'undefined') {
      global.MPLifecycleLedger.record('native_event_delivered', {
        bridgeType: 'expo:trip:sync',
        tripActive: !!(msg && msg.active),
      });
    }
  }

  global.MPTrackingDebug = {
    open: open,
    close: close,
    refresh: refresh,
    exportLedger: exportLedger,
    shareLedger: shareLedger,
    onSync: onSync,
  };
})(typeof window !== 'undefined' ? window : global);
