import type { EngineResult } from "@seo-autopilot/shared";
import { err, ok } from "@seo-autopilot/shared";
import type { CreateBusinessInput } from "../domain/types.js";

const REQUIRED_STRING_FIELDS: Array<keyof CreateBusinessInput> = [
  "legalName",
  "tradingName",
  "website",
  "primaryDomain",
  "businessDescription",
  "industry",
  "primaryContact",
  "timeZone",
  "primaryLanguage",
];

const STAGES = new Set([
  "idea",
  "startup",
  "growth",
  "established",
  "enterprise",
]);

const COMPANY_TYPES = new Set([
  "sole_trader",
  "partnership",
  "limited_company",
  "llp",
  "non_profit",
  "other",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateBusinessInput(
  input: unknown,
): EngineResult<CreateBusinessInput> {
  if (!input || typeof input !== "object") {
    return err({
      code: "VALIDATION_FAILED",
      message: "Create business input must be an object",
      retryable: false,
    });
  }

  const record = input as Record<string, unknown>;
  const missing: string[] = [];

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(record[field])) {
      missing.push(field);
    }
  }

  if (!STAGES.has(String(record.businessStage))) {
    missing.push("businessStage");
  }
  if (!COMPANY_TYPES.has(String(record.companyType))) {
    missing.push("companyType");
  }

  if (
    record.yearEstablished !== undefined &&
    (typeof record.yearEstablished !== "number" ||
      !Number.isFinite(record.yearEstablished))
  ) {
    missing.push("yearEstablished");
  }

  if (missing.length > 0) {
    return err({
      code: "VALIDATION_FAILED",
      message: `Invalid create business input: ${missing.join(", ")}`,
      retryable: false,
      details: { missing },
    });
  }

  const website = String(record.website);
  if (!/^https?:\/\//i.test(website)) {
    return err({
      code: "VALIDATION_FAILED",
      message: "website must be an absolute http(s) URL",
      retryable: false,
    });
  }

  return ok({
    legalName: String(record.legalName).trim(),
    tradingName: String(record.tradingName).trim(),
    website: website.trim(),
    primaryDomain: String(record.primaryDomain).trim(),
    businessDescription: String(record.businessDescription).trim(),
    industry: String(record.industry).trim(),
    businessStage: record.businessStage as CreateBusinessInput["businessStage"],
    companyType: record.companyType as CreateBusinessInput["companyType"],
    ...(typeof record.yearEstablished === "number"
      ? { yearEstablished: record.yearEstablished }
      : {}),
    primaryContact: String(record.primaryContact).trim(),
    timeZone: String(record.timeZone).trim(),
    primaryLanguage: String(record.primaryLanguage).trim(),
  });
}

export function validateNonEmptyName(
  name: unknown,
  field = "name",
): EngineResult<string> {
  if (!isNonEmptyString(name)) {
    return err({
      code: "VALIDATION_FAILED",
      message: `${field} is required`,
      retryable: false,
    });
  }
  return ok(name.trim());
}
