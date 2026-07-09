interface VectorBrandLockupProps {
  className?: string;
  variant?: 'header' | 'loading' | 'footer';
}

export function VectorBrandLockup({ className, variant = 'header' }: VectorBrandLockupProps) {
  const id = `vector-logo-${variant}`;

  return (
    <span className={`vector-brand vector-brand--${variant}${className ? ` ${className}` : ''}`}>
      <svg
        className="vector-brand__mark"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 26L18 8L28 26"
          stroke={`url(#${id}-stroke)`}
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 20H24"
          stroke={`url(#${id}-stroke)`}
          strokeWidth="2.75"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={`${id}-stroke`} x1="8" y1="8" x2="28" y2="26">
            <stop stopColor="#6b8fff" />
            <stop offset="1" stopColor="#3d6bff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="vector-brand__text">
        <span className="vector-brand__name">Vector</span>
        <span className="vector-brand__sub">Peptides</span>
      </span>
    </span>
  );
}
