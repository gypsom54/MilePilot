import { Button } from '@vector-platform/ui';
import { PackagingRender } from '@/components/brand/PackagingRender';
import { CascadeItem, CascadeReveal } from '@/components/effects/CascadeReveal';
import { VECTOR_ASSETS, type ProductAssetKey } from '@/lib/vector-assets';

const PRODUCTS: {
  name: string;
  strength: string;
  accent: 'blue' | 'teal' | 'gold' | 'copper';
  asset: ProductAssetKey;
  points: string[];
}[] = [
  {
    name: 'Retatrutide',
    strength: '40 mg',
    accent: 'blue',
    asset: 'retatrutide',
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
  {
    name: 'BPC-157 + TB500',
    strength: '20 mg',
    accent: 'teal',
    asset: 'bpc',
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
  {
    name: 'NAD+',
    strength: '1000 mg',
    accent: 'gold',
    asset: 'nad',
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
  {
    name: 'GHK-Cu',
    strength: '100 mg',
    accent: 'copper',
    asset: 'ghk',
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
];

export function ResearchSeries() {
  return (
    <section className="research-series section--dark section--cinematic" id="research-series" aria-labelledby="series-title">
      <div className="research-series__intro">
        <CascadeReveal>
          <CascadeItem index={0}>
            <p className="section-eyebrow">Research Series</p>
          </CascadeItem>
          <CascadeItem index={1}>
            <h2 id="series-title" className="section-headline">
              Featured Peptides
            </h2>
          </CascadeItem>
          <CascadeItem index={2}>
            <p className="section-lead">
              Laboratory research compounds. Not for human or veterinary use.
            </p>
          </CascadeItem>
        </CascadeReveal>
      </div>

      <div className="research-series__gallery">
        {PRODUCTS.map((product, index) => (
          <CascadeReveal key={product.name} className="product-showcase">
            <article
              className={`product-feature product-feature--${product.accent}${index % 2 === 1 ? ' product-feature--reverse' : ''}`}
            >
              <CascadeItem index={4} className="product-feature__visual">
                <PackagingRender
                  src={VECTOR_ASSETS.products[product.asset]}
                  alt={`Vector Peptides ${product.name} ${product.strength} — premium matte navy packaging with research pen`}
                  accent={product.accent}
                  variant="feature"
                  living
                />
              </CascadeItem>

              <div className="product-feature__copy">
                <CascadeItem index={0}>
                  <p className="product-feature__series">Vector Research Series</p>
                </CascadeItem>
                <CascadeItem index={1}>
                  <h3 className="product-feature__name">{product.name}</h3>
                </CascadeItem>
                <CascadeItem index={2}>
                  <p className="product-feature__strength">{product.strength}</p>
                </CascadeItem>
                <CascadeItem index={3}>
                  <ul className="product-feature__points">
                    {product.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </CascadeItem>
                <CascadeItem index={4}>
                  <span className="product-feature__badge">Research Use Only</span>
                </CascadeItem>
                <CascadeItem index={5}>
                  <Button variant="ghost" size="lg" className="c-btn c-btn--ghost product-feature__cta">
                    View Product
                  </Button>
                </CascadeItem>
              </div>
            </article>
          </CascadeReveal>
        ))}
      </div>
    </section>
  );
}
