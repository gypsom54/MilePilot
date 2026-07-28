export const CrawlIntelligenceEntityType = {
  CrawlJob: "CrawlJob",
  CrawlScope: "CrawlScope",
  CrawlSource: "CrawlSource",
  CrawlObservation: "CrawlObservation",
  CrawlSnapshot: "CrawlSnapshot",
  SnapshotComparison: "SnapshotComparison",
} as const;

export type CrawlIntelligenceEntityType =
  (typeof CrawlIntelligenceEntityType)[keyof typeof CrawlIntelligenceEntityType];

export const CrawlIntelligenceRelationshipType = {
  HAS_SCOPE: "HAS_SCOPE",
  HAS_SOURCE: "HAS_SOURCE",
  HAS_OBSERVATION: "HAS_OBSERVATION",
  REFERENCES_WEBSITE: "REFERENCES_WEBSITE",
  HAS_SNAPSHOT: "HAS_SNAPSHOT",
  COMPARES: "COMPARES",
  OBSERVATION_OF_URL: "OBSERVATION_OF_URL",
} as const;

export type CrawlIntelligenceRelationshipType =
  (typeof CrawlIntelligenceRelationshipType)[keyof typeof CrawlIntelligenceRelationshipType];

export function crawlJobEntityId(jobId: string): string {
  return `crawl-job:${jobId}`;
}

export function crawlChildEntityId(
  jobId: string,
  kind: string,
  childId: string,
): string {
  return `crawl-job:${jobId}:${kind}:${childId}`;
}
