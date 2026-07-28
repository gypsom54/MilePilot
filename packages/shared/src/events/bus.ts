import type {
  EventHandler,
  EventSubscription,
  PlatformEvent,
} from "./types.js";

/**
 * Event bus contract. All cross-engine communication goes through this.
 * No engine may call another engine directly.
 */
export interface EventBus {
  publish<TPayload = unknown>(event: PlatformEvent<TPayload>): Promise<void>;
  subscribe<TPayload = unknown>(
    eventName: string,
    handler: EventHandler<TPayload>,
  ): EventSubscription;
  subscribeAll(handler: EventHandler): EventSubscription;
}

/**
 * In-memory event bus for Sprint 0 foundation.
 * Replaceable with a durable bus in later sprints without changing engine contracts.
 */
export class InMemoryEventBus implements EventBus {
  private readonly handlers = new Map<string, Set<EventHandler>>();
  private readonly globalHandlers = new Set<EventHandler>();

  async publish<TPayload = unknown>(
    event: PlatformEvent<TPayload>,
  ): Promise<void> {
    const named = this.handlers.get(event.name);
    const tasks: Array<void | Promise<void>> = [];

    if (named) {
      for (const handler of named) {
        tasks.push(handler(event as PlatformEvent));
      }
    }

    for (const handler of this.globalHandlers) {
      tasks.push(handler(event as PlatformEvent));
    }

    await Promise.all(tasks);
  }

  subscribe<TPayload = unknown>(
    eventName: string,
    handler: EventHandler<TPayload>,
  ): EventSubscription {
    let set = this.handlers.get(eventName);
    if (!set) {
      set = new Set();
      this.handlers.set(eventName, set);
    }
    const typed = handler as EventHandler;
    set.add(typed);
    return {
      unsubscribe: () => {
        set?.delete(typed);
      },
    };
  }

  subscribeAll(handler: EventHandler): EventSubscription {
    this.globalHandlers.add(handler);
    return {
      unsubscribe: () => {
        this.globalHandlers.delete(handler);
      },
    };
  }
}
