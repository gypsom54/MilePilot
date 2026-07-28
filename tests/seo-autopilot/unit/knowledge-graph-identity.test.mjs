import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildIdentityKey,
  collectIdentityKeys,
  normaliseAliasValue,
} from "../../../packages/knowledge-graph/dist/index.js";

describe("Knowledge Graph identity", () => {
  it("normalises aliases and builds identity keys", () => {
    assert.equal(normaliseAliasValue("  Acme  Co "), "acme co");
    assert.equal(
      buildIdentityKey("Business", "acme co"),
      "business::acme co",
    );
    const keys = collectIdentityKeys({
      type: "Business",
      identityFields: ["Acme Co"],
      aliases: [
        {
          value: "Acme",
          kind: "short_name",
          normalisedValue: "acme",
          sourceEngine: "business-discovery",
          observedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
    assert.deepEqual(keys, ["business::acme", "business::acme co"]);
  });
});
