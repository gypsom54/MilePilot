import { EngineRegistry } from "../engine-registry/engine-registry.js";
import { ToolRegistry } from "../tool-registry/tool-registry.js";
import { DeterministicIntentRouter } from "../intent-router/deterministic-intent-router.js";
import { ResponseBuilder } from "../response-builder/response-builder.js";
import { AuditLogger } from "../audit-logger/audit-logger.js";
import { WorkflowRunner } from "../workflow-runner/workflow-runner.js";

export class AmosCore {
  constructor({ logger } = {}) {
    this.logger = logger || console;
    this.engineRegistry = new EngineRegistry({ logger: this.logger });
    this.toolRegistry = new ToolRegistry({ engineRegistry: this.engineRegistry, logger: this.logger });
    this.intentRouter = new DeterministicIntentRouter();
    this.responseBuilder = new ResponseBuilder();
    this.auditLogger = new AuditLogger({ logger: this.logger });
    this.workflowRunner = new WorkflowRunner({
      intentRouter: this.intentRouter,
      engineRegistry: this.engineRegistry,
      toolRegistry: this.toolRegistry,
      responseBuilder: this.responseBuilder,
      auditLogger: this.auditLogger,
      logger: this.logger,
    });
  }

  async registerEngine(engine) {
    this.engineRegistry.register(engine);
    await this.engineRegistry.runHealthChecks();
    this.toolRegistry.loadToolsFromEngines();
  }

  async run(requestText) {
    return this.workflowRunner.run(requestText);
  }

  getDiagnostics() {
    return {
      engines: this.engineRegistry.getAvailability(),
      tools: this.toolRegistry.listTools(),
      audits: this.auditLogger.list(),
    };
  }
}
