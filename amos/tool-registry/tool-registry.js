import { validateToolDefinition } from "../contracts/validators.js";

function toolCategory(toolId) {
  if (!toolId || typeof toolId !== "string") return "unknown";
  const idx = toolId.indexOf(".");
  return idx > 0 ? toolId.slice(0, idx) : "unknown";
}

export class ToolRegistry {
  constructor({ engineRegistry, logger } = {}) {
    this.engineRegistry = engineRegistry;
    this.tools = new Map();
    this.logger = logger || console;
  }

  registerTool(tool) {
    validateToolDefinition(tool);
    if (!this.engineRegistry?.getEngine(tool.engineId)) {
      throw new Error(`Tool engine is not registered: ${tool.engineId}`);
    }
    if (this.tools.has(tool.id)) {
      throw new Error(`Duplicate tool id: ${tool.id}`);
    }
    this.tools.set(tool.id, tool);
    this.logger.info?.("[AMOS][ToolRegistry] tool registered", {
      toolId: tool.id,
      engineId: tool.engineId,
      permission: tool.permission,
      confirmationRequired: tool.confirmationRequired,
    });
  }

  loadToolsFromEngines() {
    const engines = this.engineRegistry?.listEngines?.() || [];
    for (const engine of engines) {
      const tools = engine.getTools();
      for (const tool of tools) {
        this.registerTool(tool);
      }
    }
  }

  getTool(toolId) {
    return this.tools.get(toolId) || null;
  }

  getToolsByEngine(engineId) {
    return Array.from(this.tools.values()).filter((tool) => tool.engineId === engineId);
  }

  getToolsByCategory(category) {
    return Array.from(this.tools.values()).filter((tool) => toolCategory(tool.id) === category);
  }

  listTools() {
    return Array.from(this.tools.values());
  }

  isAvailable(toolId) {
    const tool = this.getTool(toolId);
    if (!tool) return false;
    return this.engineRegistry?.isEngineHealthy?.(tool.engineId) !== false;
  }
}
