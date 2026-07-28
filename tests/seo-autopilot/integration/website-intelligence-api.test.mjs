import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPlatformRuntime,
  handleApiRequest,
} from "../../../apps/api/dist/index.js";

describe("Website Intelligence API", () => {
  it("defines website, property and page through API handlers", async () => {
    const runtime = createPlatformRuntime();

    const website = await handleApiRequest(runtime, {
      method: "POST",
      path: "/website-intelligence/websites",
      body: {
        tenantId: "tenant_api",
        name: "API Website",
        correlationId: "wi-1",
      },
    });
    assert.equal(website.status, 200);

    const property = await handleApiRequest(runtime, {
      method: "POST",
      path: `/website-intelligence/websites/${website.body.id}/properties`,
      body: {
        tenantId: "tenant_api",
        environment: "production",
        baseUrl: "https://api.example.com",
      },
    });
    assert.equal(property.status, 200);
    const propertyId = property.body.properties[0].id;

    const page = await handleApiRequest(runtime, {
      method: "POST",
      path: `/website-intelligence/websites/${website.body.id}/pages`,
      body: {
        tenantId: "tenant_api",
        propertyId,
        url: "https://api.example.com/home",
        pageType: "home",
        purpose: "orient",
        sourceId: "fixture",
        observedAt: "2026-01-01T00:00:00.000Z",
        confidence: 0.9,
      },
    });
    assert.equal(page.status, 200);
    assert.equal(page.body.pages[0].pageType.status, "candidate");

    const manifest = await handleApiRequest(runtime, {
      method: "GET",
      path: "/website-intelligence/manifest",
    });
    assert.equal(manifest.status, 200);
    assert.equal(manifest.body.engine.id, "website-intelligence");
    assert.ok(runtime.registry.get("website-intelligence"));
  });
});
