import { Button } from '@vector-platform/ui';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <p className="hero__eyebrow">Vector Platform</p>

        <h1 id="hero-heading" className="hero__headline">
          Build the Future of Research.
        </h1>

        <p className="hero__subheading">
          Premium peptide research products, intelligent software and AI-powered
          business tools.
        </p>

        <div className="hero__actions">
          <Button variant="primary" size="lg">
            View Products
          </Button>
          <Button variant="ghost" size="lg" className="hero__ghost-btn">
            Explore Platform
          </Button>
        </div>
      </div>
    </section>
  );
}
