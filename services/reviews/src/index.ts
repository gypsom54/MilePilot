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
 * Reviews Intelligence Engine
 *
 * Sprint 0: scaffold only. No business/SEO logic.
 * Implements IntelligenceEngine via BaseIntelligenceEngine.
 */
export class ReviewsEngine extends BaseIntelligenceEngine {
  readonly name = "reviews";
  readonly purpose =
    "Ingest and structure review signals.";
  readonly version = "0.1.0";
  readonly inputs: string[] = [];
  readonly outputs: string[] = [];
  readonly events: string[] = ["ReviewReceived"];
  readonly dependencies: string[] = [];

  constructor(context: EngineContext) {
    super(context);
  }
}

export function createReviewsEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "reviews",
    version: "0.1.0",
    description: "Reviews Intelligence Engine",
    dependencies: [],
  });
}

export function createReviewsEngineRegistration(
  context: EngineContext,
): EngineRegistration {
  const engine: IntelligenceEngine = new ReviewsEngine(context);
  const config = createReviewsEngineConfig();
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
