import { Button } from '@vector-platform/ui';
import { HeroProductVisual } from './HeroProductVisual';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">Vector Peptides UK</p>

          <h1 className="hero__headline">Research Without Compromise.</h1>

          <p className="hero__subheading">
            Premium research peptides presented with clear documentation,
            professional packaging and secure UK fulfilment.
          </p>

          <div className="hero__actions">
            <Button variant="primary" size="lg" className="premium-btn premium-btn--primary">
              Shop Research Products
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="premium-btn premium-btn--ghost"
            >
              View Documentation
            </Button>
          </div>
        </div>

        <HeroProductVisual />
      </div>
    </section>
  );
}
