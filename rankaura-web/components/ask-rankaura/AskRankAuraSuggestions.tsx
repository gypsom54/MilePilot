"use client";

import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import type { AskRankAuraSuggestedQuestion } from "@/types/askRankAura";

interface AskRankAuraSuggestionsProps {
  suggestions: AskRankAuraSuggestedQuestion[];
  onSelect: (text: string) => void;
}

/** Suggested questions = ButtonSecondary only. No Ask visual overrides. */
export function AskRankAuraSuggestions({
  suggestions,
  onSelect,
}: AskRankAuraSuggestionsProps) {
  const items = suggestions.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-ra-muted">Suggested questions</p>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {items.map((suggestion) => (
          <li key={suggestion.id}>
            <ButtonSecondary
              type="button"
              onClick={() => onSelect(suggestion.text)}
            >
              {suggestion.text}
            </ButtonSecondary>
          </li>
        ))}
      </ul>
    </div>
  );
}
