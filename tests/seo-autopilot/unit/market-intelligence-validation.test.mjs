import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateCreateMarketInput,
  validateGapEvidence,
  validateTrendObservations,
} from "../../../services/market-intelligence/dist/index.js";

describe("Market Intelligence validation", () => {
  it("rejects incomplete market definitions", () => {
    const result = validateCreateMarketInput({ name: "Peptides" });
    assert.equal(result.ok, false);
  });

  it("rejects unsupported gaps", () => {
    const result = validateGapEvidence([]);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "GAP_REQUIRES_EVIDENCE");
    }
  });

  it("rejects trends from a single observation", () => {
    const result = validateTrendObservations([
      {
        observedAt: "2026-01-01T00:00:00.000Z",
        note: "only one",
        sourceId: "src_1",
        confidence: 0.7,
      },
    ]);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "TREND_REQUIRES_MULTIPLE_OBSERVATIONS");
    }
  });

  it("rejects trends with identical timestamps", () => {
    const result = validateTrendObservations([
      {
        observedAt: "2026-01-01T00:00:00.000Z",
        note: "a",
        sourceId: "src_1",
        confidence: 0.7,
      },
      {
        observedAt: "2026-01-01T00:00:00.000Z",
        note: "b",
        sourceId: "src_1",
        confidence: 0.7,
      },
    ]);
    assert.equal(result.ok, false);
  });
});
