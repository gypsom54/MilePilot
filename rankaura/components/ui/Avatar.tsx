import { cn } from "@/utils/cn";

interface AvatarProps {
  label: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles = {
  sm: "h-9 w-9 text-sm",
  md: "h-10 w-10 text-sm",
} as const;

export function Avatar({ label, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-midnight)] font-semibold text-[var(--color-aura-soft)]",
        sizeStyles[size],
        className,
      )}
      aria-hidden
    >
      {label}
    </div>
  );
}
