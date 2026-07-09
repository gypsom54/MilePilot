import Link from 'next/link';
import { PackagingRender } from '@/components/brand/PackagingRender';
import { VECTOR_ASSETS, type ProductAssetKey } from '@/lib/vector-assets';

const PRODUCTS: {
  name: string;
  strength: string;
  accent: 'blue' | 'teal' | 'gold' | 'copper';
  asset: ProductAssetKey;
}[] = [
  { name: 'Retatrutide', strength: '40 mg', accent: 'blue', asset: 'retatrutide' },
  { name: 'BPC-157 + TB500', strength: '20 mg', accent: 'teal', asset: 'bpc' },
  { name: 'NAD+', strength: '1000 mg', accent: 'gold', asset: 'nad' },
  { name: 'GHK-Cu', strength: '100 mg', accent: 'copper', asset: 'ghk' },
];

export function ResearchSeries() {
  return (
    <section className="research-series section--dark" id="research-series" aria-labelledby="series-title">
      <div className="research-series__header">
        <p className="section-eyebrow">Research Series</p>
        <h2 id="series-title" className="section-headline">
          Featured Research Peptides
        </h2>
      </div>

      <div className="product-grid">
        {PRODUCTS.map((product) => (
          <article key={product.name} className={`product-card product-card--${product.accent}`}>
            <div className="product-card__glow" aria-hidden="true" />
            <div className="product-card__visual">
              <PackagingRender
                src={VECTOR_ASSETS.products[product.asset]}
                alt={`Vector Peptides ${product.name} ${product.strength}`}
                accent={product.accent}
                variant="card"
              />
            </div>
            <h3 className="product-card__name">{product.name}</h3>
            <p className="product-card__strength">{product.strength}</p>
            <Link href="#research-series" className="product-card__link">
              View Product
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
