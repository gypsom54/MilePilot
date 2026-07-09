"use client";

import { useId } from "react";
import { cn } from "@/utils/cn";

interface RankAuraMarkProps {
  className?: string;
}

/** Approved Option 1 RA monogram — premium blue gradient on deep navy. */
export function RankAuraMark({ className }: RankAuraMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `rankaura-blue-${uid}`;
  const glowId = `rankaura-glow-${uid}`;

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("rankaura-logo-glow", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="44" y1="18" x2="68" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="80" height="80" rx="18" fill="#0B1526" />
      <g filter={`url(#${glowId})`}>
        <path
          fill="#FFFFFF"
          d="M21 58V22h13.8c5.4 0 9.2 3.4 9.2 8.6 0 4-2.3 6.8-6 7.9L48.5 58h-6.4l-7.8-14.6H25.4V58H21zm4.4-18.8h8.6c2.9 0 4.7-1.6 4.7-4.2 0-2.6-1.8-4.2-4.7-4.2h-8.6v8.4z"
        />
        <path
          fill={`url(#${gradientId})`}
          d="M49.2 58 59.6 30h4.8L74.8 58h-4.6l-2.9-8.4H54.7L51.8 58h-2.6zm7.4-21.2 3.8 11.2h.2l3.8-11.2h-7.8z"
        />
      </g>
    </svg>
  );
}

interface RankAuraWordmarkProps {
  variant?: "light" | "dark";
  className?: string;
}

export function RankAuraWordmark({ variant = "light", className }: RankAuraWordmarkProps) {
  const rankColor = variant === "dark" ? "text-white" : "text-[#080f1a]";

  return (
    <p
      className={cn(
        "font-semibold tracking-[0.22em]",
        className,
      )}
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
  md: { icon: "h-14 w-14", wordmark: "text-base", tagline: "text-xs" },
  lg: { icon: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20", wordmark: "text-lg sm:text-xl", tagline: "text-sm" },
};

/**
 * Official RankAura logo lockup — Option 1 RA monogram + RANKAURA wordmark.
 * SVG paths from approved brand sheet; asset also at public/brand/rankaura-mark.svg
 */
export function RankAuraLogo({
  showWordmark = true,
  showTagline = true,
  size = "lg",
  variant = "light",
  className = "",
}: RankAuraLogoProps) {
  const s = SIZES[size];
  const taglineColor = variant === "dark" ? "text-white/70" : "text-[#5b7c99]";

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <RankAuraMark className={s.icon} />

      {showWordmark && (
        <RankAuraWordmark variant={variant} className={cn("mt-5", s.wordmark)} />
      )}

      {showTagline && (
        <p className={cn("mt-2 font-medium tracking-wide", taglineColor, s.tagline)}>
          We Help Grow Businesses.
        </p>
      )}
    </div>
  );
}
