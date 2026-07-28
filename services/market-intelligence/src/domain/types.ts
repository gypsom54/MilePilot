export type GeographicScope =
  | "local"
  | "regional"
  | "national"
  | "international";

export type Freshness = "fresh" | "stale" | "expired";

export type CandidateStatus = "candidate" | "confirmed";

export type CompetitorStatus = "candidate" | "confirmed" | "dismissed";

export type GapStatus = "candidate" | "validated";

export type SourceKind = "fixture" | "user" | "import" | "adapter";

export interface EvidenceMeta {
  sourceId: string;
  observedAt: string;
  scope: GeographicScope;
  provenance: string;
  confidence: number;
  limitations: string[];
  expiresAt?: string;
  freshness: Freshness;
}

export interface MarketSource {
  id: string;
  label: string;
  kind: SourceKind;
  uri?: string;
  collectedAt: string;
}

export interface MarketDefinition {
  name: string;
  description: string;
  industryScope: string;
  geographicScope: GeographicScope;
  locationLabels: string[];
}

export interface MarketCategory {
  id: string;
  name: string;
  description: string;
  status: CandidateStatus;
  evidence: EvidenceMeta;
}

export interface CustomerProblem {
  id: string;
  statement: string;
  categoryIds: string[];
  evidence: EvidenceMeta;
}

export interface DesiredOutcome {
  id: string;
  statement: string;
  categoryIds: string[];
  evidence: EvidenceMeta;
}

export interface DemandSignal {
  id: string;
  text: string;
  intensity?: number;
  evidence: EvidenceMeta;
  idempotencyKey: string;
}

export interface MarketQuestion {
  id: string;
  question: string;
  evidence: EvidenceMeta;
}

export interface DemandTheme {
  id: string;
  name: string;
  signalIds: string[];
  questionIds: string[];
  evidence: EvidenceMeta;
}

export interface Organisation {
  id: string;
  name: string;
  website?: string;
}

export interface ObservedProduct {
  id: string;
  organisationId: string;
  name: string;
}

export interface ObservedService {
  id: string;
  organisationId: string;
  name: string;
}

export interface CompetitorCandidate {
  id: string;
  name: string;
  website?: string;
  organisationId?: string;
  status: CompetitorStatus;
  evidence: EvidenceMeta;
}

export interface MarketLocation {
  id: string;
  label: string;
  scope: GeographicScope;
}

export interface OfferObservation {
  id: string;
  organisationId: string;
  productId?: string;
  serviceId?: string;
  summary: string;
  priceObservation?: string;
  locationId?: string;
  evidence: EvidenceMeta;
  idempotencyKey: string;
}

export interface MarketGap {
  id: string;
  statement: string;
  supportingEvidenceIds: string[];
  status: GapStatus;
  evidence: EvidenceMeta;
}

export interface TimedObservation {
  observedAt: string;
  note: string;
  sourceId: string;
  confidence: number;
}

export interface Trend {
  id: string;
  name: string;
  direction: string;
  observations: TimedObservation[];
  evidence: EvidenceMeta;
}

export interface SeasonalityPattern {
  id: string;
  name: string;
  pattern: string;
  observations: TimedObservation[];
  evidence: EvidenceMeta;
}

/**
 * Canonical Market Profile — tenant-scoped external market understanding.
 * businessId is a read-only Business Discovery reference and is never mutated here.
 */
export interface MarketProfile {
  id: string;
  tenantId: string;
  businessId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  definition: MarketDefinition;
  categories: MarketCategory[];
  problems: CustomerProblem[];
  outcomes: DesiredOutcome[];
  demandSignals: DemandSignal[];
  demandThemes: DemandTheme[];
  questions: MarketQuestion[];
  competitors: CompetitorCandidate[];
  organisations: Organisation[];
  products: ObservedProduct[];
  services: ObservedService[];
  locations: MarketLocation[];
  offers: OfferObservation[];
  gaps: MarketGap[];
  trends: Trend[];
  seasonality: SeasonalityPattern[];
  sources: MarketSource[];
  importKeys: string[];
}

export interface CreateMarketInput {
  tenantId: string;
  businessId?: string;
  name: string;
  description: string;
  industryScope: string;
  geographicScope: GeographicScope;
  locationLabels?: string[];
}
