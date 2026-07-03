/**
 * Gmail / iOS forced-dark-mode helpers for dark-navy MilePilot emails.
 * Keeps light text readable on #031126 backgrounds.
 */
import { EMAIL, c } from "./emailTokens.js";

export function emailDarkModeStyles() {
  return `<style type="text/css">
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body, .body { margin:0 !important; padding:0 !important; width:100% !important; -webkit-text-size-adjust:100%; }
  .mp-outer { background-color:${EMAIL.bgDeep} !important; }
  .mp-text { ${c(EMAIL.textPrimary)} }
  .mp-text-body { ${c(EMAIL.textBody)} }
  .mp-text-muted { ${c(EMAIL.textMuted)} }
  .mp-text-soft { ${c(EMAIL.textSoft)} }
  .mp-text-accent { ${c(EMAIL.textAccent)} }
  .mp-text-white { ${c(EMAIL.textWhite)} }
  u + .body .mp-gmail-screen { background:#000000 !important; mix-blend-mode:screen !important; }
  u + .body .mp-gmail-diff { background:#000000 !important; mix-blend-mode:difference !important; }
  [data-ogsc] .mp-text, [data-ogsb] .mp-text { ${c(EMAIL.textPrimary)} }
  [data-ogsc] .mp-text-body, [data-ogsb] .mp-text-body { ${c(EMAIL.textBody)} }
  [data-ogsc] .mp-text-muted, [data-ogsb] .mp-text-muted { ${c(EMAIL.textMuted)} }
  [data-ogsc] .mp-text-soft, [data-ogsb] .mp-text-soft { ${c(EMAIL.textSoft)} }
  [data-ogsc] .mp-text-accent, [data-ogsb] .mp-text-accent { ${c(EMAIL.textAccent)} }
  [data-ogsc] .mp-text-white, [data-ogsb] .mp-text-white { ${c(EMAIL.textWhite)} }
</style>`;
}

/** Wrap copy blocks so Gmail iOS keeps light text on dark backgrounds. */
export function gmailTextShield(html) {
  return `<div class="mp-gmail-screen" style="background:#000000;mso-hide:all;"><div class="mp-gmail-diff" style="background:#000000;mso-hide:all;">${html}</div></div>`;
}
