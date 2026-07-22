#!/usr/bin/env node
/**
 * Production boot smoke — serves frontend/index.html and verifies bootApp runs.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const frontendRoot = path.join(root, "frontend");
const PORT = 8791;

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
      let filePath = path.join(frontendRoot, urlPath.replace(/^\//, ""));
      if (!filePath.startsWith(frontendRoot)) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end();
          return;
        }
        const ext = path.extname(filePath);
        const types = {
          ".html": "text/html",
          ".js": "application/javascript",
          ".json": "application/json",
          ".css": "text/css",
          ".svg": "image/svg+xml",
        };
        res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

function fail(msg) {
  console.error("✗ PRODUCTION BOOT SMOKE FAILED:", msg);
  process.exit(1);
}

function pass(msg) {
  console.log("✓", msg);
}

async function main() {
  const server = await startServer();
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto(`http://127.0.0.1:${PORT}/index.html`, {
      waitUntil: "load",
      timeout: 30000,
    });

    const boot = await page.evaluate(() => ({
      bootAppType: typeof bootApp,
      showScreenType: typeof showScreen,
      handlePosType: typeof handlePos,
      feedAutopilotGpsType: typeof feedAutopilotGps,
      mpAutoPilotLoaded: typeof MPAutoPilotMotion !== "undefined",
      activeScreen: document.querySelector(".screen.active")?.id || null,
      syntaxOk: !document.querySelector("body")?.dataset?.bootSyntaxError,
    }));

    if (boot.bootAppType !== "function") fail("bootApp is not a function after load");
    pass("bootApp exists and page loaded");

    if (boot.showScreenType !== "function") fail("showScreen is not available");
    pass("showScreen available (screens can initialise)");

    if (boot.handlePosType !== "function") fail("handlePos GPS handler missing");
    pass("handlePos GPS handler registered");

    if (boot.feedAutopilotGpsType !== "function") fail("feedAutopilotGps missing");
    pass("feedAutopilotGps available");

    if (!boot.mpAutoPilotLoaded) fail("MPAutoPilotMotion did not load");
    pass("AutoPilot module loaded");

    const fatal = consoleErrors.filter(
      (e) => /SyntaxError|Unexpected token/i.test(e) && !/favicon/i.test(e)
    );
    if (fatal.length) fail(`console syntax errors: ${fatal.join(" | ")}`);
    pass("no JavaScript syntax errors on boot");

    await page.evaluate(() => {
      localStorage.setItem("mp_onboard_complete", "true");
      localStorage.setItem("mp_driver", "Boot Smoke");
      localStorage.setItem("mp_vehicle", "car");
      if (typeof showScreen === "function") showScreen("home");
    });
    await page.waitForFunction(
      () => document.querySelector("#home.active") !== null,
      { timeout: 15000 }
    );
    pass("home screen initialised after showScreen");

    console.log("\nProduction boot smoke OK");
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((e) => fail(e.message || String(e)));
