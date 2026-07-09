"use client";

import { Button } from "@/components/ui/Button";

interface OnboardingPrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function OnboardingPrimaryButton({
  onClick,
  children,
  disabled = false,
  type = "button",
}: OnboardingPrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="mt-14 w-full rounded-2xl py-5 text-base font-semibold sm:mt-16"
    >
      {children}
    </Button>
  );
}

interface OnboardingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "url";
  autoFocus?: boolean;
}

export function OnboardingInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus = true,
}: OnboardingInputProps) {
  return (
    <div className="mt-12 sm:mt-14">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full border-0 border-b-2 border-[#e5e7eb] bg-transparent pb-4 text-2xl font-medium tracking-tight text-[#080f1a] placeholder:text-[#c4c9d2] focus:border-[#080f1a] focus:outline-none sm:text-3xl"
      />
    </div>
  );
}

interface OnboardingTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function OnboardingTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: OnboardingTextareaProps) {
  return (
    <div className="mt-12 sm:mt-14">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        autoFocus
        className="w-full resize-none rounded-2xl border border-[#e8eaed] bg-white px-6 py-5 text-lg leading-relaxed text-[#080f1a] placeholder:text-[#c4c9d2] shadow-[0_1px_2px_rgba(8,15,26,0.04)] focus:border-[#080f1a] focus:outline-none focus:ring-2 focus:ring-[#080f1a]/5 sm:text-xl"
      />
    </div>
  );
}
