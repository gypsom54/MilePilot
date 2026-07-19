const WEEKLY_MILEAGE_PATTERNS = [
  /how many miles have i driven this week\??/i,
  /what is my mileage this week\??/i,
  /show my business miles for this week\??/i,
  /how much can i claim for mileage this week\??/i,
  /how many business miles have i driven this week\??/i,
  /business miles.*this week/i,
  /mileage.*this week/i,
  /claim.*mileage.*this week/i,
];

export class DeterministicIntentRouter {
  route(requestText) {
    const text = String(requestText || "").trim();
    const lowered = text.toLowerCase();

    for (const pattern of WEEKLY_MILEAGE_PATTERNS) {
      if (pattern.test(lowered)) {
        return {
          intentId: "journey.mileage_summary",
          confidence: 0.98,
          toolId: "journey.getMileageSummary",
          parameters: {
            dateRange: "current_week",
          },
          requiresClarification: false,
        };
      }
    }

    return {
      intentId: "unsupported",
      confidence: 1,
      parameters: {},
      requiresClarification: true,
    };
  }
}
