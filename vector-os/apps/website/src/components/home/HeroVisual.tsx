export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__halo" />
      <div className="hero-visual__ring hero-visual__ring--outer" />
      <div className="hero-visual__ring hero-visual__ring--inner" />

      <svg
        className="hero-visual__svg"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8eb8ff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#3366ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1534e1" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="strand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5990ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1534e1" stopOpacity="0.05" />
          </linearGradient>
          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* DNA strands */}
        <path
          className="hero-visual__strand hero-visual__strand--left"
          d="M120 60 C140 120, 100 180, 120 240 C140 300, 100 340, 120 380"
          stroke="url(#strand-gradient)"
          strokeWidth="1.5"
        />
        <path
          className="hero-visual__strand hero-visual__strand--right"
          d="M280 60 C260 120, 300 180, 280 240 C260 300, 300 340, 280 380"
          stroke="url(#strand-gradient)"
          strokeWidth="1.5"
        />

        {/* Molecule network connections */}
        <g className="hero-visual__network" stroke="rgba(89, 144, 255, 0.25)" strokeWidth="1">
          <line x1="200" y1="200" x2="120" y2="100" className="hero-visual__bond" />
          <line x1="200" y1="200" x2="280" y2="100" className="hero-visual__bond" />
          <line x1="200" y1="200" x2="80" y2="200" className="hero-visual__bond" />
          <line x1="200" y1="200" x2="320" y2="200" className="hero-visual__bond" />
          <line x1="200" y1="200" x2="120" y2="300" className="hero-visual__bond" />
          <line x1="200" y1="200" x2="280" y2="300" className="hero-visual__bond" />
          <line x1="120" y1="100" x2="80" y2="200" className="hero-visual__bond hero-visual__bond--secondary" />
          <line x1="280" y1="100" x2="320" y2="200" className="hero-visual__bond hero-visual__bond--secondary" />
          <line x1="120" y1="300" x2="80" y2="200" className="hero-visual__bond hero-visual__bond--secondary" />
          <line x1="280" y1="300" x2="320" y2="200" className="hero-visual__bond hero-visual__bond--secondary" />
        </g>

        {/* Network nodes */}
        <circle cx="120" cy="100" r="6" className="hero-visual__node" />
        <circle cx="280" cy="100" r="6" className="hero-visual__node" />
        <circle cx="80" cy="200" r="5" className="hero-visual__node hero-visual__node--small" />
        <circle cx="320" cy="200" r="5" className="hero-visual__node hero-visual__node--small" />
        <circle cx="120" cy="300" r="6" className="hero-visual__node" />
        <circle cx="280" cy="300" r="6" className="hero-visual__node" />

        {/* Glass interface frame */}
        <rect
          className="hero-visual__glass"
          x="130"
          y="130"
          width="140"
          height="140"
          rx="16"
        />

        {/* AI core */}
        <circle
          className="hero-visual__core"
          cx="200"
          cy="200"
          r="36"
          fill="url(#core-gradient)"
          filter="url(#core-glow)"
        />
        <circle className="hero-visual__core-pulse" cx="200" cy="200" r="48" />
        <circle className="hero-visual__core-pulse hero-visual__core-pulse--delayed" cx="200" cy="200" r="56" />
      </svg>
    </div>
  );
}
