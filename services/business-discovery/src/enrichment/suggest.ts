import { randomUUID } from "node:crypto";
import type {
  BusinessProfile,
  EnrichmentSuggestion,
} from "../domain/types.js";

/**
 * Propose enrichments only — never silently applied (Volume 4).
 */
export function proposeEnrichments(
  profile: BusinessProfile,
): EnrichmentSuggestion[] {
  const suggestions: EnrichmentSuggestion[] = [];

  if (!profile.identity.primaryDomain.value && profile.identity.website.value) {
    try {
      const host = new URL(profile.identity.website.value).hostname;
      suggestions.push({
        id: randomUUID(),
        path: "identity.primaryDomain",
        proposedValue: host.replace(/^www\./, ""),
        rationale: "Derived from website URL",
        confidence: 0.8,
        status: "pending",
      });
    } catch {
      // ignore invalid URL — validation should already have caught this
    }
  }

  if (!profile.brand.uniqueSellingProposition.value) {
    suggestions.push({
      id: randomUUID(),
      path: "brand.uniqueSellingProposition",
      proposedValue: `${profile.identity.tradingName.value} specialises in ${profile.identity.industry.value}`,
      rationale: "Draft USP from trading name and industry — requires confirmation",
      confidence: 0.45,
      status: "pending",
    });
  }

  if (profile.expertise.length === 0 && profile.identity.industry.value) {
    suggestions.push({
      id: randomUUID(),
      path: "expertise",
      proposedValue: [
        {
          name: profile.identity.industry.value,
          children: [],
        },
      ],
      rationale: "Seed expertise map from industry — requires confirmation",
      confidence: 0.4,
      status: "pending",
    });
  }

  return suggestions;
}
