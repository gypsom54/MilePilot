import type { ConfigurationProvider, EngineConfig } from "./types.js";

/**
 * In-memory configuration provider for Sprint 0.
 * Later sprints may swap this for file/env/remote providers without changing engines.
 */
export class InMemoryConfigurationProvider implements ConfigurationProvider {
  private readonly configs = new Map<string, EngineConfig>();

  getEngineConfig(engineName: string): EngineConfig | undefined {
    return this.configs.get(engineName);
  }

  listEngineConfigs(): EngineConfig[] {
    return [...this.configs.values()];
  }

  setEngineConfig(config: EngineConfig): void {
    this.configs.set(config.name, config);
  }
}

export function createDefaultEngineConfig(
  partial: Pick<EngineConfig, "name" | "version" | "description"> &
    Partial<EngineConfig>,
): EngineConfig {
  return {
    name: partial.name,
    version: partial.version,
    description: partial.description,
    limits: partial.limits ?? {
      maxConcurrentJobs: 1,
      maxInputBytes: 1_048_576,
      maxOutputBytes: 1_048_576,
    },
    timeouts: partial.timeouts ?? {
      analyseMs: 30_000,
      recommendMs: 30_000,
      automateMs: 30_000,
      healthMs: 5_000,
    },
    featureFlags: partial.featureFlags ?? {},
    dependencies: partial.dependencies ?? [],
    status: partial.status ?? "registered",
    settings: partial.settings ?? {},
  };
}
