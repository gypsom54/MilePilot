/**
 * @seo-autopilot/api
 *
 * Sprint 0: API shell placeholder only.
 * No HTTP routes, no SEO tools, no business endpoints.
 * Hosts composition roots for Engine Registry + Event Bus in later sprints.
 */
import {
  InMemoryEngineRegistry,
  type EngineRegistry,
} from "@seo-autopilot/engine-sdk";
import { InMemoryEventBus, type EventBus } from "@seo-autopilot/shared";

export interface PlatformRuntime {
  registry: EngineRegistry;
  events: EventBus;
}

export function createPlatformRuntime(): PlatformRuntime {
  return {
    registry: new InMemoryEngineRegistry(),
    events: new InMemoryEventBus(),
  };
}

export const API_APP_STATUS = "scaffold-only" as const;
