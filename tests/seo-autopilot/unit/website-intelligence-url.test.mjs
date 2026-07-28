import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normaliseUrl } from "../../../services/website-intelligence/dist/index.js";

describe("Website Intelligence URL normalisation", () => {
  it("normalises deterministically", () => {
    assert.equal(
      normaliseUrl("HTTPS://Example.COM:443/Services/?b=2&a=1#frag"),
      "https://example.com/Services?a=1&b=2",
    );
    assert.equal(
      normaliseUrl("https://example.com/path/"),
      "https://example.com/path",
    );
    assert.equal(normaliseUrl("https://example.com/"), "https://example.com/");
  });

  it("keeps staging and production hosts distinct", () => {
    const production = normaliseUrl("https://www.example.com/about");
    const staging = normaliseUrl("https://staging.example.com/about");
    assert.notEqual(production, staging);
  });
});
