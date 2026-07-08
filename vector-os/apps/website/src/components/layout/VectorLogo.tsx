interface VectorLogoProps {
  className?: string;
}

export function VectorLogo({ className }: VectorLogoProps) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="8" fill="url(#vector-logo-gradient)" />
      <path
        d="M8 18L14 8L20 18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 14.5H17.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="vector-logo-gradient" x1="4" y1="4" x2="24" y2="24">
          <stop stopColor="#5990ff" />
          <stop offset="1" stopColor="#1534e1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
