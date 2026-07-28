import type { EngineResult } from "@seo-autopilot/shared";
import { FixtureCrawlAdapter } from "../adapters/fixture-adapter.js";
import { InjectedCrawlAdapter } from "../adapters/injected-adapter.js";
import type { AdapterObservation } from "../adapters/types.js";
import { CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST } from "../capability-manifest.js";
import type { CrawlIntelligenceService } from "../service.js";

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
      result.error.code === "CRAWL_JOB_NOT_FOUND" ||
      result.error.code === "SNAPSHOT_NOT_FOUND" ||
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

function asObservations(value: unknown): AdapterObservation[] {
  if (!Array.isArray(value)) return [];
  return value as AdapterObservation[];
}

export class CrawlIntelligenceApi {
  constructor(private readonly service: CrawlIntelligenceService) {}

  async handle(request: ApiRequest): Promise<ApiResponse> {
    const { method, path } = request;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const correlationId = corr(request.body);

    if (method === "GET" && path === "/crawl-intelligence/manifest") {
      return { status: 200, body: CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST };
    }

    if (method === "GET" && path === "/crawl-intelligence/jobs") {
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
      return { status: 200, body: this.service.listJobs(tenantId) };
    }

    if (method === "POST" && path === "/crawl-intelligence/jobs") {
      return fromResult(await this.service.createJob(request.body, correlationId));
    }

    const match = path.match(/^\/crawl-intelligence\/jobs\/([^/]+)(.*)$/);
    if (!match) {
      return {
        status: 404,
        body: { error: { code: "NOT_FOUND", message: path } },
      };
    }

    const jobId = decodeURIComponent(match[1] ?? "");
    const rest = match[2] ?? "";
    const tenantId = String(request.query?.tenantId ?? body.tenantId ?? "");

    if (method === "GET" && rest === "") {
      return fromResult(this.service.getJob(jobId, tenantId || undefined));
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
      return fromResult(this.service.listVersions(jobId, tenantId));
    }

    if (method === "POST" && rest === "/start") {
      const current = this.service.getJob(jobId, tenantId);
      if (!current.ok) return fromResult(current);
      // Start is expressed by importing observations via an adapter.
      return {
        status: 200,
        body: {
          jobId,
          status: current.value.status,
          message:
            "Use POST /import with fixture or injected observations to run the job",
        },
      };
    }

    if (method === "POST" && rest === "/observations") {
      const attemptNumber =
        typeof body.attemptNumber === "number" ? body.attemptNumber : undefined;
      return fromResult(
        await this.service.recordObservation(
          jobId,
          tenantId,
          {
            kind: body.kind as never,
            sourceId: String(body.sourceId ?? ""),
            observedAt: String(body.observedAt ?? ""),
            originalUrl: String(body.originalUrl ?? ""),
            payload: (body.payload as Record<string, unknown>) ?? {},
            ...(attemptNumber !== undefined ? { attemptNumber } : {}),
          },
          correlationId,
        ),
      );
    }

    if (method === "POST" && rest === "/import") {
      const observations = asObservations(body.observations);
      const adapterKind = String(body.adapterKind ?? "fixture");
      const adapter =
        adapterKind === "injected"
          ? new InjectedCrawlAdapter(async function* () {
              for (const item of observations) yield item;
            })
          : new FixtureCrawlAdapter(observations);
      return fromResult(
        await this.service.importFromAdapter(
          jobId,
          tenantId,
          adapter,
          correlationId,
        ),
      );
    }

    if (method === "POST" && rest === "/snapshots") {
      return fromResult(
        await this.service.createSnapshot(
          jobId,
          tenantId,
          String(body.label ?? "snapshot"),
          correlationId,
        ),
      );
    }

    if (method === "POST" && rest === "/snapshots/compare") {
      return fromResult(
        await this.service.compareSnapshots(
          jobId,
          tenantId,
          String(body.leftSnapshotId ?? ""),
          String(body.rightSnapshotId ?? ""),
          correlationId,
        ),
      );
    }

    const snapshotMatch = rest.match(/^\/snapshots\/([^/]+)$/);
    if (snapshotMatch && method === "GET") {
      const snapshotId = decodeURIComponent(snapshotMatch[1] ?? "");
      return fromResult(
        this.service.getSnapshot(jobId, tenantId, snapshotId),
      );
    }

    return {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: path } },
    };
  }
}
