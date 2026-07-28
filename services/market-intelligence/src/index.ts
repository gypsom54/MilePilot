export type {
  MarketProfile,
  CreateMarketInput,
  EvidenceMeta,
  MarketCategory,
  CustomerProblem,
  DesiredOutcome,
  DemandSignal,
  DemandTheme,
  CompetitorCandidate,
  OfferObservation,
  MarketGap,
  Trend,
  SeasonalityPattern,
  MarketSource,
  GeographicScope,
} from "./domain/types.js";

export {
  createEvidenceMeta,
  computeFreshness,
  effectiveConfidence,
  buildIdempotencyKey,
} from "./domain/evidence.js";

export {
  validateCreateMarketInput,
  validateEvidenceInput,
  validateGapEvidence,
  validateTrendObservations,
} from "./validation/validate.js";

export { MarketProfileRepository } from "./repository/market-profile-repository.js";
export { MarketIntelligenceService } from "./service.js";
export {
  MarketIntelligenceEngine,
  createMarketIntelligenceEngineConfig,
  createMarketIntelligenceEngineRegistration,
} from "./engine.js";
export { MARKET_INTELLIGENCE_CAPABILITY_MANIFEST } from "./capability-manifest.js";
export {
  MarketIntelligenceApi,
  type ApiRequest,
  type ApiResponse,
} from "./api/handlers.js";
export {
  createMarketIntelligenceRuntime,
  registerMarketIntelligence,
  type MarketIntelligenceRuntime,
} from "./composition.js";
export { syncMarketProfileToKnowledgeGraph } from "./knowledge-graph/sync.js";
