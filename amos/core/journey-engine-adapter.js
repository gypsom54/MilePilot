import {
  loadTrustedJourneyReviewModule,
  loadTrustedSummaryReportsModule,
  loadTrustedTripStoreModule,
} from "./trusted-summary-reports-loader.js";

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

function toJourneyRecord(trip) {
  return {
    id: String(trip?.id || ""),
    status: String(trip?.status || "pending"),
    miles: Number(trip?.miles || 0),
    seconds: Number(trip?.seconds || 0),
    hmrc: Number(trip?.hmrc || 0),
    vehicle: String(trip?.vehicle || "car"),
    startISO: isoDate(trip?.startISO || Date.now()),
    endISO: isoDate(trip?.endISO || trip?.startISO || Date.now()),
    shiftId: trip?.shiftId || null,
  };
}

function sortJourneysDescending(trips) {
  return [...(trips || [])].sort((left, right) => {
    const leftMs = new Date(left?.endISO || left?.startISO || 0).getTime();
    const rightMs = new Date(right?.endISO || right?.startISO || 0).getTime();
    return rightMs - leftMs;
  });
}

function claimRateResolver(dependencies) {
  return (miles, vehicle) => {
    if (typeof dependencies?.getHmrcRate === "function") {
      return dependencies.getHmrcRate(miles, vehicle);
    }
    return 0.55;
  };
}

function loadJourneyModules(dependencies = {}) {
  const tripStore = loadTrustedTripStoreModule(dependencies);
  const journeyReview = loadTrustedJourneyReviewModule({
    ...dependencies,
    tripStore,
  });

  return { tripStore, journeyReview };
}

function loadTrustedTrips(dependencies = {}) {
  const { tripStore } = loadJourneyModules(dependencies);
  return tripStore.loadTrips(dependencies.getVehicle?.(), claimRateResolver(dependencies));
}

function buildTodayTripsOutput(trips, journeyReview, timestamp) {
  const date = new Date(timestamp);
  const journeys = journeyReview.tripsForReviewDate(trips, date);
  const counts = journeyReview.reviewCountsForDate(trips, date);

  return {
    date: date.toISOString().slice(0, 10),
    journeys: journeys.map(toJourneyRecord),
    tripCount: journeys.length,
    pendingCount: Number(counts?.remaining || 0),
    businessCount: Number(counts?.business || 0),
    personalCount: Number(counts?.personal || 0),
  };
}

function buildTripHistoryOutput(trips, limit) {
  const sorted = sortJourneysDescending(trips);
  const journeys = sorted.slice(0, limit);

  return {
    requestedLimit: limit,
    totalJourneys: sorted.length,
    journeys: journeys.map(toJourneyRecord),
    tripCount: journeys.length,
  };
}

function buildPendingReviewsOutput(trips, journeyReview, timestamp) {
  const date = new Date(timestamp);
  const journeys = journeyReview.tripsNeedingReview(trips, date);
  const pendingMiles = journeys.reduce((sum, trip) => sum + Number(trip?.miles || 0), 0);

  return {
    date: date.toISOString().slice(0, 10),
    journeys: journeys.map(toJourneyRecord),
    pendingCount: journeys.length,
    pendingMiles: Number(pendingMiles.toFixed(1)),
  };
}

function buildJourneyByIdOutput(trips, journeyId) {
  const journey = (trips || []).find((trip) => String(trip?.id) === String(journeyId));
  if (!journey) return null;

  return {
    journey: toJourneyRecord(journey),
  };
}

