import { Button } from '@vector-platform/ui';
import { CascadeItem, CascadeReveal } from '@/components/effects/CascadeReveal';
import { LivingHeroVisual } from '@/components/effects/LivingHeroVisual';

export function CinematicHero() {
  return (
    <section className="c-hero section--dark section--cinematic">
      <div className="c-hero__glow" aria-hidden="true" />
      <div className="c-hero__inner">
        <CascadeReveal className="c-hero__copy">
          <CascadeItem index={0}>
            <p className="c-hero__label">Vector Precision Research</p>
          </CascadeItem>
          <CascadeItem index={1}>
            <h1 className="c-hero__title">
              Research
              <br />
              Without <span className="c-hero__accent">Compromise.</span>
            </h1>
          </CascadeItem>
          <CascadeItem index={2}>
            <p className="c-hero__lead">
              Purity, identity and potency verified through rigorous independent
              testing. Premium research peptides presented with the documentation
              your laboratory demands.
            </p>
          </CascadeItem>
          <CascadeItem index={3}>
            <div className="c-hero__actions">
              <Button variant="primary" size="lg" className="c-btn c-btn--primary">
                View Research Series
              </Button>
              <Button variant="ghost" size="lg" className="c-btn c-btn--ghost">
                Quality Assurance
              </Button>
            </div>
          </CascadeItem>
        </CascadeReveal>

        <LivingHeroVisual />
      </div>
    </section>
  );
}
