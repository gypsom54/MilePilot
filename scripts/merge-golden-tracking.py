#!/usr/bin/env python3
"""Merge v8.43.67 golden tracking/autopilot from 686d370 into current index.html."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CURRENT = (ROOT / "frontend/index.html").read_text()
GOLDEN = subprocess.check_output(
    ["git", "show", "686d370:frontend/index.html"], cwd=ROOT, text=True
)

def extract_func(src, name):
    pat = rf"function {re.escape(name)}\("
    m = re.search(pat, src)
    if not m:
        raise SystemExit(f"missing function {name}")
    start = m.start()
    i = m.end()
    depth = 1
    while i < len(src) and depth:
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
        i += 1
    return src[start:i]

def replace_func(dst, name, body):
    pat = rf"function {re.escape(name)}\("
    m = re.search(pat, dst)
    if not m:
        raise SystemExit(f"target missing function {name}")
    start = m.start()
    i = m.end()
    depth = 1
    while i < len(dst) and depth:
        if dst[i] == "{":
            depth += 1
        elif dst[i] == "}":
            depth -= 1
        i += 1
    return dst[:start] + body + dst[i:]

def replace_between(dst, start_marker, end_marker, insert, *, after=True):
    a = dst.find(start_marker)
    b = dst.find(end_marker, a)
    if a < 0 or b < 0:
        raise SystemExit(f"markers not found: {start_marker!r}")
    if after:
        return dst[: b + len(end_marker)] + insert + dst[b + len(end_marker) :]
    return dst[:a] + insert + dst[b + len(end_marker) :]

out = GOLDEN

# --- Keep Ask MilePilot + tax engine script tags from current ---
for tag in [
    '<script src="js/mp-tax-engine.js"></script>',
    '<script src="js/ask-milepilot-view.js"></script>',
    '<script src="js/ask-milepilot-service.js"></script>',
    '<script src="js/ask-milepilot-app.js"></script>',
]:
    if tag not in out and tag in CURRENT:
        out = out.replace(
            '<script src="js/app-copy.js"></script>',
            tag + "\n" + '<script src="js/app-copy.js"></script>',
            1,
        )

# Ask screen section
ask_section = """<section id="ask" class="screen mp-ds-root" data-mp="MP-S5-002">
<div id="mpAskShellRoot"></div>
</section>
"""
if '<section id="ask"' not in out:
    out = out.replace('<section id="tracking" class="screen">', ask_section + '<section id="tracking" class="screen">', 1)

# Nav Ask button
nav_ask = """<button type="button" class="nav-item" id="navAsk" onclick="showAsk()" aria-label="Ask MilePilot"><span class="nav-icon-wrap"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a7 7 0 0 1 7 7c0 2.8-1.6 5.2-4 6.3V18l-3 2v-3.7A7 7 0 0 1 12 3z"/></svg><span class="nav-pulse"></span></span><span class="nav-label">Ask</span></button>
"""
if 'id="navAsk"' not in out:
    out = out.replace(
        '<button type="button" class="nav-item" id="navReports"',
        nav_ask + '<button type="button" class="nav-item" id="navReports"',
        1,
    )

# Tax engine helpers from current — replace golden inline fmt/money/claim block
tax_block = extract_func(CURRENT, "fmt")
# current bundles fmt+money+requireTaxEngine+... in one line; grab through shiftEngineHmrc
m = re.search(
    r"function fmt\(s\)\{.*?function shiftEngineHmrc\(s\)\{[^}]+\}[^}]*\}",
    CURRENT,
    re.S,
)
if not m:
    raise SystemExit("tax block not found in current")
tax_block = m.group(0)
out = re.sub(
    r"function fmt\(s\)\{.*?function claim\(mi,v=vehicle\)\{return \(Number\(mi\)\|\|0\)\*\(vehicles\[v\]\?\.rate\|\|\.55\)\}",
    tax_block,
    out,
    count=1,
    flags=re.S,
)

# Ask helpers from current
for fn in ["buildAskDeps", "initAskMilePilot", "showAsk"]:
    if re.search(rf"function {fn}\(", out) is None:
        block = extract_func(CURRENT, fn)
        out = out.replace(
            "function goHome()",
            block + "\nfunction goHome()",
            1,
        )
    else:
        out = replace_func(out, fn, extract_func(CURRENT, fn))

out = replace_func(out, "showScreen", extract_func(CURRENT, "showScreen"))
out = replace_func(out, "setNav", extract_func(CURRENT, "setNav"))
out = replace_func(out, "parseDeepLink", extract_func(CURRENT, "parseDeepLink"))
out = replace_func(out, "getBestEarningDayThisWeek", extract_func(CURRENT, "getBestEarningDayThisWeek"))

# bootApp: golden tracking init order + ask from current
boot_golden = extract_func(GOLDEN, "bootApp")
boot_current = extract_func(CURRENT, "bootApp")
if "initAskMilePilot()" not in boot_golden:
    boot_golden = boot_golden.replace(
        "initSummaryReports();",
        "initSummaryReports();initAskMilePilot();",
        1,
    )
# Keep ask session restore from current boot
if "mp_active_screen" in boot_current and "mp_active_screen" not in boot_golden:
    boot_golden = boot_golden.replace(
        "if(parseDeepLink()){showReports();return}",
        "if(parseDeepLink())return;try{const last=sessionStorage.getItem('mp_active_screen');if(last==='ask'){showAsk();return}}catch(e){}",
        1,
    )
out = replace_func(out, "bootApp", boot_golden)

# handlePos: keep current (includes MP-HF-001 semicolon fix)
out = replace_func(out, "handlePos", extract_func(CURRENT, "handlePos"))

# Version bump
out = re.sub(r"const APP_VERSION='[^']+'", "const APP_VERSION='8.43.68'", out, count=1)

(ROOT / "frontend/index.html").write_text(out)
print("Merged golden tracking into frontend/index.html")
