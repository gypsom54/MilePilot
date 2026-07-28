import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  businessEntityId,
} from "../../../packages/knowledge-graph/dist/index.js";
import { PlatformEventName } from "../../../packages/shared/dist/index.js";
import { createBusinessDiscoveryRuntime } from "../../../services/business-discovery/dist/index.js";

const sampleBusiness = {
  legalName: "Vector Research Ltd",
  tradingName: "Vector Research",
  website: "https://vectorresearch.example",
  primaryDomain: "vectorresearch.example",
  businessDescription: "Research peptide supplier",
  industry: "Life sciences",
  businessStage: "growth",
  companyType: "limited_company",
  primaryContact: "ops@vectorresearch.example",
  timeZone: "Europe/London",
  primaryLanguage: "en-GB",
};

describe("Business Discovery integration", () => {
  it("creates a versioned profile, publishes events, and syncs the graph", async () => {
    const runtime = createBusinessDiscoveryRuntime();
    /** @type {string[]} */
    const events = [];
    runtime.events.subscribeAll((event) => {
      events.push(event.name);
    });

    const created = await runtime.service.createBusiness(sampleBusiness);
    assert.equal(created.ok, true);
    if (!created.ok) return;

    assert.equal(created.value.version, 1);
    assert.equal(created.value.identity.legalName.source, "user");
    assert.ok(created.value.identity.legalName.changeHistory.length >= 1);

    const graphBusiness = await runtime.graph.findBusinessContext({
      entityId: businessEntityId(created.value.id),
    });
    assert.equal(graphBusiness.ok, true);

    const withService = await runtime.service.addService(created.value.id, {
      name: "Analytical Methods",
      category: "Laboratory",
    });
    assert.equal(withService.ok, true);
    if (!withService.ok) return;
    assert.equal(withService.value.version, 2);

    assert.ok(events.includes(PlatformEventName.BusinessCreated));
    assert.ok(events.includes(PlatformEventName.WebsiteConnected));
    assert.ok(events.includes(PlatformEventName.ServiceAdded));
    assert.ok(events.includes(PlatformEventName.BusinessUpdated));

    const versions = runtime.service.listVersions(created.value.id);
    assert.equal(versions.ok, true);
    if (versions.ok) {
      assert.deepEqual(versions.value, [1, 2]);
    }
  });

  it("requires confirmation before enrichment becomes canonical", async () => {
    const runtime = createBusinessDiscoveryRuntime();
    const created = await runtime.service.createBusiness(sampleBusiness);
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const enrich = await runtime.service.analyseEnrichment(created.value.id);
    assert.equal(enrich.ok, true);
    if (!enrich.ok) return;

    const pending = enrich.value.suggestions.find(
      (item) => item.path === "brand.uniqueSellingProposition",
    );
    assert.ok(pending);

    const before = runtime.service.getBusiness(created.value.id);
    assert.equal(before.ok, true);
    if (!before.ok) return;
    assert.equal(before.value.brand.uniqueSellingProposition.value, "");

    const confirmed = await runtime.service.confirmEnrichment(
      created.value.id,
      pending.id,
    );
    assert.equal(confirmed.ok, true);
    if (!confirmed.ok) return;
    assert.ok(confirmed.value.brand.uniqueSellingProposition.value.length > 0);
    assert.equal(
      confirmed.value.brand.uniqueSellingProposition.source,
      "confirmed_enrichment",
    );
  });
});
