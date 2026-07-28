import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import { normaliseUrl } from "../domain/url.js";
import type {
  CreateWebsiteInput,
  PageEntity,
  PropertyEnvironment,
  PublicationState,
} from "../domain/types.js";

const ENVIRONMENTS = new Set<PropertyEnvironment>([
  "production",
  "staging",
  "other",
]);

const PUBLICATION_STATES = new Set<PublicationState>([
  "draft",
  "published",
  "redirected",
  "archived",
  "deleted",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateWebsiteInput(
  input: unknown,
): EngineResult<CreateWebsiteInput> {
  if (!input || typeof input !== "object") {
    return err({
      code: "VALIDATION_FAILED",
      message: "Create website input must be an object",
      retryable: false,
    });
  }
  const record = input as Record<string, unknown>;
  if (!isNonEmptyString(record.tenantId) || !isNonEmptyString(record.name)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "tenantId and name are required",
      retryable: false,
    });
  }
  return ok({
    tenantId: record.tenantId.trim(),
    name: record.name.trim(),
    ...(isNonEmptyString(record.businessId)
      ? { businessId: record.businessId.trim() }
      : {}),
  });
}

export function validateObservation(input: {
  sourceId?: unknown;
  observedAt?: unknown;
  confidence?: unknown;
}): EngineResult<{ sourceId: string; observedAt: string; confidence: number }> {
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
  const confidence =
    typeof input.confidence === "number" ? input.confidence : Number.NaN;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    return err({
      code: "VALIDATION_FAILED",
      message: "confidence must be between 0 and 1",
      retryable: false,
    });
  }
  return ok({
    sourceId: input.sourceId.trim(),
    observedAt: input.observedAt.trim(),
    confidence,
  });
}

export function validatePropertyEnvironment(
  value: unknown,
): EngineResult<PropertyEnvironment> {
  if (!ENVIRONMENTS.has(value as PropertyEnvironment)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "environment must be production, staging, or other",
      retryable: false,
    });
  }
  return ok(value as PropertyEnvironment);
}

export function validateAndNormaliseUrl(rawUrl: unknown): EngineResult<{
  rawUrl: string;
  normalisedUrl: string;
}> {
  if (!isNonEmptyString(rawUrl)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "url is required",
      retryable: false,
    });
  }
  try {
    const normalisedUrl = normaliseUrl(rawUrl);
    return ok({ rawUrl: rawUrl.trim(), normalisedUrl });
  } catch (cause) {
    return err({
      code: "INVALID_URL",
      message: cause instanceof Error ? cause.message : "Invalid URL",
      retryable: false,
    });
  }
}

export function validatePublicationState(
  value: unknown,
): EngineResult<PublicationState> {
  if (!PUBLICATION_STATES.has(value as PublicationState)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "Invalid publication state",
      retryable: false,
    });
  }
  return ok(value as PublicationState);
}

/**
 * Rejects circular page hierarchy within a website.
 */
export function wouldCreateHierarchyLoop(
  pages: PageEntity[],
  pageId: string,
  parentPageId: string,
): boolean {
  if (pageId === parentPageId) {
    return true;
  }
  const byId = new Map(pages.map((page) => [page.id, page]));
  let current: string | undefined = parentPageId;
  const seen = new Set<string>();
  while (current) {
    if (current === pageId) {
      return true;
    }
    if (seen.has(current)) {
      return true;
    }
    seen.add(current);
    current = byId.get(current)?.parentPageId;
  }
  return false;
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
