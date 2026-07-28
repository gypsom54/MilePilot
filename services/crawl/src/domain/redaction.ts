const SENSITIVE_HEADER_NAMES = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "proxy-authorization",
  "x-api-key",
  "x-auth-token",
  "x-session-token",
]);

const SENSITIVE_PAYLOAD_KEYS = new Set([
  "authorization",
  "cookie",
  "setCookie",
  "set-cookie",
  "password",
  "apiKey",
  "api_key",
  "sessionToken",
  "session_token",
  "formValues",
  "form_submission_values",
  "rawBody",
  "responseBody",
  "confidentialBody",
]);

export function redactHeaders(
  headers: Record<string, unknown> | undefined,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (!headers) return result;
  for (const [key, value] of Object.entries(headers)) {
    if (SENSITIVE_HEADER_NAMES.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = String(value);
    }
  }
  return result;
}

export function redactPayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_PAYLOAD_KEYS.has(key) || SENSITIVE_HEADER_NAMES.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
      continue;
    }
    if (key === "headers" && value && typeof value === "object") {
      result[key] = redactHeaders(value as Record<string, unknown>);
      continue;
    }
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === "object"
          ? redactPayload(item as Record<string, unknown>)
          : item,
      );
      continue;
    }
    if (value && typeof value === "object") {
      result[key] = redactPayload(value as Record<string, unknown>);
      continue;
    }
    result[key] = value;
  }
  return result;
}

export function isSensitiveHeaderName(name: string): boolean {
  return SENSITIVE_HEADER_NAMES.has(name.toLowerCase());
}
