import { Button } from '@vector-platform/ui';
import { ProductScene } from './ProductScene';

export function CinematicHero() {
  return (
    <section className="c-hero section--dark">
      <div className="c-hero__glow" aria-hidden="true" />
      <div className="c-hero__inner">
        <div className="c-hero__copy">
          <p className="c-hero__label">Vector Precision Research</p>
          <h1 className="c-hero__title">
            Research
            <br />
            Without <span className="c-hero__accent">Compromise.</span>
          </h1>
          <p className="c-hero__lead">
            Purity, identity and potency verified through rigorous independent
            testing. Premium research peptides presented with the documentation
            your laboratory demands.
          </p>
          <div className="c-hero__actions">
            <Button variant="primary" size="lg" className="c-btn c-btn--primary">
              View Research Series
            </Button>
            <Button variant="ghost" size="lg" className="c-btn c-btn--ghost">
              Quality Assurance
            </Button>
          </div>
        </div>

        <div className="c-hero__visual">
          <ProductScene
            variant="hero"
            name="Retatrutide"
            strength="40 mg"
            accent="blue"
          />
          <div className="c-hero__seal" aria-hidden="true">
            <span className="c-hero__seal-ring" />
            <span className="c-hero__seal-text">
              Verified
              <br />
              Vector
              <br />
              Authenticity
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
