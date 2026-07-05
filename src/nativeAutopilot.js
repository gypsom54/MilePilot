/**
 * Native AutoPilot — background driving detection when WebView is suspended.
 * Starts native trips without the app open (Always location required).
 */
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { startBackgroundLocationUpdates } from './locationTask';
import * as Location from 'expo-location';
import { startNativeTrip, isNativeTripActive, getTripSyncPayload, distanceMeters } from './nativeTrackingEngine';
import { syncNativeAutoEnd } from './nativeAutoEnd';

const STATE_PATH = `${FileSystem.documentDirectory}milepilot_native_autopilot.json`;

const THRESH = {
  DRIVING_SPEED_MPS: 4.47,
  SUSTAINED_MS: 10000,
  MAX_ACC_M: 80,
  MIN_SAMPLES: 2,
  SPEED_GATE_DT: 2,
};

let armed = false;
let candidateStartedAt = 0;
let candidateSamples = 0;
let lastSample = null;
let lastNotifyAt = 0;
let hydratePromise = null;

async function persistState() {
  try {
    if (!FileSystem.documentDirectory) return;
    await FileSystem.writeAsStringAsync(
      STATE_PATH,
      JSON.stringify({
        armed,
        candidateStartedAt,
        candidateSamples,
        lastSample,
        savedAt: Date.now(),
      })
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
    candidateStartedAt = Number(parsed.candidateStartedAt) || 0;
    candidateSamples = Number(parsed.candidateSamples) || 0;
    lastSample = parsed.lastSample || null;
    return armed;
  } catch (e) {
    return false;
  }
}

/** Call before background GPS batches — iOS may cold-start the task without in-memory state. */
export async function hydrateNativeAutopilot() {
  if (!hydratePromise) {
    hydratePromise = loadNativeAutopilotState().finally(() => {
      hydratePromise = null;
    });
  }
  return hydratePromise;
}

export function isNativeAutopilotArmed() {
  return armed;
}

export async function setNativeAutopilotArmed(active) {
  armed = !!active;
  if (!armed) {
    candidateStartedAt = 0;
    candidateSamples = 0;
    lastSample = null;
  }
  await persistState();
}

export async function ensureAutopilotBackgroundLocation() {
  await hydrateNativeAutopilot();
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

function sampleFromPayload(payload) {
  const speed = payload.coords.speed;
  return {
    lat: payload.coords.latitude,
    lon: payload.coords.longitude,
    acc: payload.coords.accuracy,
    t: payload.timestamp || Date.now(),
    speedMps: speed != null && speed >= 0 ? speed : null,
  };
}

function effectiveSpeedMps(sample, prev) {
  if (sample.speedMps != null && sample.speedMps >= THRESH.DRIVING_SPEED_MPS) {
    return sample.speedMps;
  }
  if (!prev || prev.lat == null || sample.lat == null) return 0;
  const d = distanceMeters(prev, sample);
  const dt = Math.max(0.001, (sample.t - prev.t) / 1000);
  const gateDt = Math.max(dt, THRESH.SPEED_GATE_DT);
  return d / gateDt;
}

function isDrivingSpeed(speedMps) {
  return speedMps >= THRESH.DRIVING_SPEED_MPS;
}

/**
 * Returns trip sync payload if a native trip was auto-started.
 */
export function onAutopilotBackgroundLocation(payload) {
  if (!armed || isNativeTripActive() || !payload?.coords) return null;

  const sample = sampleFromPayload(payload);
  const acc = sample.acc;

  if (acc != null && acc > THRESH.MAX_ACC_M) {
    lastSample = sample;
    persistState().catch(() => {});
    return null;
  }

  const prev = lastSample;
  const speedMps = effectiveSpeedMps(sample, prev);
  lastSample = sample;

  if (!prev && sample.speedMps == null) {
    persistState().catch(() => {});
    return null;
  }

  if (!isDrivingSpeed(speedMps)) {
    resetCandidate();
    persistState().catch(() => {});
    return null;
  }

  const now = sample.t;

  if (!candidateStartedAt) {
    candidateStartedAt = now;
    candidateSamples = 1;
    persistState().catch(() => {});
    return null;
  }

  candidateSamples += 1;
  const sustained = now - candidateStartedAt;

  if (sustained < THRESH.SUSTAINED_MS || candidateSamples < THRESH.MIN_SAMPLES) {
    persistState().catch(() => {});
    return null;
  }

  const startedAt = candidateStartedAt;
  resetCandidate();
  const shiftId = `shift_${now}`;

  console.log('[MilePilot NativeAutopilot] auto-start trip', shiftId, 'speedMps', speedMps.toFixed(1));

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

  persistState().catch(() => {});
  notifyTripStarted().catch(() => {});

  return sync || getTripSyncPayload();
}
