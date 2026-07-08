"use client";

import { useEffect, useState } from "react";
import type { AuraInsight } from "@/types/mission-mode";

interface AuraAssistantProps {
  insight: AuraInsight;
}

export function AuraAssistant({ insight }: AuraAssistantProps) {
  const [displayed, setDisplayed] = useState(insight.text);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let index = 0;
    const text = insight.text;
    let interval: number | undefined;

    const startTimer = window.setTimeout(() => {
      setDisplayed("");
      setIsTyping(true);
      interval = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (interval) window.clearInterval(interval);
          setIsTyping(false);
        }
      }, 28);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      if (interval) window.clearInterval(interval);
    };
  }, [insight.id, insight.text]);

  return (
    <div className="mission-mode-aura pointer-events-none fixed bottom-8 right-8 z-40 max-w-sm">
      <div className="mission-mode-aura-glow pointer-events-auto rounded-2xl border border-[var(--mm-border)] bg-[var(--mm-surface-strong)] px-5 py-4 shadow-[0_8px_40px_rgba(47,111,237,0.15)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="mission-mode-aura-orb flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--mm-aura)] to-[var(--mm-emerald)] text-xs font-bold text-white">
            A
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--mm-aura-soft)]">
              Aura AI
            </p>
            <p className="text-[11px] text-[var(--mm-text-muted)]">Watching your mission</p>
          </div>
        </div>
        <p className="mt-4 min-h-[2.5rem] text-sm leading-relaxed text-[var(--mm-text)]">
          {displayed}
          {isTyping && <span className="mission-mode-cursor ml-0.5 inline-block">|</span>}
        </p>
      </div>
    </div>
  );
}
