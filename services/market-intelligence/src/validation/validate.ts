import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type {
  CreateMarketInput,
  GeographicScope,
  TimedObservation,
} from "../domain/types.js";

const SCOPES = new Set<GeographicScope>([
  "local",
  "regional",
  "national",
  "international",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateMarketInput(
  input: unknown,
): EngineResult<CreateMarketInput> {
  if (!input || typeof input !== "object") {
    return err({
      code: "VALIDATION_FAILED",
      message: "Create market input must be an object",
      retryable: false,
    });
  }
  const record = input as Record<string, unknown>;
  const missing: string[] = [];
  for (const field of [
    "tenantId",
    "name",
    "description",
    "industryScope",
  ] as const) {
    if (!isNonEmptyString(record[field])) {
      missing.push(field);
    }
  }
  if (!SCOPES.has(record.geographicScope as GeographicScope)) {
    missing.push("geographicScope");
  }
  if (missing.length > 0) {
    return err({
      code: "VALIDATION_FAILED",
      message: `Invalid create market input: ${missing.join(", ")}`,
      retryable: false,
      details: { missing },
    });
  }

  return ok({
    tenantId: String(record.tenantId).trim(),
    ...(isNonEmptyString(record.businessId)
      ? { businessId: record.businessId.trim() }
      : {}),
    name: String(record.name).trim(),
    description: String(record.description).trim(),
    industryScope: String(record.industryScope).trim(),
    geographicScope: record.geographicScope as GeographicScope,
    locationLabels: Array.isArray(record.locationLabels)
      ? record.locationLabels.map(String)
      : [],
  });
}

export function validateNonEmpty(
  value: unknown,
  field: string,
): EngineResult<string> {
  if (!isNonEmptyString(value)) {
    return err({
      code: "VALIDATION_FAILED",
      message: `${field} is required`,
      retryable: false,
    });
  }
  return ok(value.trim());
}

export function validateEvidenceInput(input: {
  sourceId?: unknown;
  observedAt?: unknown;
  scope?: unknown;
  confidence?: unknown;
}): EngineResult<{
  sourceId: string;
  observedAt: string;
  scope: GeographicScope;
  confidence: number;
}> {
  if (!isNonEmptyString(input.sourceId)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "sourceId is required for every observation",
      retryable: false,
    });
  }
  if (!isNonEmptyString(input.observedAt)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "observedAt is required for every observation",
      retryable: false,
    });
  }
  if (!SCOPES.has(input.scope as GeographicScope)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "geographic scope is required and must be preserved",
      retryable: false,
    });
  }
  const confidence =
    typeof input.confidence === "number" ? input.confidence : Number.NaN;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    return err({
      code: "VALIDATION_FAILED",
      message: "confidence must be a number between 0 and 1",
      retryable: false,
    });
  }
  return ok({
    sourceId: input.sourceId.trim(),
    observedAt: input.observedAt.trim(),
    scope: input.scope as GeographicScope,
    confidence,
  });
}

export function validateTrendObservations(
  observations: unknown,
): EngineResult<TimedObservation[]> {
  if (!Array.isArray(observations) || observations.length < 2) {
    return err({
      code: "TREND_REQUIRES_MULTIPLE_OBSERVATIONS",
      message:
        "Trends require observations from separate points in time (minimum 2)",
      retryable: false,
    });
  }

  const parsed: TimedObservation[] = [];
  for (const item of observations) {
    if (!item || typeof item !== "object") {
      return err({
        code: "VALIDATION_FAILED",
        message: "Invalid trend observation",
        retryable: false,
      });
    }
    const row = item as Record<string, unknown>;
    if (
      !isNonEmptyString(row.observedAt) ||
      !isNonEmptyString(row.note) ||
      !isNonEmptyString(row.sourceId) ||
      typeof row.confidence !== "number"
    ) {
      return err({
        code: "VALIDATION_FAILED",
        message: "Trend observation missing required fields",
        retryable: false,
      });
    }
    parsed.push({
      observedAt: row.observedAt.trim(),
      note: row.note.trim(),
      sourceId: row.sourceId.trim(),
      confidence: row.confidence,
    });
  }

  const distinctTimes = new Set(parsed.map((item) => item.observedAt));
  if (distinctTimes.size < 2) {
    return err({
      code: "TREND_REQUIRES_MULTIPLE_OBSERVATIONS",
      message:
        "Trends cannot be created from one observation (or identical timestamps)",
      retryable: false,
    });
  }

  return ok(parsed);
}

export function validateGapEvidence(
  supportingEvidenceIds: unknown,
): EngineResult<string[]> {
  if (!Array.isArray(supportingEvidenceIds) || supportingEvidenceIds.length < 1) {
    return err({
      code: "GAP_REQUIRES_EVIDENCE",
      message: "Unsupported gaps are rejected — supporting evidence is required",
      retryable: false,
    });
  }
  const ids = supportingEvidenceIds.map(String).filter((id) => id.trim());
  if (ids.length < 1) {
    return err({
      code: "GAP_REQUIRES_EVIDENCE",
      message: "Unsupported gaps are rejected — supporting evidence is required",
      retryable: false,
    });
  }
  return ok(ids);
}
