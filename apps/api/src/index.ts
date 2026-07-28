/**
 * @seo-autopilot/api
 *
 * Sprint 1: composition root + Business Discovery API surface.
 * No dashboards. No SEO tools. No Ask orchestration.
 */
import {
  InMemoryEngineRegistry,
  type EngineRegistry,
} from "@seo-autopilot/engine-sdk";
import {
  createBusinessDiscoveryRuntime,
  registerBusinessDiscovery,
  type ApiRequest,
  type ApiResponse,
  type BusinessDiscoveryRuntime,
} from "@seo-autopilot/business-discovery";
import { InMemoryEventBus, type EventBus } from "@seo-autopilot/shared";

export interface PlatformRuntime {
  registry: EngineRegistry;
  events: EventBus;
  businessDiscovery: BusinessDiscoveryRuntime;
}

export function createPlatformRuntime(): PlatformRuntime {
  const events = new InMemoryEventBus();
  const registry = new InMemoryEngineRegistry();
  const businessDiscovery = createBusinessDiscoveryRuntime(events);
  registerBusinessDiscovery(businessDiscovery, registry);

  return {
    registry,
    events,
    businessDiscovery,
  };
}

export async function handleApiRequest(
  runtime: PlatformRuntime,
  request: ApiRequest,
): Promise<ApiResponse> {
  if (request.path.startsWith("/business-discovery")) {
    return runtime.businessDiscovery.api.handle(request);
  }

  return {
    status: 404,
    body: {
      error: {
        code: "NOT_FOUND",
        message: `${request.method} ${request.path}`,
      },
    },
  };
}

export type { ApiRequest, ApiResponse };
export const API_APP_STATUS = "business-discovery-sprint1" as const;
