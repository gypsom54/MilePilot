import type { CapabilityManifest } from "@seo-autopilot/engine-sdk";

/**
 * Business Discovery Capability Manifest (Volume 4).
 */
export const BUSINESS_DISCOVERY_CAPABILITY_MANIFEST: CapabilityManifest = {
  engine: {
    id: "business-discovery",
    name: "Business Discovery Engine",
    version: "1.0.0",
  },
  capabilities: [
    "build_business_profile",
    "manage_brand_profile",
    "manage_audience_profile",
    "manage_goal_registry",
    "manage_expertise_map",
    "manage_trust_profile",
    "manage_digital_asset_registry",
    "manage_competitor_seeds",
    "manage_customer_question_bank",
    "manage_constraint_registry",
    "manage_preference_registry",
    "enrich_business_profile",
    "confirm_enrichment",
  ],
  consumes: ["user_business_input", "confirmed_enrichment"],
  produces: [
    "business_profile",
    "brand_profile",
    "audience_profile",
    "goal_registry",
    "expertise_map",
    "trust_profile",
    "digital_asset_registry",
    "competitor_seeds",
    "customer_question_bank",
    "constraint_registry",
    "preference_registry",
  ],
  confidence: {
    minimum_actionable: 0.65,
  },
  risk: {
    default: "low",
  },
  approval: {
    required_for_execution: true,
  },
};
