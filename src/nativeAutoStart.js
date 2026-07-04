/**
 * MP-048 — Native headless AutoPilot auto-start (iOS background).
 * Starts trips without opening the WebView when driving is confirmed.
 */
import * as Notifications from 'expo-notifications';
import {
  canNativeAutoStart,
  getTripStatusForNativeAutoStart,
  loadNativeAutopilotPrefs,
} from './nativeAutopilotPrefs';
import {
  createDriveDetectorState,
  ingestDriveSample,
} from './nativeDriveDetector';
import { syncNativeAutoEnd } from './nativeAutoEnd';
import {
  startNativeTrip,
  isNativeTripActive,
  getTripSyncPayload,
} from './nativeTrackingEngine';

const IDLE_MS = 90 * 60 * 1000;

let armed = false;
let detector = createDriveDetectorState();
let starting = false;
let notifyTripStarted = null;

export function setNativeAutoStartNotifier(fn) {
  notifyTripStarted = typeof fn === 'function' ? fn : null;
}

export function isNativeAutoStartArmed() {
  return armed;
}

export function armNativeAutoStart() {
  armed = true;
  detector = createDriveDetectorState();
  starting = false;
  console.log('[MilePilot NativeAutoStart] armed');
}

export function disarmNativeAutoStart() {
  armed = false;
  detector = createDriveDetectorState();
  starting = false;
  console.log('[MilePilot NativeAutoStart] disarmed');
}

export function getNativeAutoStartDebug() {
  return {
    armed,
    starting,
    candidateConfidence: detector.candidateConfidence,
    candidateSustainedSec: detector.candidateStartedAt
      ? Math.round((Date.now() - detector.candidateStartedAt) / 1000)
      : 0,
    tripActive: isNativeTripActive(),
  };
}

function payloadToSample(payload) {
  if (!payload?.coords) return null;
  const speed =
    payload.coords.speed != null && payload.coords.speed >= 0
      ? payload.coords.speed
      : null;
  return {
    lat: payload.coords.latitude,
    lon: payload.coords.longitude,
    acc: payload.coords.accuracy,
    t: payload.timestamp || Date.now(),
    speedMps: speed,
  };
}

async function notifyAutoStart(tripStatus) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'AutoPilot',
        body:
          tripStatus === 'business'
            ? 'AutoPilot started tracking your business journey.'
            : 'AutoPilot started tracking — review this journey when you finish.',
        sound: true,
        data: { type: 'autopilot_auto_start' },
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('[MilePilot NativeAutoStart] notification failed', e.message);
  }
}

async function executeNativeAutoStart({ confidence }) {
  if (starting || isNativeTripActive()) return null;
  starting = true;
  try {
    await loadNativeAutopilotPrefs();
    if (!canNativeAutoStart()) {
      console.log('[MilePilot NativeAutoStart] blocked by prefs');
      return null;
    }

    const tripStatus = getTripStatusForNativeAutoStart();
    const startedAt = Date.now();
    const shiftId = `shift_${startedAt}`;

    const sync = startNativeTrip({
      shiftId,
      startedAt,
      autoStarted: true,
      tripStatus,
      autopilotDetected: true,
    });

    syncNativeAutoEnd({
      active: true,
      shiftId,
      lastMovementAt: startedAt,
      inactivityMs: IDLE_MS,
      autoEndDeadlineAt: startedAt + IDLE_MS,
    });

    await notifyAutoStart(tripStatus);

    const startedPayload = {
      type: 'expo:autopilot:started',
      sync,
      confidence,
      tripStatus,
      autoStarted: true,
      timestamp: Date.now(),
    };

    console.log('[MilePilot NativeAutoStart] trip started', {
      shiftId,
      tripStatus,
      confidence,
    });

    if (typeof notifyTripStarted === 'function') {
      notifyTripStarted(startedPayload);
    }

    disarmNativeAutoStart();
    return startedPayload;
  } finally {
    starting = false;
  }
}

/**
 * Feed background/foreground GPS while armed and no trip is active.
 */
export async function onIdleLocationForAutoStart(payload) {
  if (!armed || isNativeTripActive() || starting) return null;

  await loadNativeAutopilotPrefs();
  if (!canNativeAutoStart()) return null;

  const sample = payloadToSample(payload);
  if (!sample) return null;

  const result = ingestDriveSample(detector, sample);
  detector = result.state;

  if (result.confirmed) {
    return executeNativeAutoStart({
      confidence: result.confidence,
      sustainedMs: result.sustainedMs,
    });
  }

  return null;
}

export function peekNativeTripForResume() {
  const sync = getTripSyncPayload();
  if (!sync?.active) return null;
  return sync;
}
