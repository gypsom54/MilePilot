import { Button } from '@vector-platform/ui';
import { PackagingRender } from '@/components/brand/PackagingRender';
import { VECTOR_ASSETS } from '@/lib/vector-assets';

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
          <PackagingRender
            src={VECTOR_ASSETS.hero}
            alt="Vector Peptides premium packaging — matte navy presentation box, research pen and hologram authenticity seal"
            accent="blue"
            variant="hero"
            priority
          />
        </div>
      </div>
    </section>
  );
}
