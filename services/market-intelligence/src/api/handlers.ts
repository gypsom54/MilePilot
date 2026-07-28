import type { EngineResult } from "@seo-autopilot/shared";
import { MARKET_INTELLIGENCE_CAPABILITY_MANIFEST } from "../capability-manifest.js";
import type { MarketIntelligenceService } from "../service.js";

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
      result.error.code === "MARKET_NOT_FOUND" ||
      result.error.code === "CATEGORY_NOT_FOUND" ||
      result.error.code === "COMPETITOR_NOT_FOUND" ||
      result.error.code === "GAP_NOT_FOUND"
        ? 404
        : result.error.code === "TENANT_ISOLATION_VIOLATION"
          ? 403
          : result.error.code === "VALIDATION_FAILED" ||
              result.error.code === "GAP_REQUIRES_EVIDENCE" ||
              result.error.code === "TREND_REQUIRES_MULTIPLE_OBSERVATIONS" ||
              result.error.code === "SEASONALITY_REQUIRES_MULTIPLE_OBSERVATIONS" ||
              result.error.code === "COMPETITOR_DISMISSED"
            ? 400
            : 422;
    return { status, body: { error: result.error } };
  }
  return { status: 200, body: result.value };
}

function correlationId(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }
  const value = (body as Record<string, unknown>).correlationId;
  return typeof value === "string" ? value : undefined;
}

/**
 * Market Intelligence API handlers (Volume 5).
 * No market reasoning in handlers — delegate to application services only.
 */
export class MarketIntelligenceApi {
  constructor(private readonly service: MarketIntelligenceService) {}

  async handle(request: ApiRequest): Promise<ApiResponse> {
    const { method, path } = request;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const corr = correlationId(request.body);

    if (method === "GET" && path === "/market-intelligence/manifest") {
      return { status: 200, body: MARKET_INTELLIGENCE_CAPABILITY_MANIFEST };
    }

    if (method === "GET" && path === "/market-intelligence/markets") {
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
      return { status: 200, body: this.service.listMarkets(tenantId) };
    }

    if (method === "POST" && path === "/market-intelligence/markets") {
      return fromResult(await this.service.defineMarket(request.body, corr));
    }

    const marketMatch = path.match(
      /^\/market-intelligence\/markets\/([^/]+)(.*)$/,
    );
    if (!marketMatch) {
      return {
        status: 404,
        body: { error: { code: "NOT_FOUND", message: path } },
      };
    }

    const marketId = decodeURIComponent(marketMatch[1] ?? "");
    const rest = marketMatch[2] ?? "";
    const tenantId = String(
      request.query?.tenantId ?? body.tenantId ?? "",
    );

    if (!tenantId && rest !== "") {
      return {
        status: 400,
        body: {
          error: {
            code: "VALIDATION_FAILED",
            message: "tenantId is required",
          },
        },
      };
    }

    if (method === "GET" && rest === "") {
      return fromResult(
        this.service.getMarket(marketId, tenantId || undefined),
      );
    }

    if (method === "GET" && rest === "/versions") {
      return fromResult(this.service.listVersions(marketId, tenantId));
    }

    if (method === "PATCH" && rest === "/scope") {
      return fromResult(
        await this.service.updateScope(marketId, tenantId, body as never, corr),
      );
    }

    if (method === "POST" && rest === "/sources") {
      return fromResult(
        await this.service.addSource(marketId, tenantId, body as never),
      );
    }

    if (method === "POST" && rest === "/categories") {
      return fromResult(
        await this.service.addCategoryCandidate(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    const confirmCategory = rest.match(/^\/categories\/([^/]+)\/confirm$/);
    if (method === "POST" && confirmCategory) {
      return fromResult(
        await this.service.confirmCategory(
          marketId,
          tenantId,
          decodeURIComponent(confirmCategory[1] ?? ""),
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/problems") {
      return fromResult(
        await this.service.addProblem(marketId, tenantId, body as never, corr),
      );
    }

    if (method === "POST" && rest === "/outcomes") {
      return fromResult(
        await this.service.addOutcome(marketId, tenantId, body as never),
      );
    }

    if (method === "POST" && rest === "/demand-signals") {
      return fromResult(
        await this.service.observeDemandSignal(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/demand-themes") {
      return fromResult(
        await this.service.createDemandTheme(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/questions") {
      return fromResult(
        await this.service.addQuestion(marketId, tenantId, body as never),
      );
    }

    if (method === "POST" && rest === "/competitors") {
      return fromResult(
        await this.service.discoverCompetitor(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    const confirmCompetitor = rest.match(/^\/competitors\/([^/]+)\/confirm$/);
    if (method === "POST" && confirmCompetitor) {
      return fromResult(
        await this.service.confirmCompetitor(
          marketId,
          tenantId,
          decodeURIComponent(confirmCompetitor[1] ?? ""),
          corr,
        ),
      );
    }

    const dismissCompetitor = rest.match(/^\/competitors\/([^/]+)\/dismiss$/);
    if (method === "POST" && dismissCompetitor) {
      return fromResult(
        await this.service.dismissCompetitor(
          marketId,
          tenantId,
          decodeURIComponent(dismissCompetitor[1] ?? ""),
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/offers") {
      return fromResult(
        await this.service.observeOffer(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/gaps") {
      return fromResult(
        await this.service.detectGap(marketId, tenantId, body as never, corr),
      );
    }

    const validateGap = rest.match(/^\/gaps\/([^/]+)\/validate$/);
    if (method === "POST" && validateGap) {
      return fromResult(
        await this.service.validateGap(
          marketId,
          tenantId,
          decodeURIComponent(validateGap[1] ?? ""),
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/trends") {
      return fromResult(
        await this.service.observeTrend(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/seasonality") {
      return fromResult(
        await this.service.observeSeasonality(
          marketId,
          tenantId,
          body as never,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/evidence/import") {
      const items = Array.isArray(body.items) ? body.items : [];
      return fromResult(
        await this.service.importEvidenceBatch(
          marketId,
          tenantId,
          items as never,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/evidence/expire") {
      return fromResult(
        await this.service.expireEvidence(
          marketId,
          tenantId,
          typeof body.now === "string" ? body.now : undefined,
          corr,
        ),
      );
    }

    if (method === "POST" && rest === "/research/complete") {
      return fromResult(
        await this.service.completeResearch(
          marketId,
          tenantId,
          "completed",
          corr,
          body,
        ),
      );
    }

    if (method === "POST" && rest === "/research/partial") {
      return fromResult(
        await this.service.completeResearch(
          marketId,
          tenantId,
          "partial",
          corr,
          body,
        ),
      );
    }

    if (method === "POST" && rest === "/research/fail") {
      return fromResult(
        await this.service.completeResearch(
          marketId,
          tenantId,
          "failed",
          corr,
          body,
        ),
      );
    }

    return {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: `${method} ${path}` } },
    };
  }
}
