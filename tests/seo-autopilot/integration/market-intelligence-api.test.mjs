import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPlatformRuntime,
  handleApiRequest,
} from "../../../apps/api/dist/index.js";

describe("Market Intelligence API", () => {
  it("defines and retrieves a market through API handlers", async () => {
    const runtime = createPlatformRuntime();

    const createResponse = await handleApiRequest(runtime, {
      method: "POST",
      path: "/market-intelligence/markets",
      body: {
        tenantId: "tenant_api",
        name: "API Market",
        description: "Created via API",
        industryScope: "Software",
        geographicScope: "regional",
        correlationId: "api-corr-1",
      },
    });
    assert.equal(createResponse.status, 200);
    const market = createResponse.body;
    assert.equal(market.definition.geographicScope, "regional");

    const getResponse = await handleApiRequest(runtime, {
      method: "GET",
      path: `/market-intelligence/markets/${market.id}`,
      query: { tenantId: "tenant_api" },
    });
    assert.equal(getResponse.status, 200);

    const manifest = await handleApiRequest(runtime, {
      method: "GET",
      path: "/market-intelligence/manifest",
    });
    assert.equal(manifest.status, 200);
    assert.equal(manifest.body.engine.id, "market-intelligence");

    assert.ok(runtime.registry.get("market-intelligence"));
    assert.ok(runtime.registry.get("business-discovery"));
  });

  it("enforces tenant isolation on get", async () => {
    const runtime = createPlatformRuntime();
    const createResponse = await handleApiRequest(runtime, {
      method: "POST",
      path: "/market-intelligence/markets",
      body: {
        tenantId: "tenant_one",
        name: "Isolated",
        description: "Tenant one market",
        industryScope: "Software",
        geographicScope: "local",
      },
    });
    assert.equal(createResponse.status, 200);

    const denied = await handleApiRequest(runtime, {
      method: "GET",
      path: `/market-intelligence/markets/${createResponse.body.id}`,
      query: { tenantId: "tenant_two" },
    });
    assert.equal(denied.status, 403);
  });
});
