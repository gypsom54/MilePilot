import type { EngineResult } from "@seo-autopilot/shared";
import { WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST } from "../capability-manifest.js";
import type { WebsiteIntelligenceService } from "../service.js";

export interface ApiRequest {
  method: "GET" | "POST" | "PATCH";
  path: string;
  body?: unknown;
  query?: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

function fromResult<T>(result: EngineResult<T>): ApiResponse {
  if (!result.ok) {
    const status =
      result.error.code === "WEBSITE_NOT_FOUND" ||
      result.error.code === "PAGE_NOT_FOUND" ||
      result.error.code === "PROPERTY_NOT_FOUND" ||
      result.error.code === "NOT_FOUND"
        ? 404
        : result.error.code === "TENANT_ISOLATION_VIOLATION"
          ? 403
          : 400;
    return { status, body: { error: result.error } };
  }
  return { status: 200, body: result.value };
}

function corr(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as Record<string, unknown>).correlationId;
  return typeof value === "string" ? value : undefined;
}

export class WebsiteIntelligenceApi {
  constructor(private readonly service: WebsiteIntelligenceService) {}

  async handle(request: ApiRequest): Promise<ApiResponse> {
    const { method, path } = request;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const correlationId = corr(request.body);

    if (method === "GET" && path === "/website-intelligence/manifest") {
      return { status: 200, body: WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST };
    }

    if (method === "GET" && path === "/website-intelligence/websites") {
      const tenantId = request.query?.tenantId ?? "";
      if (!tenantId) {
        return {
          status: 400,
          body: {
            error: {
              code: "VALIDATION_FAILED",
              message: "tenantId query parameter is required",
            },
          },
        };
      }
      return { status: 200, body: this.service.listWebsites(tenantId) };
    }

    if (method === "POST" && path === "/website-intelligence/websites") {
      return fromResult(
        await this.service.defineWebsite(request.body, correlationId),
      );
    }

    const match = path.match(/^\/website-intelligence\/websites\/([^/]+)(.*)$/);
    if (!match) {
      return {
        status: 404,
        body: { error: { code: "NOT_FOUND", message: path } },
      };
    }

    const websiteId = decodeURIComponent(match[1] ?? "");
    const rest = match[2] ?? "";
    const tenantId = String(request.query?.tenantId ?? body.tenantId ?? "");

    if (method === "GET" && rest === "") {
      return fromResult(
        this.service.getWebsite(websiteId, tenantId || undefined),
      );
    }
    if (!tenantId) {
      return {
        status: 400,
        body: {
          error: { code: "VALIDATION_FAILED", message: "tenantId is required" },
        },
      };
    }

    if (method === "GET" && rest === "/versions") {
      return fromResult(this.service.listVersions(websiteId, tenantId));
    }
    if (method === "POST" && rest === "/properties") {
      return fromResult(
        await this.service.addProperty(
          websiteId,
          tenantId,
          body as never,
          correlationId,
        ),
      );
    }
    if (method === "POST" && rest === "/pages") {
      return fromResult(
        await this.service.observePage(
          websiteId,
          tenantId,
          body as never,
          correlationId,
        ),
      );
    }

    const pageMatch = rest.match(/^\/pages\/([^/]+)(.*)$/);
    if (pageMatch) {
      const pageId = decodeURIComponent(pageMatch[1] ?? "");
      const pageRest = pageMatch[2] ?? "";

      if (method === "POST" && pageRest === "/type/confirm") {
        return fromResult(
          await this.service.confirmPageType(
            websiteId,
            tenantId,
            pageId,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/purpose/confirm") {
        return fromResult(
          await this.service.confirmPagePurpose(
            websiteId,
            tenantId,
            pageId,
            correlationId,
          ),
        );
      }
      if (method === "PATCH" && pageRest === "/hierarchy") {
        return fromResult(
          await this.service.updateHierarchy(
            websiteId,
            tenantId,
            pageId,
            (body.parentPageId as string | null | undefined) ?? null,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/sections") {
        return fromResult(
          await this.service.addSection(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/template") {
        return fromResult(
          await this.service.associateTemplate(
            websiteId,
            tenantId,
            pageId,
            String(body.templateId ?? ""),
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/business-mappings") {
        return fromResult(
          await this.service.mapBusinessEntity(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/market-mappings") {
        return fromResult(
          await this.service.mapMarketEntity(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/topics") {
        return fromResult(
          await this.service.associateTopic(
            websiteId,
            tenantId,
            pageId,
            String(body.topicId ?? ""),
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/questions") {
        return fromResult(
          await this.service.associateQuestion(
            websiteId,
            tenantId,
            pageId,
            String(body.questionId ?? ""),
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/conversion-actions") {
        return fromResult(
          await this.service.addConversionAction(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/forms") {
        return fromResult(
          await this.service.addForm(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/trust-elements") {
        return fromResult(
          await this.service.addTrustElement(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/assets") {
        return fromResult(
          await this.service.addAsset(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
      if (method === "POST" && pageRest === "/publication-state") {
        return fromResult(
          await this.service.changePublicationState(
            websiteId,
            tenantId,
            pageId,
            body as never,
            correlationId,
          ),
        );
      }
    }

    if (method === "POST" && rest === "/navigations") {
      return fromResult(
        await this.service.addNavigation(
          websiteId,
          tenantId,
          body as never,
          correlationId,
        ),
      );
    }
    if (method === "POST" && rest === "/templates") {
      return fromResult(
        await this.service.addTemplate(websiteId, tenantId, body as never),
      );
    }
    if (method === "POST" && rest === "/snapshots") {
      return fromResult(
        await this.service.createSnapshot(
          websiteId,
          tenantId,
          body as never,
          correlationId,
        ),
      );
    }
    if (method === "POST" && rest === "/imports") {
      return fromResult(
        await this.service.importPages(
          websiteId,
          tenantId,
          body as never,
          correlationId,
        ),
      );
    }

    return {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: `${method} ${path}` } },
    };
  }
}
