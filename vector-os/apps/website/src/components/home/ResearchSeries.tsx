import { Button } from '@vector-platform/ui';
import { Reveal } from '@/components/effects/Reveal';
import { ProductScene } from './ProductScene';

const PRODUCTS = [
  {
    name: 'Retatrutide',
    strength: '40 mg',
    accent: 'blue' as const,
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
  {
    name: 'BPC-157 + TB500',
    strength: '20 mg',
    accent: 'teal' as const,
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
  {
    name: 'NAD+',
    strength: '1000 mg',
    accent: 'gold' as const,
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
  {
    name: 'GHK-Cu',
    strength: '100 mg',
    accent: 'copper' as const,
    points: ['Research Grade', 'Independently Tested', 'Batch Verified'],
  },
] as const;

export function ResearchSeries() {
  return (
    <section className="research-series section--dark" id="research-series" aria-labelledby="series-title">
      <div className="research-series__intro">
        <Reveal>
          <p className="section-eyebrow">Research Series</p>
          <h2 id="series-title" className="section-headline">
            Featured Peptides
          </h2>
          <p className="section-lead">
            Laboratory research compounds. Not for human or veterinary use.
          </p>
        </Reveal>
      </div>

      <div className="research-series__gallery">
        {PRODUCTS.map((product, index) => (
          <Reveal key={product.name} delay={index * 80}>
            <article
              className={`product-feature product-feature--${product.accent}${index % 2 === 1 ? ' product-feature--reverse' : ''}`}
            >
              <div className="product-feature__visual">
                <ProductScene
                  name={product.name}
                  strength={product.strength}
                  accent={product.accent}
                />
              </div>

              <div className="product-feature__copy">
                <p className="product-feature__series">Vector Research Series</p>
                <h3 className="product-feature__name">{product.name}</h3>
                <p className="product-feature__strength">{product.strength}</p>

                <ul className="product-feature__points">
                  {product.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <span className="product-feature__badge">Research Use Only</span>

                <Button variant="ghost" size="lg" className="c-btn c-btn--ghost product-feature__cta">
                  View Product
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
