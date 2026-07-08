import { Button } from '@vector-platform/ui';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__glow hero__glow--secondary" aria-hidden="true" />

      <div className="hero__layout">
        <HeroVisual />

        <div className="hero__inner">
          <p className="hero__eyebrow hero__animate hero__animate--1">Vector Platform</p>

          <h1 id="hero-heading" className="hero__headline hero__animate hero__animate--2">
            Build the Future of Research.
          </h1>

          <p className="hero__subheading hero__animate hero__animate--3">
            Premium peptide research products, intelligent business software and
            AI-powered laboratory tools.
          </p>

          <div className="hero__actions hero__animate hero__animate--4">
            <Button variant="primary" size="lg" className="premium-btn premium-btn--primary">
              Explore Products
            </Button>
            <Button variant="ghost" size="lg" className="premium-btn premium-btn--ghost hero__ghost-btn">
              Explore Platform
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
