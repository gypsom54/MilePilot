import type { CapabilityManifest } from "@seo-autopilot/engine-sdk";

export const CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST: CapabilityManifest = {
  engine: {
    id: "crawl-intelligence",
    name: "Crawl Intelligence Engine",
    version: "1.0.0",
  },
  capabilities: [
    "create_crawl_job",
    "validate_crawl_scope",
    "record_crawl_observations",
    "import_fixture_observations",
    "import_injected_observations",
    "stream_adapter_observations",
    "create_immutable_snapshots",
    "compare_snapshots_factually",
    "retain_provenance_and_timestamps",
    "redact_sensitive_headers",
  ],
  consumes: [
    "tenant_context",
    "website_id_reference",
    "property_id_reference",
    "fixture_observations",
    "injected_observations",
  ],
  produces: [
    "crawl_job",
    "crawl_scope",
    "crawl_source",
    "crawl_observation",
    "crawl_snapshot",
    "snapshot_comparison",
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
