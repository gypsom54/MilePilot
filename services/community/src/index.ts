import {
  BaseIntelligenceEngine,
  type EngineContext,
  type EngineRegistration,
  type IntelligenceEngine,
} from "@seo-autopilot/engine-sdk";
import {
  createDefaultEngineConfig,
  type EngineConfig,
} from "@seo-autopilot/shared";

/**
 * Community Intelligence Engine
 *
 * Sprint 0: scaffold only. No business/SEO logic.
 * Implements IntelligenceEngine via BaseIntelligenceEngine.
 */
export class CommunityEngine extends BaseIntelligenceEngine {
  readonly name = "community";
  readonly purpose =
    "Observe community signals relevant to growth.";
  readonly version = "0.1.0";
  readonly inputs: string[] = [];
  readonly outputs: string[] = [];
  readonly events: string[] = ["AIRecommendationGenerated"];
  readonly dependencies: string[] = [];

  constructor(context: EngineContext) {
    super(context);
  }
}

export function createCommunityEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "community",
    version: "0.1.0",
    description: "Community Intelligence Engine",
    dependencies: [],
  });
}

export function createCommunityEngineRegistration(
  context: EngineContext,
): EngineRegistration {
  const engine: IntelligenceEngine = new CommunityEngine(context);
  const config = createCommunityEngineConfig();
  return {
    name: engine.name,
    version: engine.version,
    description: config.description,
    dependencies: [...engine.dependencies],
    events: [...engine.events],
    status: config.status,
    engine,
    config,
  };
}
