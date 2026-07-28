import { InMemoryWebsiteIntelligenceStore } from "@seo-autopilot/database";
import type { EngineContext, EngineRegistry } from "@seo-autopilot/engine-sdk";
import { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import {
  InMemoryEventBus,
  StructuredEngineLogger,
  type EventBus,
} from "@seo-autopilot/shared";
import { WebsiteIntelligenceApi } from "./api/handlers.js";
import { WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import {
  createWebsiteIntelligenceEngineConfig,
  WebsiteIntelligenceEngine,
} from "./engine.js";
import { WebsiteProfileRepository } from "./repository/website-profile-repository.js";
import { WebsiteIntelligenceService } from "./service.js";

export interface WebsiteIntelligenceRuntime {
  events: EventBus;
  graph: InMemoryKnowledgeGraph;
  store: InMemoryWebsiteIntelligenceStore;
  repository: WebsiteProfileRepository;
  service: WebsiteIntelligenceService;
  engine: WebsiteIntelligenceEngine;
  api: WebsiteIntelligenceApi;
  capabilityManifest: typeof WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST;
}

export function createWebsiteIntelligenceRuntime(
  events: EventBus = new InMemoryEventBus(),
  graph: InMemoryKnowledgeGraph = new InMemoryKnowledgeGraph(),
): WebsiteIntelligenceRuntime {
  const store = new InMemoryWebsiteIntelligenceStore();
  const repository = new WebsiteProfileRepository(store, graph);
  const service = new WebsiteIntelligenceService(repository, events);
  const config = createWebsiteIntelligenceEngineConfig();
  const context: EngineContext = {
    config,
    events,
    logger: new StructuredEngineLogger(config.name),
  };
  const engine = new WebsiteIntelligenceEngine(context, service);
  const api = new WebsiteIntelligenceApi(service);

  return {
    events,
    graph,
    store,
    repository,
    service,
    engine,
    api,
    capabilityManifest: WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST,
  };
}

export function registerWebsiteIntelligence(
  runtime: WebsiteIntelligenceRuntime,
  registry: EngineRegistry,
): void {
  const config = createWebsiteIntelligenceEngineConfig();
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
