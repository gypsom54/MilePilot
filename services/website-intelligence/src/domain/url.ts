/**
 * Deterministic URL normalisation (Volume 6).
 * Does not strip subdomains — staging vs production hosts remain distinct.
 */

export function normaliseUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Unsupported URL protocol: ${parsed.protocol}`);
  }

  const protocol = parsed.protocol.toLowerCase();
  const host = parsed.hostname.toLowerCase();

  let port = parsed.port;
  if (
    (protocol === "http:" && port === "80") ||
    (protocol === "https:" && port === "443")
  ) {
    port = "";
  }

  let pathname = parsed.pathname.replace(/\/{2,}/g, "/");
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  if (!pathname) {
    pathname = "/";
  }

  const params = [...parsed.searchParams.entries()].sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1].localeCompare(b[1]);
    }
    return a[0].localeCompare(b[0]);
  });
  const search = new URLSearchParams();
  for (const [key, value] of params) {
    search.append(key, value);
  }
  const query = search.toString();

  const authority = port ? `${host}:${port}` : host;
  return query
    ? `${protocol}//${authority}${pathname}?${query}`
    : `${protocol}//${authority}${pathname}`;
}
