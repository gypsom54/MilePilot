/**
 * VITAL — BUSINESS CRITICAL (MP-043)
 * Expo background location task — records GPS when phone is locked.
 * Do not modify without reading docs/TRACKING_CONTRACT.md
 * Do NOT claim background tracking works until confirmed on device.
 */
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const BACKGROUND_LOCATION_TASK = 'MILEPILOT_BACKGROUND_LOCATION';

/** Set from MilePilotWebView to forward coords into the WebView JS layer */
let forwardLocationToWebView = null;
const pendingBackgroundLocations = [];

export function takePendingBackgroundLocations() {
  if (!pendingBackgroundLocations.length) return [];
  return pendingBackgroundLocations.splice(0, pendingBackgroundLocations.length);
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

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('[MilePilot BG GPS]', error.message || error);
    return;
  }
  const locations = data?.locations;
  if (!locations || !locations.length) return;

  const latest = locations[locations.length - 1];
  const payload = locationToPayload(latest);
  if (!payload) return;

  pendingBackgroundLocations.push(payload);
  if (pendingBackgroundLocations.length > 500) {
    pendingBackgroundLocations.splice(0, pendingBackgroundLocations.length - 500);
  }

  // BACKGROUND GPS TEST POINT — log to Metro / Xcode console during device tests
  console.log('[MilePilot BG GPS] location', payload.coords.latitude, payload.coords.longitude);

  if (typeof forwardLocationToWebView === 'function') {
    forwardLocationToWebView(payload);
  }
});

/**
 * BACKGROUND GPS TEST POINT
 * Start native background location updates during an active shift.
 * Requires "Always" location permission on iOS.
 */
export async function startBackgroundLocationUpdates() {
  const hasTask = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (!hasTask) {
    console.warn('[MilePilot BG GPS] task not registered');
  }

  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (started) return true;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.BestForNavigation,
    distanceInterval: 10,
    timeInterval: 5000,
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
