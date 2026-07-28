import {
  EngineLogCategory,
  type EngineLogEntry,
  type EngineLogger,
  type LogLevel,
} from "./types.js";

export type LogSink = (entry: EngineLogEntry) => void;

const defaultSink: LogSink = (entry) => {
  const line = JSON.stringify(entry);
  if (entry.level === "error") {
    console.error(line);
    return;
  }
  if (entry.level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
};

/**
 * Structured logger used by every Intelligence Engine.
 */
export class StructuredEngineLogger implements EngineLogger {
  constructor(
    private readonly engine: string,
    private readonly sink: LogSink = defaultSink,
  ) {}

  log(
    entry: Omit<EngineLogEntry, "occurredAt" | "engine"> & {
      occurredAt?: string;
      engine?: string;
    },
  ): void {
    this.sink({
      level: entry.level,
      category: entry.category,
      engine: entry.engine ?? this.engine,
      message: entry.message,
      occurredAt: entry.occurredAt ?? new Date().toISOString(),
      ...(entry.details !== undefined ? { details: entry.details } : {}),
      ...(entry.correlationId !== undefined
        ? { correlationId: entry.correlationId }
        : {}),
    });
  }

  started(message: string, details?: Record<string, unknown>): void {
    this.categoryLog("info", EngineLogCategory.Started, message, details);
  }

  completed(message: string, details?: Record<string, unknown>): void {
    this.categoryLog("info", EngineLogCategory.Completed, message, details);
  }

  failed(message: string, details?: Record<string, unknown>): void {
    this.categoryLog("error", EngineLogCategory.Failed, message, details);
  }

  retry(message: string, details?: Record<string, unknown>): void {
    this.categoryLog("warn", EngineLogCategory.Retry, message, details);
  }

  learning(message: string, details?: Record<string, unknown>): void {
    this.categoryLog("info", EngineLogCategory.Learning, message, details);
  }

  recommendation(message: string, details?: Record<string, unknown>): void {
    this.categoryLog(
      "info",
      EngineLogCategory.Recommendation,
      message,
      details,
    );
  }

  automation(message: string, details?: Record<string, unknown>): void {
    this.categoryLog("info", EngineLogCategory.Automation, message, details);
  }

  private categoryLog(
    level: LogLevel,
    category: string,
    message: string,
    details?: Record<string, unknown>,
  ): void {
    this.log({
      level,
      category,
      message,
      ...(details !== undefined ? { details } : {}),
    });
  }
}
