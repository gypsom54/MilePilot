"use client";

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
      <p className="text-xs font-medium text-[#8b95a5]">Suggested questions</p>
      <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {items.map((suggestion) => (
          <li key={suggestion.id}>
            <button
              type="button"
              onClick={() => onSelect(suggestion.text)}
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 py-2.5 text-left text-sm leading-snug text-[#080f1a] transition-colors hover:border-[#c5d4f5] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
            >
              {suggestion.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
