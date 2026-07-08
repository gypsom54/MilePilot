import { Button } from '@vector-platform/ui';

const PRODUCTS = [
  { name: 'Retatrutide', strength: '60mg' },
  { name: 'BPC-157 + TB-500', strength: '20mg' },
  { name: 'GHK-Cu', strength: '100mg' },
  { name: 'NAD+', strength: '1000mg' },
] as const;

function ProductImagePlaceholder({ name, strength }: { name: string; strength: string }) {
  return (
    <div className="product-card__image" aria-hidden="true">
      <div className="product-card__image-inner">
        <div className="product-card__vial">
          <div className="product-card__vial-cap" />
          <div className="product-card__vial-body" />
        </div>
        <span className="product-card__image-strength">{strength}</span>
      </div>
      <span className="product-card__image-label">{name}</span>
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="featured-products" id="products" aria-labelledby="products-heading">
      <div className="featured-products__inner">
        <div className="featured-products__header">
          <h2 id="products-heading" className="section-title">
            Featured Research Products
          </h2>
          <p className="section-subtitle">
            Premium compounds for laboratory research. Not for human or veterinary use.
          </p>
        </div>

        <div className="featured-products__grid">
          {PRODUCTS.map((product) => (
            <article key={product.name} className="product-card">
              <ProductImagePlaceholder name={product.name} strength={product.strength} />
              <div className="product-card__body">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__strength">{product.strength}</p>
                <span className="product-card__badge">Research Use Only</span>
                <Button variant="secondary" size="md" className="product-card__btn premium-btn">
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
