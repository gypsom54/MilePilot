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
import { WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import type { WebsiteIntelligenceService } from "./service.js";

export class WebsiteIntelligenceEngine extends BaseIntelligenceEngine {
  readonly name = "website-intelligence";
  readonly purpose =
    "Represent a business website structurally and semantically before crawling or optimisation begins.";
  readonly version = "1.0.0";
  readonly inputs = [
    "tenant_context",
    "business_id_reference",
    "fixture_observations",
    "injected_observations",
  ];
  readonly outputs = [
    "website_profile",
    "website_property",
    "page",
    "navigation",
    "page_section",
    "page_template",
    "website_snapshot",
  ];
  readonly events = [
    "WebsiteDefined",
    "WebsitePropertyAdded",
    "PageObserved",
    "PageTypeCandidateCreated",
    "PageTypeConfirmed",
    "PagePurposeCandidateCreated",
    "PagePurposeConfirmed",
    "PageHierarchyUpdated",
    "NavigationStructureUpdated",
    "PageSectionObserved",
    "PageTemplateAssociated",
    "BusinessEntityMapped",
    "MarketEntityMapped",
    "TopicAssociated",
    "QuestionAssociated",
    "ConversionActionObserved",
    "FormObserved",
    "TrustElementObserved",
    "WebsiteAssetObserved",
    "PagePublicationStateChanged",
    "WebsiteSnapshotCreated",
    "WebsiteImportStarted",
    "WebsiteImportCompleted",
    "WebsiteImportFailed",
  ];
  readonly dependencies: string[] = [];

  constructor(
    context: EngineContext,
    private readonly service: WebsiteIntelligenceService,
  ) {
    super(context);
  }

  async analyse(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.started("analyse");
    const operation = String(input.operation ?? "get_website");
    if (operation === "define") {
      const created = await this.service.defineWebsite(
        input.website,
        typeof input.correlationId === "string"
          ? input.correlationId
          : undefined,
      );
      if (!created.ok) {
        return created;
      }
      this.context.logger.completed("define website");
      return ok({
        profile: created.value,
        capabilityManifest: WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST,
        externalFactsGuard: this.service.assertExternalFactsUntouched(
          created.value,
        ),
      });
    }

    const websiteId = String(input.websiteId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const profile = this.service.getWebsite(websiteId, tenantId || undefined);
    if (!profile.ok) {
      return profile;
    }
    this.context.logger.completed("analyse get");
    return ok({
      profile: profile.value,
      externalFactsGuard: this.service.assertExternalFactsUntouched(
        profile.value,
      ),
    });
  }

  async recommend(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.recommendation(
      "Website Intelligence refuses optimisation requests",
    );
    return err({
      code: "ENGINE_DOES_NOT_RECOMMEND",
      message:
        "Website Intelligence owns structural and semantic website understanding only. It refuses optimisation, rewriting, scoring and strategy requests.",
      retryable: false,
    });
  }

  async automate(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    const operation = String(input.operation ?? "");
    const websiteId = String(input.websiteId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const pageId = String(input.pageId ?? "");
    const correlationId =
      typeof input.correlationId === "string" ? input.correlationId : undefined;

    if (operation === "confirm_page_type") {
      const result = await this.service.confirmPageType(
        websiteId,
        tenantId,
        pageId,
        correlationId,
      );
      return result.ok ? ok({ profile: result.value }) : result;
    }
    if (operation === "confirm_page_purpose") {
      const result = await this.service.confirmPagePurpose(
        websiteId,
        tenantId,
        pageId,
        correlationId,
      );
      return result.ok ? ok({ profile: result.value }) : result;
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
        capabilityManifestId: WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST.engine.id,
        excluded: [
          "crawler",
          "page_render",
          "cms_connection",
          "seo_scoring",
          "rankings",
          "performance_evaluation",
          "content_generation",
          "internal_link_recommendations",
          "opportunity_prioritisation",
          "dashboards",
          "ask_orchestration",
        ],
      },
    };
  }
}

export function createWebsiteIntelligenceEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "website-intelligence",
    version: "1.0.0",
    description: "Website Intelligence Engine",
    dependencies: [],
  });
}

export function createWebsiteIntelligenceEngineRegistration(
  context: EngineContext,
  service: WebsiteIntelligenceService,
): EngineRegistration {
  const engine: IntelligenceEngine = new WebsiteIntelligenceEngine(
    context,
    service,
  );
  const config = createWebsiteIntelligenceEngineConfig();
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
