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
 * Market Intelligence Engine
 *
 * Sprint 0: scaffold only. No business/SEO logic.
 * Implements IntelligenceEngine via BaseIntelligenceEngine.
 */
export class MarketIntelligenceEngine extends BaseIntelligenceEngine {
  readonly name = "market-intelligence";
  readonly purpose =
    "Observe market signals relevant to the business.";
  readonly version = "0.1.0";
  readonly inputs: string[] = [];
  readonly outputs: string[] = [];
  readonly events: string[] = ["CompetitorUpdated"];
  readonly dependencies: string[] = [];

  constructor(context: EngineContext) {
    super(context);
  }
}

export function createMarketIntelligenceEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "market-intelligence",
    version: "0.1.0",
    description: "Market Intelligence Engine",
    dependencies: [],
  });
}

export function createMarketIntelligenceEngineRegistration(
  context: EngineContext,
): EngineRegistration {
  const engine: IntelligenceEngine = new MarketIntelligenceEngine(context);
  const config = createMarketIntelligenceEngineConfig();
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
