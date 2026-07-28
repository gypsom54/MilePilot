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
import { MARKET_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import type { MarketIntelligenceService } from "./service.js";

/**
 * Market Intelligence Engine — Volume 5.
 * Owns external market observations. Does not recommend strategy or overwrite Business Discovery.
 */
export class MarketIntelligenceEngine extends BaseIntelligenceEngine {
  readonly name = "market-intelligence";
  readonly purpose =
    "Represent external market understanding through structured, sourced and versioned evidence.";
  readonly version = "1.0.0";
  readonly inputs = [
    "tenant_context",
    "business_id_reference",
    "fixture_evidence",
    "imported_evidence",
  ];
  readonly outputs = [
    "market_profile",
    "market_category",
    "customer_problem",
    "desired_outcome",
    "demand_signal",
    "demand_theme",
    "competitor_candidate",
    "offer_observation",
    "market_gap",
    "trend",
    "seasonality_pattern",
    "market_source",
  ];
  readonly events = [
    "MarketDefined",
    "MarketScopeUpdated",
    "MarketCategoryCandidateCreated",
    "MarketCategoryConfirmed",
    "DemandSignalObserved",
    "DemandThemeCreated",
    "CustomerProblemObserved",
    "CompetitorCandidateDiscovered",
    "CompetitorCandidateConfirmed",
    "CompetitorCandidateDismissed",
    "OfferObserved",
    "MarketGapDetected",
    "MarketGapValidated",
    "MarketTrendObserved",
    "SeasonalityPatternObserved",
    "MarketEvidenceExpired",
    "MarketResearchCompleted",
    "MarketResearchPartiallyCompleted",
    "MarketResearchFailed",
  ];
  readonly dependencies: string[] = [];

  constructor(
    context: EngineContext,
    private readonly service: MarketIntelligenceService,
  ) {
    super(context);
  }

  async analyse(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.started("analyse");
    const operation = String(input.operation ?? "get_market");

    if (operation === "define") {
      const created = await this.service.defineMarket(
        input.market,
        typeof input.correlationId === "string"
          ? input.correlationId
          : undefined,
      );
      if (!created.ok) {
        this.context.logger.failed("define market failed", {
          code: created.error.code,
        });
        return created;
      }
      this.context.logger.completed("define market");
      return ok({
        profile: created.value,
        capabilityManifest: MARKET_INTELLIGENCE_CAPABILITY_MANIFEST,
        businessDiscoveryGuard: this.service.assertBusinessDiscoveryUntouched(
          created.value,
        ),
      });
    }

    const marketId = String(input.marketId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const profile = this.service.getMarket(marketId, tenantId || undefined);
    if (!profile.ok) {
      this.context.logger.failed("get market failed", {
        code: profile.error.code,
      });
      return profile;
    }
    this.context.logger.completed("analyse get");
    return ok({
      profile: profile.value,
      businessDiscoveryGuard: this.service.assertBusinessDiscoveryUntouched(
        profile.value,
      ),
    });
  }

  async recommend(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.recommendation(
      "Market Intelligence refuses strategic recommendations",
    );
    return err({
      code: "ENGINE_DOES_NOT_RECOMMEND",
      message:
        "Market Intelligence owns external market observations only. Opportunity Intelligence or Ask SEO AutoPilot owns strategic and optimisation decisions.",
      retryable: false,
    });
  }

  async automate(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.automation("automate started");
    const operation = String(input.operation ?? "");
    const marketId = String(input.marketId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const correlationId =
      typeof input.correlationId === "string" ? input.correlationId : undefined;

    if (operation === "confirm_category") {
      const result = await this.service.confirmCategory(
        marketId,
        tenantId,
        String(input.categoryId ?? ""),
        correlationId,
      );
      return result.ok ? ok({ profile: result.value }) : result;
    }

    if (operation === "expire_evidence") {
      const result = await this.service.expireEvidence(
        marketId,
        tenantId,
        typeof input.now === "string" ? input.now : undefined,
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
        capabilityManifestId: MARKET_INTELLIGENCE_CAPABILITY_MANIFEST.engine.id,
        excluded: [
          "crawler",
          "seo_scoring",
          "rankings",
          "content_generation",
          "ask_orchestration",
          "dashboards",
          "external_providers",
        ],
      },
    };
  }
}

export function createMarketIntelligenceEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "market-intelligence",
    version: "1.0.0",
    description: "Market Intelligence Engine",
    dependencies: [],
  });
}

export function createMarketIntelligenceEngineRegistration(
  context: EngineContext,
  service: MarketIntelligenceService,
): EngineRegistration {
  const engine: IntelligenceEngine = new MarketIntelligenceEngine(
    context,
    service,
  );
  const config = createMarketIntelligenceEngineConfig();
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
