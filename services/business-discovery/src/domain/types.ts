import type { ProvenancedValue } from "@seo-autopilot/shared";

export type BusinessStage =
  | "idea"
  | "startup"
  | "growth"
  | "established"
  | "enterprise";

export type CompanyType =
  | "sole_trader"
  | "partnership"
  | "limited_company"
  | "llp"
  | "non_profit"
  | "other";

export type GeographicScope =
  | "local"
  | "regional"
  | "national"
  | "international";

export type LifecycleStatus = "planned" | "active" | "paused" | "retired";

export type GoalProgressState =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned";

export type PositioningTier = "premium" | "value" | "specialist";

export type QuestionCategory =
  | "faq"
  | "sales"
  | "support"
  | "objection"
  | "misconception";

export interface IdentityProfile {
  legalName: ProvenancedValue<string>;
  tradingName: ProvenancedValue<string>;
  website: ProvenancedValue<string>;
  primaryDomain: ProvenancedValue<string>;
  businessDescription: ProvenancedValue<string>;
  industry: ProvenancedValue<string>;
  businessStage: ProvenancedValue<BusinessStage>;
  companyType: ProvenancedValue<CompanyType>;
  yearEstablished?: ProvenancedValue<number>;
  primaryContact: ProvenancedValue<string>;
  timeZone: ProvenancedValue<string>;
  primaryLanguage: ProvenancedValue<string>;
}

export interface BrandProfile {
  tone: ProvenancedValue<string>;
  values: ProvenancedValue<string[]>;
  uniqueSellingProposition: ProvenancedValue<string>;
  positioning: ProvenancedValue<string>;
  positioningTier: ProvenancedValue<PositioningTier>;
  writingStyle: ProvenancedValue<string>;
  preferredTerminology: ProvenancedValue<string[]>;
  neverSays: ProvenancedValue<string[]>;
  complianceRestrictions: ProvenancedValue<string[]>;
}

export interface OfferEntity {
  id: string;
  kind: "product" | "service";
  name: ProvenancedValue<string>;
  description: ProvenancedValue<string>;
  category: ProvenancedValue<string>;
  parentCategory?: ProvenancedValue<string>;
  relatedTopics: ProvenancedValue<string[]>;
  commercialPriority: ProvenancedValue<number>;
  geographicAvailability: ProvenancedValue<string[]>;
  lifecycleStatus: ProvenancedValue<LifecycleStatus>;
  supportingEvidence: ProvenancedValue<string[]>;
  associatedKnowledgeAssets: ProvenancedValue<string[]>;
}

export interface AudienceProfile {
  primaryAudience: ProvenancedValue<string>;
  secondaryAudience: ProvenancedValue<string[]>;
  industriesServed: ProvenancedValue<string[]>;
  customerProblems: ProvenancedValue<string[]>;
  customerGoals: ProvenancedValue<string[]>;
  buyingTriggers: ProvenancedValue<string[]>;
  objections: ProvenancedValue<string[]>;
  decisionMakers: ProvenancedValue<string[]>;
  preferredCommunicationStyle: ProvenancedValue<string>;
}

export interface LocationEntity {
  id: string;
  scope: ProvenancedValue<GeographicScope>;
  serviceArea: ProvenancedValue<string>;
  physicalPremises: ProvenancedValue<boolean>;
  remoteAvailability: ProvenancedValue<boolean>;
  languages: ProvenancedValue<string[]>;
  marketPriority: ProvenancedValue<number>;
}

export interface GoalEntity {
  id: string;
  statement: ProvenancedValue<string>;
  priority: ProvenancedValue<number>;
  timeHorizon: ProvenancedValue<string>;
  successMetric: ProvenancedValue<string>;
  owner: ProvenancedValue<string>;
  progressState: ProvenancedValue<GoalProgressState>;
}

export interface ExpertiseNode {
  id: string;
  name: ProvenancedValue<string>;
  parentId?: string;
  children: ExpertiseNode[];
}

export interface TrustSignal {
  id: string;
  kind: ProvenancedValue<string>;
  label: ProvenancedValue<string>;
  evidence: ProvenancedValue<string[]>;
  verified: ProvenancedValue<boolean>;
}

export interface DigitalAsset {
  id: string;
  kind: ProvenancedValue<string>;
  url: ProvenancedValue<string>;
  label: ProvenancedValue<string>;
}

export interface CompetitorSeed {
  id: string;
  name: ProvenancedValue<string>;
  website?: ProvenancedValue<string>;
  relevanceConfidence: ProvenancedValue<number>;
  origin: ProvenancedValue<"user" | "onboarding_discovery">;
}

export interface CustomerQuestion {
  id: string;
  category: ProvenancedValue<QuestionCategory>;
  question: ProvenancedValue<string>;
}

export interface ConstraintEntity {
  id: string;
  kind: ProvenancedValue<string>;
  description: ProvenancedValue<string>;
}

export interface PreferenceRegistry {
  reportFrequency: ProvenancedValue<string>;
  automationLevel: ProvenancedValue<string>;
  aiDetailLevel: ProvenancedValue<string>;
  writingStyle: ProvenancedValue<string>;
  approvalThresholds: ProvenancedValue<Record<string, number>>;
}

export interface TeamMember {
  id: string;
  name: ProvenancedValue<string>;
  role: ProvenancedValue<string>;
}

export interface EnrichmentSuggestion {
  id: string;
  path: string;
  proposedValue: unknown;
  rationale: string;
  confidence: number;
  status: "pending" | "confirmed" | "rejected";
}

/**
 * Canonical Business Profile — sole understanding surface for downstream engines.
 */
export interface BusinessProfile {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  identity: IdentityProfile;
  brand: BrandProfile;
  products: OfferEntity[];
  services: OfferEntity[];
  locations: LocationEntity[];
  audience: AudienceProfile;
  goals: GoalEntity[];
  expertise: ExpertiseNode[];
  team: TeamMember[];
  trust: TrustSignal[];
  digitalAssets: DigitalAsset[];
  competitors: CompetitorSeed[];
  questions: CustomerQuestion[];
  constraints: ConstraintEntity[];
  preferences: PreferenceRegistry;
  pendingEnrichments: EnrichmentSuggestion[];
}

export interface CreateBusinessInput {
  legalName: string;
  tradingName: string;
  website: string;
  primaryDomain: string;
  businessDescription: string;
  industry: string;
  businessStage: BusinessStage;
  companyType: CompanyType;
  yearEstablished?: number;
  primaryContact: string;
  timeZone: string;
  primaryLanguage: string;
}
