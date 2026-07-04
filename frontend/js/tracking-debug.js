/**
 * MP-043 Tracking Debug — diagnostic screen for native background mileage.
 * No UI polish; engineering visibility only.
 */
(function (global) {
  'use strict';

  let lastSync = null;
  let refreshTimer = null;

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
    const tripActive =
      typeof global.isShiftTracking === 'function'
        ? global.isShiftTracking()
        : global.ccState === 'active';
    const auto =
      typeof global.MPTripAutoEnd !== 'undefined'
        ? global.MPTripAutoEnd.getDebugState(tripActive)
        : {};
    return {
      tripStatus: tripActive ? 'ACTIVE' : 'idle',
      miles: typeof global.miles === 'number' ? global.miles : null,
      lastGpsAt: global.lastGpsAt || null,
      lastGpsLat: global.lastPoint?.lat ?? null,
      lastGpsLon: global.lastPoint?.lon ?? null,
      gpsPoints: global.routePoints?.length || 0,
      lastSave: global.lastActiveShiftSaveAt || null,
      autoEndCountdown: auto.countdownSec,
      autoEndIdle: auto.lastMovementAgoSec,
      nativeAuthoritative: !!global.__nativeEngineAuthoritative,
      nativeBgFallback: !!(global.nativeBgFallbackActive),
      lastWebGpsAt: global.lastWebGpsAt || null,
      webGpsWatch: global.gpsWatchId != null ? 'ON' : 'OFF',
      pendingMeters: typeof global.pendingMeters === 'number' ? global.pendingMeters : null,
      lastNativeMiles: global.lastNativeMilesSeen,
      lastNativeBg: global.lastNativeBgAt || null,
      permission:
        typeof global.MPTrackingProvider !== 'undefined'
          ? global.MPTrackingProvider.getPermission()
          : 'n/a',
      trackingMode: isNative() ? 'Native shell + remote PWA' : 'Web/PWA',
    };
  }

  function renderLines(nativeSnap, webDbg) {
    const lines = [
      '=== MilePilot Tracking Debug ===',
      'App version: ' + (global.APP_VERSION || '?'),
      'Native build: ' + (global.__MILEPILOT_BUILD__ || '?'),
      'Tracking mode: ' + (nativeSnap?.trackingMode || webDbg.trackingMode),
      '',
      '--- LOCKED PHONE (critical) ---',
      'Background task running: ' + (nativeSnap?.backgroundTaskRunning ? 'YES ✓' : 'NO ✗ NEED TESTFLIGHT BUILD 10'),
      'Background location enabled: ' + (nativeSnap?.backgroundActive ? 'YES' : 'NO'),
      'Last background GPS: ' + fmtAgo(nativeSnap?.lastBackgroundUpdateAt),
      'Trip required for locked miles: YES (AutoPilot watching alone does not count)',
      nativeSnap?.backgroundTaskRunning ? '' : '>>> Upload zip + install TestFlight build 10 <<<',
      '',
      '--- Permissions ---',
      'Permission: ' + (nativeSnap?.permissionStatus || webDbg.permission),
      '',
      '--- Trip ---',
      'Trip status (web): ' + webDbg.tripStatus,
      'Trip active (native): ' + (nativeSnap?.active ? 'YES' : 'NO'),
      'Shift id: ' + (nativeSnap?.shiftId || global.shiftId || '—'),
      'Native engine authoritative: ' + (webDbg.nativeAuthoritative ? 'YES' : 'NO'),
      'Web BG fallback active: ' + (webDbg.nativeBgFallback ? 'YES' : 'NO'),
      '',
      '--- GPS ---',
      'Miles (web display): ' + (webDbg.miles != null ? webDbg.miles.toFixed(4) : '—'),
      'Pending meters (web): ' + (webDbg.pendingMeters != null ? Math.round(webDbg.pendingMeters) + 'm' : '—'),
      'Miles (native): ' + (nativeSnap?.miles != null ? Number(nativeSnap.miles).toFixed(4) : '—'),
      'Last native miles seen: ' + (webDbg.lastNativeMiles != null ? Number(webDbg.lastNativeMiles).toFixed(4) : '—'),
      'Web GPS watch: ' + (webDbg.webGpsWatch || 'OFF'),
      'Last web GPS: ' + fmtAgo(webDbg.lastWebGpsAt),
      'GPS points (web): ' + webDbg.gpsPoints,
      'GPS points (native): ' + (nativeSnap?.gpsPointCount ?? '—'),
      'Last GPS: ' + fmtTime(nativeSnap?.lastGpsAt || webDbg.lastGpsAt),
      'Last coords: ' +
        (nativeSnap?.lastGpsLat != null
          ? nativeSnap.lastGpsLat.toFixed(5) + ', ' + nativeSnap.lastGpsLon.toFixed(5)
          : webDbg.lastGpsLat != null
            ? webDbg.lastGpsLat.toFixed(5) + ', ' + webDbg.lastGpsLon.toFixed(5)
            : '—'),
      'Last accuracy: ' + (nativeSnap?.lastGpsAcc != null ? Math.round(nativeSnap.lastGpsAcc) + 'm' : '—'),
      'Last foreground GPS: ' + fmtAgo(nativeSnap?.lastForegroundUpdateAt),
      'Last background GPS: ' + fmtAgo(nativeSnap?.lastBackgroundUpdateAt),
      'Last native persist: ' + fmtAgo(nativeSnap?.lastPersistAt),
      'Last web save: ' + fmtAgo(webDbg.lastSave),
      '',
      '--- App state ---',
      'Document visibility: ' + (document.visibilityState || '?'),
      'Last GPS source: ' + (nativeSnap?.lastSource || '—'),
      '',
      '--- Auto-end ---',
      'Countdown: ' + (webDbg.autoEndCountdown != null ? webDbg.autoEndCountdown + 's' : '—'),
      'Idle: ' + (webDbg.autoEndIdle != null ? webDbg.autoEndIdle + 's' : '—'),
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
    return lines.join('\n');
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
    const tripActive =
      typeof global.isShiftTracking === 'function'
        ? global.isShiftTracking()
        : global.ccState === 'active';
    if (tripActive && typeof global.goHome === 'function') {
      global.goHome();
      return;
    }
    if (typeof global.showSettings === 'function') global.showSettings();
  }

  function onSync(msg) {
    lastSync = msg;
  }

  global.MPTrackingDebug = {
    open: open,
    close: close,
    refresh: refresh,
    onSync: onSync,
  };
})(typeof window !== 'undefined' ? window : global);
