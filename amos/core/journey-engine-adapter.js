import { loadTrustedSummaryReportsModule } from "./trusted-summary-reports-loader.js";

function isoDate(value) {
  return new Date(value).toISOString();
}

function toWeeklySummaryOutput(weeklyPayload) {
  const startISO = isoDate(weeklyPayload?.dateRange?.start || Date.now());
  const endISO = isoDate(weeklyPayload?.dateRange?.end || Date.now());
  const totals = weeklyPayload?.totals || {};

  return {
    dateRange: {
      start: startISO,
      end: endISO,
    },
    businessMiles: Number(totals.miles || 0),
    tripCount: Number(weeklyPayload?.shifts?.length || 0),
    hmrcClaimableAmount:
      typeof totals.hmrc === "number" ? Number(totals.hmrc) : Number(totals.hmrc || 0),
    currency: "GBP",
  };
}

export function createJourneyEngineAdapter({
  id = "journey-engine",
  name = "Journey Engine Adapter",
  version = "1.0.0",
  trustedSummaryDependencies,
  logger,
} = {}) {
  const log = logger || console;

  return {
    id,
    name,
    version,

    async healthCheck() {
      try {
        const module = loadTrustedSummaryReportsModule(trustedSummaryDependencies || {});
        const ok = !!module?.buildPayload;
        return {
          ok,
          details: ok ? "trusted summary reports available" : "trusted summary unavailable",
        };
      } catch (error) {
        return {
          ok: false,
          details: error?.message || "health check failed",
        };
      }
    },

    getTools() {
      return [
        {
          id: "journey.getMileageSummary",
          engineId: id,
          name: "Get Weekly Mileage Summary",
          description: "Returns trusted business mileage totals for the current week.",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {
            type: "object",
            required: ["dateRange"],
            properties: {
              dateRange: { type: "string", enum: ["current_week"] },
            },
          },
          outputSchema: {
            type: "object",
            required: ["dateRange", "businessMiles", "tripCount", "currency"],
          },
          version: "1.0.0",
        },
      ];
    },

    async executeTool(toolId, input, context) {
      const startedAt = Date.now();
      try {
        if (toolId !== "journey.getMileageSummary") {
          return {
            success: false,
            error: {
              code: "TOOL_NOT_SUPPORTED",
              message: `Tool ${toolId} is not supported by ${id}`,
              retryable: false,
            },
            metadata: {
              engineId: id,
              toolId,
              durationMs: Date.now() - startedAt,
            },
          };
        }

        if (input?.dateRange !== "current_week") {
          return {
            success: false,
            error: {
              code: "INVALID_INPUT",
              message: "Only dateRange=current_week is supported in Sprint 1",
              retryable: false,
            },
            metadata: {
              engineId: id,
              toolId,
              durationMs: Date.now() - startedAt,
            },
          };
        }

        const summaryModule = loadTrustedSummaryReportsModule(trustedSummaryDependencies || {});
        const trustedPayload = summaryModule.buildPayload("Weekly", new Date(context.timestamp));
        const output = toWeeklySummaryOutput(trustedPayload);

        return {
          success: true,
          data: output,
          metadata: {
            engineId: id,
            toolId,
            durationMs: Date.now() - startedAt,
          },
        };
      } catch (error) {
        log.error?.("[AMOS][JourneyAdapter] tool execution failed", {
          toolId,
          workflowId: context?.workflowId,
          error: error?.message || String(error),
        });
        return {
          success: false,
          error: {
            code: "TRUSTED_ENGINE_FAILURE",
            message: error?.message || "trusted mileage summary unavailable",
            retryable: true,
          },
          metadata: {
            engineId: id,
            toolId,
            durationMs: Date.now() - startedAt,
          },
        };
      }
    },
  };
}
