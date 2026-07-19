import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

export function createMemoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed).map(([key, value]) => [key, String(value)]));
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

function createWindowSandbox({ localStorage, preload = {} } = {}) {
  const windowObject = {
    localStorage: localStorage || createMemoryStorage(),
    ...preload,
  };

  return {
    console,
    Date,
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout,
    localStorage: windowObject.localStorage,
    window: windowObject,
    globalThis: windowObject,
  };
}

function loadWindowModule(relativePath, globalKey, { localStorage, preload } = {}) {
  const sourcePath = path.join(root, relativePath);
  const source = fs.readFileSync(sourcePath, "utf8");
  const sandbox = createWindowSandbox({ localStorage, preload });

  vm.runInNewContext(source, sandbox);

  return sandbox.window?.[globalKey] || null;
}

export function loadTrustedSummaryReportsModule(dependencies = {}) {
  const summaryReports = loadWindowModule("frontend/js/summary-reports.js", "MPSummaryReports", {
    localStorage: dependencies.localStorage,
  });

  if (!summaryReports || typeof summaryReports.init !== "function") {
    throw new Error("Trusted summary reports module failed to load");
  }

  summaryReports.init({
    getEmail: dependencies.getEmail || (() => ""),
    getDriver: dependencies.getDriver || (() => ""),
    getFrequency: dependencies.getFrequency || (() => "weekly"),
    getTrips: dependencies.getTrips || (() => []),
    getShifts: dependencies.getShifts || (() => []),
    fmt: dependencies.fmt || ((seconds) => String(seconds)),
    apiPost: dependencies.apiPost || (async () => ({ res: { ok: false }, data: {} })),
    getHmrcRate: dependencies.getHmrcRate || (() => 0.55),
  });

  return summaryReports;
}

export function loadTrustedTripStoreModule(dependencies = {}) {
  const tripStore = loadWindowModule("frontend/js/trip-store.js", "MPTrips", {
    localStorage: dependencies.localStorage,
  });

  if (!tripStore || typeof tripStore.loadTrips !== "function") {
    throw new Error("Trusted trip store module failed to load");
  }

  return tripStore;
}

export function loadTrustedJourneyReviewModule(dependencies = {}) {
  const tripStore = dependencies.tripStore || loadTrustedTripStoreModule(dependencies);
  const journeyReview = loadWindowModule("frontend/js/journey-review.js", "MPJourneyReview", {
    localStorage: dependencies.localStorage,
    preload: { MPTrips: tripStore },
  });

  if (!journeyReview || typeof journeyReview.tripsForReviewDate !== "function") {
    throw new Error("Trusted journey review module failed to load");
  }

  return journeyReview;
}
