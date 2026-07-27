"use client";

import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import type { AskRankAuraSuggestedQuestion } from "@/types/askRankAura";

interface AskRankAuraSuggestionsProps {
  suggestions: AskRankAuraSuggestedQuestion[];
  onSelect: (text: string) => void;
}

/** Suggested questions reuse THE outlined secondary button — no Ask-only control. */
export function AskRankAuraSuggestions({
  suggestions,
  onSelect,
}: AskRankAuraSuggestionsProps) {
  const items = suggestions.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-ra-muted">Suggested questions</p>
      <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {items.map((suggestion) => (
          <li key={suggestion.id}>
            <ButtonSecondary
              type="button"
              onClick={() => onSelect(suggestion.text)}
              className="h-auto min-h-ra-control w-full justify-start text-left whitespace-normal"
            >
              {suggestion.text}
            </ButtonSecondary>
          </li>
        ))}
      </ul>
    </div>
  );
}
