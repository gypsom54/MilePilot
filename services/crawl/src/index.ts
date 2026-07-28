export type {
  AdapterKind,
  CrawlEnvironment,
  CrawlJob,
  CrawlJobStatus,
  CrawlObservation,
  CrawlScope,
  CrawlSnapshot,
  CrawlSource,
  CreateCrawlJobInput,
  FactualChange,
  ImageAltState,
  ObservationKind,
  SnapshotComparison,
} from "./domain/types.js";
export { normaliseUrl } from "./domain/url.js";
export {
  isSensitiveHeaderName,
  redactHeaders,
  redactPayload,
} from "./domain/redaction.js";
export { validateUrlAgainstScope } from "./validation/scope.js";
export type { AdapterObservation, CrawlAdapter } from "./adapters/types.js";
export { FixtureCrawlAdapter } from "./adapters/fixture-adapter.js";
export { InjectedCrawlAdapter } from "./adapters/injected-adapter.js";
export { CrawlJobRepository } from "./repository/crawl-job-repository.js";
export { CrawlIntelligenceService } from "./service.js";
export {
  CrawlIntelligenceEngine,
  createCrawlIntelligenceEngineConfig,
  createCrawlIntelligenceEngineRegistration,
} from "./engine.js";
export { CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
export {
  CrawlIntelligenceApi,
  type ApiRequest,
  type ApiResponse,
} from "./api/handlers.js";
export {
  createCrawlIntelligenceRuntime,
  registerCrawlIntelligence,
  type CrawlIntelligenceRuntime,
} from "./composition.js";
export { syncCrawlJobToKnowledgeGraph } from "./knowledge-graph/sync.js";
export { publishCrawlEvent, PlatformEventName } from "./events/publish.js";
