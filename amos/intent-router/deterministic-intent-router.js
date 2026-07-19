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

const TODAY_JOURNEYS_PATTERNS = [
  /show today'?s journeys\.?/i,
  /show today'?s trips\.?/i,
  /show my journeys today\.?/i,
];

const LAST_JOURNEY_PATTERNS = [/show my last journey\.?/i, /show my last trip\.?/i];

const PENDING_REVIEW_PATTERNS = [
  /show journeys awaiting review\.?/i,
  /show my journeys awaiting review\.?/i,
  /show journeys waiting for review\.?/i,
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

    for (const pattern of TODAY_JOURNEYS_PATTERNS) {
      if (pattern.test(lowered)) {
        return {
          intentId: "journey.today_trips",
          confidence: 0.98,
          toolId: "journey.getTodayTrips",
          parameters: {
            date: "today",
          },
          requiresClarification: false,
        };
      }
    }

    for (const pattern of LAST_JOURNEY_PATTERNS) {
      if (pattern.test(lowered)) {
        return {
          intentId: "journey.last_journey",
          confidence: 0.98,
          toolId: "journey.getTripHistory",
          parameters: {
            limit: 1,
          },
          requiresClarification: false,
        };
      }
    }

    for (const pattern of PENDING_REVIEW_PATTERNS) {
      if (pattern.test(lowered)) {
        return {
          intentId: "journey.pending_reviews",
          confidence: 0.98,
          toolId: "journey.getPendingReviews",
          parameters: {
            date: "today",
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
