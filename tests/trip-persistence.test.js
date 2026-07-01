/**
 * VITAL — Trip persistence regression tests (mp_trips / mp_active_trip)
 */
import assert from "node:assert/strict";

const STORAGE = { TRIPS: "mp_trips", ACTIVE: "mp_active_trip" };

function createMockStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, v);
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}

function normaliseTrip(raw) {
  return {
    id: raw.id || "trip_test",
    status: raw.status || "pending",
    miles: Number(raw.miles) || 0,
    seconds: Number(raw.seconds) || 0,
    startISO: raw.startISO || new Date().toISOString(),
    endISO: raw.endISO || raw.startISO || new Date().toISOString(),
    route: raw.route || [],
  };
}

function saveTrips(ls, trips) {
  ls.setItem(STORAGE.TRIPS, JSON.stringify(trips));
}

function loadTrips(ls) {
  return JSON.parse(ls.getItem(STORAGE.TRIPS) || "[]").map(normaliseTrip);
}

function saveActiveTrip(ls, trip) {
  if (!trip) ls.removeItem(STORAGE.ACTIVE);
  else ls.setItem(STORAGE.ACTIVE, JSON.stringify(trip));
}

function loadActiveTrip(ls) {
  const raw = ls.getItem(STORAGE.ACTIVE);
  return raw ? JSON.parse(raw) : null;
}

let passed = 0;
let failed = 0;

function run(name, fn) {
  try {
    fn();
    console.log("✓ " + name);
    passed++;
  } catch (e) {
    console.error("✗ " + name);
    console.error("  " + e.message);
    failed++;
  }
}

run("completed trips persist in mp_trips", () => {
  const ls = createMockStorage();
  const trip = normaliseTrip({
    id: "trip_1",
    status: "business",
    miles: 12.4,
    seconds: 3600,
    startISO: "2026-06-30T08:00:00.000Z",
    endISO: "2026-06-30T09:00:00.000Z",
    route: [{ lat: 51.5, lon: -0.12 }],
  });
  saveTrips(ls, [trip]);
  const loaded = loadTrips(ls);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].id, "trip_1");
  assert.equal(loaded[0].miles, 12.4);
  assert.equal(loaded[0].status, "business");
});

run("active trip persists in mp_active_trip and clears on end", () => {
  const ls = createMockStorage();
  const active = { id: "active_1", miles: 3.2, routePoints: [{ lat: 51.5, lon: -0.12 }] };
  saveActiveTrip(ls, active);
  const restored = loadActiveTrip(ls);
  assert.equal(restored.id, "active_1");
  assert.equal(restored.miles, 3.2);
  saveActiveTrip(ls, null);
  assert.equal(loadActiveTrip(ls), null);
});

run("multiple trips survive reload", () => {
  const ls = createMockStorage();
  const trips = [
    normaliseTrip({ id: "a", miles: 1, status: "business" }),
    normaliseTrip({ id: "b", miles: 2, status: "personal" }),
    normaliseTrip({ id: "c", miles: 3, status: "pending" }),
  ];
  saveTrips(ls, trips);
  const loaded = loadTrips(ls);
  assert.equal(loaded.length, 3);
  assert.deepEqual(
    loaded.map((t) => t.id),
    ["a", "b", "c"]
  );
});

console.log(`\nTrip persistence: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
