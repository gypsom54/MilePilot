export type {
  BusinessProfile,
  CreateBusinessInput,
  IdentityProfile,
  BrandProfile,
  AudienceProfile,
  GoalEntity,
  ExpertiseNode,
  TrustSignal,
  DigitalAsset,
  CompetitorSeed,
  CustomerQuestion,
  ConstraintEntity,
  PreferenceRegistry,
  EnrichmentSuggestion,
} from "./domain/types.js";

export { createBusinessProfileFromInput } from "./domain/factory.js";
export {
  validateCreateBusinessInput,
  validateNonEmptyName,
} from "./validation/validate.js";
export { BusinessProfileRepository } from "./repository/business-profile-repository.js";
export { BusinessDiscoveryService } from "./service.js";
export {
  BusinessDiscoveryEngine,
  createBusinessDiscoveryEngineConfig,
  createBusinessDiscoveryEngineRegistration,
} from "./engine.js";
export { BUSINESS_DISCOVERY_CAPABILITY_MANIFEST } from "./capability-manifest.js";
export { BusinessDiscoveryApi, type ApiRequest, type ApiResponse } from "./api/handlers.js";
export {
  createBusinessDiscoveryRuntime,
  registerBusinessDiscovery,
  type BusinessDiscoveryRuntime,
} from "./composition.js";
export { syncBusinessProfileToKnowledgeGraph } from "./knowledge-graph/sync.js";
