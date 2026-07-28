import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  marketEntityId,
} from "../../../packages/knowledge-graph/dist/index.js";
import { createMarketIntelligenceRuntime } from "../../../services/market-intelligence/dist/index.js";

async function seedMarket(runtime, scope = "national") {
  const created = await runtime.service.defineMarket({
    tenantId: "tenant_a",
    businessId: "biz_readonly_1",
    name: "UK research peptides",
    description: "Market for research peptides",
    industryScope: "Life sciences",
    geographicScope: scope,
    locationLabels: scope === "local" ? ["Manchester"] : ["United Kingdom"],
  });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("seed failed");

  const withSource = await runtime.service.addSource(
    created.value.id,
    "tenant_a",
    { id: "src_fixture_1", label: "Fixture source", kind: "fixture" },
  );
  assert.equal(withSource.ok, true);
  if (!withSource.ok) throw new Error("source failed");
  return withSource.value;
}

describe("Market Intelligence flow", () => {
  it("syncs markets to the knowledge graph idempotently", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const market = await seedMarket(runtime);

    await runtime.repository.saveVersioned(structuredClone(market));
    const entity = await runtime.graph.getEntity(marketEntityId(market.id));
    assert.ok(entity);
    assert.equal(entity.type, "Market");
    assert.equal(entity.properties.geographicScope, "national");
  });

  it("preserves national vs local scope without conflation", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const national = await seedMarket(runtime, "national");
    const local = await seedMarket(runtime, "local");

    assert.equal(national.definition.geographicScope, "national");
    assert.equal(local.definition.geographicScope, "local");
    assert.notEqual(
      national.definition.geographicScope,
      local.definition.geographicScope,
    );
  });

  it("keeps dismissed competitors dismissed", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const market = await seedMarket(runtime);

    const discovered = await runtime.service.discoverCompetitor(
      market.id,
      "tenant_a",
      {
        name: "Competitor Co",
        sourceId: "src_fixture_1",
        observedAt: "2026-01-01T00:00:00.000Z",
        scope: "national",
        confidence: 0.7,
      },
    );
    assert.equal(discovered.ok, true);
    if (!discovered.ok) return;
    const candidateId = discovered.value.competitors[0].id;

    const dismissed = await runtime.service.dismissCompetitor(
      market.id,
      "tenant_a",
      candidateId,
    );
    assert.equal(dismissed.ok, true);

    const confirm = await runtime.service.confirmCompetitor(
      market.id,
      "tenant_a",
      candidateId,
    );
    assert.equal(confirm.ok, false);
    if (!confirm.ok) {
      assert.equal(confirm.error.code, "COMPETITOR_DISMISSED");
    }
  });

  it("does not overwrite Business Discovery facts", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const market = await seedMarket(runtime);
    assert.equal(market.businessId, "biz_readonly_1");

    const updated = await runtime.service.updateScope(
      market.id,
      "tenant_a",
      { description: "Updated market description" },
    );
    assert.equal(updated.ok, true);
    if (!updated.ok) return;
    assert.equal(updated.value.businessId, "biz_readonly_1");
    assert.equal(
      runtime.service.assertBusinessDiscoveryUntouched(updated.value)
        .mutatedBusinessDiscovery,
      false,
    );
  });

  it("rejects unsupported gaps and single-point trends", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const market = await seedMarket(runtime);

    const gap = await runtime.service.detectGap(market.id, "tenant_a", {
      statement: "Missing local guide",
      supportingEvidenceIds: [],
      sourceId: "src_fixture_1",
      observedAt: "2026-01-01T00:00:00.000Z",
      scope: "local",
      confidence: 0.6,
    });
    assert.equal(gap.ok, false);

    const trend = await runtime.service.observeTrend(market.id, "tenant_a", {
      name: "Rising interest",
      direction: "up",
      sourceId: "src_fixture_1",
      scope: "national",
      confidence: 0.6,
      observations: [
        {
          observedAt: "2026-01-01T00:00:00.000Z",
          note: "only",
          sourceId: "src_fixture_1",
          confidence: 0.6,
        },
      ],
    });
    assert.equal(trend.ok, false);
  });

  it("imports evidence idempotently", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const market = await seedMarket(runtime);
    const item = {
      text: "How to store research peptides",
      sourceId: "src_fixture_1",
      observedAt: "2026-03-01T00:00:00.000Z",
      scope: "national",
      confidence: 0.8,
    };

    const first = await runtime.service.importEvidenceBatch(
      market.id,
      "tenant_a",
      [item, item],
    );
    assert.equal(first.ok, true);
    if (!first.ok) return;
    assert.equal(first.value.imported, 1);
    assert.equal(first.value.skipped, 1);
    assert.equal(first.value.profile.demandSignals.length, 1);
  });

  it("expires evidence and retains historical records", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const market = await seedMarket(runtime);
    const observed = await runtime.service.observeDemandSignal(
      market.id,
      "tenant_a",
      {
        text: "seasonal demand",
        sourceId: "src_fixture_1",
        observedAt: "2026-01-01T00:00:00.000Z",
        scope: "national",
        confidence: 0.9,
        expiresAt: "2026-02-01T00:00:00.000Z",
      },
    );
    assert.equal(observed.ok, true);

    const expired = await runtime.service.expireEvidence(
      market.id,
      "tenant_a",
      "2026-07-01T00:00:00.000Z",
    );
    assert.equal(expired.ok, true);
    if (!expired.ok) return;
    assert.equal(expired.value.demandSignals.length, 1);
    assert.equal(expired.value.demandSignals[0].evidence.freshness, "expired");
  });
});
