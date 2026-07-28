import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateUrlAgainstScope } from "../../../services/crawl/dist/index.js";

const scope = {
  allowedHosts: ["example.com"],
  allowedProtocols: ["https"],
  includePathPrefixes: ["/blog"],
  excludePathPrefixes: ["/blog/private"],
  environment: "production",
};

describe("Crawl Intelligence scope validation", () => {
  it("accepts in-scope URLs", () => {
    const result = validateUrlAgainstScope(
      "https://example.com/blog/post-1",
      scope,
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.normalisedUrl, "https://example.com/blog/post-1");
    }
  });

  it("rejects out-of-scope hosts", () => {
    const result = validateUrlAgainstScope("https://other.com/blog", scope);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, "OUT_OF_SCOPE_URL");
  });

  it("rejects unsupported protocols", () => {
    const result = validateUrlAgainstScope("http://example.com/blog", scope);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, "UNSUPPORTED_PROTOCOL");
  });

  it("rejects excluded path prefixes", () => {
    const result = validateUrlAgainstScope(
      "https://example.com/blog/private/x",
      scope,
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error.code, "OUT_OF_SCOPE_URL");
  });
});
