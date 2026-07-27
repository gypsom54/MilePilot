"use client";

import { QuestionChip } from "@/components/ui/QuestionChip";
import type { AskRankAuraSuggestedQuestion } from "@/types/askRankAura";

interface AskRankAuraSuggestionsProps {
  suggestions: AskRankAuraSuggestedQuestion[];
  onSelect: (text: string) => void;
}

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
            <QuestionChip onClick={() => onSelect(suggestion.text)}>
              {suggestion.text}
            </QuestionChip>
          </li>
        ))}
      </ul>
    </div>
  );
}
