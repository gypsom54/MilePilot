import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normaliseUrl } from "../../../services/crawl/dist/index.js";

describe("Crawl Intelligence URL normalisation", () => {
  it("normalises host case, trailing slash and default ports", () => {
    assert.equal(
      normaliseUrl("HTTPS://WWW.Example.com:443/About/"),
      "https://www.example.com/About",
    );
  });

  it("rejects unsupported protocols", () => {
    assert.throws(() => normaliseUrl("ftp://example.com/file"), /Unsupported/);
  });
});
