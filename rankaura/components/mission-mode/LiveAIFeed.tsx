"use client";

import { useEffect, useRef } from "react";
import type { LiveFeedEvent } from "@/types/mission-mode";

interface LiveAIFeedProps {
  events: LiveFeedEvent[];
}

export function LiveAIFeed({ events }: LiveAIFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const latestEventId = events[0]?.id;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [latestEventId]);

  return (
    <aside className="flex h-full flex-col border-l border-[var(--mm-border)] bg-[var(--mm-surface)] backdrop-blur-xl">
      <div className="border-b border-[var(--mm-border)] px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="mission-mode-pulse h-2 w-2 rounded-full bg-[var(--mm-emerald)]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--mm-text-muted)]">
            Live AI Feed
          </p>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 mission-mode-scroll">
        <ul className="space-y-0">
          {events.map((event, index) => (
            <li
              key={event.id}
              className={`mission-mode-feed-enter ${index === 0 ? "mission-mode-feed-new" : ""}`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <p className="font-mono text-[11px] text-[var(--mm-aura-soft)]">{event.time}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--mm-text-secondary)]">
                {event.message}
              </p>
              {index < events.length - 1 && (
                <div className="my-4 h-px bg-[var(--mm-border)]" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
