export type {
  EngineInput,
  EngineOutput,
  EngineHealth,
  IntelligenceEngine,
  EngineContext,
  EngineFactory,
} from "./intelligence-engine.js";
export { BaseIntelligenceEngine } from "./intelligence-engine.js";

export type { EngineRegistration, EngineRegistry } from "./registry.js";
export { InMemoryEngineRegistry } from "./registry.js";

/** Re-export event bus from shared for a single engine import surface */
export {
  InMemoryEventBus,
  type EventBus,
  PlatformEventName,
  type PlatformEvent,
} from "@seo-autopilot/shared";

export type {
  CapabilityManifest,
  CapabilityManifestEngine,
} from "./capability-manifest.js";