export function createJourneyEngineAdapter({
  id = "journey-engine",
  name = "Journey Engine Adapter",
  version = "1.0.0",
  trustedJourneyDependencies,
  trustedSummaryDependencies,
  logger,
} = {}) {
  const log = logger || console;
  const dependencies = trustedJourneyDependencies || trustedSummaryDependencies || {};

  return {
    id,
    name,
    version,

    async healthCheck() {
      try {
        const summaryModule = loadTrustedSummaryReportsModule(dependencies);
        const tripStore = loadTrustedTripStoreModule(dependencies);
        const journeyReview = loadTrustedJourneyReviewModule({ ...dependencies, tripStore });
        const ok =
          !!summaryModule?.buildPayload &&
          typeof tripStore?.loadTrips === "function" &&
          typeof journeyReview?.tripsForReviewDate === "function" &&
          typeof journeyReview?.tripsNeedingReview === "function";
        return {
          ok,
          details: ok ? "trusted journey modules available" : "trusted journey modules unavailable",
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
        {
          id: "journey.getTodayTrips",
          engineId: id,
          name: "Get Today's Journeys",
          description: "Returns trusted journeys recorded today.",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {
            type: "object",
            properties: {
              date: { type: "string", enum: ["today"] },
            },
          },
          outputSchema: {
            type: "object",
            required: ["date", "journeys", "tripCount"],
          },
          version: "2.0.0",
        },
        {
          id: "journey.getTripHistory",
          engineId: id,
          name: "Get Journey History",
          description: "Returns recent trusted journey history.",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {
            type: "object",
            properties: {
              limit: { type: "number", minimum: 1, maximum: 50 },
            },
          },
          outputSchema: {
            type: "object",
            required: ["journeys", "tripCount", "totalJourneys"],
          },
          version: "2.0.0",
        },
        {
          id: "journey.getPendingReviews",
          engineId: id,
          name: "Get Pending Journey Reviews",
          description: "Returns trusted journeys awaiting review today.",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {
            type: "object",
            properties: {
              date: { type: "string", enum: ["today"] },
            },
          },
          outputSchema: {
            type: "object",
            required: ["date", "journeys", "pendingCount"],
          },
          version: "2.0.0",
        },
        {
          id: "journey.getJourneyById",
          engineId: id,
          name: "Get Journey By Id",
          description: "Returns a single trusted journey by id.",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {
            type: "object",
            required: ["journeyId"],
            properties: {
              journeyId: { type: "string" },
            },
          },
          outputSchema: {
            type: "object",
            required: ["journey"],
          },
          version: "2.0.0",
        },
      ];
    },

    async executeTool(toolId, input, context) {
      const startedAt = Date.now();
      try {
        let output = null;

        if (toolId === "journey.getMileageSummary") {
          if (input?.dateRange !== "current_week") {
            return {
              success: false,
              error: {
                code: "INVALID_INPUT",
                message: "Only dateRange=current_week is supported for mileage summary",
                retryable: false,
              },
              metadata: {
                engineId: id,
                toolId,
                durationMs: Date.now() - startedAt,
              },
            };
          }

          const summaryModule = loadTrustedSummaryReportsModule(dependencies);
          const trustedPayload = summaryModule.buildPayload("Weekly", new Date(context.timestamp));
          output = toWeeklySummaryOutput(trustedPayload);
        } else if (toolId === "journey.getTodayTrips") {
          const { journeyReview } = loadJourneyModules(dependencies);
          const trips = loadTrustedTrips(dependencies);
          output = buildTodayTripsOutput(trips, journeyReview, context.timestamp);
        } else if (toolId === "journey.getTripHistory") {
          const trips = loadTrustedTrips(dependencies);
          const requestedLimit = Math.max(1, Math.min(50, Number(input?.limit || 20)));
          output = buildTripHistoryOutput(trips, requestedLimit);
        } else if (toolId === "journey.getPendingReviews") {
          const { journeyReview } = loadJourneyModules(dependencies);
          const trips = loadTrustedTrips(dependencies);
          output = buildPendingReviewsOutput(trips, journeyReview, context.timestamp);
        } else if (toolId === "journey.getJourneyById") {
          const trips = loadTrustedTrips(dependencies);
          output = buildJourneyByIdOutput(trips, input?.journeyId);

          if (!output) {
            return {
              success: false,
              error: {
                code: "JOURNEY_NOT_FOUND",
                message: `Journey ${input?.journeyId || "unknown"} was not found`,
                retryable: false,
              },
              metadata: {
                engineId: id,
                toolId,
                durationMs: Date.now() - startedAt,
              },
            };
          }
        } else {
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
