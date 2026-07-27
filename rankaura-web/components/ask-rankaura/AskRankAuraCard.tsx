"use client";

import { useCallback, useEffect, useState } from "react";
import { AskRankAuraAnswerPanel } from "@/components/ask-rankaura/AskRankAuraAnswer";
import { AskRankAuraInput } from "@/components/ask-rankaura/AskRankAuraInput";
import { AskRankAuraSuggestions } from "@/components/ask-rankaura/AskRankAuraSuggestions";
import { resolveAskRankAuraQuestion } from "@/services/askRankAura/mockAskRankAura";
import type {
  AskRankAuraAnswer,
  AskRankAuraData,
} from "@/types/askRankAura";

interface AskRankAuraCardProps {
  data: AskRankAuraData;
}

/**
 * Compact Ask RankAura adviser card for Workspace.
 * Default: heading + input + max 4 suggestions.
 * Expanded: one focused answer; no chat history thread.
 */
export function AskRankAuraCard({ data }: AskRankAuraCardProps) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<AskRankAuraAnswer | null>(null);

  const submitQuestion = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const resolved = resolveAskRankAuraQuestion(trimmed, data);
      setAnswer(resolved);
      setQuery("");
    },
    [data],
  );

  const resetToCompact = useCallback(() => {
    setAnswer(null);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!answer) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetToCompact();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, resetToCompact]);

  return (
    <section
      aria-labelledby="ask-rankaura-heading"
      className="rounded-2xl border border-[#dce6fb] bg-white p-5 shadow-[0_2px_8px_rgba(91,141,239,0.08)] sm:p-6"
      data-state={answer ? "expanded" : "compact"}
      data-testid="ask-rankaura-card"
    >
      <h2
        id="ask-rankaura-heading"
        className="text-lg font-semibold tracking-tight text-[#080f1a] sm:text-xl"
      >
        {data.card.heading}
      </h2>
      <p className="mt-1.5 text-sm text-[#8b95a5]">{data.card.support}</p>

      {!answer ? (
        <>
          <AskRankAuraInput
            value={query}
            onChange={setQuery}
            onSubmit={() => submitQuestion(query)}
            placeholder={data.card.placeholder}
          />
          <AskRankAuraSuggestions
            suggestions={data.suggestedQuestions}
            onSelect={submitQuestion}
          />
        </>
      ) : (
        <AskRankAuraAnswerPanel
          answer={answer}
          onAskAnother={resetToCompact}
        />
      )}
    </section>
  );
}
