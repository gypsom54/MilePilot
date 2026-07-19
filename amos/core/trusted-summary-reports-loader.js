import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

function createMemoryStorage(seed = {}) {
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

export function loadTrustedSummaryReportsModule(dependencies) {
  const srcPath = path.join(root, "frontend/js/summary-reports.js");
  const src = fs.readFileSync(srcPath, "utf8");

  const sandbox = {
    console,
    Date,
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout,
    localStorage: dependencies.localStorage || createMemoryStorage(),
    window: {},
    globalThis: {},
  };
  sandbox.window = sandbox.globalThis;

  vm.runInNewContext(src, sandbox);
  const summaryReports = sandbox.window.MPSummaryReports;

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
