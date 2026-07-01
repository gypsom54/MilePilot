/**
 * MP-045 — Native idle watchdog for TestFlight (runs when WebView is suspended).
 * Tracks wall-clock deadline; triggers auto-end via WebView injection.
 */
import * as Notifications from 'expo-notifications';

const MOVEMENT_METERS = 15;
const NOTIF_ID = 'milepilot-auto-end';

let state = {
  active: false,
  shiftId: null,
  lastMovementAt: 0,
  autoEndDeadlineAt: 0,
  inactivityMs: 90 * 60 * 1000,
  lastLat: null,
  lastLon: null,
  pendingAutoEnd: false,
};

let injectAutoEnd = null;

export function setNativeAutoEndInjector(fn) {
  injectAutoEnd = typeof fn === 'function' ? fn : null;
}

export function syncNativeAutoEnd(payload) {
  if (!payload) return;
  if (payload.active === false) {
    state = {
      active: false,
      shiftId: null,
      lastMovementAt: 0,
      autoEndDeadlineAt: 0,
      inactivityMs: 90 * 60 * 1000,
      lastLat: null,
      lastLon: null,
      pendingAutoEnd: false,
    };
    cancelAutoEndNotification();
    return;
  }
  state.active = true;
  state.shiftId = payload.shiftId || state.shiftId;
  state.inactivityMs = payload.inactivityMs || state.inactivityMs || 90 * 60 * 1000;
  state.lastMovementAt = payload.lastMovementAt || Date.now();
  state.autoEndDeadlineAt =
    payload.autoEndDeadlineAt || state.lastMovementAt + state.inactivityMs;
  if (payload.lat != null && payload.lon != null) {
    state.lastLat = payload.lat;
    state.lastLon = payload.lon;
  }
  scheduleAutoEndNotification(state.autoEndDeadlineAt);
  console.log('[MilePilot NativeAutoEnd] armed', {
    shiftId: state.shiftId,
    deadlineISO: new Date(state.autoEndDeadlineAt).toISOString(),
  });
}

function distanceMeters(a, b) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const la1 = a.lat * rad;
  const la2 = b.lat * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

async function cancelAutoEndNotification() {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIF_ID);
  } catch (e) {}
}

async function scheduleAutoEndNotification(deadlineAt) {
  const waitSec = Math.max(1, Math.floor((deadlineAt - Date.now()) / 1000));
  try {
    await cancelAutoEndNotification();
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIF_ID,
      content: {
        title: 'MilePilot — shift ended',
        body: 'Your trip finished after 90 minutes stopped. Your report is being sent.',
        sound: true,
        data: { type: 'auto_end' },
      },
      trigger: { seconds: waitSec },
    });
  } catch (e) {
    console.warn('[MilePilot NativeAutoEnd] notification schedule failed', e.message);
  }
}

function triggerAutoEnd(reason) {
  if (!state.active || state.pendingAutoEnd) return false;
  state.pendingAutoEnd = true;
  console.log('[MilePilot NativeAutoEnd] triggering auto-end', { reason, shiftId: state.shiftId });
  if (typeof injectAutoEnd === 'function') {
    injectAutoEnd(reason || 'native_idle');
  }
  return true;
}

export function flushPendingNativeAutoEnd() {
  if (state.pendingAutoEnd && typeof injectAutoEnd === 'function') {
    injectAutoEnd('native_idle_resume');
    return true;
  }
  if (state.active && Date.now() >= state.autoEndDeadlineAt) {
    return triggerAutoEnd('native_idle_resume');
  }
  return false;
}

/**
 * Called from background location task on every GPS fix.
 */
export function onNativeBackgroundLocation(payload) {
  if (!state.active || !payload?.coords) return;
  const now = Date.now();
  const lat = payload.coords.latitude;
  const lon = payload.coords.longitude;

  if (state.lastLat != null && state.lastLon != null) {
    const d = distanceMeters({ lat: state.lastLat, lon: state.lastLon }, { lat, lon });
    if (d >= MOVEMENT_METERS) {
      state.lastMovementAt = now;
      state.autoEndDeadlineAt = now + state.inactivityMs;
      state.pendingAutoEnd = false;
      scheduleAutoEndNotification(state.autoEndDeadlineAt);
      console.log('[MilePilot NativeAutoEnd] movement — deadline reset', { meters: Math.round(d) });
    }
  }

  state.lastLat = lat;
  state.lastLon = lon;

  if (now >= state.autoEndDeadlineAt) {
    triggerAutoEnd('native_bg_location');
  }
}

export function getNativeAutoEndState() {
  return { ...state };
}
