/**
 * Native AutoPilot — background driving detection when WebView is suspended.
 * Starts native trips without the app open (Always location required).
 */
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { startBackgroundLocationUpdates } from './locationTask';
import * as Location from 'expo-location';
import { startNativeTrip, isNativeTripActive, getTripSyncPayload } from './nativeTrackingEngine';
import { syncNativeAutoEnd } from './nativeAutoEnd';

const STATE_PATH = `${FileSystem.documentDirectory}milepilot_native_autopilot.json`;

const THRESH = {
  DRIVING_SPEED_MPS: 4.47,
  SUSTAINED_MS: 10000,
  MAX_ACC_M: 80,
  MIN_SAMPLES: 2,
};

let armed = false;
let candidateStartedAt = 0;
let candidateSamples = 0;
let lastNotifyAt = 0;

async function persistState() {
  try {
    if (!FileSystem.documentDirectory) return;
    await FileSystem.writeAsStringAsync(
      STATE_PATH,
      JSON.stringify({ armed, savedAt: Date.now() })
    );
  } catch (e) {
    console.warn('[MilePilot NativeAutopilot] persist failed', e.message);
  }
}

export async function loadNativeAutopilotState() {
  try {
    if (!FileSystem.documentDirectory) return false;
    const info = await FileSystem.getInfoAsync(STATE_PATH);
    if (!info.exists) return false;
    const parsed = JSON.parse(await FileSystem.readAsStringAsync(STATE_PATH));
    armed = !!parsed.armed;
    return armed;
  } catch (e) {
    return false;
  }
}

export function isNativeAutopilotArmed() {
  return armed;
}

export async function setNativeAutopilotArmed(active) {
  armed = !!active;
  if (!armed) {
    candidateStartedAt = 0;
    candidateSamples = 0;
  }
  await persistState();
}

export async function ensureAutopilotBackgroundLocation() {
  if (!armed) {
    return { ok: false, reason: 'not_armed', backgroundActive: false };
  }
  const bgPerm = await Location.getBackgroundPermissionsAsync();
  if (bgPerm.status !== 'granted') {
    return { ok: false, reason: 'no_bg_permission', backgroundActive: false };
  }
  try {
    await startBackgroundLocationUpdates();
    return { ok: true, backgroundActive: true };
  } catch (e) {
    console.warn('[MilePilot NativeAutopilot] bg start failed', e.message);
    return { ok: false, error: e.message, backgroundActive: false };
  }
}

async function notifyTripStarted() {
  const now = Date.now();
  if (now - lastNotifyAt < 60000) return;
  lastNotifyAt = now;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MilePilot AutoPilot',
        body: 'Driving detected — your business miles are being recorded.',
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('[MilePilot NativeAutopilot] notification failed', e.message);
  }
}

function resetCandidate() {
  candidateStartedAt = 0;
  candidateSamples = 0;
}

/**
 * Returns trip sync payload if a native trip was auto-started.
 */
export function onAutopilotBackgroundLocation(payload) {
  if (!armed || isNativeTripActive() || !payload?.coords) return null;

  const speed = payload.coords.speed;
  const acc = payload.coords.accuracy;
  const now = payload.timestamp || Date.now();

  if (acc != null && acc > THRESH.MAX_ACC_M) return null;

  const speedOk = speed != null && speed >= THRESH.DRIVING_SPEED_MPS;
  if (!speedOk) {
    resetCandidate();
    return null;
  }

  if (!candidateStartedAt) {
    candidateStartedAt = now;
    candidateSamples = 1;
    return null;
  }

  candidateSamples += 1;
  const sustained = now - candidateStartedAt;

  if (sustained < THRESH.SUSTAINED_MS || candidateSamples < THRESH.MIN_SAMPLES) {
    return null;
  }

  resetCandidate();
  const shiftId = `shift_${now}`;
  const startedAt = candidateStartedAt || now;

  console.log('[MilePilot NativeAutopilot] auto-start trip', shiftId);

  const sync = startNativeTrip({
    shiftId,
    startedAt,
    vehicle: 'car',
    miles: 0,
    pendingMeters: 0,
    routePoints: [],
    lastPoint: null,
    lastGpsAt: now,
  });

  syncNativeAutoEnd({
    active: true,
    shiftId,
    lastMovementAt: now,
    inactivityMs: 90 * 60 * 1000,
    autoEndDeadlineAt: now + 90 * 60 * 1000,
  });

  notifyTripStarted().catch(() => {});

  return sync || getTripSyncPayload();
}
