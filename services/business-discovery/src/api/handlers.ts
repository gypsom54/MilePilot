import type { EngineResult } from "@seo-autopilot/shared";
import { BUSINESS_DISCOVERY_CAPABILITY_MANIFEST } from "../capability-manifest.js";
import type { BusinessProfile } from "../domain/types.js";
import type { BusinessDiscoveryService } from "../service.js";

export interface ApiRequest {
  method: "GET" | "POST" | "PATCH";
  path: string;
  body?: unknown;
  params?: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

function fromResult<T>(result: EngineResult<T>): ApiResponse {
  if (!result.ok) {
    const status =
      result.error.code === "BUSINESS_NOT_FOUND" ||
      result.error.code === "GOAL_NOT_FOUND" ||
      result.error.code === "ENRICHMENT_NOT_FOUND"
        ? 404
        : result.error.code === "VALIDATION_FAILED"
          ? 400
          : 422;
    return { status, body: { error: result.error } };
  }
  return { status: 200, body: result.value };
}

/**
 * Business Discovery API handlers (Volume 4 / Sprint 1).
 * No dashboard. No SEO endpoints.
 */
export class BusinessDiscoveryApi {
  constructor(private readonly service: BusinessDiscoveryService) {}

  async handle(request: ApiRequest): Promise<ApiResponse> {
    const { method, path } = request;

    if (method === "GET" && path === "/business-discovery/manifest") {
      return { status: 200, body: BUSINESS_DISCOVERY_CAPABILITY_MANIFEST };
    }

    if (method === "GET" && path === "/business-discovery/businesses") {
      return { status: 200, body: this.service.listBusinesses() };
    }

    if (method === "POST" && path === "/business-discovery/businesses") {
      return fromResult(await this.service.createBusiness(request.body));
    }

    const businessMatch = path.match(
      /^\/business-discovery\/businesses\/([^/]+)(.*)$/,
    );
    if (!businessMatch) {
      return { status: 404, body: { error: { code: "NOT_FOUND", message: path } } };
    }

    const businessId = decodeURIComponent(businessMatch[1] ?? "");
    const rest = businessMatch[2] ?? "";

    if (method === "GET" && rest === "") {
      return fromResult(this.service.getBusiness(businessId));
    }

    if (method === "GET" && rest === "/versions") {
      return fromResult(this.service.listVersions(businessId));
    }

    if (method === "PATCH" && rest === "/brand") {
      return fromResult(
        await this.service.updateBrand(
          businessId,
          (request.body ?? {}) as {
            tone?: string;
            uniqueSellingProposition?: string;
            positioning?: string;
            writingStyle?: string;
          },
        ),
      );
    }

    if (method === "POST" && rest === "/services") {
      return fromResult(
        await this.service.addService(
          businessId,
          (request.body ?? {}) as {
            name: string;
            description?: string;
            category?: string;
          },
        ),
      );
    }

    if (method === "PATCH" && rest === "/audience") {
      const body = (request.body ?? {}) as { primaryAudience?: string };
      return fromResult(
        await this.service.updateAudience(
          businessId,
          String(body.primaryAudience ?? ""),
        ),
      );
    }

    if (method === "POST" && rest === "/goals") {
      return fromResult(
        await this.service.addGoal(
          businessId,
          (request.body ?? {}) as {
            statement: string;
            priority?: number;
            timeHorizon?: string;
            successMetric?: string;
            owner?: string;
          },
        ),
      );
    }

    const completeGoal = rest.match(/^\/goals\/([^/]+)\/complete$/);
    if (method === "POST" && completeGoal) {
      return fromResult(
        await this.service.completeGoal(
          businessId,
          decodeURIComponent(completeGoal[1] ?? ""),
        ),
      );
    }

    if (method === "POST" && rest === "/competitors") {
      return fromResult(
        await this.service.addCompetitorSeed(
          businessId,
          (request.body ?? {}) as {
            name: string;
            website?: string;
            relevanceConfidence?: number;
          },
        ),
      );
    }

    if (method === "POST" && rest === "/constraints") {
      return fromResult(
        await this.service.addConstraint(
          businessId,
          (request.body ?? {}) as { kind: string; description: string },
        ),
      );
    }

    if (method === "POST" && rest === "/questions") {
      return fromResult(
        await this.service.addQuestion(
          businessId,
          (request.body ?? {}) as {
            category: "faq" | "sales" | "support" | "objection" | "misconception";
            question: string;
          },
        ),
      );
    }

    if (method === "POST" && rest === "/enrichment") {
      return fromResult(await this.service.analyseEnrichment(businessId));
    }

    if (method === "POST" && rest === "/enrichment/confirm") {
      const body = (request.body ?? {}) as { suggestionId?: string };
      return fromResult(
        await this.service.confirmEnrichment(
          businessId,
          String(body.suggestionId ?? ""),
        ),
      );
    }

    return {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: `${method} ${path}` } },
    };
  }
}

export type { BusinessProfile };
