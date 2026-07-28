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
 * Competitor Intelligence Engine
 *
 * Sprint 0: scaffold only. No business/SEO logic.
 * Implements IntelligenceEngine via BaseIntelligenceEngine.
 */
export class CompetitorEngine extends BaseIntelligenceEngine {
  readonly name = "competitor";
  readonly purpose =
    "Track competitor changes via the event bus.";
  readonly version = "0.1.0";
  readonly inputs: string[] = [];
  readonly outputs: string[] = [];
  readonly events: string[] = ["CompetitorUpdated"];
  readonly dependencies: string[] = [];

  constructor(context: EngineContext) {
    super(context);
  }
}

export function createCompetitorEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "competitor",
    version: "0.1.0",
    description: "Competitor Intelligence Engine",
    dependencies: [],
  });
}

export function createCompetitorEngineRegistration(
  context: EngineContext,
): EngineRegistration {
  const engine: IntelligenceEngine = new CompetitorEngine(context);
  const config = createCompetitorEngineConfig();
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
