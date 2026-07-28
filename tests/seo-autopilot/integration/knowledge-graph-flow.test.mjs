import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PlatformEventName } from "../../../packages/shared/dist/index.js";
import { createKnowledgeGraphRuntime } from "../../../services/knowledge-graph-engine/dist/index.js";

async function seedEvidence(runtime, tenantId, id = "ev_1") {
  const result = await runtime.service.attachEvidence({
    tenantId,
    evidence: {
      id,
      kind: "observation_ref",
      sourceEngine: "business-discovery",
      referenceIds: ["obs_1"],
      summary: "fixture evidence",
      payload: { fixture: true },
    },
  });
  assert.equal(result.ok, true);
  return result.value;
}

describe("Knowledge Graph Engine flow", () => {
  it("requires evidence and preserves provenance on create", async () => {
    const runtime = createKnowledgeGraphRuntime();
    const denied = await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: [],
      properties: { name: "Acme" },
    });
    assert.equal(denied.ok, false);
    if (!denied.ok) assert.equal(denied.error.code, "EVIDENCE_REQUIRED");

    await seedEvidence(runtime, "t1");
    const created = await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      aliases: [{ value: "Acme Co", kind: "legal_name" }],
      identityFields: ["acme.co"],
      properties: { name: "Acme Co" },
      correlationId: "corr-kg-1",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    assert.equal(created.value.version, 1);
    assert.equal(created.value.versionHistory[0].immutable, true);
    assert.ok(created.value.provenance.length >= 1);
    assert.ok(created.value.evidenceIds.includes("ev_1"));
  });

  it("keeps entity ids immutable and version history append-only", async () => {
    const runtime = createKnowledgeGraphRuntime();
    await seedEvidence(runtime, "t1");
    const created = await runtime.service.proposeEntity({
      tenantId: "t1",
      id: "ent_stable",
      type: "Topic",
      proposingEngine: "market-intelligence",
      evidenceIds: ["ev_1"],
      properties: { label: "A" },
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const updated = await runtime.service.proposeEntity({
      tenantId: "t1",
      id: "ent_stable",
      type: "Topic",
      proposingEngine: "market-intelligence",
      evidenceIds: ["ev_1"],
      properties: { label: "B" },
      confidence: 0.9,
    });
    assert.equal(updated.ok, true);
    if (!updated.ok) return;
    assert.equal(updated.value.id, "ent_stable");
    assert.equal(updated.value.version, 2);
    assert.equal(updated.value.versionHistory.length, 2);
    assert.equal(updated.value.versionHistory[0].properties.label, "A");
    // Mutating a returned snapshot must not corrupt stored history.
    updated.value.versionHistory[0].properties.label = "mutated";
    const history = runtime.service.queries.getVersionHistory("ent_stable");
    assert.equal(history[0].properties.label, "A");
    assert.equal(history[0].immutable, true);
  });

  it("refuses cross-engine mutation of canonical entities", async () => {
    const runtime = createKnowledgeGraphRuntime();
    await seedEvidence(runtime, "t1");
    await runtime.service.proposeEntity({
      tenantId: "t1",
      id: "ent_owned",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      properties: { name: "Owned" },
    });
    const blocked = await runtime.service.proposeEntity({
      tenantId: "t1",
      id: "ent_owned",
      type: "Business",
      proposingEngine: "market-intelligence",
      evidenceIds: ["ev_1"],
      properties: { name: "Hijacked" },
    });
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.equal(blocked.error.code, "CROSS_ENGINE_MUTATION_FORBIDDEN");
    }
  });

  it("detects duplicates without merging automatically", async () => {
    const runtime = createKnowledgeGraphRuntime();
    await seedEvidence(runtime, "t1");
    await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      aliases: [{ value: "Acme", kind: "name" }],
      identityFields: ["acme"],
      properties: { name: "Acme 1" },
      idempotencyKey: "dup-1",
    });
    await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      aliases: [{ value: "Acme", kind: "name" }],
      identityFields: ["acme"],
      properties: { name: "Acme 2" },
      idempotencyKey: "dup-2",
    });
    const duplicates = runtime.service.detectDuplicates("t1");
    assert.equal(duplicates.ok, true);
    if (!duplicates.ok) return;
    assert.ok(duplicates.value.length >= 1);
    const entities = runtime.service.listEntities("t1");
    assert.equal(entities.filter((item) => item.status === "merged").length, 0);
  });

  it("requires confirmation before merge and preserves history", async () => {
    const runtime = createKnowledgeGraphRuntime();
    const events = [];
    runtime.events.subscribeAll(async (event) => events.push(event.name));
    await seedEvidence(runtime, "t1");

    const left = await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      aliases: [{ value: "Left", kind: "name" }],
      properties: { name: "Left" },
      idempotencyKey: "merge-left",
    });
    const right = await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      aliases: [{ value: "Right", kind: "name" }],
      properties: { name: "Right" },
      idempotencyKey: "merge-right",
    });
    assert.equal(left.ok && right.ok, true);
    if (!left.ok || !right.ok) return;

    const proposal = await runtime.service.createMergeProposal({
      tenantId: "t1",
      sourceEntityId: left.value.id,
      targetEntityId: right.value.id,
      reason: "same business",
      proposedBy: "operator",
    });
    assert.equal(proposal.ok, true);
    if (!proposal.ok) return;
    assert.equal(proposal.value.status, "pending");

    const confirmed = await runtime.service.confirmMerge(
      "t1",
      proposal.value.id,
      "operator",
    );
    assert.equal(confirmed.ok, true);
    if (!confirmed.ok) return;
    assert.equal(confirmed.value.proposal.status, "confirmed");
    const source = runtime.service.getEntity(left.value.id, "t1");
    assert.equal(source.value.status, "merged");
    assert.equal(source.value.mergedIntoId, right.value.id);
    assert.ok(
      confirmed.value.target.aliases.some(
        (alias) => alias.normalisedValue === "left",
      ),
    );
    assert.ok(events.includes(PlatformEventName.KnowledgeMergeProposed));
    assert.ok(events.includes(PlatformEventName.KnowledgeMergeConfirmed));
  });

  it("supports temporal validity queries", async () => {
    const runtime = createKnowledgeGraphRuntime();
    await seedEvidence(runtime, "t1");
    await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Offer",
      proposingEngine: "market-intelligence",
      evidenceIds: ["ev_1"],
      properties: { label: "seasonal" },
      validFrom: "2026-01-01T00:00:00.000Z",
      validTo: "2026-01-31T23:59:59.000Z",
      idempotencyKey: "temporal-1",
    });
    const inside = runtime.service.queries.entitiesValidAt(
      "t1",
      "2026-01-15T00:00:00.000Z",
    );
    const outside = runtime.service.queries.entitiesValidAt(
      "t1",
      "2026-02-15T00:00:00.000Z",
    );
    assert.equal(inside.length, 1);
    assert.equal(outside.length, 0);
  });

  it("is idempotent for repeated proposals", async () => {
    const runtime = createKnowledgeGraphRuntime();
    await seedEvidence(runtime, "t1");
    const first = await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      properties: { name: "Idem" },
      idempotencyKey: "idem-1",
    });
    const second = await runtime.service.proposeEntity({
      tenantId: "t1",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_1"],
      properties: { name: "Idem" },
      idempotencyKey: "idem-1",
    });
    assert.equal(first.ok && second.ok, true);
    if (!first.ok || !second.ok) return;
    assert.equal(first.value.id, second.value.id);
    assert.equal(runtime.service.listEntities("t1").length, 1);
  });

  it("enforces tenant isolation", async () => {
    const runtime = createKnowledgeGraphRuntime();
    await seedEvidence(runtime, "tenant_a", "ev_a");
    const created = await runtime.service.proposeEntity({
      tenantId: "tenant_a",
      type: "Business",
      proposingEngine: "business-discovery",
      evidenceIds: ["ev_a"],
      properties: { name: "A" },
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    const blocked = runtime.service.getEntity(created.value.id, "tenant_b");
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.equal(blocked.error.code, "TENANT_ISOLATION_VIOLATION");
    }
  });
});
