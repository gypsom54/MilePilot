import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

export function createMemoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed).map(([k, v]) => [k, String(v)]));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

export function loadFixtureTrips() {
  const src = fs.readFileSync(path.join(root, "tests", "fixtures", "amos-week-trips.json"), "utf8");
  return JSON.parse(src);
}

export function createJourneyDependencies(trips = loadFixtureTrips()) {
  const localStorage = createMemoryStorage({
    mp_trips: JSON.stringify(trips),
  });

  return {
    localStorage,
    getEmail: () => "driver@example.com",
    getDriver: () => "Driver",
    getFrequency: () => "weekly",
    getVehicle: () => "car",
    getTrips: () => trips,
    getShifts: () => [],
    fmt: (seconds) => `${seconds}s`,
    apiPost: async () => ({ res: { ok: true }, data: { sent: true } }),
    getHmrcRate: () => 0.55,
  };
}
