/**
 * Capability Manifest — Volume 3 / Volume 4.
 * Every engine publishes one so Ask can discover capabilities without hard-coding.
 */

export interface CapabilityManifestEngine {
  id: string;
  name: string;
  version: string;
}

export interface CapabilityManifest {
  engine: CapabilityManifestEngine;
  capabilities: string[];
  consumes: string[];
  produces: string[];
  confidence: {
    minimum_actionable: number;
  };
  risk: {
    default: "low" | "medium" | "high";
  };
  approval: {
    required_for_execution: boolean;
  };
}
