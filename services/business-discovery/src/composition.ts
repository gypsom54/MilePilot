import { InMemoryBusinessDiscoveryStore } from "@seo-autopilot/database";
import type { EngineContext, EngineRegistry } from "@seo-autopilot/engine-sdk";
import { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import {
  InMemoryEventBus,
  StructuredEngineLogger,
  type EventBus,
} from "@seo-autopilot/shared";
import { BusinessDiscoveryApi } from "./api/handlers.js";
import { BUSINESS_DISCOVERY_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import {
  createBusinessDiscoveryEngineConfig,
  BusinessDiscoveryEngine,
} from "./engine.js";
import { BusinessProfileRepository } from "./repository/business-profile-repository.js";
import { BusinessDiscoveryService } from "./service.js";

export interface BusinessDiscoveryRuntime {
  events: EventBus;
  graph: InMemoryKnowledgeGraph;
  store: InMemoryBusinessDiscoveryStore;
  repository: BusinessProfileRepository;
  service: BusinessDiscoveryService;
  engine: BusinessDiscoveryEngine;
  api: BusinessDiscoveryApi;
  capabilityManifest: typeof BUSINESS_DISCOVERY_CAPABILITY_MANIFEST;
}

export function createBusinessDiscoveryRuntime(
  events: EventBus = new InMemoryEventBus(),
): BusinessDiscoveryRuntime {
  const store = new InMemoryBusinessDiscoveryStore();
  const graph = new InMemoryKnowledgeGraph();
  const repository = new BusinessProfileRepository(store, graph);
  const service = new BusinessDiscoveryService(repository, events);
  const config = createBusinessDiscoveryEngineConfig();
  const context: EngineContext = {
    config,
    events,
    logger: new StructuredEngineLogger(config.name),
  };
  const engine = new BusinessDiscoveryEngine(context, service);
  const api = new BusinessDiscoveryApi(service);

  return {
    events,
    graph,
    store,
    repository,
    service,
    engine,
    api,
    capabilityManifest: BUSINESS_DISCOVERY_CAPABILITY_MANIFEST,
  };
}

export function registerBusinessDiscovery(
  runtime: BusinessDiscoveryRuntime,
  registry: EngineRegistry,
): void {
  const config = createBusinessDiscoveryEngineConfig();
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
