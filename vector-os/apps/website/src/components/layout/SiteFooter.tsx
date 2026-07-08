import Link from 'next/link';
import { VectorLogo } from './VectorLogo';

const FOOTER_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'Quality', href: '#quality' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'Contact', href: '#contact' },
  { label: 'Terms', href: '#terms' },
  { label: 'Privacy', href: '#privacy' },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <div className="site-footer__brand">
            <VectorLogo />
            <div>
              <span className="site-footer__wordmark">Vector Peptides UK</span>
              <span className="site-footer__domain">vectorpeptides.uk</span>
            </div>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="site-footer__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="site-footer__copyright">
          &copy; {year} Vector Peptides UK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
