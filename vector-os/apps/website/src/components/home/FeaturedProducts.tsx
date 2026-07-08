import { Button } from '@vector-platform/ui';

const PRODUCTS = [
  { name: 'Retatrutide', strength: '40 mg', accent: 'blue' },
  { name: 'BPC-157 + TB500', strength: '20 mg', accent: 'teal' },
  { name: 'NAD+', strength: '1000 mg', accent: 'gold' },
  { name: 'GHK-Cu', strength: '100 mg', accent: 'violet' },
] as const;

export function FeaturedProducts() {
  return (
    <section className="featured-products" id="products" aria-labelledby="products-heading">
      <div className="featured-products__inner">
        <div className="featured-products__header">
          <h2 id="products-heading" className="section-title">
            Featured Research Series
          </h2>
          <p className="section-subtitle">
            Laboratory research compounds. Not for human or veterinary use.
          </p>
        </div>

        <div className="featured-products__grid">
          {PRODUCTS.map((product) => (
            <article
              key={product.name}
              className={`product-card product-card--${product.accent}`}
            >
              <div className="product-card__visual" aria-hidden="true">
                <div className="product-card__vial">
                  <div className="product-card__vial-cap" />
                  <div className="product-card__vial-body" />
                </div>
                <div className="product-card__glow" />
              </div>

              <div className="product-card__body">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__strength">{product.strength}</p>
                <span className="product-card__badge">Research Use Only</span>
                <Button
                  variant="ghost"
                  size="md"
                  className="product-card__btn premium-btn premium-btn--ghost"
                >
                  View Product
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
