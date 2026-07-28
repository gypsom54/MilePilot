import { InMemoryCrawlIntelligenceStore } from "@seo-autopilot/database";
import type { EngineContext, EngineRegistry } from "@seo-autopilot/engine-sdk";
import { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import {
  InMemoryEventBus,
  StructuredEngineLogger,
  type EventBus,
} from "@seo-autopilot/shared";
import { CrawlIntelligenceApi } from "./api/handlers.js";
import { CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import {
  createCrawlIntelligenceEngineConfig,
  CrawlIntelligenceEngine,
} from "./engine.js";
import { CrawlJobRepository } from "./repository/crawl-job-repository.js";
import { CrawlIntelligenceService } from "./service.js";

export interface CrawlIntelligenceRuntime {
  events: EventBus;
  graph: InMemoryKnowledgeGraph;
  store: InMemoryCrawlIntelligenceStore;
  repository: CrawlJobRepository;
  service: CrawlIntelligenceService;
  engine: CrawlIntelligenceEngine;
  api: CrawlIntelligenceApi;
  capabilityManifest: typeof CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST;
}

export function createCrawlIntelligenceRuntime(
  events: EventBus = new InMemoryEventBus(),
  graph: InMemoryKnowledgeGraph = new InMemoryKnowledgeGraph(),
): CrawlIntelligenceRuntime {
  const store = new InMemoryCrawlIntelligenceStore();
  const repository = new CrawlJobRepository(store, graph);
  const service = new CrawlIntelligenceService(repository, events);
  const config = createCrawlIntelligenceEngineConfig();
  const context: EngineContext = {
    config,
    events,
    logger: new StructuredEngineLogger(config.name),
  };
  const engine = new CrawlIntelligenceEngine(context, service);
  const api = new CrawlIntelligenceApi(service);

  return {
    events,
    graph,
    store,
    repository,
    service,
    engine,
    api,
    capabilityManifest: CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST,
  };
}

export function registerCrawlIntelligence(
  runtime: CrawlIntelligenceRuntime,
  registry: EngineRegistry,
): void {
  const config = createCrawlIntelligenceEngineConfig();
  registry.register({
    name: runtime.engine.name,
    version: runtime.engine.version,
    description: config.description,
    dependencies: [...runtime.engine.dependencies],
    events: [...runtime.engine.events],
    status: config.status,
    engine: runtime.engine,
    config,
  });
}
