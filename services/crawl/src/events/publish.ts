import type { EventBus } from "@seo-autopilot/shared";
import { PlatformEventName } from "@seo-autopilot/shared";

const SOURCE = "crawl-intelligence";

export async function publishCrawlEvent(
  bus: EventBus,
  name: string,
  payload: Record<string, unknown>,
  correlationId?: string,
): Promise<void> {
  await bus.publish({
    name,
    payload,
    occurredAt: new Date().toISOString(),
    source: SOURCE,
    ...(correlationId !== undefined ? { correlationId } : {}),
  });
}

export { PlatformEventName };
