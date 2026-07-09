import Link from 'next/link';
import { VectorBrandLockup } from './VectorBrandLockup';
import { IconShield } from '@/components/icons/PremiumIcons';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer section--dark" id="contact">
      <div className="compliance-strip" id="about">
        <div className="compliance-strip__inner">
          <div className="compliance-strip__icon" aria-hidden="true">
            <IconShield />
          </div>
          <div className="compliance-strip__copy">
            <p className="compliance-strip__title">Research Use Only. Not for Human Consumption.</p>
            <p className="compliance-strip__text">
              All products are supplied strictly for laboratory research purposes only.
              Not for human or veterinary use.
            </p>
          </div>
          <Link href="#documentation" className="compliance-strip__link">
            Learn More
          </Link>
        </div>
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <VectorBrandLockup variant="footer" />
          <div>
            <span className="site-footer__wordmark">Vector Peptides UK</span>
            <span className="site-footer__domain">vectorpeptides.uk</span>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          <Link href="#research-series">Products</Link>
          <Link href="#quality">Quality</Link>
          <Link href="#documentation">Documentation</Link>
          <Link href="#contact">Contact</Link>
          <Link href="#terms">Terms</Link>
          <Link href="#privacy">Privacy</Link>
        </nav>

        <p className="site-footer__copy">&copy; {year} Vector Peptides UK</p>
      </div>
    </footer>
  );
}
