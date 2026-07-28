import { randomUUID } from "node:crypto";
import { createProvenancedValue } from "@seo-autopilot/shared";
import type { BusinessProfile, CreateBusinessInput } from "./types.js";

export function createEmptyBrand() {
  return {
    tone: createProvenancedValue(""),
    values: createProvenancedValue<string[]>([]),
    uniqueSellingProposition: createProvenancedValue(""),
    positioning: createProvenancedValue(""),
    positioningTier: createProvenancedValue<"premium" | "value" | "specialist">(
      "specialist",
    ),
    writingStyle: createProvenancedValue(""),
    preferredTerminology: createProvenancedValue<string[]>([]),
    neverSays: createProvenancedValue<string[]>([]),
    complianceRestrictions: createProvenancedValue<string[]>([]),
  };
}

export function createEmptyAudience() {
  return {
    primaryAudience: createProvenancedValue(""),
    secondaryAudience: createProvenancedValue<string[]>([]),
    industriesServed: createProvenancedValue<string[]>([]),
    customerProblems: createProvenancedValue<string[]>([]),
    customerGoals: createProvenancedValue<string[]>([]),
    buyingTriggers: createProvenancedValue<string[]>([]),
    objections: createProvenancedValue<string[]>([]),
    decisionMakers: createProvenancedValue<string[]>([]),
    preferredCommunicationStyle: createProvenancedValue(""),
  };
}

export function createDefaultPreferences() {
  return {
    reportFrequency: createProvenancedValue("weekly"),
    automationLevel: createProvenancedValue("suggest"),
    aiDetailLevel: createProvenancedValue("guided"),
    writingStyle: createProvenancedValue(""),
    approvalThresholds: createProvenancedValue<Record<string, number>>({
      default: 0.65,
    }),
  };
}

export function createBusinessProfileFromInput(
  input: CreateBusinessInput,
): BusinessProfile {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    version: 1,
    createdAt: now,
    updatedAt: now,
    identity: {
      legalName: createProvenancedValue(input.legalName),
      tradingName: createProvenancedValue(input.tradingName),
      website: createProvenancedValue(input.website),
      primaryDomain: createProvenancedValue(input.primaryDomain),
      businessDescription: createProvenancedValue(input.businessDescription),
      industry: createProvenancedValue(input.industry),
      businessStage: createProvenancedValue(input.businessStage),
      companyType: createProvenancedValue(input.companyType),
      ...(input.yearEstablished !== undefined
        ? {
            yearEstablished: createProvenancedValue(input.yearEstablished),
          }
        : {}),
      primaryContact: createProvenancedValue(input.primaryContact),
      timeZone: createProvenancedValue(input.timeZone),
      primaryLanguage: createProvenancedValue(input.primaryLanguage),
    },
    brand: createEmptyBrand(),
    products: [],
    services: [],
    locations: [],
    audience: createEmptyAudience(),
    goals: [],
    expertise: [],
    team: [],
    trust: [],
    digitalAssets: [],
    competitors: [],
    questions: [],
    constraints: [],
    preferences: createDefaultPreferences(),
    pendingEnrichments: [],
  };
}
