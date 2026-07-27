"use client";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { cn } from "@/utils/cn";

interface OnboardingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: string;
}

export function OnboardingInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
  autoComplete,
}: OnboardingInputProps) {
  return (
    <div className="mt-10">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-0 border-b border-[#080f1a] bg-transparent pb-3 text-xl text-[#080f1a] outline-none placeholder:text-[#3d4654] focus:border-[#080f1a]"
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
  autoFocus?: boolean;
}

export function OnboardingTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
}: OnboardingTextareaProps) {
  return (
    <div className="mt-10">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-2xl border border-[#080f1a] bg-white px-4 py-4 text-lg text-[#080f1a] outline-none placeholder:text-[#3d4654] focus:border-[#080f1a]"
      />
    </div>
  );
}

interface OnboardingPrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function OnboardingPrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: OnboardingPrimaryButtonProps) {
  return (
    <ButtonPrimary
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "mt-auto h-12 w-full rounded-full sm:mt-14 sm:w-auto",
        className,
      )}
    >
      {children}
    </ButtonPrimary>
  );
}
