/**
 * Canonical engine log categories.
 * Every engine must log through these categories for consistent observability.
 */
export const EngineLogCategory = {
  Started: "Started",
  Completed: "Completed",
  Failed: "Failed",
  Retry: "Retry",
  Learning: "Learning",
  Recommendation: "Recommendation",
  Automation: "Automation",
} as const;

export type EngineLogCategory =
  (typeof EngineLogCategory)[keyof typeof EngineLogCategory];

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface EngineLogEntry {
  level: LogLevel;
  category: EngineLogCategory | string;
  engine: string;
  message: string;
  occurredAt: string;
  details?: Record<string, unknown>;
  correlationId?: string;
}

export interface EngineLogger {
  log(entry: Omit<EngineLogEntry, "occurredAt"> & { occurredAt?: string }): void;
  started(message: string, details?: Record<string, unknown>): void;
  completed(message: string, details?: Record<string, unknown>): void;
  failed(message: string, details?: Record<string, unknown>): void;
  retry(message: string, details?: Record<string, unknown>): void;
  learning(message: string, details?: Record<string, unknown>): void;
  recommendation(message: string, details?: Record<string, unknown>): void;
  automation(message: string, details?: Record<string, unknown>): void;
}
