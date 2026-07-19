function formatGbp(value) {
  return `GBP ${Number(value).toFixed(2)}`;
}

export class ResponseBuilder {
  buildSuccess({ workflowId, intent, toolData }) {
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
      message: "I can only help with weekly mileage summary requests right now.",
      suggestedActions: ["ask_weekly_mileage"],
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
