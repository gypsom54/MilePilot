import { validateEngineContract } from "../contracts/validators.js";

export class EngineRegistry {
  constructor({ logger } = {}) {
    this.engines = new Map();
    this.availability = new Map();
    this.logger = logger || console;
  }

  register(engine) {
    validateEngineContract(engine);
    if (this.engines.has(engine.id)) {
      throw new Error(`Duplicate engine id: ${engine.id}`);
    }
    this.engines.set(engine.id, engine);
    this.availability.set(engine.id, { healthy: true, details: "registered" });
    this.logger.info?.("[AMOS][EngineRegistry] engine registered", {
      engineId: engine.id,
      version: engine.version,
    });
    return engine;
  }

  getEngine(engineId) {
    return this.engines.get(engineId) || null;
  }

  listEngines() {
    return Array.from(this.engines.values());
  }

  getAvailability() {
    const out = {};
    for (const [engineId, state] of this.availability.entries()) {
      out[engineId] = { ...state };
    }
    return out;
  }

  async runHealthChecks() {
    const results = [];
    for (const engine of this.engines.values()) {
      try {
        const health = await engine.healthCheck();
        const healthy = !!health?.ok;
        const details = health?.details || (healthy ? "ok" : "unhealthy");
        this.availability.set(engine.id, { healthy, details });
        results.push({ engineId: engine.id, healthy, details });
        this.logger.info?.("[AMOS][EngineRegistry] health check", {
          engineId: engine.id,
          healthy,
          details,
        });
      } catch (error) {
        this.availability.set(engine.id, {
          healthy: false,
          details: error?.message || "health check failed",
        });
        results.push({
          engineId: engine.id,
          healthy: false,
          details: error?.message || "health check failed",
        });
        this.logger.error?.("[AMOS][EngineRegistry] health check failed", {
          engineId: engine.id,
          error: error?.message || String(error),
        });
      }
    }
    return results;
  }

  isEngineHealthy(engineId) {
    const entry = this.availability.get(engineId);
    return !!entry?.healthy;
  }
}
