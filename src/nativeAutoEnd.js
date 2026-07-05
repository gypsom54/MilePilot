/**
 * MP-045 — Native idle watchdog for TestFlight (runs when WebView is suspended).
 * Tracks wall-clock deadline; triggers auto-end via WebView injection.
 */
import * as Notifications from 'expo-notifications';

const MOVEMENT_METERS = 50;
const SOFT_MOVEMENT_METERS = 22;
const MIN_SPEED_MPS = 1.8;
const SOFT_SPEED_MPS = 1.0;
const MAX_ACC_M = 65;
const NOTIF_ID = 'milepilot-auto-end';
const RESCHEDULE_MIN_MS = 30000;

let state = {
  active: false,
  shiftId: null,
  lastMovementAt: 0,
  autoEndDeadlineAt: 0,
  inactivityMs: 90 * 60 * 1000,
  lastLat: null,
  lastLon: null,
  pendingAutoEnd: false,
  autoEndCompleted: false,
};

let injectAutoEnd = null;
let stopNativeTripHandler = null;
let lastScheduledDeadlineAt = 0;
let lastImmediateNotifAt = 0;

export function setNativeAutoEndInjector(fn) {
  injectAutoEnd = typeof fn === 'function' ? fn : null;
}

export function setNativeAutoEndTripStopHandler(fn) {
  stopNativeTripHandler = typeof fn === 'function' ? fn : null;
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
      autoEndCompleted: false,
    };
    lastScheduledDeadlineAt = 0;
    cancelAutoEndNotification();
    return;
  }
  state.active = true;
  state.autoEndCompleted = false;
  state.pendingAutoEnd = false;
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
  if (!state.active || state.autoEndCompleted) return;
  if (
    lastScheduledDeadlineAt &&
    Math.abs(deadlineAt - lastScheduledDeadlineAt) < RESCHEDULE_MIN_MS
  ) {
    return;
  }
  const waitSec = Math.max(1, Math.floor((deadlineAt - Date.now()) / 1000));
  try {
    await cancelAutoEndNotification();
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIF_ID,
      content: {
        title: 'MilePilot — shift ended',
        body: 'Your trip finished after 90 minutes stopped. Your report will be emailed shortly.',
        sound: true,
        data: { type: 'auto_end' },
      },
      trigger: { seconds: waitSec },
    });
    lastScheduledDeadlineAt = deadlineAt;
  } catch (e) {
    console.warn('[MilePilot NativeAutoEnd] notification schedule failed', e.message);
  }
}

function completeNativeAutoEnd(reason) {
  if (state.autoEndCompleted) return false;
  state.autoEndCompleted = true;
  state.active = false;
  state.pendingAutoEnd = true;
  lastScheduledDeadlineAt = 0;
  cancelAutoEndNotification();

  if (typeof stopNativeTripHandler === 'function') {
    try {
      stopNativeTripHandler();
    } catch (e) {
      console.warn('[MilePilot NativeAutoEnd] stopNativeTrip failed', e.message);
    }
  }

  const now = Date.now();
  if (now - lastImmediateNotifAt > 60000) {
    lastImmediateNotifAt = now;
    Notifications.scheduleNotificationAsync({
      identifier: NOTIF_ID + '-done',
      content: {
        title: 'MilePilot — shift ended',
        body: 'Your trip finished. Open MilePilot to review your mileage report.',
        sound: true,
        data: { type: 'auto_end_done' },
      },
      trigger: null,
    }).catch(() => {});
  }

  console.log('[MilePilot NativeAutoEnd] triggering auto-end', { reason, shiftId: state.shiftId });
  if (typeof injectAutoEnd === 'function') {
    injectAutoEnd(reason || 'native_idle');
  }
  return true;
}

function triggerAutoEnd(reason) {
  if (!state.active || state.pendingAutoEnd || state.autoEndCompleted) return false;
  return completeNativeAutoEnd(reason || 'native_idle');
}

export function flushPendingNativeAutoEnd() {
  if (state.autoEndCompleted) return false;
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
  if (!state.active || state.autoEndCompleted || !payload?.coords) return;
  const now = Date.now();
  const lat = payload.coords.latitude;
  const lon = payload.coords.longitude;
  const acc = payload.coords.accuracy;
  const speed = payload.coords.speed;

  if (state.lastLat != null && state.lastLon != null) {
    const d = distanceMeters({ lat: state.lastLat, lon: state.lastLon }, { lat, lon });
    const accOk = acc == null || acc <= MAX_ACC_M;
    const speedVal = speed != null && speed >= 0 ? speed : null;
    const speedOk = speedVal != null ? speedVal >= MIN_SPEED_MPS : true;
    const softSpeedOk = speedVal != null ? speedVal >= SOFT_SPEED_MPS : true;
    const hardMove = d >= MOVEMENT_METERS && accOk && speedOk;
    const softMove = d >= SOFT_MOVEMENT_METERS && accOk && softSpeedOk;
    if (hardMove || softMove) {
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
