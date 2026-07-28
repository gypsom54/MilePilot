import {
  CrawlIntelligenceEntityType,
  CrawlIntelligenceRelationshipType,
  crawlChildEntityId,
  crawlJobEntityId,
  type InMemoryKnowledgeGraph,
} from "@seo-autopilot/knowledge-graph";
import type { CrawlJob } from "../domain/types.js";

async function link(
  graph: InMemoryKnowledgeGraph,
  id: string,
  type: string,
  from: string,
  to: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  await graph.createRelationship({ id, type, from, to, properties });
}

/**
 * Idempotent crawl observation graph sync.
 * Never writes Website Intelligence entity types — only external refs as properties.
 */
export async function syncCrawlJobToKnowledgeGraph(
  graph: InMemoryKnowledgeGraph,
  job: CrawlJob,
): Promise<void> {
  const jobNodeId = crawlJobEntityId(job.id);

  await graph.upsertEntity({
    id: jobNodeId,
    type: CrawlIntelligenceEntityType.CrawlJob,
    properties: {
      jobId: job.id,
      tenantId: job.tenantId,
      status: job.status,
      version: job.version,
      websiteId: job.websiteId ?? null,
      propertyId: job.propertyId ?? null,
      provenance: "crawl-intelligence",
    },
  });

  const scopeId = crawlChildEntityId(job.id, "scope", "primary");
  await graph.upsertEntity({
    id: scopeId,
    type: CrawlIntelligenceEntityType.CrawlScope,
    properties: { ...job.scope },
  });
  await link(
    graph,
    `${jobNodeId}->scope`,
    CrawlIntelligenceRelationshipType.HAS_SCOPE,
    jobNodeId,
    scopeId,
  );

  const sourceId = crawlChildEntityId(job.id, "source", job.source.id);
  await graph.upsertEntity({
    id: sourceId,
    type: CrawlIntelligenceEntityType.CrawlSource,
    properties: { ...job.source },
  });
  await link(
    graph,
    `${jobNodeId}->source`,
    CrawlIntelligenceRelationshipType.HAS_SOURCE,
    jobNodeId,
    sourceId,
  );

  if (job.websiteId) {
    await link(
      graph,
      `${jobNodeId}->website-ref`,
      CrawlIntelligenceRelationshipType.REFERENCES_WEBSITE,
      jobNodeId,
      jobNodeId,
      {
        websiteId: job.websiteId,
        propertyId: job.propertyId ?? null,
        note: "read-only Website Intelligence reference — not overwritten",
      },
    );
  }

  for (const observation of job.observations) {
    const id = crawlChildEntityId(job.id, "observation", observation.id);
    await graph.upsertEntity({
      id,
      type: CrawlIntelligenceEntityType.CrawlObservation,
      properties: {
        kind: observation.kind,
        sourceId: observation.sourceId,
        observedAt: observation.observedAt,
        originalUrl: observation.originalUrl,
        normalisedUrl: observation.normalisedUrl,
        scopeEnvironment: observation.scopeEnvironment,
        payload: observation.payload,
        idempotencyKey: observation.idempotencyKey,
        recordedAt: observation.recordedAt,
      },
    });
    await link(
      graph,
      `${jobNodeId}->observation:${observation.id}`,
      CrawlIntelligenceRelationshipType.HAS_OBSERVATION,
      jobNodeId,
      id,
    );
    await link(
      graph,
      `observation:${observation.id}->url`,
      CrawlIntelligenceRelationshipType.OBSERVATION_OF_URL,
      id,
      id,
      { normalisedUrl: observation.normalisedUrl },
    );
  }

  for (const snapshot of job.snapshots) {
    const id = crawlChildEntityId(job.id, "snapshot", snapshot.id);
    await graph.upsertEntity({
      id,
      type: CrawlIntelligenceEntityType.CrawlSnapshot,
      properties: { ...snapshot },
    });
    await link(
      graph,
      `${jobNodeId}->snapshot:${snapshot.id}`,
      CrawlIntelligenceRelationshipType.HAS_SNAPSHOT,
      jobNodeId,
      id,
    );
  }

  for (const comparison of job.comparisons) {
    const id = crawlChildEntityId(job.id, "comparison", comparison.id);
    await graph.upsertEntity({
      id,
      type: CrawlIntelligenceEntityType.SnapshotComparison,
      properties: { ...comparison },
    });
    await link(
      graph,
      `comparison:${comparison.id}->left`,
      CrawlIntelligenceRelationshipType.COMPARES,
      id,
      crawlChildEntityId(job.id, "snapshot", comparison.leftSnapshotId),
      { side: "left" },
    );
    await link(
      graph,
      `comparison:${comparison.id}->right`,
      CrawlIntelligenceRelationshipType.COMPARES,
      id,
      crawlChildEntityId(job.id, "snapshot", comparison.rightSnapshotId),
      { side: "right" },
    );
  }
}
