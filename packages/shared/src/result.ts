/**
 * Shared result envelope for engine outputs.
 * No domain/business fields — only transport shape.
 */
export type EngineResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: EngineError };

export interface EngineError {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export function ok<T>(value: T): EngineResult<T> {
  return { ok: true, value };
}

export function err(error: EngineError): EngineResult<never> {
  return { ok: false, error };
}
