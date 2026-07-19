import assert from "node:assert/strict";
import { DeterministicIntentRouter } from "../intent-router/deterministic-intent-router.js";

export function runIntentRouterTests() {
  const router = new DeterministicIntentRouter();
  const prompts = [
    "How many miles have I driven this week?",
    "What is my mileage this week?",
    "Show my business miles for this week.",
    "How much can I claim for mileage this week?",
  ];

  for (const prompt of prompts) {
    const routed = router.route(prompt);
    assert.equal(routed.intentId, "journey.mileage_summary", "recognises supported mileage phrase");
    assert.equal(routed.parameters.dateRange, "current_week", "extracts current_week");
    assert.equal(routed.requiresClarification, false, "does not require clarification for known prompt");
  }

  const unsupported = router.route("Book me a hotel near Manchester");
  assert.equal(unsupported.intentId, "unsupported", "returns unsupported for unrelated requests");

  const lowConfidenceLike = router.route("Maybe something about last month maybe");
  assert.equal(lowConfidenceLike.intentId, "unsupported", "does not guess at low confidence");
}
