/**
 * @seo-autopilot/api
 *
 * Sprint 3: Business Discovery + Market Intelligence + Website Intelligence.
 * No dashboards. No SEO tools. No Ask orchestration. No crawling.
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
import {
  createWebsiteIntelligenceRuntime,
  registerWebsiteIntelligence,
  type WebsiteIntelligenceRuntime,
} from "@seo-autopilot/website-intelligence";
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
  websiteIntelligence: WebsiteIntelligenceRuntime;
}

export function createPlatformRuntime(): PlatformRuntime {
  const events = new InMemoryEventBus();
  const registry = new InMemoryEngineRegistry();
  const businessDiscovery = createBusinessDiscoveryRuntime(events);
  registerBusinessDiscovery(businessDiscovery, registry);

  const marketIntelligence = createMarketIntelligenceRuntime(
    events,
    businessDiscovery.graph,
  );
  registerMarketIntelligence(marketIntelligence, registry);

  const websiteIntelligence = createWebsiteIntelligenceRuntime(
    events,
    businessDiscovery.graph,
  );
  registerWebsiteIntelligence(websiteIntelligence, registry);

  return {
    registry,
    events,
    businessDiscovery,
    marketIntelligence,
    websiteIntelligence,
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
  if (request.path.startsWith("/website-intelligence")) {
    return runtime.websiteIntelligence.api.handle(request);
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

export const API_APP_STATUS = "website-intelligence-sprint3" as const;
