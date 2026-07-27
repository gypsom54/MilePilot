"use client";

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
      <input
        id="ask-rankaura-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="h-11 w-full flex-1 rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 text-sm text-[#080f1a] placeholder:text-[#8b95a5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def] disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#080f1a] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Ask
      </button>
    </form>
  );
}
