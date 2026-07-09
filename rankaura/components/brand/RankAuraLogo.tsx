"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";

/** Extracted from approved brand sheet — not hand-drawn SVG. */
export const BRAND_ASSETS = {
  mark: "/brand/rankaura-mark.png",
  lockup: "/brand/rankaura-lockup.png",
} as const;

interface RankAuraMarkProps {
  className?: string;
  priority?: boolean;
}

/** RA monogram — raster asset cropped from premium brand sheet. */
export function RankAuraMark({ className, priority = false }: RankAuraMarkProps) {
  return (
    <Image
      src={BRAND_ASSETS.mark}
      alt=""
      width={160}
      height={160}
      priority={priority}
      className={cn("rankaura-logo-glow h-auto w-full", className)}
      aria-hidden
    />
  );
}

interface RankAuraWordmarkProps {
  variant?: "light" | "dark";
  className?: string;
}

/** Wordmark is part of the extracted lockup asset on welcome; kept for API compatibility. */
export function RankAuraWordmark({ variant = "light", className }: RankAuraWordmarkProps) {
  const rankColor = variant === "dark" ? "text-white" : "text-[#080f1a]";

  return (
    <p
      className={cn("font-semibold tracking-[0.22em]", className)}
      aria-label="RankAura"
    >
      <span className={rankColor}>RANK</span>
      <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
        AURA
      </span>
    </p>
  );
}

interface RankAuraLogoProps {
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

const SIZES = {
  md: { lockup: "w-48", mark: "h-14 w-14" },
  lg: { lockup: "w-56 sm:w-64", mark: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20" },
};

/**
 * Official RankAura logo — uses PNG assets extracted from the approved brand sheet.
 * Run `npm run brand:extract` after placing public/brand/rankaura-brand-sheet.png.
 */
export function RankAuraLogo({
  showWordmark = true,
  showTagline = true,
  size = "lg",
  variant = "light",
  className = "",
}: RankAuraLogoProps) {
  const s = SIZES[size];

  if (showWordmark && showTagline) {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <Image
          src={BRAND_ASSETS.lockup}
          alt="RankAura — We Help Grow Businesses."
          width={512}
          height={320}
          priority
          className={cn("rankaura-logo-glow h-auto", s.lockup)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <RankAuraMark className={s.mark} priority />

      {showWordmark && (
        <RankAuraWordmark variant={variant} className="mt-5 text-lg sm:text-xl" />
      )}

      {showTagline && (
        <p
          className={cn(
            "mt-2 text-sm font-medium tracking-wide",
            variant === "dark" ? "text-white/70" : "text-[#5b7c99]",
          )}
        >
          We Help Grow Businesses.
        </p>
      )}
    </div>
  );
}
