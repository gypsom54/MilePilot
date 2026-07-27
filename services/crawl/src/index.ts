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
 * Crawl Intelligence Engine
 *
 * Sprint 0: scaffold only. No business/SEO logic.
 * Implements IntelligenceEngine via BaseIntelligenceEngine.
 */
export class CrawlEngine extends BaseIntelligenceEngine {
  readonly name = "crawl";
  readonly purpose =
    "Ingest website pages into the platform event stream.";
  readonly version = "0.1.0";
  readonly inputs: string[] = [];
  readonly outputs: string[] = [];
  readonly events: string[] = ["PageCrawled"];
  readonly dependencies: string[] = [];

  constructor(context: EngineContext) {
    super(context);
  }
}

export function createCrawlEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "crawl",
    version: "0.1.0",
    description: "Crawl Intelligence Engine",
    dependencies: [],
  });
}

export function createCrawlEngineRegistration(
  context: EngineContext,
): EngineRegistration {
  const engine: IntelligenceEngine = new CrawlEngine(context);
  const config = createCrawlEngineConfig();
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
