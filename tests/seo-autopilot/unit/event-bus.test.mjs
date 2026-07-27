import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  InMemoryEventBus,
  PlatformEventName,
} from "../../../packages/shared/dist/index.js";

describe("InMemoryEventBus", () => {
  it("delivers published events to subscribers", async () => {
    const bus = new InMemoryEventBus();
    /** @type {unknown[]} */
    const received = [];

    bus.subscribe(PlatformEventName.BusinessCreated, (event) => {
      received.push(event.payload);
    });

    await bus.publish({
      name: PlatformEventName.BusinessCreated,
      payload: { id: "biz_1" },
      occurredAt: new Date().toISOString(),
      source: "test",
    });

    assert.deepEqual(received, [{ id: "biz_1" }]);
  });

  it("supports unsubscribe", async () => {
    const bus = new InMemoryEventBus();
    let count = 0;
    const sub = bus.subscribe(PlatformEventName.PageCrawled, () => {
      count += 1;
    });
    sub.unsubscribe();

    await bus.publish({
      name: PlatformEventName.PageCrawled,
      payload: {},
      occurredAt: new Date().toISOString(),
      source: "test",
    });

    assert.equal(count, 0);
  });
});
