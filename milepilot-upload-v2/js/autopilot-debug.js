/**
 * MP-047 AutoPilot Debug — development diagnostics only.
 */
(function (global) {
  'use strict';

  let refreshTimer = null;

  function q(id) {
    return document.getElementById(id);
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

  function render() {
    const body = q('autopilotDebugBody');
    if (!body) return;
    if (typeof global.MPAutoPilotMotion === 'undefined') {
      body.textContent =
        'AutoPilot motion module not loaded.\n\nUpload the latest Cloudflare zip (v8.43.32+) and hard-refresh the app.';
      return;
    }

    const dbg = global.MPAutoPilotMotion.getDebugState();
    const logs = global.MPAutoPilotMotion.getLog().slice(-12);

    const lines = [
      '=== MilePilot AutoPilot Debug ===',
      'State: ' + dbg.state,
      'AutoPilot mode: ' + (dbg.enabled ? 'ON' : 'OFF'),
      'Motion detection: ' + (dbg.motionEnabled ? 'ON' : 'OFF'),
      'Auto-start business: ' + (dbg.autoBusiness ? 'ON' : 'OFF'),
      'Idle auto-end: ' + Math.round(dbg.idleMs / 60000) + ' min',
      '',
      '--- Detection ---',
      'Last speed: ' + (dbg.lastSpeedMph != null ? dbg.lastSpeedMph.toFixed(1) + ' mph' : '—'),
      'GPS accuracy: ' + (dbg.lastAccuracyM != null ? Math.round(dbg.lastAccuracyM) + ' m' : '—'),
      'Motion activity: ' + dbg.motionActivity,
      'Confidence: ' + (dbg.candidateConfidence ? dbg.candidateConfidence.toFixed(2) : '—'),
      'Candidate sustained: ' + dbg.candidateSustainedSec + 's',
      'Last GPS: ' + fmtAgo(dbg.lastGpsAt) + ' (' + fmtTime(dbg.lastGpsAt) + ')',
      '',
      '--- Trip ---',
      'Shift active: ' + (dbg.shiftActive ? 'YES' : 'NO'),
      'Trip started: ' + fmtTime(dbg.tripStartedAt),
      'Trip ended: ' + fmtTime(dbg.tripEndedAt),
      'Idle countdown: ' + (dbg.idleCountdownSec != null ? dbg.idleCountdownSec + 's' : '—'),
      'Idle since movement: ' + (dbg.idleAgoSec != null ? dbg.idleAgoSec + 's' : '—'),
      '',
      '--- System ---',
      'Permissions OK: ' + (dbg.permissionsOk ? 'YES' : 'NO'),
      'Battery OK: ' + (dbg.batteryOk ? 'YES' : 'NO'),
      'Report sent: ' + fmtTime(dbg.reportSentAt),
      'Last error: ' + (dbg.lastError || '—'),
      '',
      '--- Recent log ---',
    ];

    logs.forEach(function (entry) {
      lines.push(entry.t + ' [' + entry.state + '] ' + entry.msg);
    });

    body.textContent = lines.join('\n');
  }

  function open() {
    if (typeof global.showScreen === 'function') global.showScreen('autopilotDebug');
    render();
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(render, 2000);
  }

  function close() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = null;
    if (typeof global.showSettings === 'function') global.showSettings();
  }

  function refresh() {
    render();
  }

  global.MPAutoPilotDebug = {
    open: open,
    close: close,
    refresh: refresh,
    render: render,
  };
})(typeof window !== 'undefined' ? window : globalThis);
