import type { CrawlScope } from "../domain/types.js";
import type { AdapterObservation, CrawlAdapter } from "./types.js";

/**
 * Injected test adapter — accepts a stream/provider function. No network I/O.
 */
export class InjectedCrawlAdapter implements CrawlAdapter {
  readonly kind = "injected" as const;

  constructor(
    private readonly provider: (
      scope: CrawlScope,
    ) => AsyncIterable<AdapterObservation> | Iterable<AdapterObservation>,
  ) {}

  async *collect(
    scope: CrawlScope,
    options?: { signal?: AbortSignal },
  ): AsyncIterable<AdapterObservation> {
    const stream = this.provider(scope);
    const iterator =
      Symbol.asyncIterator in Object(stream)
        ? (stream as AsyncIterable<AdapterObservation>)
        : (async function* () {
            for (const item of stream as Iterable<AdapterObservation>) {
              yield item;
            }
          })();
    for await (const observation of iterator) {
      if (options?.signal?.aborted) {
        return;
      }
      yield observation;
    }
  }
}
