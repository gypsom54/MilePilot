import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

describe("KnowledgeGraphSdk package", () => {
  it("exports SDK module surface without implementation", async () => {
    const kg = await import(
      "../../../packages/knowledge-graph/dist/index.js"
    );
    // Package is types + re-exports only; runtime export object may be empty.
    assert.equal(typeof kg, "object");
    // Ensure the package compiled (dist exists / import succeeds).
    assert.ok(require.resolve("../../../packages/knowledge-graph/package.json"));
  });
});
