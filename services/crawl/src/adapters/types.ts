import type { CrawlObservation, CrawlScope } from "../domain/types.js";

/**
 * CrawlAdapter contract — fixture/injected only in Sprint 4.
 * No live HTTP / browser / network collection.
 */
export interface CrawlAdapter {
  readonly kind: "fixture" | "injected";
  /**
   * Stream observations for a job. Implementations must not perform production network I/O.
   */
  collect(
    scope: CrawlScope,
    options?: { signal?: AbortSignal },
  ): AsyncIterable<Omit<CrawlObservation, "id" | "recordedAt" | "idempotencyKey" | "scopeEnvironment"> & {
    idempotencyKey?: string;
  }>;
}

export type AdapterObservation = Omit<
  CrawlObservation,
  "id" | "recordedAt" | "idempotencyKey" | "scopeEnvironment"
> & { idempotencyKey?: string };
