/**
 * CRITICAL MILEAGE ENGINE FILE — MP-043
 * Expo background location task. GPS points feed nativeTrackingEngine immediately.
 */
import { onNativeBackgroundLocation } from './nativeAutoEnd';
import { hydrateNativeAutopilot, onAutopilotBackgroundLocation } from './nativeAutopilot';
import { ingestNativeLocation } from './nativeTrackingEngine';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const BACKGROUND_LOCATION_TASK = 'MILEPILOT_BACKGROUND_LOCATION';

let forwardLocationToWebView = null;
const pendingSyncPayloads = [];

export function takePendingBackgroundLocations() {
  if (!pendingSyncPayloads.length) return [];
  return pendingSyncPayloads.splice(0, pendingSyncPayloads.length);
}

export function setBackgroundLocationForwarder(fn) {
  forwardLocationToWebView = fn;
}

function locationToPayload(loc) {
  if (!loc || !loc.coords) return null;
  return {
    type: 'expo:location',
    coords: {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
      altitude: loc.coords.altitude,
      altitudeAccuracy: loc.coords.altitudeAccuracy,
      heading: loc.coords.heading,
      speed: loc.coords.speed,
    },
    timestamp: loc.timestamp || Date.now(),
  };
}

function queueSync(sync) {
  if (!sync) return;
  pendingSyncPayloads.push(sync);
  if (pendingSyncPayloads.length > 100) {
    pendingSyncPayloads.splice(0, pendingSyncPayloads.length - 100);
  }
  if (typeof forwardLocationToWebView === 'function') {
    forwardLocationToWebView(sync);
  }
}

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('[MilePilot BG GPS]', error.message || error);
    return;
  }
  const locations = data?.locations;
  if (!locations || !locations.length) return;

  (async () => {
    await hydrateNativeAutopilot();

    for (const loc of locations) {
      const payload = locationToPayload(loc);
      if (!payload) continue;

      console.log(
        '[MilePilot BG GPS] location',
        payload.coords.latitude,
        payload.coords.longitude,
        'acc',
        payload.coords.accuracy,
        'speed',
        payload.coords.speed
      );

      const sync = ingestNativeLocation(payload, { source: 'background' });
      if (sync) {
        queueSync(sync);
      } else {
        const autoTrip = onAutopilotBackgroundLocation(payload);
        if (autoTrip) {
          queueSync(autoTrip);
        } else {
          onNativeBackgroundLocation(payload);
        }
      }
    }
  })().catch((e) => {
    console.error('[MilePilot BG GPS] task handler failed', e.message || e);
  });
});

export async function startBackgroundLocationUpdates() {
  const hasTask = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (!hasTask) {
    console.warn('[MilePilot BG GPS] task not registered');
  }

  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (started) return true;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.BestForNavigation,
    distanceInterval: 5,
    timeInterval: 3000,
    showsBackgroundLocationIndicator: true,
    pausesUpdatesAutomatically: false,
    activityType: Location.ActivityType.AutomotiveNavigation,
    foregroundService: {
      notificationTitle: 'MilePilot AutoPilot',
      notificationBody: 'Recording business mileage',
      notificationColor: '#0D6BFF',
    },
  });

  console.log('[MilePilot BG GPS] background updates started');
  return true;
}

export async function stopBackgroundLocationUpdates() {
  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (!started) return;
  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  console.log('[MilePilot BG GPS] background updates stopped');
}

export { Location };
