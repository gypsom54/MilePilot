import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type { CrawlScope } from "../domain/types.js";
import { normaliseUrl } from "../domain/url.js";

export function validateUrlAgainstScope(
  rawUrl: string,
  scope: CrawlScope,
): EngineResult<{ originalUrl: string; normalisedUrl: string }> {
  let normalisedUrl: string;
  try {
    normalisedUrl = normaliseUrl(rawUrl);
  } catch (cause) {
    return err({
      code: "UNSUPPORTED_PROTOCOL_OR_URL",
      message: cause instanceof Error ? cause.message : "Invalid URL",
      retryable: false,
    });
  }

  const parsed = new URL(normalisedUrl);
  const protocol = parsed.protocol.replace(":", "") as "http" | "https";
  if (!scope.allowedProtocols.includes(protocol)) {
    return err({
      code: "UNSUPPORTED_PROTOCOL",
      message: `Protocol not allowed by crawl scope: ${protocol}`,
      retryable: false,
    });
  }

  const host = parsed.hostname.toLowerCase();
  const allowedHosts = scope.allowedHosts.map((item) => item.toLowerCase());
  if (!allowedHosts.includes(host)) {
    return err({
      code: "OUT_OF_SCOPE_URL",
      message: `URL host out of crawl scope: ${host}`,
      retryable: false,
    });
  }

  const path = parsed.pathname || "/";
  if (
    scope.includePathPrefixes.length > 0 &&
    !scope.includePathPrefixes.some((prefix) => path.startsWith(prefix))
  ) {
    return err({
      code: "OUT_OF_SCOPE_URL",
      message: `URL path not in include prefixes: ${path}`,
      retryable: false,
    });
  }
  if (scope.excludePathPrefixes.some((prefix) => path.startsWith(prefix))) {
    return err({
      code: "OUT_OF_SCOPE_URL",
      message: `URL path excluded by crawl scope: ${path}`,
      retryable: false,
    });
  }

  return ok({ originalUrl: rawUrl.trim(), normalisedUrl });
}
