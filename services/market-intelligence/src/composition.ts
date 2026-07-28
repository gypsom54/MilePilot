import { InMemoryMarketIntelligenceStore } from "@seo-autopilot/database";
import type { EngineContext, EngineRegistry } from "@seo-autopilot/engine-sdk";
import { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import {
  InMemoryEventBus,
  StructuredEngineLogger,
  type EventBus,
} from "@seo-autopilot/shared";
import { MarketIntelligenceApi } from "./api/handlers.js";
import { MARKET_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import {
  createMarketIntelligenceEngineConfig,
  MarketIntelligenceEngine,
} from "./engine.js";
import { MarketProfileRepository } from "./repository/market-profile-repository.js";
import { MarketIntelligenceService } from "./service.js";

export interface MarketIntelligenceRuntime {
  events: EventBus;
  graph: InMemoryKnowledgeGraph;
  store: InMemoryMarketIntelligenceStore;
  repository: MarketProfileRepository;
  service: MarketIntelligenceService;
  engine: MarketIntelligenceEngine;
  api: MarketIntelligenceApi;
  capabilityManifest: typeof MARKET_INTELLIGENCE_CAPABILITY_MANIFEST;
}

export function createMarketIntelligenceRuntime(
  events: EventBus = new InMemoryEventBus(),
  graph: InMemoryKnowledgeGraph = new InMemoryKnowledgeGraph(),
): MarketIntelligenceRuntime {
  const store = new InMemoryMarketIntelligenceStore();
  const repository = new MarketProfileRepository(store, graph);
  const service = new MarketIntelligenceService(repository, events);
  const config = createMarketIntelligenceEngineConfig();
  const context: EngineContext = {
    config,
    events,
    logger: new StructuredEngineLogger(config.name),
  };
  const engine = new MarketIntelligenceEngine(context, service);
  const api = new MarketIntelligenceApi(service);

  return {
    events,
    graph,
    store,
    repository,
    service,
    engine,
    api,
    capabilityManifest: MARKET_INTELLIGENCE_CAPABILITY_MANIFEST,
  };
}

export function registerMarketIntelligence(
  runtime: MarketIntelligenceRuntime,
  registry: EngineRegistry,
): void {
  const config = createMarketIntelligenceEngineConfig();
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
