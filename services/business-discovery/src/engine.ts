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
import { BUSINESS_DISCOVERY_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import type { BusinessDiscoveryService } from "./service.js";

/**
 * Business Discovery Engine — Volume 4.
 * Owns business understanding. Does not optimise, score SEO, or write content.
 */
export class BusinessDiscoveryEngine extends BaseIntelligenceEngine {
  readonly name = "business-discovery";
  readonly purpose =
    "Build the canonical Business Profile that every other engine relies upon.";
  readonly version = "1.0.0";
  readonly inputs = [
    "user_business_input",
    "confirmed_enrichment",
    "business_id",
  ];
  readonly outputs = [
    "business_profile",
    "brand_profile",
    "audience_profile",
    "goal_registry",
    "expertise_map",
    "trust_profile",
    "digital_asset_registry",
    "competitor_seeds",
    "customer_question_bank",
    "constraint_registry",
    "preference_registry",
  ];
  readonly events = [
    "BusinessCreated",
    "BusinessUpdated",
    "WebsiteConnected",
    "ServiceAdded",
    "AudienceChanged",
    "GoalAdded",
    "GoalCompleted",
    "CompetitorSeedAdded",
    "ConstraintUpdated",
    "BrandProfileUpdated",
  ];
  readonly dependencies: string[] = [];

  constructor(
    context: EngineContext,
    private readonly service: BusinessDiscoveryService,
  ) {
    super(context);
  }

  /**
   * Analyse = validate input / propose enrichments / return profile understanding.
   * Never silently mutates canonical knowledge without confirmation paths.
   */
  async analyse(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.started("analyse");

    const operation = String(input.operation ?? "get_profile");

    if (operation === "create") {
      const created = await this.service.createBusiness(input.business);
      if (!created.ok) {
        this.context.logger.failed("analyse create failed", {
          code: created.error.code,
        });
        return created;
      }
      this.context.logger.completed("analyse create");
      return ok({
        profile: created.value,
        capabilityManifest: BUSINESS_DISCOVERY_CAPABILITY_MANIFEST,
      });
    }

    if (operation === "enrich") {
      const businessId = String(input.businessId ?? "");
      const result = await this.service.analyseEnrichment(businessId);
      if (!result.ok) {
        this.context.logger.failed("analyse enrich failed", {
          code: result.error.code,
        });
        return result;
      }
      this.context.logger.completed("analyse enrich");
      return ok({ suggestions: result.value.suggestions });
    }

    const businessId = String(input.businessId ?? "");
    const profile = this.service.getBusiness(businessId);
    if (!profile.ok) {
      this.context.logger.failed("analyse get failed", {
        code: profile.error.code,
      });
      return profile;
    }
    this.context.logger.completed("analyse get");
    return ok({ profile: profile.value });
  }

  /**
   * Business Discovery does not produce optimisation recommendations (Volume 4).
   */
  async recommend(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.recommendation(
      "Business Discovery does not produce optimisation recommendations",
    );
    return err({
      code: "ENGINE_DOES_NOT_RECOMMEND",
      message:
        "Business Discovery owns understanding only. No optimisation recommendations.",
      retryable: false,
    });
  }

  /**
   * Automate = apply confirmed mutations (create already via analyse, confirm enrichment, structured updates).
   */
  async automate(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.automation("automate started");
    const operation = String(input.operation ?? "");

    if (operation === "confirm_enrichment") {
      const result = await this.service.confirmEnrichment(
        String(input.businessId ?? ""),
        String(input.suggestionId ?? ""),
      );
      if (!result.ok) {
        this.context.logger.failed("confirm enrichment failed", {
          code: result.error.code,
        });
        return result;
      }
      this.context.logger.completed("confirm enrichment");
      return ok({ profile: result.value });
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
        capabilityManifestId: BUSINESS_DISCOVERY_CAPABILITY_MANIFEST.engine.id,
      },
    };
  }
}

export function createBusinessDiscoveryEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "business-discovery",
    version: "1.0.0",
    description: "Business Discovery Intelligence Engine",
    dependencies: [],
  });
}

export function createBusinessDiscoveryEngineRegistration(
  context: EngineContext,
  service: BusinessDiscoveryService,
): EngineRegistration {
  const engine: IntelligenceEngine = new BusinessDiscoveryEngine(
    context,
    service,
  );
  const config = createBusinessDiscoveryEngineConfig();
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
