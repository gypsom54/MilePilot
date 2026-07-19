function formatGbp(value) {
  return `GBP ${Number(value).toFixed(2)}`;
}

function formatJourneyTimeRange(journey) {
  const start = new Date(journey?.startISO || Date.now()).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const end = new Date(journey?.endISO || journey?.startISO || Date.now()).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${start} to ${end}`;
}

function formatStatus(status) {
  if (status === "business") return "business";
  if (status === "personal") return "personal";
  return "awaiting review";
}

export class ResponseBuilder {
  buildSuccess({ workflowId, intent, toolId, toolData }) {
    if (intent?.intentId === "journey.mileage_summary") {
      const miles = Number(toolData?.businessMiles || 0).toFixed(1);
      const journeys = Number(toolData?.tripCount || 0);
      const hasClaim = typeof toolData?.hmrcClaimableAmount === "number";
      const claimText = hasClaim
        ? ` Your HMRC mileage claim is ${formatGbp(toolData.hmrcClaimableAmount)}.`
        : "";
      return {
        success: true,
        message: `You recorded ${miles} business miles across ${journeys} journeys this week.${claimText}`,
        data: toolData,
        suggestedActions: ["view_weekly_report", "open_trip_review"],
        workflowId,
      };
    }

    if (toolId === "journey.getTodayTrips") {
      const tripCount = Number(toolData?.tripCount || 0);
      const pendingCount = Number(toolData?.pendingCount || 0);
      if (!tripCount) {
        return {
          success: true,
          message: "You have no journeys recorded today.",
          data: toolData,
          suggestedActions: ["start_tracking", "open_trip_review"],
          workflowId,
        };
      }

      const pendingText = pendingCount
        ? ` ${pendingCount} ${pendingCount === 1 ? "is" : "are"} awaiting review.`
        : "";

      return {
        success: true,
        message: `You have ${tripCount} ${tripCount === 1 ? "journey" : "journeys"} recorded today.${pendingText}`,
        data: toolData,
        suggestedActions: ["open_trip_review", "view_today_report"],
        workflowId,
      };
    }

    if (toolId === "journey.getTripHistory") {
      const journeys = toolData?.journeys || [];
      if (!journeys.length) {
        return {
          success: true,
          message: "You have no journeys recorded yet.",
          data: toolData,
          workflowId,
        };
      }

      if (Number(toolData?.requestedLimit || 0) === 1) {
        const lastJourney = journeys[0];
        return {
          success: true,
          message: `Your last journey was ${Number(lastJourney?.miles || 0).toFixed(1)} miles from ${formatJourneyTimeRange(lastJourney)} and is marked ${formatStatus(lastJourney?.status)}.`,
          data: toolData,
          suggestedActions: ["open_trip_review", "view_trip_history"],
          workflowId,
        };
      }

      return {
        success: true,
        message: `I found ${journeys.length} recent ${journeys.length === 1 ? "journey" : "journeys"} in your history.`,
        data: toolData,
        suggestedActions: ["view_trip_history"],
        workflowId,
      };
    }

    if (toolId === "journey.getPendingReviews") {
      const pendingCount = Number(toolData?.pendingCount || 0);
      if (!pendingCount) {
        return {
          success: true,
          message: "You have no journeys awaiting review today.",
          data: toolData,
          suggestedActions: ["start_tracking"],
          workflowId,
        };
      }

      return {
        success: true,
        message: `You have ${pendingCount} ${pendingCount === 1 ? "journey" : "journeys"} awaiting review today, covering ${Number(toolData?.pendingMiles || 0).toFixed(1)} miles.`,
        data: toolData,
        suggestedActions: ["open_trip_review"],
        workflowId,
      };
    }

    if (toolId === "journey.getJourneyById") {
      const journey = toolData?.journey;
      return {
        success: true,
        message: `Journey ${journey?.id} was ${Number(journey?.miles || 0).toFixed(1)} miles and is marked ${formatStatus(journey?.status)}.`,
        data: toolData,
        workflowId,
      };
    }

    return {
      success: true,
      message: "Request completed.",
      data: toolData,
      workflowId,
    };
  }

  buildUnsupported({ workflowId }) {
    return {
      success: false,
      message:
        "I can help with weekly mileage, today's journeys, your last journey, or journeys awaiting review right now.",
      suggestedActions: ["ask_weekly_mileage", "ask_today_journeys", "ask_last_journey"],
      workflowId,
    };
  }

  buildFailure({ workflowId, message }) {
    return {
      success: false,
      message: message || "I could not complete that request.",
      workflowId,
    };
  }
}
