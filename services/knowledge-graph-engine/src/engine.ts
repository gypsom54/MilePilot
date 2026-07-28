import {
  BaseIntelligenceEngine,
  type EngineContext,
  type EngineHealth,
  type EngineInput,
  type EngineOutput,
  type EngineRegistration,
  type IntelligenceEngine,
} from "@seo-autopilot/engine-sdk";
import {
  createDefaultEngineConfig,
  err,
  ok,
  type EngineConfig,
  type EngineResult,
} from "@seo-autopilot/shared";
import { KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import type { KnowledgeGraphService } from "./service.js";

export class KnowledgeGraphEngine extends BaseIntelligenceEngine {
  readonly name = "knowledge-graph";
  readonly purpose =
    "Provide canonical semantic memory with evidence, provenance, identity and confirmed merges only.";
  readonly version = "1.0.0";
  readonly inputs = [
    "tenant_context",
    "engine_proposals",
    "evidence_references",
  ];
  readonly outputs = [
    "canonical_entity",
    "canonical_relationship",
    "merge_proposal",
    "duplicate_candidate",
  ];
  readonly events = [
    "KnowledgeEntityProposed",
    "KnowledgeEntityCreated",
    "KnowledgeEntityUpdated",
    "KnowledgeRelationshipCreated",
    "KnowledgeRelationshipUpdated",
    "KnowledgeAliasAdded",
    "KnowledgeEvidenceAttached",
    "KnowledgeDuplicateDetected",
    "KnowledgeMergeProposed",
    "KnowledgeMergeConfirmed",
    "KnowledgeMergeRejected",
    "KnowledgeVersionRecorded",
  ];
  readonly dependencies: string[] = [];

  constructor(
    context: EngineContext,
    private readonly service: KnowledgeGraphService,
  ) {
    super(context);
  }

  async analyse(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.started("analyse");
    const operation = String(input.operation ?? "get_entity");
    if (operation === "propose_entity") {
      const created = await this.service.proposeEntity(input.entity as never);
      if (!created.ok) return created;
      this.context.logger.completed("propose entity");
      return ok({
        entity: created.value,
        capabilityManifest: KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST,
      });
    }
    const entityId = String(input.entityId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const entity = this.service.getEntity(entityId, tenantId || undefined);
    if (!entity.ok) return entity;
    this.context.logger.completed("analyse get");
    return ok({ entity: entity.value });
  }

  async recommend(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.recommendation(
      "Knowledge Graph Engine refuses recommendations",
    );
    return err({
      code: "ENGINE_DOES_NOT_RECOMMEND",
      message:
        "Knowledge Graph Engine owns canonical semantic memory only. It refuses SEO, opportunity scoring, strategy and optimisation recommendations.",
      retryable: false,
    });
  }

  async automate(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    const operation = String(input.operation ?? "");
    const tenantId = String(input.tenantId ?? "");
    const proposalId = String(input.proposalId ?? "");
    const actor = String(input.actor ?? "system");
    const correlationId =
      typeof input.correlationId === "string" ? input.correlationId : undefined;

    if (operation === "confirm_merge") {
      const result = await this.service.confirmMerge(
        tenantId,
        proposalId,
        actor,
        correlationId,
      );
      return result.ok ? ok(result.value) : result;
    }
    if (operation === "reject_merge") {
      const result = await this.service.rejectMerge(
        tenantId,
        proposalId,
        actor,
        correlationId,
      );
      return result.ok ? ok({ proposal: result.value }) : result;
    }
    return err({
      code: "UNSUPPORTED_AUTOMATION",
      message: `Unsupported automate operation: ${operation}`,
      retryable: false,
    });
  }

  async health(): Promise<EngineHealth> {
    return {
      status: "healthy",
      checkedAt: new Date().toISOString(),
      details: {
        version: this.version,
        capabilityManifestId: KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST.engine.id,
        excluded: [
          "seo_logic",
          "crawl_logic",
          "website_logic",
          "business_logic",
          "market_logic",
          "recommendations",
          "opportunity_scoring",
          "dashboards",
          "ask_orchestration",
          "automatic_ai_merges",
        ],
      },
    };
  }
}

export function createKnowledgeGraphEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "knowledge-graph",
    version: "1.0.0",
    description: "Knowledge Graph Engine",
    dependencies: [],
  });
}

export function createKnowledgeGraphEngineRegistration(
  context: EngineContext,
  service: KnowledgeGraphService,
): EngineRegistration {
  const engine: IntelligenceEngine = new KnowledgeGraphEngine(context, service);
  const config = createKnowledgeGraphEngineConfig();
  return {
    name: engine.name,
    version: engine.version,
    description: config.description,
    dependencies: [...engine.dependencies],
    events: [...engine.events],
    status: config.status,
    engine,
    config,
  };
}
