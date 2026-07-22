/**
 * MP-044 — Node ESM adapter for the unified HMRC tax engine.
 * Loads frontend/js/mp-tax-engine.js as the single source of truth.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../frontend/js/mp-tax-engine.js"), "utf8");
const ctx = { window: {}, globalThis: {} };
ctx.globalThis = ctx;
vm.runInNewContext(src, ctx);

export const MPTaxEngine = ctx.window.MPTaxEngine;
