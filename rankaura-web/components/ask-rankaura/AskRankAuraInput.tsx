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
  return (
    <form
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim() || disabled) return;
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
        className="flex-1"
      />
      <ButtonPrimary
        type="submit"
        className="shrink-0"
        aria-disabled={!value.trim() || disabled || undefined}
      >
        Ask
      </ButtonPrimary>
    </form>
  );
}
