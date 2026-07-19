import assert from "node:assert/strict";
import { EngineRegistry } from "../engine-registry/engine-registry.js";
import { ToolRegistry } from "../tool-registry/tool-registry.js";

function makeEngine() {
  return {
    id: "journey-engine",
    name: "Journey",
    version: "1.0.0",
    async healthCheck() {
      return { ok: true };
    },
    getTools() {
      return [
        {
          id: "journey.getMileageSummary",
          engineId: "journey-engine",
          name: "Weekly miles",
          description: "trusted miles",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {},
          outputSchema: {},
          version: "1.0.0",
        },
        {
          id: "journey.getTodayTrips",
          engineId: "journey-engine",
          name: "Today trips",
          description: "trusted today trips",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {},
          outputSchema: {},
          version: "1.0.0",
        },
        {
          id: "journey.getTripHistory",
          engineId: "journey-engine",
          name: "Trip history",
          description: "trusted history",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {},
          outputSchema: {},
          version: "1.0.0",
        },
        {
          id: "journey.getPendingReviews",
          engineId: "journey-engine",
          name: "Pending reviews",
          description: "trusted pending reviews",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {},
          outputSchema: {},
          version: "1.0.0",
        },
        {
          id: "journey.getJourneyById",
          engineId: "journey-engine",
          name: "Journey by id",
          description: "trusted journey by id",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {},
          outputSchema: {},
          version: "1.0.0",
        },
      ];
    },
    async executeTool() {
      return { success: true, metadata: { engineId: "journey-engine", toolId: "journey.getMileageSummary", durationMs: 1 } };
    },
  };
}

export async function runToolRegistryTests() {
  const engineRegistry = new EngineRegistry({ logger: { info() {}, error() {} } });
  engineRegistry.register(makeEngine());
  await engineRegistry.runHealthChecks();

  const tools = new ToolRegistry({ engineRegistry, logger: { info() {}, error() {} } });
  tools.loadToolsFromEngines();

  assert.ok(tools.getTool("journey.getMileageSummary"), "registers valid tools");
  assert.ok(tools.getTool("journey.getTodayTrips"), "registers today's journey tool");
  assert.ok(tools.getTool("journey.getTripHistory"), "registers trip history tool");
  assert.ok(tools.getTool("journey.getPendingReviews"), "registers pending review tool");
  assert.ok(tools.getTool("journey.getJourneyById"), "registers journey-by-id tool");

  assert.throws(() => {
    tools.registerTool({
      id: "journey.getMileageSummary",
      engineId: "journey-engine",
      name: "Duplicate",
      description: "dup",
      permission: "read",
      confirmationRequired: false,
      inputSchema: {},
      outputSchema: {},
      version: "1.0.0",
    });
  }, /Duplicate tool id/, "rejects duplicate tool IDs");

  assert.throws(() => {
    tools.registerTool({
      id: "unknown.tool",
      engineId: "missing-engine",
      name: "Unknown",
      description: "bad",
      permission: "read",
      confirmationRequired: false,
      inputSchema: {},
      outputSchema: {},
      version: "1.0.0",
    });
  }, /not registered/, "rejects tools belonging to unknown engines");

  assert.equal(tools.getTool("tool.not.registered"), null, "prevents unregistered tool execution by lookup");
}
