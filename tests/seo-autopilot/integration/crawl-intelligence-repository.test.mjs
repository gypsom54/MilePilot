import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCrawlIntelligenceRuntime,
  FixtureCrawlAdapter,
} from "../../../services/crawl/dist/index.js";

describe("Crawl Intelligence repository", () => {
  it("enforces tenant isolation", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob({
      tenantId: "tenant_a",
      scope: {
        allowedHosts: ["example.com"],
        allowedProtocols: ["https"],
        includePathPrefixes: [],
        excludePathPrefixes: [],
        environment: "production",
      },
      source: { kind: "fixture", label: "fixture" },
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const blocked = runtime.service.getJob(created.value.id, "tenant_b");
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.equal(blocked.error.code, "TENANT_ISOLATION_VIOLATION");
    }
  });

  it("versions jobs and syncs KG without Website Intelligence entity types", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob({
      tenantId: "tenant_repo",
      websiteId: "wi_site_1",
      propertyId: "wi_prop_1",
      scope: {
        allowedHosts: ["example.com"],
        allowedProtocols: ["https"],
        includePathPrefixes: [],
        excludePathPrefixes: [],
        environment: "production",
      },
      source: { kind: "fixture", label: "fixture" },
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;

    await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_repo",
      new FixtureCrawlAdapter([
        {
          kind: "document",
          sourceId: created.value.source.id,
          observedAt: "2026-01-01T00:00:00.000Z",
          originalUrl: "https://example.com/",
          payload: { contentType: "text/html" },
        },
      ]),
    );

    const versions = runtime.service.listVersions(
      created.value.id,
      "tenant_repo",
    );
    assert.equal(versions.ok, true);
    if (versions.ok) assert.ok(versions.value.length >= 2);

    const jobEntity = await runtime.graph.getEntity(
      `crawl-job:${created.value.id}`,
    );
    assert.ok(jobEntity);
    assert.equal(jobEntity.type, "CrawlJob");
    assert.equal(jobEntity.properties.websiteId, "wi_site_1");

    const job = runtime.service.getJob(created.value.id, "tenant_repo");
    assert.equal(job.ok, true);
    if (!job.ok) return;
    const guard = runtime.service.assertWebsiteIntelligenceUntouched(job.value);
    assert.equal(guard.mutatedWebsiteIntelligence, false);
  });
});
