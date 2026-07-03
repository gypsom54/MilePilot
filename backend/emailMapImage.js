/**
 * Converts route-map SVG to a Gmail-safe inline PNG <img> tag.
 * Gmail strips inline <svg>; embedded PNG data URIs render reliably.
 */
import { Resvg } from "@resvg/resvg-js";

export function svgToEmailImgTag(svgString, alt = "Business route map") {
  if (!svgString) return "";
  const safeAlt = String(alt).replace(/"/g, "&quot;");
  try {
    const resvg = new Resvg(svgString, {
      fitTo: { mode: "width", value: 440 },
    });
    const pngBuffer = resvg.render().asPng();
    const base64 = pngBuffer.toString("base64");
    return `<img src="data:image/png;base64,${base64}" alt="${safeAlt}" width="440" height="272" style="display:block;width:100%;max-width:440px;height:auto;border:0;" />`;
  } catch (err) {
    console.error("emailMapImage: SVG to PNG failed", err.message);
    return "";
  }
}
