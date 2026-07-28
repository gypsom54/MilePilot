import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPlatformRuntime,
  handleApiRequest,
} from "../../../apps/api/dist/index.js";

describe("Business Discovery API", () => {
  it("creates and retrieves a business profile through the API", async () => {
    const runtime = createPlatformRuntime();

    const createResponse = await handleApiRequest(runtime, {
      method: "POST",
      path: "/business-discovery/businesses",
      body: {
        legalName: "Example Ltd",
        tradingName: "Example",
        website: "https://example.com",
        primaryDomain: "example.com",
        businessDescription: "Example business",
        industry: "Software",
        businessStage: "startup",
        companyType: "limited_company",
        primaryContact: "hello@example.com",
        timeZone: "UTC",
        primaryLanguage: "en",
      },
    });

    assert.equal(createResponse.status, 200);
    const profile = createResponse.body;
    assert.equal(profile.identity.tradingName.value, "Example");

    const getResponse = await handleApiRequest(runtime, {
      method: "GET",
      path: `/business-discovery/businesses/${profile.id}`,
    });
    assert.equal(getResponse.status, 200);

    const manifest = await handleApiRequest(runtime, {
      method: "GET",
      path: "/business-discovery/manifest",
    });
    assert.equal(manifest.status, 200);
    assert.equal(manifest.body.engine.id, "business-discovery");

    const registered = runtime.registry.get("business-discovery");
    assert.ok(registered);
  });
});
