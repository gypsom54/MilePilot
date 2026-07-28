/**
 * @seo-autopilot/api
 *
 * Sprint 2: composition root + Business Discovery + Market Intelligence APIs.
 * No dashboards. No SEO tools. No Ask orchestration.
 */
import {
  InMemoryEngineRegistry,
  type EngineRegistry,
} from "@seo-autopilot/engine-sdk";
import {
  createBusinessDiscoveryRuntime,
  registerBusinessDiscovery,
  type BusinessDiscoveryRuntime,
} from "@seo-autopilot/business-discovery";
import {
  createMarketIntelligenceRuntime,
  registerMarketIntelligence,
  type MarketIntelligenceRuntime,
} from "@seo-autopilot/market-intelligence";
import { InMemoryEventBus, type EventBus } from "@seo-autopilot/shared";

export interface ApiRequest {
  method: "GET" | "POST" | "PATCH";
  path: string;
  body?: unknown;
  query?: Record<string, string>;
  params?: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

export interface PlatformRuntime {
  registry: EngineRegistry;
  events: EventBus;
  businessDiscovery: BusinessDiscoveryRuntime;
  marketIntelligence: MarketIntelligenceRuntime;
}

export function createPlatformRuntime(): PlatformRuntime {
  const events = new InMemoryEventBus();
  const registry = new InMemoryEngineRegistry();
  const businessDiscovery = createBusinessDiscoveryRuntime(events);
  registerBusinessDiscovery(businessDiscovery, registry);

  // Share the same graph instance so both domains can coexist without BD overwrite.
  const marketIntelligence = createMarketIntelligenceRuntime(
    events,
    businessDiscovery.graph,
  );
  registerMarketIntelligence(marketIntelligence, registry);

  return {
    registry,
    events,
    businessDiscovery,
    marketIntelligence,
  };
}

export async function handleApiRequest(
  runtime: PlatformRuntime,
  request: ApiRequest,
): Promise<ApiResponse> {
  if (request.path.startsWith("/business-discovery")) {
    return runtime.businessDiscovery.api.handle(request);
  }
  if (request.path.startsWith("/market-intelligence")) {
    return runtime.marketIntelligence.api.handle(request);
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

export const API_APP_STATUS = "market-intelligence-sprint2" as const;
