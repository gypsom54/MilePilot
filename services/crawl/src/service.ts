import { createHash, randomUUID } from "node:crypto";
import type { EventBus } from "@seo-autopilot/shared";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type { CrawlAdapter } from "./adapters/types.js";
import { redactPayload } from "./domain/redaction.js";
import type {
  CrawlJob,
  CrawlObservation,
  CrawlSnapshot,
  CreateCrawlJobInput,
  FactualChange,
  ObservationKind,
} from "./domain/types.js";
import { PlatformEventName, publishCrawlEvent } from "./events/publish.js";
import type { CrawlJobRepository } from "./repository/crawl-job-repository.js";
import { validateUrlAgainstScope } from "./validation/scope.js";

function idempotencyKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export class CrawlIntelligenceService {
  constructor(
    private readonly repository: CrawlJobRepository,
    private readonly events: EventBus,
  ) {}

  assertWebsiteIntelligenceUntouched(job: CrawlJob): {
    websiteId: string | undefined;
    propertyId: string | undefined;
    mutatedWebsiteIntelligence: false;
  } {
    return {
      websiteId: job.websiteId,
      propertyId: job.propertyId,
      mutatedWebsiteIntelligence: false,
    };
  }

  async createJob(
    rawInput: unknown,
    correlationId?: string,
  ): Promise<EngineResult<CrawlJob>> {
    if (!rawInput || typeof rawInput !== "object") {
      return err({
        code: "VALIDATION_FAILED",
        message: "Create crawl job input must be an object",
        retryable: false,
      });
    }
    const input = rawInput as CreateCrawlJobInput;
    if (!input.tenantId || !input.scope || !input.source) {
      return err({
        code: "VALIDATION_FAILED",
        message: "tenantId, scope and source are required",
        retryable: false,
      });
    }
    if (!["production", "staging", "other"].includes(input.scope.environment)) {
      return err({
        code: "VALIDATION_FAILED",
        message: "scope.environment must be production, staging, or other",
        retryable: false,
      });
    }
    if (!input.scope.allowedHosts?.length) {
      return err({
        code: "VALIDATION_FAILED",
        message: "scope.allowedHosts is required",
        retryable: false,
      });
    }

    const now = new Date().toISOString();
    const job: CrawlJob = {
      id: randomUUID(),
      tenantId: input.tenantId,
      ...(input.websiteId !== undefined ? { websiteId: input.websiteId } : {}),
      ...(input.propertyId !== undefined ? { propertyId: input.propertyId } : {}),
      status: "draft",
      version: 1,
      createdAt: now,
      updatedAt: now,
      scope: {
        allowedHosts: input.scope.allowedHosts.map((host) => host.toLowerCase()),
        allowedProtocols: input.scope.allowedProtocols ?? ["http", "https"],
        includePathPrefixes: input.scope.includePathPrefixes ?? [],
        excludePathPrefixes: input.scope.excludePathPrefixes ?? [],
        environment: input.scope.environment,
      },
      source: {
        id: input.source.id ?? randomUUID(),
        kind: input.source.kind,
        label: input.source.label,
      },
      observations: [],
      snapshots: [],
      comparisons: [],
      importKeys: [],
    };

    const saved = await this.repository.saveNew(job);
    if (!saved.ok) return saved;

    await publishCrawlEvent(
      this.events,
      PlatformEventName.CrawlJobCreated,
      {
        jobId: saved.value.id,
        tenantId: saved.value.tenantId,
        sourceId: saved.value.source.id,
        websiteId: saved.value.websiteId ?? null,
      },
      correlationId,
    );
    await publishCrawlEvent(
      this.events,
      PlatformEventName.CrawlScopeValidated,
      {
        jobId: saved.value.id,
        environment: saved.value.scope.environment,
        allowedHosts: saved.value.scope.allowedHosts,
      },
      correlationId,
    );
    return saved;
  }

  getJob(jobId: string, tenantId?: string): EngineResult<CrawlJob> {
    return this.repository.get(jobId, tenantId);
  }

  listJobs(tenantId: string): CrawlJob[] {
    return this.repository.listByTenant(tenantId);
  }

  listVersions(jobId: string, tenantId?: string): EngineResult<number[]> {
    const existing = this.repository.get(jobId, tenantId);
    if (!existing.ok) return existing;
    return ok(this.repository.listVersions(jobId));
  }

  async recordObservation(
    jobId: string,
    tenantId: string,
    input: {
      kind: ObservationKind;
      sourceId: string;
      observedAt: string;
      originalUrl: string;
      payload?: Record<string, unknown>;
      attemptNumber?: number;
    },
    correlationId?: string,
  ): Promise<EngineResult<CrawlJob>> {
    const current = this.repository.get(jobId, tenantId);
    if (!current.ok) return current;

    const scoped = validateUrlAgainstScope(
      input.originalUrl,
      current.value.scope,
    );
    if (!scoped.ok) return scoped;

    const safePayload = redactPayload(input.payload ?? {});
    const key = idempotencyKey([
      tenantId,
      jobId,
      input.kind,
      input.sourceId,
      input.observedAt,
      scoped.value.normalisedUrl,
      String(input.attemptNumber ?? 1),
      JSON.stringify(safePayload),
    ]);

    if (current.value.importKeys.includes(key)) {
      return ok(current.value);
    }

    const observation: CrawlObservation = {
      id: randomUUID(),
      kind: input.kind,
      sourceId: input.sourceId,
      observedAt: input.observedAt,
      originalUrl: scoped.value.originalUrl,
      normalisedUrl: scoped.value.normalisedUrl,
      scopeEnvironment: current.value.scope.environment,
      payload: {
        ...safePayload,
        ...(input.attemptNumber !== undefined
          ? { attemptNumber: input.attemptNumber }
          : {}),
      },
      idempotencyKey: key,
      recordedAt: new Date().toISOString(),
    };

    const job = structuredClone(current.value);
    job.observations.push(observation);
    job.importKeys.push(key);

    const saved = await this.repository.saveVersioned(job);
    if (!saved.ok) return saved;

    await publishCrawlEvent(
      this.events,
      PlatformEventName.CrawlObservationRecorded,
      {
        jobId,
        tenantId,
        observationId: observation.id,
        kind: observation.kind,
        sourceId: observation.sourceId,
        normalisedUrl: observation.normalisedUrl,
      },
      correlationId,
    );

    if (observation.kind === "fetch_attempt") {
      await publishCrawlEvent(
        this.events,
        PlatformEventName.CrawlFetchAttempted,
        {
          jobId,
          observationId: observation.id,
          attemptNumber: observation.payload.attemptNumber ?? 1,
        },
        correlationId,
      );
    }
    if (observation.kind === "http_response") {
      await publishCrawlEvent(
        this.events,
        PlatformEventName.CrawlResponseObserved,
        { jobId, observationId: observation.id, sourceId: observation.sourceId },
        correlationId,
      );
    }
    if (observation.kind === "redirect_chain") {
      await publishCrawlEvent(
        this.events,
        PlatformEventName.CrawlRedirectObserved,
        { jobId, observationId: observation.id },
        correlationId,
      );
    }
    if (observation.kind === "crawl_failure") {
      await publishCrawlEvent(
        this.events,
        PlatformEventName.CrawlFailureObserved,
        { jobId, observationId: observation.id },
        correlationId,
      );
    }
    if (observation.kind === "document") {
      await publishCrawlEvent(
        this.events,
        PlatformEventName.PageCrawled,
        {
          jobId,
          observationId: observation.id,
          normalisedUrl: observation.normalisedUrl,
        },
        correlationId,
      );
    }

    return saved;
  }

  async importFromAdapter(
    jobId: string,
    tenantId: string,
    adapter: CrawlAdapter,
    correlationId?: string,
  ): Promise<
    EngineResult<{ job: CrawlJob; imported: number; skipped: number }>
  > {
    const current = this.repository.get(jobId, tenantId);
    if (!current.ok) return current;

    if (adapter.kind !== "fixture" && adapter.kind !== "injected") {
      return err({
        code: "UNSUPPORTED_ADAPTER",
        message: "Only fixture and injected adapters are permitted",
        retryable: false,
      });
    }

    let job = structuredClone(current.value);
    job.status = "running";
    const started = await this.repository.saveVersioned(job);
    if (!started.ok) return started;
    job = started.value;

    await publishCrawlEvent(
      this.events,
      PlatformEventName.CrawlJobStarted,
      { jobId, tenantId, adapterKind: adapter.kind },
      correlationId,
    );

    let imported = 0;
    let skipped = 0;

    try {
      for await (const item of adapter.collect(job.scope)) {
        const before = job.observations.length;
        const attemptNumber =
          typeof item.payload.attemptNumber === "number"
            ? item.payload.attemptNumber
            : undefined;
        const result = await this.recordObservation(
          jobId,
          tenantId,
          {
            kind: item.kind,
            sourceId: item.sourceId,
            observedAt: item.observedAt,
            originalUrl: item.originalUrl,
            payload: item.payload,
            ...(attemptNumber !== undefined ? { attemptNumber } : {}),
          },
          correlationId,
        );
        if (!result.ok) {
          throw new Error(result.error.message);
        }
        if (result.value.observations.length === before) skipped += 1;
        else imported += 1;
        job = result.value;
      }

      job = structuredClone(job);
      job.status = "completed";
      const completed = await this.repository.saveVersioned(job);
      if (!completed.ok) return completed;

      await publishCrawlEvent(
        this.events,
        PlatformEventName.CrawlJobCompleted,
        { jobId, tenantId, imported, skipped },
        correlationId,
      );
      return ok({ job: completed.value, imported, skipped });
    } catch (cause) {
      const failed = structuredClone(
        this.repository.get(jobId, tenantId).ok
          ? (this.repository.get(jobId, tenantId) as { ok: true; value: CrawlJob })
              .value
          : job,
      );
      failed.status = "failed";
      await this.repository.saveVersioned(failed);
      await publishCrawlEvent(
        this.events,
        PlatformEventName.CrawlJobFailed,
        {
          jobId,
          tenantId,
          error: cause instanceof Error ? cause.message : String(cause),
        },
        correlationId,
      );
      return err({
        code: "CRAWL_JOB_FAILED",
        message: cause instanceof Error ? cause.message : String(cause),
        retryable: false,
      });
    }
  }

  async createSnapshot(
    jobId: string,
    tenantId: string,
    label: string,
    correlationId?: string,
  ): Promise<EngineResult<CrawlJob>> {
    const current = this.repository.get(jobId, tenantId);
    if (!current.ok) return current;
    const job = structuredClone(current.value);
    const snapshot: CrawlSnapshot = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      label,
      observationIds: job.observations.map((item) => item.id),
      factualSummary: job.observations.map((item) => ({
        id: item.id,
        kind: item.kind,
        normalisedUrl: item.normalisedUrl,
      })),
      immutable: true,
    };
    job.snapshots.push(snapshot);
    const saved = await this.repository.saveVersioned(job);
    if (!saved.ok) return saved;
    await publishCrawlEvent(
      this.events,
      PlatformEventName.CrawlSnapshotCreated,
      { jobId, tenantId, snapshotId: snapshot.id },
      correlationId,
    );
    return saved;
  }

  getSnapshot(
    jobId: string,
    tenantId: string,
    snapshotId: string,
  ): EngineResult<CrawlSnapshot> {
    const job = this.repository.get(jobId, tenantId);
    if (!job.ok) return job;
    const snapshot = job.value.snapshots.find((item) => item.id === snapshotId);
    if (!snapshot) {
      return err({
        code: "SNAPSHOT_NOT_FOUND",
        message: `Snapshot not found: ${snapshotId}`,
        retryable: false,
      });
    }
    // Return a frozen copy — snapshots are immutable.
    return ok(Object.freeze(structuredClone(snapshot)));
  }

  async compareSnapshots(
    jobId: string,
    tenantId: string,
    leftSnapshotId: string,
    rightSnapshotId: string,
    correlationId?: string,
  ): Promise<EngineResult<CrawlJob>> {
    const current = this.repository.get(jobId, tenantId);
    if (!current.ok) return current;
    const left = current.value.snapshots.find(
      (item) => item.id === leftSnapshotId,
    );
    const right = current.value.snapshots.find(
      (item) => item.id === rightSnapshotId,
    );
    if (!left || !right) {
      return err({
        code: "SNAPSHOT_NOT_FOUND",
        message: "Both snapshots are required for comparison",
        retryable: false,
      });
    }

    const leftMap = new Map(
      left.factualSummary.map((item) => [item.normalisedUrl + "|" + item.kind, item]),
    );
    const rightMap = new Map(
      right.factualSummary.map((item) => [item.normalisedUrl + "|" + item.kind, item]),
    );
    const factualChanges: FactualChange[] = [];

    for (const [key, item] of rightMap) {
      if (!leftMap.has(key)) {
        factualChanges.push({
          changeType: "added",
          field: key,
          after: item,
          observationId: item.id,
        });
      }
    }
    for (const [key, item] of leftMap) {
      if (!rightMap.has(key)) {
        factualChanges.push({
          changeType: "removed",
          field: key,
          before: item,
          observationId: item.id,
        });
      }
    }

    const job = structuredClone(current.value);
    const comparisonId = randomUUID();
    job.comparisons.push({
      id: comparisonId,
      createdAt: new Date().toISOString(),
      leftSnapshotId,
      rightSnapshotId,
      factualChanges,
    });
    const saved = await this.repository.saveVersioned(job);
    if (!saved.ok) return saved;
    await publishCrawlEvent(
      this.events,
      PlatformEventName.CrawlSnapshotCompared,
      {
        jobId,
        tenantId,
        comparisonId,
        changeCount: factualChanges.length,
      },
      correlationId,
    );
    return saved;
  }
}
