"use client";

import {
  OnboardingInput,
  OnboardingPrimaryButton,
} from "@/components/onboarding/OnboardingFields";

interface AskRankAuraInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
}

/**
 * Ask input + CTA — copied from approved onboarding
 * (OnboardingInput + OnboardingPrimaryButton / Continue).
 */
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
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSubmit();
      }}
    >
      <OnboardingInput
        id="ask-rankaura-input"
        label="Ask RankAura a question about your business growth"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      <OnboardingPrimaryButton
        onClick={() => {
          if (!canSubmit) return;
          onSubmit();
        }}
        disabled={!canSubmit}
      >
        Ask RankAura
      </OnboardingPrimaryButton>
    </form>
  );
}
