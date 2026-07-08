import { Button } from '@vector-platform/ui';
import { Reveal } from '@/components/effects/Reveal';

export function PurchaseCta() {
  return (
    <section className="purchase-cta section--light" aria-labelledby="purchase-title">
      <Reveal>
        <div className="purchase-cta__inner">
          <h2 id="purchase-title" className="purchase-cta__title">
            Begin Your Research
            <br />
            With Confidence.
          </h2>
          <p className="purchase-cta__lead">
            Premium compounds. Professional packaging. Secure UK fulfilment.
          </p>
          <Button variant="primary" size="lg" className="c-btn c-btn--primary c-btn--dark">
            Shop Research Products
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
