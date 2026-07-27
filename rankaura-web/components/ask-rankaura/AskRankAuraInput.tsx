"use client";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { Input } from "@/components/ui/Input";

interface AskRankAuraInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
}

export function AskRankAuraInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
}: AskRankAuraInputProps) {
  const canSubmit = Boolean(value.trim()) && !disabled;

  return (
    <form
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSubmit();
      }}
    >
      <label htmlFor="ask-rankaura-input" className="sr-only">
        Ask RankAura a question about your business growth
      </label>
      <Input
        id="ask-rankaura-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="min-w-0 flex-1"
      />
      <ButtonPrimary type="submit" disabled={!canSubmit} className="shrink-0">
        Ask
      </ButtonPrimary>
    </form>
  );
}
