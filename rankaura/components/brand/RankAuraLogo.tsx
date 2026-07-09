interface RankAuraLogoProps {
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: "md" | "lg";
  className?: string;
}

const SIZES = {
  md: { icon: "h-14 w-14", wordmark: "text-lg", tagline: "text-xs" },
  lg: { icon: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20", wordmark: "text-xl sm:text-2xl", tagline: "text-sm" },
};

/**
 * Temporary code-based RA monogram — Option 1 brand direction.
 * Replace with final SVG asset when brand files are delivered.
 */
export function RankAuraLogo({
  showWordmark = true,
  showTagline = true,
  size = "lg",
  className = "",
}: RankAuraLogoProps) {
  const s = SIZES[size];

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="rankaura-logo-glow relative">
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={s.icon}
          aria-hidden
        >
          <defs>
            <linearGradient id="rankaura-ra-gradient" x1="8" y1="8" x2="72" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7AABF9" />
              <stop offset="0.5" stopColor="#4F8EF7" />
              <stop offset="1" stopColor="#2F6FED" />
            </linearGradient>
            <filter id="rankaura-ra-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="4" y="4" width="72" height="72" rx="20" fill="url(#rankaura-ra-gradient)" />
          <text
            x="40"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="26"
            fontWeight="600"
            fontFamily="var(--font-dm-sans), system-ui, sans-serif"
            letterSpacing="-0.05em"
            filter="url(#rankaura-ra-glow)"
          >
            RA
          </text>
        </svg>
      </div>

      {showWordmark && (
        <p className={`mt-5 font-semibold tracking-tight text-[#080f1a] ${s.wordmark}`}>RankAura</p>
      )}

      {showTagline && (
        <p className={`mt-1.5 font-medium tracking-wide text-[#5b7c99] ${s.tagline}`}>
          We Help Grow Businesses.
        </p>
      )}
    </div>
  );
}
