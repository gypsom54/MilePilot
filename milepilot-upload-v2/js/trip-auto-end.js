/**
 * VITAL — Trip auto-end on prolonged inactivity (MP-045)
 * Isolated from GPS tracking engine. Timestamp-based — survives background/lock screen
 * when the app process is still alive. See docs/AUTO_END_TRIP.md for PWA limits.
 */
(function (global) {
  'use strict';

  const DEFAULT_INACTIVITY_MS = 90 * 60 * 1000;
  const STORAGE_KEY = 'mp_auto_end_state';
  const LOG_KEY = 'mp_auto_end_logs';
  const LOG_MAX = 80;
  const LOG_PREFIX = '[MilePilot AutoEnd]';

  let memoryLogs = [];

  function nowMs() {
    return Date.now();
  }

  function getInactivityMs() {
    try {
      const raw = localStorage.getItem('mp_debug_auto_end_ms');
      if (raw) {
        const n = Number(raw);
        if (n > 0) return n;
      }
    } catch (e) {}
    return DEFAULT_INACTIVITY_MS;
  }

  function log(msg, data) {
    const entry = { t: nowMs(), msg: msg, data: data || null };
    memoryLogs.push(entry);
    if (memoryLogs.length > LOG_MAX) memoryLogs.shift();
    if (typeof console !== 'undefined' && console.log) {
      console.log(LOG_PREFIX, msg, data !== undefined ? data : '');
    }
    try {
      const stored = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      stored.push(entry);
      while (stored.length > LOG_MAX) stored.shift();
      localStorage.setItem(LOG_KEY, JSON.stringify(stored));
    } catch (e) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function onTripStarted(shiftId, startedAt) {
    const t = startedAt || nowMs();
    const state = {
      shiftId: shiftId || 'shift_' + t,
      tripStartedAt: t,
      lastMovementAt: t,
      autoEndFired: false,
    };
    saveState(state);
    log('Trip started', { shiftId: state.shiftId, inactivityMin: getInactivityMs() / 60000 });
  }

  function onRestore(shiftId, lastMovementAt) {
    const existing = loadState();
    if (existing && existing.shiftId === shiftId && !existing.autoEndFired) {
      if (lastMovementAt) existing.lastMovementAt = lastMovementAt;
      saveState(existing);
      log('Trip restored — inactivity timer resumed', {
        shiftId: shiftId,
        idleMin: Math.floor((nowMs() - existing.lastMovementAt) / 60000),
      });
      return;
    }
    onTripStarted(shiftId, lastMovementAt || nowMs());
  }

  function onMovementDetected(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return;
    const t = at || nowMs();
    const prev = state.lastMovementAt;
    state.lastMovementAt = t;
    saveState(state);
    log('Movement detected — inactivity timer reset', {
      idleWasSec: prev ? Math.floor((t - prev) / 1000) : 0,
    });
  }

  function msUntilAutoEnd(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return null;
    const t = at || nowMs();
    return Math.max(0, getInactivityMs() - (t - state.lastMovementAt));
  }

  function shouldAutoEnd(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return false;
    const t = at || nowMs();
    return t - state.lastMovementAt >= getInactivityMs();
  }

  function checkInactivity(at, onAutoEnd) {
    if (!shouldAutoEnd(at)) return false;
    const state = loadState();
    const t = at || nowMs();
    state.autoEndFired = true;
    saveState(state);
    log('Inactivity timer expired — auto-ending trip', {
      shiftId: state.shiftId,
      idleMin: Math.floor((t - state.lastMovementAt) / 60000),
      thresholdMin: getInactivityMs() / 60000,
    });
    if (typeof onAutoEnd === 'function') {
      try {
        onAutoEnd('auto');
      } catch (e) {
        log('Auto-end callback error', { error: String(e && e.message ? e.message : e) });
        state.autoEndFired = false;
        saveState(state);
        return false;
      }
    }
    return true;
  }

  function onTripEnded(reason) {
    log('Trip ended', { reason: reason || 'unknown' });
    clearState();
  }

  function getLastMovementAt() {
    const state = loadState();
    return state ? state.lastMovementAt : null;
  }

  function getDebugState(isActive) {
    const state = loadState();
    const t = nowMs();
    const threshold = getInactivityMs();
    const lastMove = state ? state.lastMovementAt : null;
    const countdown = lastMove != null ? Math.max(0, threshold - (t - lastMove)) : null;
    let storedLogs = [];
    try {
      storedLogs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    } catch (e) {}
    return {
      tripStatus: isActive ? 'active' : 'idle',
      inactivityThresholdMs: threshold,
      inactivityThresholdMin: threshold / 60000,
      lastMovementAt: lastMove,
      lastMovementISO: lastMove ? new Date(lastMove).toISOString() : null,
      lastMovementAgoSec: lastMove != null ? Math.floor((t - lastMove) / 1000) : null,
      countdownMs: countdown,
      countdownMin: countdown != null ? Number((countdown / 60000).toFixed(2)) : null,
      autoEndFired: !!(state && state.autoEndFired),
      shiftId: state ? state.shiftId : null,
      recentLogs: memoryLogs.slice(-12).length ? memoryLogs.slice(-12) : storedLogs.slice(-12),
    };
  }

  function clearLogs() {
    memoryLogs = [];
    localStorage.removeItem(LOG_KEY);
  }

  global.MPTripAutoEnd = {
    DEFAULT_INACTIVITY_MS: DEFAULT_INACTIVITY_MS,
    getInactivityMs: getInactivityMs,
    onTripStarted: onTripStarted,
    onRestore: onRestore,
    onMovementDetected: onMovementDetected,
    checkInactivity: checkInactivity,
    shouldAutoEnd: shouldAutoEnd,
    msUntilAutoEnd: msUntilAutoEnd,
    onTripEnded: onTripEnded,
    getLastMovementAt: getLastMovementAt,
    getDebugState: getDebugState,
    clearLogs: clearLogs,
    log: log,
  };
})(typeof window !== 'undefined' ? window : globalThis);
