import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PlatformEventName } from "../../../packages/shared/dist/index.js";
import { createWebsiteIntelligenceRuntime } from "../../../services/website-intelligence/dist/index.js";

async function seedWebsite(runtime) {
  const website = await runtime.service.defineWebsite({
    tenantId: "tenant_web",
    businessId: "biz_readonly",
    name: "Example Site",
  });
  assert.equal(website.ok, true);
  if (!website.ok) throw new Error("define failed");

  const production = await runtime.service.addProperty(
    website.value.id,
    "tenant_web",
    {
      environment: "production",
      baseUrl: "https://www.example.com",
    },
  );
  assert.equal(production.ok, true);
  if (!production.ok) throw new Error("property failed");

  const staging = await runtime.service.addProperty(
    website.value.id,
    "tenant_web",
    {
      environment: "staging",
      baseUrl: "https://staging.example.com",
    },
  );
  assert.equal(staging.ok, true);
  if (!staging.ok) throw new Error("staging failed");

  return {
    websiteId: website.value.id,
    productionId: production.value.properties.find(
      (item) => item.environment === "production",
    ).id,
    stagingId: staging.value.properties.find(
      (item) => item.environment === "staging",
    ).id,
  };
}

describe("Website Intelligence flow", () => {
  it("deduplicates pages by normalised URL within a property", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const seed = await seedWebsite(runtime);

    const first = await runtime.service.observePage(
      seed.websiteId,
      "tenant_web",
      {
        propertyId: seed.productionId,
        url: "https://www.example.com/About/",
        pageType: "service",
        purpose: "inform",
        sourceId: "fixture_1",
        observedAt: "2026-01-01T00:00:00.000Z",
        confidence: 0.8,
      },
    );
    assert.equal(first.ok, true);

    const second = await runtime.service.observePage(
      seed.websiteId,
      "tenant_web",
      {
        propertyId: seed.productionId,
        url: "HTTPS://WWW.EXAMPLE.COM/About",
        pageType: "service",
        purpose: "inform",
        sourceId: "fixture_1",
        observedAt: "2026-01-02T00:00:00.000Z",
        confidence: 0.8,
      },
    );
    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.equal(second.value.pages.length, 1);
  });

  it("keeps staging and production pages distinct", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const seed = await seedWebsite(runtime);

    await runtime.service.observePage(seed.websiteId, "tenant_web", {
      propertyId: seed.productionId,
      url: "https://www.example.com/about",
      sourceId: "fixture_1",
      observedAt: "2026-01-01T00:00:00.000Z",
      confidence: 0.8,
    });
    await runtime.service.observePage(seed.websiteId, "tenant_web", {
      propertyId: seed.stagingId,
      url: "https://staging.example.com/about",
      sourceId: "fixture_1",
      observedAt: "2026-01-01T00:00:00.000Z",
      confidence: 0.8,
    });

    const profile = runtime.service.getWebsite(seed.websiteId, "tenant_web");
    assert.equal(profile.ok, true);
    if (!profile.ok) return;
    assert.equal(profile.value.pages.length, 2);
    assert.notEqual(
      profile.value.pages[0].normalisedUrl,
      profile.value.pages[1].normalisedUrl,
    );
  });

  it("rejects circular page hierarchy", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const seed = await seedWebsite(runtime);
    const a = await runtime.service.observePage(seed.websiteId, "tenant_web", {
      propertyId: seed.productionId,
      url: "https://www.example.com/a",
      sourceId: "fixture_1",
      observedAt: "2026-01-01T00:00:00.000Z",
      confidence: 0.8,
    });
    const b = await runtime.service.observePage(seed.websiteId, "tenant_web", {
      propertyId: seed.productionId,
      url: "https://www.example.com/b",
      sourceId: "fixture_1",
      observedAt: "2026-01-01T00:00:00.000Z",
      confidence: 0.8,
    });
    assert.equal(a.ok && b.ok, true);
    if (!a.ok || !b.ok) return;

    const link = await runtime.service.updateHierarchy(
      seed.websiteId,
      "tenant_web",
      b.value.pages.find((page) => page.normalisedUrl.endsWith("/b")).id,
      a.value.pages.find((page) => page.normalisedUrl.endsWith("/a")).id,
    );
    assert.equal(link.ok, true);

    const loop = await runtime.service.updateHierarchy(
      seed.websiteId,
      "tenant_web",
      a.value.pages.find((page) => page.normalisedUrl.endsWith("/a")).id,
      b.value.pages.find((page) => page.normalisedUrl.endsWith("/b")).id,
    );
    assert.equal(loop.ok, false);
    if (!loop.ok) {
      assert.equal(loop.error.code, "HIERARCHY_LOOP");
    }
  });

  it("requires confirmation for classifications", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const seed = await seedWebsite(runtime);
    const page = await runtime.service.observePage(
      seed.websiteId,
      "tenant_web",
      {
        propertyId: seed.productionId,
        url: "https://www.example.com/services",
        pageType: "service",
        purpose: "convert",
        sourceId: "fixture_1",
        observedAt: "2026-01-01T00:00:00.000Z",
        confidence: 0.8,
      },
    );
    assert.equal(page.ok, true);
    if (!page.ok) return;
    const pageId = page.value.pages[0].id;
    assert.equal(page.value.pages[0].pageType.status, "candidate");

    const confirmed = await runtime.service.confirmPageType(
      seed.websiteId,
      "tenant_web",
      pageId,
    );
    assert.equal(confirmed.ok, true);
    if (!confirmed.ok) return;
    assert.equal(confirmed.value.pages[0].pageType.status, "confirmed");
  });

  it("imports pages idempotently and keeps historical deleted pages", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const seed = await seedWebsite(runtime);
    /** @type {string[]} */
    const events = [];
    runtime.events.subscribeAll((event) => events.push(event.name));

    const imported = await runtime.service.importPages(
      seed.websiteId,
      "tenant_web",
      {
        propertyId: seed.productionId,
        sourceId: "fixture_1",
        observedAt: "2026-01-01T00:00:00.000Z",
        confidence: 0.9,
        pages: [
          { url: "https://www.example.com/one" },
          { url: "https://www.example.com/one/" },
          { url: "https://www.example.com/two" },
        ],
      },
      "corr-import",
    );
    assert.equal(imported.ok, true);
    if (!imported.ok) return;
    assert.equal(imported.value.imported, 2);
    assert.equal(imported.value.skipped, 1);
    assert.ok(events.includes(PlatformEventName.WebsiteImportCompleted));

    const pageId = imported.value.profile.pages[0].id;
    const deleted = await runtime.service.changePublicationState(
      seed.websiteId,
      "tenant_web",
      pageId,
      {
        state: "deleted",
        sourceId: "fixture_1",
        observedAt: "2026-02-01T00:00:00.000Z",
        confidence: 1,
      },
    );
    assert.equal(deleted.ok, true);
    if (!deleted.ok) return;
    assert.equal(deleted.value.pages.length, 2);
    assert.equal(deleted.value.pages[0].publicationState, "deleted");
    assert.ok(deleted.value.pages[0].publicationHistory.length >= 2);
  });

  it("does not overwrite business or market facts and enforces tenant boundaries", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const seed = await seedWebsite(runtime);
    const page = await runtime.service.observePage(
      seed.websiteId,
      "tenant_web",
      {
        propertyId: seed.productionId,
        url: "https://www.example.com/map",
        sourceId: "fixture_1",
        observedAt: "2026-01-01T00:00:00.000Z",
        confidence: 0.8,
      },
    );
    assert.equal(page.ok, true);
    if (!page.ok) return;
    const pageId = page.value.pages[0].id;

    const mapped = await runtime.service.mapBusinessEntity(
      seed.websiteId,
      "tenant_web",
      pageId,
      {
        businessId: "biz_readonly",
        entityPath: "services.0",
        refTenantId: "tenant_web",
      },
    );
    assert.equal(mapped.ok, true);
    if (!mapped.ok) return;
    assert.equal(mapped.value.businessId, "biz_readonly");
    assert.equal(
      runtime.service.assertExternalFactsUntouched(mapped.value)
        .mutatedBusinessDiscovery,
      false,
    );

    const crossTenant = await runtime.service.mapMarketEntity(
      seed.websiteId,
      "tenant_web",
      pageId,
      {
        marketId: "mkt_1",
        entityType: "DemandTheme",
        entityId: "theme_1",
        refTenantId: "other_tenant",
      },
    );
    assert.equal(crossTenant.ok, false);

    const denied = runtime.service.getWebsite(seed.websiteId, "other_tenant");
    assert.equal(denied.ok, false);
  });
});
