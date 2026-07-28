import type {
  EngineConfig,
  EngineLogger,
  EngineResult,
  EventBus,
} from "@seo-autopilot/shared";

/**
 * Inputs/outputs are opaque at the SDK layer.
 * Concrete shapes are defined by each engine's later specification volumes.
 */
export type EngineInput = Record<string, unknown>;
export type EngineOutput = Record<string, unknown>;

export interface EngineHealth {
  status: "healthy" | "degraded" | "unhealthy";
  checkedAt: string;
  details?: Record<string, unknown>;
}

/**
 * Every Intelligence Engine MUST implement this interface.
 * No engine may invent its own top-level structure.
 */
export interface IntelligenceEngine {
  readonly name: string;
  readonly purpose: string;
  readonly version: string;
  readonly inputs: string[];
  readonly outputs: string[];
  readonly events: string[];
  readonly dependencies: string[];

  analyse(input: EngineInput): Promise<EngineResult<EngineOutput>>;
  recommend(input: EngineInput): Promise<EngineResult<EngineOutput>>;
  automate(input: EngineInput): Promise<EngineResult<EngineOutput>>;
  health(): Promise<EngineHealth>;
}

export interface EngineContext {
  config: EngineConfig;
  events: EventBus;
  logger: EngineLogger;
}

export interface EngineFactory {
  create(context: EngineContext): IntelligenceEngine;
}

/**
 * Sprint 0 scaffold helper — methods intentionally unimplemented.
 * Future sprints replace NotImplementedEngine with real engines.
 */
export abstract class BaseIntelligenceEngine implements IntelligenceEngine {
  abstract readonly name: string;
  abstract readonly purpose: string;
  abstract readonly version: string;
  abstract readonly inputs: string[];
  abstract readonly outputs: string[];
  abstract readonly events: string[];
  abstract readonly dependencies: string[];

  protected constructor(protected readonly context: EngineContext) {}

  async analyse(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    return this.notImplemented("analyse");
  }

  async recommend(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    return this.notImplemented("recommend");
  }

  async automate(_input: EngineInput): Promise<EngineResult<EngineOutput>> {
    return this.notImplemented("automate");
  }

  async health(): Promise<EngineHealth> {
    return {
      status: "healthy",
      checkedAt: new Date().toISOString(),
      details: { scaffold: true },
    };
  }

  private notImplemented(operation: string): EngineResult<EngineOutput> {
    this.context.logger.failed(`${operation} not implemented`, {
      engine: this.name,
      sprint: 0,
    });
    return {
      ok: false,
      error: {
        code: "ENGINE_NOT_IMPLEMENTED",
        message: `${this.name}.${operation} is not implemented in Sprint 0`,
        retryable: false,
      },
    };
  }
}
