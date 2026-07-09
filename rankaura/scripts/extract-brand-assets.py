#!/usr/bin/env python3
"""
Extract RankAura logo assets from the approved brand sheet image.

Usage:
  python3 scripts/extract-brand-assets.py [path-to-brand-sheet]

Default input: public/brand/rankaura-brand-sheet.png
Also accepts .jpg / .jpeg / .webp in the same folder.

Outputs (exact crops from source — no SVG recreation):
  public/brand/rankaura-mark.png
  public/brand/rankaura-lockup.png
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "public" / "brand"
CONFIG_PATH = BRAND_DIR / "extract-regions.json"

DEFAULT_REGIONS = {
    "mark": {"left": 0.38, "top": 0.06, "width": 0.24, "height": 0.18},
    "lockup": {"left": 0.28, "top": 0.04, "width": 0.44, "height": 0.32},
}


def find_source(explicit: str | None) -> Path:
    if explicit:
        path = Path(explicit)
        if not path.exists():
            raise FileNotFoundError(f"Brand sheet not found: {path}")
        return path

    for name in (
        "rankaura-brand-sheet.png",
        "rankaura-brand-sheet.jpg",
        "rankaura-brand-sheet.jpeg",
        "rankaura-brand-sheet.webp",
    ):
        candidate = BRAND_DIR / name
        if candidate.exists():
            return candidate

    raise FileNotFoundError(
        "Brand sheet missing. Add your premium design file to:\n"
        "  rankaura/public/brand/rankaura-brand-sheet.png\n"
        "Then run: python3 scripts/extract-brand-assets.py"
    )


def load_regions() -> dict:
    if CONFIG_PATH.exists():
        return json.loads(CONFIG_PATH.read_text())
    return DEFAULT_REGIONS


def crop_relative(img: Image.Image, region: dict) -> Image.Image:
    w, h = img.size
    left = int(region["left"] * w)
    top = int(region["top"] * h)
    right = left + int(region["width"] * w)
    bottom = top + int(region["height"] * h)
    return img.crop((left, top, right, bottom))


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")
    image.save(path, format="PNG", optimize=True)


def main() -> int:
    source_arg = sys.argv[1] if len(sys.argv) > 1 else None
    source = find_source(source_arg)
    regions = load_regions()

    print(f"Source: {source}")
    with Image.open(source) as img:
        rgb = img.convert("RGBA")
        mark = crop_relative(rgb, regions["mark"])
        lockup = crop_relative(rgb, regions["lockup"])

    mark_path = BRAND_DIR / "rankaura-mark.png"
    lockup_path = BRAND_DIR / "rankaura-lockup.png"

    save_png(mark, mark_path)
    save_png(lockup, lockup_path)

    print(f"Wrote {mark_path} ({mark.size[0]}x{mark.size[1]})")
    print(f"Wrote {lockup_path} ({lockup.size[0]}x{lockup.size[1]})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
