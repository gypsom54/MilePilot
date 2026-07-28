import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PlatformEventName } from "../../../packages/shared/dist/index.js";
import { WebsiteIntelligenceEntityType } from "../../../packages/knowledge-graph/dist/index.js";
import {
  createCrawlIntelligenceRuntime,
  FixtureCrawlAdapter,
  InjectedCrawlAdapter,
} from "../../../services/crawl/dist/index.js";

function baseJobInput(overrides = {}) {
  const { scope, source, ...rest } = overrides;
  return {
    tenantId: "tenant_crawl",
    websiteId: "wi_readonly_site",
    propertyId: "wi_readonly_prop",
    ...rest,
    scope: {
      allowedHosts: ["example.com"],
      allowedProtocols: ["https"],
      includePathPrefixes: [],
      excludePathPrefixes: [],
      environment: "production",
      ...scope,
    },
    source: { kind: "fixture", label: "fixture-source", ...source },
  };
}

function obs(partial) {
  return {
    sourceId: "fixture-source",
    observedAt: "2026-01-01T00:00:00.000Z",
    originalUrl: "https://example.com/",
    payload: {},
    ...partial,
  };
}

describe("Crawl Intelligence flow", () => {
  it("imports observation kinds via fixture adapter with provenance", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const events = [];
    runtime.events.subscribeAll(async (event) => {
      events.push(event.name);
    });

    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const kinds = [
      "url_discovery",
      "fetch_attempt",
      "http_response",
      "redirect_chain",
      "document",
      "html_metadata",
      "heading",
      "link",
      "image",
      "resource",
      "canonical_declaration",
      "robots_directive",
      "robots_file",
      "sitemap",
      "structured_data",
      "language",
      "text_content_structural",
      "timing",
      "content_fingerprint",
      "crawl_failure",
    ];

    const result = await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_crawl",
      new FixtureCrawlAdapter(
        kinds.map((kind, index) =>
          obs({
            kind,
            observedAt: `2026-01-01T00:00:${String(index).padStart(2, "0")}.000Z`,
            payload:
              kind === "image"
                ? { alt: "present", altText: "logo" }
                : kind === "fetch_attempt"
                  ? { attemptNumber: 1 }
                  : kind === "crawl_failure"
                    ? { reason: "timeout", collectionFailed: true }
                    : { index },
          }),
        ),
      ),
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.value.imported, kinds.length);
    assert.equal(result.value.job.observations.length, kinds.length);
    for (const observation of result.value.job.observations) {
      assert.ok(observation.sourceId);
      assert.ok(observation.observedAt);
      assert.ok(observation.originalUrl);
      assert.ok(observation.normalisedUrl);
      assert.ok(observation.idempotencyKey);
    }
    assert.ok(events.includes(PlatformEventName.CrawlJobCreated));
    assert.ok(events.includes(PlatformEventName.CrawlJobStarted));
    assert.ok(events.includes(PlatformEventName.CrawlJobCompleted));
    assert.ok(events.includes(PlatformEventName.CrawlObservationRecorded));
    assert.ok(events.includes(PlatformEventName.PageCrawled));
    assert.ok(events.includes(PlatformEventName.CrawlFailureObserved));
  });

  it("keeps retries distinct and repeated imports idempotent", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const attempt1 = obs({
      kind: "fetch_attempt",
      payload: { attemptNumber: 1 },
    });
    const attempt2 = obs({
      kind: "fetch_attempt",
      payload: { attemptNumber: 2 },
    });

    const first = await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_crawl",
      new FixtureCrawlAdapter([attempt1, attempt2]),
    );
    assert.equal(first.ok, true);
    if (!first.ok) return;
    assert.equal(first.value.job.observations.length, 2);

    const second = await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_crawl",
      new FixtureCrawlAdapter([attempt1, attempt2]),
    );
    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.equal(second.value.imported, 0);
    assert.equal(second.value.skipped, 2);
    assert.equal(second.value.job.observations.length, 2);
  });

  it("rejects out-of-scope and unsupported protocol URLs from adapters", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const outOfScope = await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_crawl",
      new FixtureCrawlAdapter([
        obs({ originalUrl: "https://evil.com/", kind: "document" }),
      ]),
    );
    assert.equal(outOfScope.ok, false);
    if (!outOfScope.ok) {
      assert.match(outOfScope.error.message, /out of crawl scope/i);
    }

    const badProtocol = await runtime.service.recordObservation(
      created.value.id,
      "tenant_crawl",
      {
        kind: "document",
        sourceId: "fixture-source",
        observedAt: "2026-01-01T00:00:00.000Z",
        originalUrl: "ftp://example.com/file",
      },
    );
    assert.equal(badProtocol.ok, false);
  });

  it("keeps production and staging scopes separate", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const prod = await runtime.service.createJob(
      baseJobInput({ scope: { environment: "production" } }),
    );
    const staging = await runtime.service.createJob(
      baseJobInput({
        scope: {
          allowedHosts: ["staging.example.com"],
          allowedProtocols: ["https"],
          includePathPrefixes: [],
          excludePathPrefixes: [],
          environment: "staging",
        },
      }),
    );
    assert.equal(prod.ok && staging.ok, true);
    if (!prod.ok || !staging.ok) return;

    await runtime.service.recordObservation(prod.value.id, "tenant_crawl", {
      kind: "document",
      sourceId: "fixture-source",
      observedAt: "2026-01-01T00:00:00.000Z",
      originalUrl: "https://example.com/",
    });
    await runtime.service.recordObservation(staging.value.id, "tenant_crawl", {
      kind: "document",
      sourceId: "fixture-source",
      observedAt: "2026-01-01T00:00:00.000Z",
      originalUrl: "https://staging.example.com/",
    });

    const prodJob = runtime.service.getJob(prod.value.id, "tenant_crawl");
    const stagingJob = runtime.service.getJob(staging.value.id, "tenant_crawl");
    assert.equal(prodJob.value.observations[0].scopeEnvironment, "production");
    assert.equal(stagingJob.value.observations[0].scopeEnvironment, "staging");
  });

  it("distinguishes empty and absent image alt attributes", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_crawl",
      new InjectedCrawlAdapter(function* () {
        yield obs({
          kind: "image",
          originalUrl: "https://example.com/a.png",
          payload: { alt: "present", altText: "hero" },
        });
        yield obs({
          kind: "image",
          originalUrl: "https://example.com/b.png",
          payload: { alt: "empty", altText: "" },
        });
        yield obs({
          kind: "image",
          originalUrl: "https://example.com/c.png",
          payload: { alt: "absent" },
        });
      }),
    );

    const job = runtime.service.getJob(created.value.id, "tenant_crawl");
    const alts = job.value.observations.map((item) => item.payload.alt);
    assert.deepEqual(alts, ["present", "empty", "absent"]);
    assert.notEqual(alts[1], alts[2]);
  });

  it("records redirect loops without judging them", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const recorded = await runtime.service.recordObservation(
      created.value.id,
      "tenant_crawl",
      {
        kind: "redirect_chain",
        sourceId: "fixture-source",
        observedAt: "2026-01-01T00:00:00.000Z",
        originalUrl: "https://example.com/a",
        payload: {
          hops: [
            "https://example.com/a",
            "https://example.com/b",
            "https://example.com/a",
          ],
          loopDetected: true,
        },
      },
    );
    assert.equal(recorded.ok, true);
    if (!recorded.ok) return;
    const chain = recorded.value.observations[0];
    assert.equal(chain.payload.loopDetected, true);
    assert.equal(
      Object.prototype.hasOwnProperty.call(chain.payload, "severity"),
      false,
    );
    assert.equal(
      Object.prototype.hasOwnProperty.call(chain.payload, "severity"),
      false,
    );
  });

  it("represents failed collection distinctly from absence", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    await runtime.service.recordObservation(created.value.id, "tenant_crawl", {
      kind: "crawl_failure",
      sourceId: "fixture-source",
      observedAt: "2026-01-01T00:00:00.000Z",
      originalUrl: "https://example.com/missing",
      payload: { reason: "dns_error", collectionFailed: true },
    });

    const job = runtime.service.getJob(created.value.id, "tenant_crawl");
    const failure = job.value.observations.find(
      (item) => item.kind === "crawl_failure",
    );
    assert.ok(failure);
    assert.equal(failure.payload.collectionFailed, true);
    assert.notEqual(failure, undefined);
  });

  it("creates immutable snapshots and factual comparisons only", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    await runtime.service.recordObservation(created.value.id, "tenant_crawl", {
      kind: "document",
      sourceId: "fixture-source",
      observedAt: "2026-01-01T00:00:00.000Z",
      originalUrl: "https://example.com/a",
    });
    const snap1 = await runtime.service.createSnapshot(
      created.value.id,
      "tenant_crawl",
      "before",
    );
    assert.equal(snap1.ok, true);
    if (!snap1.ok) return;
    const leftId = snap1.value.snapshots[0].id;

    await runtime.service.recordObservation(created.value.id, "tenant_crawl", {
      kind: "document",
      sourceId: "fixture-source",
      observedAt: "2026-01-02T00:00:00.000Z",
      originalUrl: "https://example.com/b",
    });
    const snap2 = await runtime.service.createSnapshot(
      created.value.id,
      "tenant_crawl",
      "after",
    );
    assert.equal(snap2.ok, true);
    if (!snap2.ok) return;
    const rightId = snap2.value.snapshots[1].id;

    const frozen = runtime.service.getSnapshot(
      created.value.id,
      "tenant_crawl",
      leftId,
    );
    assert.equal(frozen.ok, true);
    if (!frozen.ok) return;
    assert.equal(frozen.value.immutable, true);
    assert.throws(() => {
      frozen.value.label = "mutated";
    }, TypeError);

    const compared = await runtime.service.compareSnapshots(
      created.value.id,
      "tenant_crawl",
      leftId,
      rightId,
    );
    assert.equal(compared.ok, true);
    if (!compared.ok) return;
    const changes = compared.value.comparisons[0].factualChanges;
    assert.ok(changes.some((item) => item.changeType === "added"));
    for (const change of changes) {
      assert.ok(["added", "removed", "changed"].includes(change.changeType));
      assert.equal(
        Object.prototype.hasOwnProperty.call(change, "severity"),
        false,
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(change, "recommendation"),
        false,
      );
    }
  });

  it("never overwrites Website Intelligence facts", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    // Seed a WI-like entity that crawl must not mutate.
    await runtime.graph.upsertEntity({
      id: "website:wi_readonly_site",
      type: WebsiteIntelligenceEntityType.Website,
      properties: { name: "Canonical WI", tenantId: "tenant_crawl" },
    });

    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    await runtime.service.importFromAdapter(
      created.value.id,
      "tenant_crawl",
      new FixtureCrawlAdapter([
        obs({ kind: "document", payload: { title: "Observed title" } }),
      ]),
    );

    const wi = await runtime.graph.getEntity("website:wi_readonly_site");
    assert.equal(wi.properties.name, "Canonical WI");
    assert.equal(
      Object.prototype.hasOwnProperty.call(wi.properties, "title"),
      false,
    );

    const job = runtime.service.getJob(created.value.id, "tenant_crawl");
    const guard = runtime.service.assertWebsiteIntelligenceUntouched(job.value);
    assert.equal(guard.mutatedWebsiteIntelligence, false);
    assert.equal(guard.websiteId, "wi_readonly_site");
  });

  it("redacts sensitive headers before persistence", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const recorded = await runtime.service.recordObservation(
      created.value.id,
      "tenant_crawl",
      {
        kind: "http_response",
        sourceId: "fixture-source",
        observedAt: "2026-01-01T00:00:00.000Z",
        originalUrl: "https://example.com/",
        payload: {
          headers: {
            Authorization: "Bearer abc",
            Cookie: "a=1",
            "Set-Cookie": "b=2",
            "X-Api-Key": "k",
          },
          password: "secret",
          responseBody: "confidential",
        },
      },
    );
    assert.equal(recorded.ok, true);
    if (!recorded.ok) return;
    const payload = recorded.value.observations[0].payload;
    assert.equal(payload.headers.Authorization, "[REDACTED]");
    assert.equal(payload.headers.Cookie, "[REDACTED]");
    assert.equal(payload.headers["Set-Cookie"], "[REDACTED]");
    assert.equal(payload.headers["X-Api-Key"], "[REDACTED]");
    assert.equal(payload.password, "[REDACTED]");
    assert.equal(payload.responseBody, "[REDACTED]");
  });

  it("keeps separate timestamped collections distinct", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const created = await runtime.service.createJob(baseJobInput());
    assert.equal(created.ok, true);
    if (!created.ok) return;

    await runtime.service.recordObservation(created.value.id, "tenant_crawl", {
      kind: "document",
      sourceId: "fixture-source",
      observedAt: "2026-01-01T00:00:00.000Z",
      originalUrl: "https://example.com/",
      payload: { wave: 1 },
    });
    await runtime.service.recordObservation(created.value.id, "tenant_crawl", {
      kind: "document",
      sourceId: "fixture-source",
      observedAt: "2026-01-02T00:00:00.000Z",
      originalUrl: "https://example.com/",
      payload: { wave: 2 },
    });

    const job = runtime.service.getJob(created.value.id, "tenant_crawl");
    assert.equal(job.value.observations.length, 2);
  });
});
