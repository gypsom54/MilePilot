export function HeroProductVisual() {
  return (
    <div className="hero-product" aria-hidden="true">
      <div className="hero-product__glow" />
      <div className="hero-product__hex-pattern" />

      <div className="hero-product__scene">
        {/* Premium presentation box */}
        <div className="hero-product__box">
          <div className="hero-product__box-lid" />
          <div className="hero-product__box-body">
            <div className="hero-product__foam">
              {/* Research pen slot */}
              <div className="hero-product__pen-slot">
                <div className="hero-product__pen">
                  <div className="hero-product__pen-cap" />
                  <div className="hero-product__pen-body" />
                  <span className="hero-product__pen-label">3ml</span>
                </div>
              </div>

              {/* Needle spaces */}
              <div className="hero-product__needle-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="hero-product__needle-space" />
                ))}
              </div>
            </div>
          </div>

          <div className="hero-product__box-label">
            <span className="hero-product__box-brand">Vector Peptides</span>
            <span className="hero-product__box-product">Retatrutide</span>
            <span className="hero-product__box-strength">60mg</span>
            <span className="hero-product__box-badge">Research Use Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
