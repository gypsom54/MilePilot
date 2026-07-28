/**
 * Per-engine configuration contract.
 * Nothing about engine behaviour should be hardcoded outside this shape.
 */
export interface EngineLimits {
  maxConcurrentJobs: number;
  maxInputBytes: number;
  maxOutputBytes: number;
}

export interface EngineTimeouts {
  analyseMs: number;
  recommendMs: number;
  automateMs: number;
  healthMs: number;
}

export interface EngineFeatureFlags {
  [flagName: string]: boolean;
}

export type EngineRuntimeStatus =
  | "registered"
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "disabled";

export interface EngineConfig {
  /** Engine unique name */
  name: string;
  /** Semantic version */
  version: string;
  /** Human-readable description */
  description: string;
  /** Runtime limits */
  limits: EngineLimits;
  /** Operation timeouts */
  timeouts: EngineTimeouts;
  /** Feature flags for this engine */
  featureFlags: EngineFeatureFlags;
  /** Declared engine dependencies (other engine names) */
  dependencies: string[];
  /** Current health/status */
  status: EngineRuntimeStatus;
  /** Arbitrary engine-specific config bag (no business logic here) */
  settings: Record<string, unknown>;
}

export interface ConfigurationProvider {
  getEngineConfig(engineName: string): EngineConfig | undefined;
  listEngineConfigs(): EngineConfig[];
  setEngineConfig(config: EngineConfig): void;
}
