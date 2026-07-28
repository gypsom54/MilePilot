import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPlatformRuntime,
  handleApiRequest,
} from "../../../apps/api/dist/index.js";

describe("Knowledge Graph API", () => {
  it("attaches evidence, proposes entities, detects duplicates and confirms merges", async () => {
    const runtime = createPlatformRuntime();

    const evidence = await handleApiRequest(runtime, {
      method: "POST",
      path: "/knowledge-graph/evidence",
      body: {
        tenantId: "tenant_api",
        correlationId: "kg-api-1",
        evidence: {
          id: "ev_api",
          kind: "fixture",
          sourceEngine: "business-discovery",
          referenceIds: ["obs_api"],
          summary: "api evidence",
          payload: {},
        },
      },
    });
    assert.equal(evidence.status, 200);

    const left = await handleApiRequest(runtime, {
      method: "POST",
      path: "/knowledge-graph/entities/propose",
      body: {
        tenantId: "tenant_api",
        type: "Business",
        proposingEngine: "business-discovery",
        evidenceIds: ["ev_api"],
        aliases: [{ value: "API Co", kind: "name" }],
        identityFields: ["api co"],
        properties: { name: "API Co" },
        idempotencyKey: "api-left",
      },
    });
    assert.equal(left.status, 200);

    const right = await handleApiRequest(runtime, {
      method: "POST",
      path: "/knowledge-graph/entities/propose",
      body: {
        tenantId: "tenant_api",
        type: "Business",
        proposingEngine: "business-discovery",
        evidenceIds: ["ev_api"],
        aliases: [{ value: "API Company", kind: "name" }],
        identityFields: ["api co"],
        properties: { name: "API Company" },
        idempotencyKey: "api-right",
      },
    });
    assert.equal(right.status, 200);

    const duplicates = await handleApiRequest(runtime, {
      method: "POST",
      path: "/knowledge-graph/duplicates/detect",
      body: { tenantId: "tenant_api" },
    });
    assert.equal(duplicates.status, 200);
    assert.ok(duplicates.body.length >= 1);

    const proposal = await handleApiRequest(runtime, {
      method: "POST",
      path: "/knowledge-graph/merge-proposals",
      body: {
        tenantId: "tenant_api",
        sourceEntityId: left.body.id,
        targetEntityId: right.body.id,
        reason: "same identity key",
        proposedBy: "api-user",
      },
    });
    assert.equal(proposal.status, 200);

    const confirmed = await handleApiRequest(runtime, {
      method: "POST",
      path: `/knowledge-graph/merge-proposals/${proposal.body.id}/confirm`,
      body: { tenantId: "tenant_api", actor: "api-user" },
    });
    assert.equal(confirmed.status, 200);
    assert.equal(confirmed.body.proposal.status, "confirmed");

    const history = await handleApiRequest(runtime, {
      method: "GET",
      path: `/knowledge-graph/entities/${right.body.id}/history`,
      query: { tenantId: "tenant_api" },
    });
    assert.equal(history.status, 200);
    assert.ok(history.body.versionHistory.length >= 1);

    const manifest = await handleApiRequest(runtime, {
      method: "GET",
      path: "/knowledge-graph/manifest",
    });
    assert.equal(manifest.status, 200);
    assert.equal(manifest.body.engine.id, "knowledge-graph");
    assert.ok(runtime.registry.get("knowledge-graph"));
  });
});
