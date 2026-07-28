import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeFreshness,
  effectiveConfidence,
  createEvidenceMeta,
} from "../../../services/market-intelligence/dist/index.js";

describe("Market Intelligence evidence expiry", () => {
  it("marks evidence expired after expiresAt", () => {
    const freshness = computeFreshness(
      "2026-07-01T00:00:00.000Z",
      "2026-06-01T00:00:00.000Z",
    );
    assert.equal(freshness, "expired");
  });

  it("reduces confidence contribution for expired evidence", () => {
    const evidence = createEvidenceMeta({
      sourceId: "src",
      observedAt: "2026-01-01T00:00:00.000Z",
      scope: "national",
      provenance: "fixture",
      confidence: 0.8,
      expiresAt: "2026-02-01T00:00:00.000Z",
      now: "2026-07-01T00:00:00.000Z",
    });
    assert.equal(evidence.freshness, "expired");
    assert.ok(effectiveConfidence(evidence) < evidence.confidence);
  });
});
