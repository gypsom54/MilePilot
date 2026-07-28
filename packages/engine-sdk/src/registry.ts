import type { EngineConfig, EngineRuntimeStatus } from "@seo-autopilot/shared";
import type { EngineHealth, IntelligenceEngine } from "./intelligence-engine.js";

/**
 * Plugin-style registration record for every Intelligence Engine.
 */
export interface EngineRegistration {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  events: string[];
  status: EngineRuntimeStatus;
  engine: IntelligenceEngine;
  config: EngineConfig;
}

export interface EngineRegistry {
  register(registration: EngineRegistration): void;
  unregister(name: string): void;
  get(name: string): EngineRegistration | undefined;
  list(): EngineRegistration[];
  healthCheck(name: string): Promise<EngineHealth | undefined>;
  healthCheckAll(): Promise<Record<string, EngineHealth>>;
}

/**
 * In-memory Engine Registry — plugin architecture foundation.
 */
export class InMemoryEngineRegistry implements EngineRegistry {
  private readonly engines = new Map<string, EngineRegistration>();

  register(registration: EngineRegistration): void {
    if (this.engines.has(registration.name)) {
      throw new Error(
        `Engine already registered: ${registration.name}`,
      );
    }
    this.engines.set(registration.name, registration);
  }

  unregister(name: string): void {
    this.engines.delete(name);
  }

  get(name: string): EngineRegistration | undefined {
    return this.engines.get(name);
  }

  list(): EngineRegistration[] {
    return [...this.engines.values()];
  }

  async healthCheck(name: string): Promise<EngineHealth | undefined> {
    const registration = this.engines.get(name);
    if (!registration) {
      return undefined;
    }
    return registration.engine.health();
  }

  async healthCheckAll(): Promise<Record<string, EngineHealth>> {
    const result: Record<string, EngineHealth> = {};
    for (const registration of this.engines.values()) {
      result[registration.name] = await registration.engine.health();
    }
    return result;
  }
}
