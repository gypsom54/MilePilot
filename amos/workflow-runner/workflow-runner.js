import { ensureResultEnvelope } from "../contracts/validators.js";

function workflowId() {
  return `amos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class WorkflowRunner {
  constructor({ intentRouter, engineRegistry, toolRegistry, responseBuilder, auditLogger, logger } = {}) {
    this.intentRouter = intentRouter;
    this.engineRegistry = engineRegistry;
    this.toolRegistry = toolRegistry;
    this.responseBuilder = responseBuilder;
    this.auditLogger = auditLogger;
    this.logger = logger || console;
  }

  async run(requestText) {
    const startedAt = Date.now();
    const id = workflowId();
    const timestamp = new Date().toISOString();

    const writeAudit = (patch) => {
      this.auditLogger?.write?.({
        workflowId: id,
        timestamp,
        requestText,
        durationMs: Date.now() - startedAt,
        ...patch,
      });
    };

    try {
      const routedIntent = this.intentRouter.route(requestText);

      if (!routedIntent || routedIntent.intentId === "unsupported" || routedIntent.requiresClarification) {
        const response = this.responseBuilder.buildUnsupported({ workflowId: id });
        writeAudit({
          routedIntent: routedIntent?.intentId || "unsupported",
          status: "unsupported",
        });
        return { response, workflowId: id };
      }

      const tool = this.toolRegistry.getTool(routedIntent.toolId);
      if (!tool) {
        const response = this.responseBuilder.buildFailure({
          workflowId: id,
          message: "The routed tool is not registered.",
        });
        writeAudit({
          routedIntent: routedIntent.intentId,
          selectedTool: routedIntent.toolId,
          status: "failed",
          errorCode: "UNREGISTERED_TOOL",
        });
        return { response, workflowId: id };
      }

      const engine = this.engineRegistry.getEngine(tool.engineId);
      if (!engine || !this.engineRegistry.isEngineHealthy(tool.engineId)) {
        const response = this.responseBuilder.buildFailure({
          workflowId: id,
          message: "The required engine is currently unavailable.",
        });
        writeAudit({
          routedIntent: routedIntent.intentId,
          selectedTool: tool.id,
          engineId: tool.engineId,
          status: "failed",
          errorCode: "ENGINE_UNAVAILABLE",
        });
        return { response, workflowId: id };
      }

      if (!["read", "prepare", "communicate", "modify"].includes(tool.permission)) {
        const response = this.responseBuilder.buildFailure({
          workflowId: id,
          message: "Tool permission metadata is invalid.",
        });
        writeAudit({
          routedIntent: routedIntent.intentId,
          selectedTool: tool.id,
          engineId: tool.engineId,
          status: "failed",
          errorCode: "INVALID_TOOL_PERMISSION",
        });
        return { response, workflowId: id };
      }

      const rawResult = await engine.executeTool(tool.id, routedIntent.parameters, {
        workflowId: id,
        requestText,
        timestamp,
      });

      const result = ensureResultEnvelope(rawResult, tool.engineId, tool.id);
      if (!result.success) {
        const response = this.responseBuilder.buildFailure({
          workflowId: id,
          message: result.error?.message || "Tool execution failed.",
        });
        writeAudit({
          routedIntent: routedIntent.intentId,
          selectedTool: tool.id,
          engineId: tool.engineId,
          status: "failed",
          errorCode: result.error?.code || "TOOL_FAILED",
        });
        return { response, workflowId: id, toolResult: result };
      }

      const response = this.responseBuilder.buildSuccess({
        workflowId: id,
        intent: routedIntent,
        toolId: tool.id,
        toolData: result.data,
      });

      writeAudit({
        routedIntent: routedIntent.intentId,
        selectedTool: tool.id,
        engineId: tool.engineId,
        status: "success",
      });

      return { response, workflowId: id, toolResult: result };
    } catch (error) {
      this.logger.error?.("[AMOS][WorkflowRunner] unexpected failure", {
        workflowId: id,
        error: error?.message || String(error),
      });
      const response = this.responseBuilder.buildFailure({
        workflowId: id,
        message: "Unexpected AMOS workflow failure.",
      });
      writeAudit({
        status: "failed",
        errorCode: "WORKFLOW_EXCEPTION",
      });
      return { response, workflowId: id };
    }
  }
}
