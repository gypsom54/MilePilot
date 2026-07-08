interface VectorLogoProps {
  className?: string;
  variant?: 'color' | 'silver';
}

export function VectorLogo({ className, variant = 'color' }: VectorLogoProps) {
  const fill = variant === 'silver' ? 'url(#vector-logo-silver)' : 'url(#vector-logo-gradient)';
  const stroke = variant === 'silver' ? '#c8d0dc' : 'white';

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
      <rect width="28" height="28" rx="6" fill={fill} />
      <path
        d="M8 18L14 8L20 18"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 14.5H17.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="vector-logo-gradient" x1="4" y1="4" x2="24" y2="24">
          <stop stopColor="#5990ff" />
          <stop offset="1" stopColor="#1534e1" />
        </linearGradient>
        <linearGradient id="vector-logo-silver" x1="4" y1="4" x2="24" y2="24">
          <stop stopColor="#e8ecf2" />
          <stop offset="1" stopColor="#9aa8bc" />
        </linearGradient>
      </defs>
    </svg>
  );
}
