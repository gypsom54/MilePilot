import Link from 'next/link';
import { VectorLogo } from './VectorLogo';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer section--dark" id="contact">
      <div className="compliance-strip" id="about">
        <div className="compliance-strip__inner">
          <div className="compliance-strip__icon" aria-hidden="true">
            <ShieldIcon />
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
          <VectorLogo variant="silver" />
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

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3L4 7V12C4 16.418 7.582 20.418 12 21C16.418 20.418 20 16.418 20 12V7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
