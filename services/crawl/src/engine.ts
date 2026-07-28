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
import { CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
import type { CrawlIntelligenceService } from "./service.js";

export class CrawlIntelligenceEngine extends BaseIntelligenceEngine {
  readonly name = "crawl-intelligence";
  readonly purpose =
    "Preserve sourced, timestamped and immutable website observations without judging or optimising them.";
  readonly version = "1.0.0";
  readonly inputs = [
    "tenant_context",
    "website_id_reference",
    "property_id_reference",
    "fixture_observations",
    "injected_observations",
  ];
  readonly outputs = [
    "crawl_job",
    "crawl_observation",
    "crawl_snapshot",
    "snapshot_comparison",
  ];
  readonly events = [
    "CrawlJobCreated",
    "CrawlJobStarted",
    "CrawlJobCompleted",
    "CrawlJobFailed",
    "CrawlScopeValidated",
    "CrawlObservationRecorded",
    "CrawlFetchAttempted",
    "CrawlResponseObserved",
    "CrawlRedirectObserved",
    "CrawlFailureObserved",
    "CrawlSnapshotCreated",
    "CrawlSnapshotCompared",
    "PageCrawled",
  ];
  readonly dependencies: string[] = [];

  constructor(
    context: EngineContext,
    private readonly service: CrawlIntelligenceService,
  ) {
    super(context);
  }

  async analyse(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.started("analyse");
    const operation = String(input.operation ?? "get_job");
    if (operation === "create_job") {
      const created = await this.service.createJob(
        input.job,
        typeof input.correlationId === "string"
          ? input.correlationId
          : undefined,
      );
      if (!created.ok) return created;
      this.context.logger.completed("create crawl job");
      return ok({
        job: created.value,
        capabilityManifest: CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST,
        websiteIntelligenceGuard:
          this.service.assertWebsiteIntelligenceUntouched(created.value),
      });
    }

    const jobId = String(input.jobId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const job = this.service.getJob(jobId, tenantId || undefined);
    if (!job.ok) return job;
    this.context.logger.completed("analyse get");
    return ok({
      job: job.value,
      websiteIntelligenceGuard:
        this.service.assertWebsiteIntelligenceUntouched(job.value),
    });
  }

  async recommend(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    this.context.logger.recommendation(
      "Crawl Intelligence refuses SEO and optimisation requests",
    );
    return err({
      code: "ENGINE_DOES_NOT_RECOMMEND",
      message:
        "Crawl Intelligence observes crawl facts only and does not recommend SEO fixes, metadata optimisation, broken-link prioritisation, performance fixes, internal linking, content rewriting, or strategic actions.",
      retryable: false,
    });
  }

  async automate(input: EngineInput): Promise<EngineResult<EngineOutput>> {
    const operation = String(input.operation ?? "");
    const jobId = String(input.jobId ?? "");
    const tenantId = String(input.tenantId ?? "");
    const correlationId =
      typeof input.correlationId === "string" ? input.correlationId : undefined;

    if (operation === "create_snapshot") {
      const result = await this.service.createSnapshot(
        jobId,
        tenantId,
        String(input.label ?? "snapshot"),
        correlationId,
      );
      return result.ok ? ok({ job: result.value }) : result;
    }
    if (operation === "compare_snapshots") {
      const result = await this.service.compareSnapshots(
        jobId,
        tenantId,
        String(input.leftSnapshotId ?? ""),
        String(input.rightSnapshotId ?? ""),
        correlationId,
      );
      return result.ok ? ok({ job: result.value }) : result;
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
        capabilityManifestId: CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST.engine.id,
        excluded: [
          "live_http_crawler",
          "playwright",
          "chromium",
          "browser_rendering",
          "seo_scoring",
          "indexability_judgement",
          "accessibility_judgement",
          "performance_scoring",
          "content_quality_assessment",
          "broken_link_prioritisation",
          "internal_linking_recommendations",
          "content_rewriting",
          "rankings",
          "opportunity_prioritisation",
          "dashboards",
          "ask_orchestration",
          "website_intelligence_overwrite",
        ],
      },
    };
  }
}

export function createCrawlIntelligenceEngineConfig(): EngineConfig {
  return createDefaultEngineConfig({
    name: "crawl-intelligence",
    version: "1.0.0",
    description: "Crawl Intelligence Engine",
    dependencies: [],
  });
}

export function createCrawlIntelligenceEngineRegistration(
  context: EngineContext,
  service: CrawlIntelligenceService,
): EngineRegistration {
  const engine: IntelligenceEngine = new CrawlIntelligenceEngine(
    context,
    service,
  );
  const config = createCrawlIntelligenceEngineConfig();
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
