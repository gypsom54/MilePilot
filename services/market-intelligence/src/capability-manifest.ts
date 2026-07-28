import type { CapabilityManifest } from "@seo-autopilot/engine-sdk";

export const MARKET_INTELLIGENCE_CAPABILITY_MANIFEST: CapabilityManifest = {
  engine: {
    id: "market-intelligence",
    name: "Market Intelligence Engine",
    version: "1.0.0",
  },
  capabilities: [
    "define_market",
    "update_market_scope",
    "manage_market_categories",
    "observe_customer_problems",
    "observe_desired_outcomes",
    "observe_demand_signals",
    "cluster_demand_themes",
    "manage_competitor_candidates",
    "observe_market_offers",
    "detect_market_gaps",
    "observe_market_trends",
    "observe_seasonality",
    "manage_market_sources",
    "import_market_evidence",
    "expire_market_evidence",
  ],
  consumes: [
    "tenant_context",
    "business_id_reference",
    "fixture_evidence",
    "imported_evidence",
  ],
  produces: [
    "market_profile",
    "market_category",
    "customer_problem",
    "desired_outcome",
    "demand_signal",
    "demand_theme",
    "competitor_candidate",
    "offer_observation",
    "market_gap",
    "trend",
    "seasonality_pattern",
    "market_source",
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
