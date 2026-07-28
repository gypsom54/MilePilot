import {
  PlatformEventName,
  type EventBus,
} from "@seo-autopilot/shared";

const SOURCE = "business-discovery";

export async function publishBusinessEvent(
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
