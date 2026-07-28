import { createHash } from "node:crypto";
import type { EvidenceMeta, Freshness, GeographicScope } from "./types.js";

export function computeFreshness(
  nowIso: string,
  expiresAt?: string,
  staleBeforeExpiryMs = 1000 * 60 * 60 * 24 * 7,
): Freshness {
  if (!expiresAt) {
    return "fresh";
  }
  const now = Date.parse(nowIso);
  const expires = Date.parse(expiresAt);
  if (Number.isNaN(now) || Number.isNaN(expires)) {
    return "fresh";
  }
  if (now >= expires) {
    return "expired";
  }
  if (expires - now <= staleBeforeExpiryMs) {
    return "stale";
  }
  return "fresh";
}

export function createEvidenceMeta(input: {
  sourceId: string;
  observedAt: string;
  scope: GeographicScope;
  provenance: string;
  confidence: number;
  limitations?: string[];
  expiresAt?: string;
  now?: string;
}): EvidenceMeta {
  const now = input.now ?? new Date().toISOString();
  return {
    sourceId: input.sourceId,
    observedAt: input.observedAt,
    scope: input.scope,
    provenance: input.provenance,
    confidence: input.confidence,
    limitations: input.limitations ?? [],
    ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt } : {}),
    freshness: computeFreshness(now, input.expiresAt),
  };
}

/** Current confidence contribution — expired/stale evidence weighs less. */
export function effectiveConfidence(evidence: EvidenceMeta): number {
  if (evidence.freshness === "expired") {
    return evidence.confidence * 0.25;
  }
  if (evidence.freshness === "stale") {
    return evidence.confidence * 0.6;
  }
  return evidence.confidence;
}

export function buildIdempotencyKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}
