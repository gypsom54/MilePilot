/**
 * MP-HF-001 — Production inline application script must parse (boot syntax gate).
 * Parses the primary inline <script> with acorn; fails on JavaScript syntax errors.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const TARGETS = [
  { rel: "frontend/index.html", label: "frontend PWA" },
  { rel: "milepilot-upload-v2/index.html", label: "deployment mirror" },
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

/** Extract the main inline application script (starts with const APP_VERSION). */
export function extractPrimaryInlineScript(html) {
  const open = "<script>\nconst APP_VERSION=";
  const start = html.indexOf(open);
  assert.notEqual(start, -1, "primary inline application script not found");
  const scriptOpen = start + "<script>".length;
  const close = html.indexOf("</script>", scriptOpen);
  assert.notEqual(close, -1, "inline script closing tag not found");
  return html.slice(scriptOpen + 1, close);
}

export function parseInlineApplicationScript(html, sourceFile = "index.html") {
  const source = extractPrimaryInlineScript(html);
  return acorn.parse(source, {
    ecmaVersion: "latest",
    sourceType: "script",
    locations: true,
    sourceFile,
  });
}

function test(name, fn) {
  try {
    fn();
    console.log("✓ " + name);
    return true;
  } catch (e) {
    console.error("✗ " + name);
    console.error("  " + (e.message || e));
    return false;
  }
}

let passed = 0;
let failed = 0;

function run(name, fn) {
  if (test(name, fn)) passed++;
  else failed++;
}

for (const { rel, label } of TARGETS) {
  run(`${label}: inline application script parses without syntax errors`, () => {
    const html = read(rel);
    const ast = parseInlineApplicationScript(html, rel);
    assert.ok(ast.type === "Program", "expected Program AST root");
    assert.ok(ast.body.length > 0, "inline script AST must not be empty");
  });

  run(`${label}: bootApp is defined in inline script`, () => {
    const source = extractPrimaryInlineScript(read(rel));
    assert.match(source, /function bootApp\s*\(/, "bootApp must exist in inline script");
    assert.match(source, /window\.addEventListener\(\s*['"]load['"]\s*,\s*bootApp\s*\)/, "bootApp must register on load");
  });

  run(`${label}: handlePos GPS handler is defined`, () => {
    const source = extractPrimaryInlineScript(read(rel));
    assert.match(source, /function handlePos\s*\(/, "handlePos must exist");
    assert.match(source, /feedAutopilotGps\(pos\);lastGpsAccuracy=p\.acc/, "handlePos autopilot branch must be valid JS");
  });
}

console.log(`\nProduction boot syntax: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
