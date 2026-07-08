export function HeroProductVisual() {
  return (
    <div className="hero-product" aria-hidden="true">
      <div className="hero-product__spotlight" />
      <div className="hero-product__floor" />

      <div className="hero-product__scene">
        <div className="hero-product__box">
          <div className="hero-product__box-face">
            <div className="hero-product__overlay">
              <VectorLogoMark />
              <span className="hero-product__overlay-text">VECTOR</span>
            </div>
            <div className="hero-product__hologram" />
          </div>

          <div className="hero-product__pen">
            <div className="hero-product__pen-cap" />
            <div className="hero-product__pen-barrel" />
            <span className="hero-product__pen-label">Research Pen</span>
          </div>

          <div className="hero-product__seal-ring" />
        </div>
      </div>
    </div>
  );
}

function VectorLogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M8 18L14 8L20 18"
        stroke="#c8d0dc"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 14.5H17.5"
        stroke="#c8d0dc"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
