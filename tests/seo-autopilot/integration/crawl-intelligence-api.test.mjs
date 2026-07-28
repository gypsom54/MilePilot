import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPlatformRuntime,
  handleApiRequest,
} from "../../../apps/api/dist/index.js";

describe("Crawl Intelligence API", () => {
  it("creates jobs, imports observations and snapshots through handlers", async () => {
    const runtime = createPlatformRuntime();

    const job = await handleApiRequest(runtime, {
      method: "POST",
      path: "/crawl-intelligence/jobs",
      body: {
        tenantId: "tenant_api",
        websiteId: "site_1",
        correlationId: "corr-crawl-1",
        scope: {
          allowedHosts: ["api.example.com"],
          allowedProtocols: ["https"],
          includePathPrefixes: [],
          excludePathPrefixes: [],
          environment: "production",
        },
        source: { kind: "fixture", label: "api-fixture" },
      },
    });
    assert.equal(job.status, 200);
    const jobId = job.body.id;

    const imported = await handleApiRequest(runtime, {
      method: "POST",
      path: `/crawl-intelligence/jobs/${jobId}/import`,
      body: {
        tenantId: "tenant_api",
        adapterKind: "fixture",
        correlationId: "corr-crawl-2",
        observations: [
          {
            kind: "fetch_attempt",
            sourceId: "api-fixture",
            observedAt: "2026-01-01T00:00:00.000Z",
            originalUrl: "https://api.example.com/",
            payload: { attemptNumber: 1 },
          },
          {
            kind: "http_response",
            sourceId: "api-fixture",
            observedAt: "2026-01-01T00:00:01.000Z",
            originalUrl: "https://api.example.com/",
            payload: {
              statusCode: 200,
              headers: {
                Authorization: "Bearer should-redact",
                "Content-Type": "text/html",
              },
            },
          },
          {
            kind: "document",
            sourceId: "api-fixture",
            observedAt: "2026-01-01T00:00:02.000Z",
            originalUrl: "https://api.example.com/",
            payload: { contentType: "text/html" },
          },
        ],
      },
    });
    assert.equal(imported.status, 200);
    assert.equal(imported.body.imported, 3);

    const responseObs = imported.body.job.observations.find(
      (item) => item.kind === "http_response",
    );
    assert.equal(responseObs.payload.headers.Authorization, "[REDACTED]");

    const snapshot = await handleApiRequest(runtime, {
      method: "POST",
      path: `/crawl-intelligence/jobs/${jobId}/snapshots`,
      body: { tenantId: "tenant_api", label: "t1" },
    });
    assert.equal(snapshot.status, 200);
    const snapshotId = snapshot.body.snapshots[0].id;

    const getSnapshot = await handleApiRequest(runtime, {
      method: "GET",
      path: `/crawl-intelligence/jobs/${jobId}/snapshots/${snapshotId}`,
      query: { tenantId: "tenant_api" },
    });
    assert.equal(getSnapshot.status, 200);
    assert.equal(getSnapshot.body.immutable, true);

    const manifest = await handleApiRequest(runtime, {
      method: "GET",
      path: "/crawl-intelligence/manifest",
    });
    assert.equal(manifest.status, 200);
    assert.equal(manifest.body.engine.id, "crawl-intelligence");
    assert.ok(runtime.registry.get("crawl-intelligence"));
  });
});
