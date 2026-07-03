/**
 * Native tracking engine logic tests (MP-043 lockdown)
 * Mirrors src/nativeTrackingEngine.js distance + odometer behaviour.
 */
const ENGINE = { MIN_MOVE_M: 6, MAX_JUMP_M: 400, MAX_SPEED_MPS: 67, STOP_SPEED_MPS: 0.9, NATIVE_SPEED_GATE_DT: 2 };

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

function movementSpeedMps(d, p, prev, deviceSpeedMps) {
  const dt = Math.max(0.001, (p.t - prev.t) / 1000);
  const gateDt = Math.max(dt, ENGINE.NATIVE_SPEED_GATE_DT);
  const calcSpeed = d / gateDt;
  if (deviceSpeedMps != null && deviceSpeedMps >= 0.5) return deviceSpeedMps;
  if (p.speedMps != null && p.speedMps >= 0.5) return p.speedMps;
  return calcSpeed;
}

function processNativePoint(trip, p, deviceSpeedMps) {
  trip.routePoints.push(p);
  const prev = trip.lastPoint;
  if (prev) {
    const d = distanceMeters(prev, p);
    const speed = movementSpeedMps(d, p, prev, deviceSpeedMps);
    if (d > 0 && d < ENGINE.MAX_JUMP_M && speed < ENGINE.MAX_SPEED_MPS) {
      trip.pendingMeters += d;
      if (trip.pendingMeters >= ENGINE.MIN_MOVE_M) {
        trip.miles += trip.pendingMeters / 1609.344;
        trip.pendingMeters = 0;
      }
    }
  }
  trip.lastPoint = p;
  return trip;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function testDistanceMeters() {
  const d = distanceMeters({ lat: 51.5, lon: -0.1 }, { lat: 51.501, lon: -0.1 });
  assert(d > 100 && d < 120, `expected ~111m, got ${d}`);
  console.log('✓ distanceMeters haversine');
}

function testBackgroundMileageSimulation() {
  let trip = { miles: 0, pendingMeters: 0, routePoints: [], lastPoint: null };
  let t = Date.now();
  let lat = 51.5;
  for (let i = 0; i < 20; i++) {
    lat += 0.0009;
    t += 5000;
    trip = processNativePoint(trip, { lat, lon: -0.12, t, speedMps: 5, nativeGps: true }, 5);
  }
  assert(trip.miles >= 0.5, `expected >= 0.5 mi from background points, got ${trip.miles}`);
  console.log('✓ background GPS point simulation accumulates miles');
}

let failed = 0;
for (const fn of [testDistanceMeters, testBackgroundMileageSimulation]) {
  try {
    fn();
  } catch (e) {
    failed++;
    console.error('✗', e.message);
  }
}
if (failed) {
  console.error(`\nNative tracking engine: ${failed} failed`);
  process.exit(1);
}
console.log('\nNative tracking engine: all passed');
