import type { EngineResult } from "@seo-autopilot/shared";
import { KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST } from "../capability-manifest.js";
import type { KnowledgeGraphService } from "../service.js";

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
      result.error.code === "ENTITY_NOT_FOUND" ||
      result.error.code === "RELATIONSHIP_NOT_FOUND" ||
      result.error.code === "MERGE_PROPOSAL_NOT_FOUND" ||
      result.error.code === "NOT_FOUND"
        ? 404
        : result.error.code === "TENANT_ISOLATION_VIOLATION" ||
            result.error.code === "CROSS_ENGINE_MUTATION_FORBIDDEN"
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

export class KnowledgeGraphApi {
  constructor(private readonly service: KnowledgeGraphService) {}

  async handle(request: ApiRequest): Promise<ApiResponse> {
    const { method, path } = request;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const correlationId = corr(request.body);
    const tenantId = String(request.query?.tenantId ?? body.tenantId ?? "");

    if (method === "GET" && path === "/knowledge-graph/manifest") {
      return { status: 200, body: KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST };
    }

    if (method === "POST" && path === "/knowledge-graph/evidence") {
      return fromResult(
        await this.service.attachEvidence({
          tenantId,
          evidence: body.evidence as never,
          ...(typeof body.entityId === "string"
            ? { entityId: body.entityId }
            : {}),
          ...(typeof body.relationshipId === "string"
            ? { relationshipId: body.relationshipId }
            : {}),
          ...(correlationId !== undefined ? { correlationId } : {}),
        }),
      );
    }

    if (method === "POST" && path === "/knowledge-graph/entities/propose") {
      return fromResult(
        await this.service.proposeEntity({
          ...(body as Record<string, unknown>),
          tenantId,
          ...(correlationId !== undefined ? { correlationId } : {}),
        } as never),
      );
    }

    if (method === "GET" && path === "/knowledge-graph/entities") {
      if (!tenantId) {
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
      return { status: 200, body: this.service.listEntities(tenantId) };
    }

    if (method === "POST" && path === "/knowledge-graph/relationships/propose") {
      return fromResult(
        await this.service.proposeRelationship({
          ...(body as Record<string, unknown>),
          tenantId,
          ...(correlationId !== undefined ? { correlationId } : {}),
        } as never),
      );
    }

    if (method === "POST" && path === "/knowledge-graph/aliases") {
      return fromResult(
        await this.service.addAlias({
          tenantId,
          entityId: String(body.entityId ?? ""),
          value: String(body.value ?? ""),
          kind: String(body.kind ?? "name"),
          sourceEngine: String(body.sourceEngine ?? ""),
          ...(typeof body.observedAt === "string"
            ? { observedAt: body.observedAt }
            : {}),
          ...(correlationId !== undefined ? { correlationId } : {}),
        }),
      );
    }

    if (method === "POST" && path === "/knowledge-graph/duplicates/detect") {
      if (!tenantId) {
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
      return fromResult(this.service.detectDuplicates(tenantId, correlationId));
    }

    if (method === "POST" && path === "/knowledge-graph/merge-proposals") {
      return fromResult(
        await this.service.createMergeProposal({
          tenantId,
          sourceEntityId: String(body.sourceEntityId ?? ""),
          targetEntityId: String(body.targetEntityId ?? ""),
          reason: String(body.reason ?? ""),
          proposedBy: String(body.proposedBy ?? ""),
          ...(correlationId !== undefined ? { correlationId } : {}),
        }),
      );
    }

    if (method === "GET" && path === "/knowledge-graph/query/valid-at") {
      if (!tenantId) {
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
      const at = String(request.query?.at ?? body.at ?? new Date().toISOString());
      return {
        status: 200,
        body: this.service.queries.entitiesValidAt(tenantId, at),
      };
    }

    const entityMatch = path.match(
      /^\/knowledge-graph\/entities\/([^/]+)(.*)$/,
    );
    if (entityMatch) {
      const entityId = decodeURIComponent(entityMatch[1] ?? "");
      const rest = entityMatch[2] ?? "";
      if (method === "GET" && rest === "") {
        return fromResult(
          this.service.getEntity(entityId, tenantId || undefined),
        );
      }
      if (method === "GET" && rest === "/history") {
        const history = this.service.queries.getVersionHistory(entityId);
        if (!history) {
          return {
            status: 404,
            body: {
              error: {
                code: "ENTITY_NOT_FOUND",
                message: entityId,
              },
            },
          };
        }
        return {
          status: 200,
          body: {
            versionHistory: history,
            provenance: this.service.queries.getProvenanceChain(entityId),
            confidenceHistory:
              this.service.queries.getConfidenceHistory(entityId),
          },
        };
      }
      if (method === "GET" && rest === "/evidence") {
        return {
          status: 200,
          body: this.service.queries.getEvidenceChain(entityId),
        };
      }
    }

    const relMatch = path.match(/^\/knowledge-graph\/relationships\/([^/]+)$/);
    if (relMatch && method === "GET") {
      const relationshipId = decodeURIComponent(relMatch[1] ?? "");
      return fromResult(
        this.service.getRelationship(relationshipId, tenantId || undefined),
      );
    }

    const mergeMatch = path.match(
      /^\/knowledge-graph\/merge-proposals\/([^/]+)\/(confirm|reject)$/,
    );
    if (mergeMatch && method === "POST") {
      const proposalId = decodeURIComponent(mergeMatch[1] ?? "");
      const action = mergeMatch[2];
      const actor = String(body.actor ?? body.confirmedBy ?? body.rejectedBy ?? "system");
      if (!tenantId) {
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
      if (action === "confirm") {
        return fromResult(
          await this.service.confirmMerge(
            tenantId,
            proposalId,
            actor,
            correlationId,
          ),
        );
      }
      return fromResult(
        await this.service.rejectMerge(
          tenantId,
          proposalId,
          actor,
          correlationId,
        ),
      );
    }

    return {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: path } },
    };
  }
}
