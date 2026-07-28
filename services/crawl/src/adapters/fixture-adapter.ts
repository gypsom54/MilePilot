import type { CrawlScope } from "../domain/types.js";
import type { AdapterObservation, CrawlAdapter } from "./types.js";

/**
 * Fixture adapter — yields prebuilt observations. No network I/O.
 */
export class FixtureCrawlAdapter implements CrawlAdapter {
  readonly kind = "fixture" as const;

  constructor(private readonly fixtures: AdapterObservation[]) {}

  async *collect(
    _scope: CrawlScope,
    options?: { signal?: AbortSignal },
  ): AsyncIterable<AdapterObservation> {
    for (const observation of this.fixtures) {
      if (options?.signal?.aborted) {
        return;
      }
      yield observation;
    }
  }
}
