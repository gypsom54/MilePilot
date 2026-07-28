import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMarketIntelligenceRuntime } from "../../../services/market-intelligence/dist/index.js";

describe("Market Intelligence repository", () => {
  it("versions market profiles per tenant", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const created = await runtime.service.defineMarket({
      tenantId: "tenant_repo",
      name: "Repo Market",
      description: "Versioned market",
      industryScope: "Retail",
      geographicScope: "national",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const updated = await runtime.service.updateScope(
      created.value.id,
      "tenant_repo",
      { industryScope: "Retail / ecommerce" },
    );
    assert.equal(updated.ok, true);
    if (!updated.ok) return;
    assert.equal(updated.value.version, 2);

    const versions = runtime.service.listVersions(
      created.value.id,
      "tenant_repo",
    );
    assert.equal(versions.ok, true);
    if (versions.ok) {
      assert.deepEqual(versions.value, [1, 2]);
    }

    const otherTenant = runtime.service.listMarkets("tenant_other");
    assert.equal(otherTenant.length, 0);
  });
});
