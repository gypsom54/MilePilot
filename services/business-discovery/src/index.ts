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
 * Business Discovery Intelligence Engine
 *
 * Sprint 0: scaffold only. No business/SEO logic.
 * Implements IntelligenceEngine via BaseIntelligenceEngine.
 */
export class BusinessDiscoveryEngine extends BaseIntelligenceEngine {
  readonly name = "business-discovery";
  readonly purpose =
    "Discover and structure business context for the platform.";
  readonly version = "0.1.0";
  readonly inputs: string[] = [];
  readonly outputs: string[] = [];
  readonly events: string[] = ["BusinessCreated", "WebsiteConnected"];
  readonly dependencies: string[] = [];

  constructor(context: EngineContext) {
    super(context);
  }
}

export function createBusinessDiscoveryEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "business-discovery",
    version: "0.1.0",
    description: "Business Discovery Intelligence Engine",
    dependencies: [],
  });
}

export function createBusinessDiscoveryEngineRegistration(
  context: EngineContext,
): EngineRegistration {
  const engine: IntelligenceEngine = new BusinessDiscoveryEngine(context);
  const config = createBusinessDiscoveryEngineConfig();
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
