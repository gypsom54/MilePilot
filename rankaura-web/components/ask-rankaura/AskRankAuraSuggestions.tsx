"use client";

import type { AskRankAuraSuggestedQuestion } from "@/types/askRankAura";

interface AskRankAuraSuggestionsProps {
  suggestions: AskRankAuraSuggestedQuestion[];
  onSelect: (text: string) => void;
}

/**
 * Plain text suggested questions — onboarding conversation language.
 * No pills, no outlined buttons, no blue chrome.
 */
export function AskRankAuraSuggestions({
  suggestions,
  onSelect,
}: AskRankAuraSuggestionsProps) {
  const items = suggestions.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="text-sm font-medium text-[#3d4654]">Suggested questions</p>
      <ul className="mt-4 space-y-3">
        {items.map((suggestion) => (
          <li key={suggestion.id}>
            <button
              type="button"
              onClick={() => onSelect(suggestion.text)}
              className="w-full text-left text-base font-normal text-[#080f1a] outline-none hover:underline"
            >
              <span className="text-[#080f1a]" aria-hidden="true">
                →{" "}
              </span>
              {suggestion.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
