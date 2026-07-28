import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCreateBusinessInput } from "../../../services/business-discovery/dist/index.js";

describe("Business Discovery validation", () => {
  it("rejects incomplete create payloads", () => {
    const result = validateCreateBusinessInput({ legalName: "Acme" });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "VALIDATION_FAILED");
    }
  });

  it("accepts a complete create payload", () => {
    const result = validateCreateBusinessInput({
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
    });
    assert.equal(result.ok, true);
  });
});
