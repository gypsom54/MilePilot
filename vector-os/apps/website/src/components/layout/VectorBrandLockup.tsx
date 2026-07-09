interface VectorBrandLockupProps {
  className?: string;
  variant?: 'header' | 'loading' | 'footer';
}

export function VectorBrandLockup({ className, variant = 'header' }: VectorBrandLockupProps) {
  const id = variant === 'loading' ? 'vector-brand-loading' : 'vector-brand-header';

  return (
    <span className={`vector-brand vector-brand--${variant}${className ? ` ${className}` : ''}`}>
      <svg
        className="vector-brand__mark"
        width="32"
        height="32"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="6" fill={`url(#${id}-gradient)`} />
        <path
          d="M8 18L14 8L20 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10.5 14.5H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id={`${id}-gradient`} x1="4" y1="4" x2="24" y2="24">
            <stop stopColor="#5990ff" />
            <stop offset="1" stopColor="#1534e1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="vector-brand__text">
        <span className="vector-brand__name">VECTOR</span>
        {variant !== 'footer' && <span className="vector-brand__sub">PEPTIDES</span>}
      </span>
      <span className="vector-brand__sheen" aria-hidden="true" />
    </span>
  );
}
