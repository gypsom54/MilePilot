import type { EngineContext, EngineRegistry } from "@seo-autopilot/engine-sdk";
import { InMemoryCanonicalKnowledgeStore } from "@seo-autopilot/knowledge-graph";
import {
  InMemoryEventBus,
  StructuredEngineLogger,
  type EventBus,
} from "@seo-autopilot/shared";
import { KnowledgeGraphApi } from "./api/handlers.js";
import { KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import {
  createKnowledgeGraphEngineConfig,
  KnowledgeGraphEngine,
} from "./engine.js";
import { KnowledgeGraphService } from "./service.js";

export interface KnowledgeGraphRuntime {
  events: EventBus;
  store: InMemoryCanonicalKnowledgeStore;
  service: KnowledgeGraphService;
  engine: KnowledgeGraphEngine;
  api: KnowledgeGraphApi;
  capabilityManifest: typeof KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST;
}

export function createKnowledgeGraphRuntime(
  events: EventBus = new InMemoryEventBus(),
): KnowledgeGraphRuntime {
  const store = new InMemoryCanonicalKnowledgeStore();
  const service = new KnowledgeGraphService(store, events);
  const config = createKnowledgeGraphEngineConfig();
  const context: EngineContext = {
    config,
    events,
    logger: new StructuredEngineLogger(config.name),
  };
  const engine = new KnowledgeGraphEngine(context, service);
  const api = new KnowledgeGraphApi(service);

  return {
    events,
    store,
    service,
    engine,
    api,
    capabilityManifest: KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST,
  };
}

export function registerKnowledgeGraphEngine(
  runtime: KnowledgeGraphRuntime,
  registry: EngineRegistry,
): void {
  const config = createKnowledgeGraphEngineConfig();
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
